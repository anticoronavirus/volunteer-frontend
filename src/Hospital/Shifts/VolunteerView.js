import { useQuery } from '@apollo/react-hooks'
import DateFnsUtils from '@date-io/date-fns'
import { Paper } from '@material-ui/core'
import { Box, Button, ListSubheader, List, ListItem, ListItemText, TextField, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import ruLocale from 'date-fns/locale/ru'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import { createElement as $, Fragment } from 'react'

import { hospitalRequirements } from 'queries'

import Onboarding from './Onboarding'

const VolunteerView = ({
  hospitalId
}) => {

  const { data, loading } = useQuery(hospitalRequirements, { variables: {
    hospitalId,
    userId: hospitalId // FIXME test purposes
  }})

  if (loading)
    return null
  
  const requirementsSatisfied = true // some(checkIfSatified, data.hospital_profession_requirement)
  
  return requirementsSatisfied
    ? $(Fragment, null,
        $(RequestShift),
        $(Box, { padding: 1 }),
        $(Paper, null,
          $(List, null,
            $(ListSubheader, null, 'Предстоящие смены'),
            $(ListItem, null,
              $(ListItemText, {
                primary: 'ОРИТ',
                secondary: '20 сентября в 10:00'
              })),
            $(ListItem, null,
              $(ListItemText, {
                primary: 'Реанимация',
                secondary: '25 сентября в 10:00'
              })))))
    : $(Onboarding, data)
}

const RequestShift = () =>
  $(Paper, null,
    $(Box, { padding: 2 },
      $(MuiPickersUtilsProvider, { utils: DateFnsUtils, locale: ruLocale },
        $(Typography, { variant: 'h5', paragraph: true },
          'Записаться на смену'),
        $(Box, { display: 'flex' }, 
          $(DatePicker, {
            label: 'Дата смены',
            variant: 'inline',
            disablePast: true,
            fullWidth: true,
            format: 'dd MMMM',
            value: null,
            size: 'small',
            inputVariant: 'outlined',
            onChange: console.log,
            disableToolbar: true }),
          $(Box, { padding: 1 }),
          $(TimePicker, {
            label: 'Время',
            fullWidth: true,
            disablePast: true,
            size: 'small',
            value: null,
            onChange: console.log,
            ampm: false,
            inputVariant: 'outlined',
          })),
          $(Box, { marginTop: 2 },
            $(ToggleButtonGroup, {
              value: 4,
              size: 'small',
              exclusive: true },
              toggleButtons)),
          $(TextField, {
            label: 'Отделение',
            margin: 'normal',
            fullWidth: true,
            select: true,
            size: 'small',
            variant: 'outlined'
          }),
          $(Box, { marginTop: 1 },
            $(Button, {
              disabled: true,
              color: 'primary',
              onChange: console.log,
              variant: 'contained' },
            'Отправить заявку')))))

const renderToggleButton = (key) =>
  $(ToggleButton, { key, value: (key * 2) + 4 }, (key * 2) + 4, ' часов')

const toggleButtons = map(renderToggleButton, range(0, 5))

// const checkIfSatified = ({ satisfied }) => satisfied.length > 0

export default VolunteerView