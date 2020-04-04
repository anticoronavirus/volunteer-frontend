import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'

import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Add from '@material-ui/icons/Add'

const AddHospitalShift = () => {
  const [open, setOpen] = useState(true)
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [demand, setDemand] = useState(20)
  return $(Fragment, null,
    $(Dialog, {
      open,
      onClose: () => setOpen(false) },
      $(DialogTitle, null, 'Новая смена'),
      $(DialogContent, null,
        $(Typography, { variant: 'caption' }, 'Начало смены'),
        $(Box, { overflow: 'scroll', maxWidth: 420 },
          $(ToggleButtonGroup, {
            size: 'small',
            exclusive: true,
            value: start,
            onChange: (event, value) => setStart(value) },
            map(RangeButton, range(0, 23)))),
        $(Box, { height: 16 }),
        !!start &&
          $(Typography, { variant: 'caption' }, 'Конец смены'),
        !!start &&
          $(Box, { overflow: 'scroll', maxWidth: 420 },
            $(ToggleButtonGroup, {
              size: 'small',
              exclusive: true,
              value: end,
              onChange: (event, value) => setEnd(value) },
              map(RangeButton, range(start + 2, start + 2 + 24)))),
        !!end &&
          $(TextField, {
            value: demand,
            margin: 'normal',
            fullWidth: true,
            onChange: ({ target }) => setDemand(target.value.replace(/^[+d]/, '')),
            type: 'number',
            label: 'Количество волонтёров' })),
      $(DialogActions, null,
        $(Button, { onClick: console.log}, 'Добавить'))),
    $(ListItem, { button: true, onClick: () => setOpen(true) },
      $(ListItemIcon, null,
        $(Add)),
      $(ListItemText, {
        primary: 'Добавить смену'
      })))
}

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

export default AddHospitalShift