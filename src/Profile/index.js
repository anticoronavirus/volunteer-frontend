import { useQuery } from '@apollo/client'
import { Box, CircularProgress, Fade, Paper, Tab, Tabs, Divider, styled, Avatar, IconButton } from '@material-ui/core'
import ExitToApp from '@material-ui/icons/ExitToApp'
import entries from 'lodash/fp/entries'
import map from 'lodash/fp/map'
import { createElement as $, useEffect } from 'react'
import { Link, Redirect, Route, Switch, useParams } from 'react-router-dom'
import MaskedInput from 'react-input-mask'

import { logoff } from 'Apollo'
import { me as meQuery } from 'queries'

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

  useEffect(() => {
    return () =>
      window.dispatchEvent(new CustomEvent('resize'))
  })

  return $(Box, { margin: 'auto', maxWidth: 480 },
    $(Fade, { in: true },
      $(Paper, { square: true },
        $(Box, { padding: 2, display: 'flex', alignItems: 'center' },
          $(Avatar, { size: 64 }),
          $(NonInputMaskedInput, {
            disabled: true,
            mask: '+7 (\\999) 999-9999',
            value: data.phone }),
          $(IconButton, { onClick: logoff },
            $(ExitToApp))),
        $(Divider),
        $(Tabs, { variant: 'scrollable', value: page || '' },
          map(renderTab, volunteerTabs)))),
    $(Box, { marginTop: 2 },
      $(Switch, null,
        map(([key, { component }]) =>
          $(Route, { key, exact: true, path: `/profile/${key}` },
            $(component, data)),
            volunteerTabs),
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
    component: Requests
  }
}

const volunteerTabs = entries(tabs)

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