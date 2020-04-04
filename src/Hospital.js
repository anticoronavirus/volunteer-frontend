import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import { useApolloClient, useQuery } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { hospital } from 'queries'
import { formatLabel } from 'utils'
import Shifts from 'ShiftsList'

import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import Add from '@material-ui/icons/Add'
import Skeleton from '@material-ui/lab/Skeleton'
import ExitToApp from '@material-ui/icons/ExitToApp'
import CloudDownload from '@material-ui/icons/CloudDownload'
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled'
import Delete from '@material-ui/icons/Delete'
import NavigateBefore from '@material-ui/icons/NavigateBefore'
import { useMediaQuery, useTheme } from '@material-ui/core'

const mockHospitalShifts = [{
  uid: 1,
  start: '08:00',
  end: '14:00',
  demand: 20
}, {
  uid: 2,
  start: '20:00',
  end: '08:00',
  demand: 3
}, {
  uid: 3,
  start: '14:00',
  end: '20:00',
  demand: 20
}]

const Hospital = ({
  history,
  match
}) => {

  const hospitalShifts = mockHospitalShifts
  const theme = useTheme()
  const client = useApolloClient()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  const { data, loading } = useQuery(hospital, { variables: { uid: match.params.uid }})

  return !loading && !data.hospital
    ? $(Redirect, { to: '/hospitals'})
    : $(Box, notMobile && { display: 'flex', padding: 2 },
        $(Box, notMobile && { marginRight: 2, marginTop: 1.5 },
          $(IconButton, { onClick: () => history.push('/')},
            $(NavigateBefore))),
        $(Box, notMobile ? { marginRight: 2 } : { marginBottom: 2 },
          $(Paper, null,
            $(Box, { padding: 2, width: notMobile ? 360 : 'auto' },
              loading
                ? $(Skeleton, { variant: 'text', width: '61%', height: 45 }) // FIXME shouldbe more precise
                : $(Typography, { variant: 'h4' }, data.hospital.shortname),
              loading
                ? $(Box, null,
                    $(Skeleton, { variant: 'text', width: '80%', height: 20 }),
                    $(Skeleton, { variant: 'text', width: '61.8%', height: 20 }))
                : $(Typography, { variant: 'subtitle2' }, data.hospital.name)),
            $(Box, { padding: '0 16px' },
              $(ButtonGroup, null,
                $(Button, { onClick: console.log, disabled: true }, $(CloudDownload, { fontSize: 'small' })),
                $(Button, { onClick: console.log, disabled: true }, $(PersonAddDisabled, { fontSize: 'small' })),
                $(Tooltip, { title: 'Выход' },
                $(Button, { onClick: () => {
                  localStorage.removeItem('authorization')
                  client.resetStore()
                  history.push('/')
                }}, $(ExitToApp, { fontSize: 'small' })),
                ))),
            $(List, null,
              $(ListSubheader, { disableSticky: true }, 'Доступные смены'),
              map(HospitalShift, sortBy('start', hospitalShifts))),
              $(AddHospitalShift))),
        $(Box, notMobile && { maxWidth: 360, flexGrow: 1 },
          $(Shifts)))
}

const HospitalShift = ({
  uid,
  start,
  end,
  demand
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${start} до ${end}`,
      secondary: formatLabel('volunteer', demand)}),
    $(ListItemSecondaryAction, null,
      $(IconButton, { onClick: console.log },
        $(Delete, { fontSize: 'small'}))))

const AddHospitalShift = () =>
  $(ListItem, { button: true },
    $(ListItemIcon, null,
      $(Add)),
    $(ListItemText, {
      primary: 'Добавить смену'
    }))

export default Hospital