import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import Shifts from 'ShiftsList'
import { formatLabel } from 'utils'

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
import Add from '@material-ui/icons/Add'
import Delete from '@material-ui/icons/Delete'
import { useMediaQuery, useTheme } from '@material-ui/core'

const Hospital = ({
  hospitalShifts
}) => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Box, notMobile && { display: 'flex', padding: 2 },
    $(Box, notMobile ? { marginRight: 2 } : { marginBottom: 2 },
      $(Paper, null,
        $(Box, { padding: 2, maxWidth: notMobile ? 400 : 'auto' },
          $(Typography, { variant: 'h4' }, 'ГКБ №40'),
          $(Typography, { variant: 'subtitle2' }, 'Нажмите на аватарку волонтёра чтобы подтвердить присутствие')),
        $(Box, { padding: '0 16px' }, 
          $(ButtonGroup, { size: 'small' },
            $(Button, { onClick: console.log }, 'Выгрузить смены'),
            $(Button, { onClick: console.log }, 'Черный список'))),
        $(List, null,
          $(ListSubheader, { disableSticky: true }, 'Настройки смен'),
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

export default () => Hospital({
  hospitalShifts: [{
    start: '08:00',
    end: '14:00',
    demand: 20
  }, {
    start: '20:00',
    end: '08:00',
    demand: 3
  }, {
    start: '14:00',
    end: '20:00',
    demand: 20
  }]
})