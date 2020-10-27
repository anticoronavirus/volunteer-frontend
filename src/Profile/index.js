import { useQuery } from '@apollo/client'
import { Avatar, Box, CircularProgress, Divider, Fade, IconButton, Paper, styled, Tab, Tabs } from '@material-ui/core'
import ExitToApp from '@material-ui/icons/ExitToApp'
import entries from 'lodash/fp/entries'
import map from 'lodash/fp/map'
import pick from 'lodash/fp/pick'
import { createElement as $, useEffect } from 'react'
import MaskedInput from 'react-input-mask'
import { Link, Redirect, Route, Switch, useParams } from 'react-router-dom'

import { logoff } from 'Apollo'
import { Hospital } from 'components/HospitalList'
import { me as meQuery } from 'queries'
import { uncappedMap, useIsDesktop } from 'utils'

import ProfileForm from './ProfileForm'
import Requests from './Requests'
import ShiftsList from './ShiftsList'

const Profile = () => {
  const { data, loading } = useQuery(meQuery)

  return loading && !data
    ? $(Box, { padding: 2 }, $(CircularProgress))
    : $(ProfilePure, data.me[0])
}

const ProfilePure = (data) => {

  const { page } = useParams()
  const isDesktop = useIsDesktop()

  // 
  useEffect(() => {
    return () =>
      window.dispatchEvent(new CustomEvent('resize'))
  })

  const tabs = data.managedHospitals.length > 0
    ? coordinatorTabs
    : volunteerTabs

  return $(Box, null,
    $(Fade, { in: true },
      $(Paper, { square: true },
        $(Box, isDesktop && { display: 'flex', alignItems: 'center', flexDirection: 'column' },
          $(Box, { padding: 2, display: 'flex', alignItems: 'center' },
            $(Avatar, { size: 64 }),
            $(NonInputMaskedInput, {
              disabled: true,
              mask: '+7 (\\999) 999-9999',
              value: data.phone }),
            $(IconButton, { onClick: logoff },
              $(ExitToApp))),
          $(Tabs, {
            variant: 'scrollable',
            value: page || '' },
            map(renderTab, tabs))))),
    $(Box, { margin: 'auto', maxWidth: 480, marginTop: 2 },
      $(Switch, null,
        map(([key, { component }]) =>
          $(Route, { key, exact: true, path: `/profile/${key}` },
            $(component, data)),
            tabs),
        $(Redirect, { to: `/profile/personal` }))))
}

const NonInputMaskedInput = styled(MaskedInput)({
  background: 'transparent',
  border: 'none',
  marginLeft: 16,
  color: 'inherit',
  flexGrow: 1,
  display: 'block'
})

const renderTab = ([key, { label }]) =>
  $(Tab, {
    key,
    label,
    value: key,
    component: Link,
    to: `/profile/${key}`
  })

const tabs = {
  personal: {
    label: 'Профиль',
    component: ProfileForm
  },
  shifts: {
    label: 'Смены',
    component: ShiftsList
  },
  requests: {
    label: 'Заявки',
    component: Requests
  },
  hospitals: {
    label: 'Мои больницы',
    component: function Hospitals({ managedHospitals }) {
      return uncappedMap(Hospital, map('hospital', managedHospitals))
    }
  }
}

const volunteerAllowed = [
  'personal',
  'shifts',
  'requests'
]

const coordinatorAllowed = [
  'personal',
  'hospitals',
  'shifts',
  'requests'
]

const volunteerTabs = entries(pick(volunteerAllowed, tabs))
const coordinatorTabs = entries(pick(coordinatorAllowed, tabs))

// const ProfilePure2 = data =>  {

//   const theme = useTheme()
//   const { page = '' } = useParams()
//   const { push } = useHistory()
//   const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

//   // FIXME mui-org/material-ui#9337
//   useEffect(() => {
//     return () =>
//       window.dispatchEvent(new CustomEvent('resize'))
//   })

//   return $(Box, notMobile && { display: 'flex' },
//     // $(Back),
//     $(Box, notMobile ? { margin: 'auto', maxWidth: 480 } : { marginBottom: 2 },
//       $(Fade, { in: true },
//         $(Paper, null,
//           $(Box, { justifyContent: 'flex-end', display: 'flex', marginBottom: -7, padding: 1 },
//             $(Tooltip, { title: 'Выход' },
//                 $(IconButton, { onClick: logoff },
//                   $(ExitToApp, { fontSize: 'small' })))),
//           $(Box, {
//             display: 'flex',
//             alignItems: 'center',
//             padding: 3,
//             justifyContent: 'center'}, 
//             $(Avatar, { style: { width: 84, height: 84 } })),
//             $(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center' },
//               $(Typography, { variant: 'subtitle1', align: 'center' }, data.phone)),
//           $(Box, { height: 16 }),
//           $(Divider),
//           $(Tabs, {
//             variant: 'fullWidth',
//             value: page,
//             // action: () => updateIndicator(),
//             onChange: (event, value) => push(`/profile/${value}`) },
//             map(([value, { label }]) =>
//               $(Tab, { id: value, key: value, value, label }),
//               entries(tabs))))),
//         $(Box, { padding: 1 }),
//         $(Fade, { in: true, timeout: 300 },
//           $(Switch, null,
//             map(([value, { component }]) =>
//               $(Route, { key: value, exact: true, path: `/profile/${value}` },
//                 $(component, data)),
//               entries(tabs)),
//             $(Redirect, { to: '/profile/' })))))
// }


export default Profile