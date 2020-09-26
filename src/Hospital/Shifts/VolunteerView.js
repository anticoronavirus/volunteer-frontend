import { useQuery } from '@apollo/react-hooks'
import DateFnsUtils from '@date-io/date-fns'
import { Paper } from '@material-ui/core'
import { Box, Button, List, ListItem, ListItemText, ListSubheader, MenuItem, TextField, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import addHours from 'date-fns/fp/addHours'
import differenceInHours from 'date-fns/fp/differenceInHours'
import ruLocale from 'date-fns/locale/ru'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import some from 'lodash/fp/some'
import { createElement as $, Fragment, useState } from 'react'

import TaskOption from 'components/TaskOption'
import { hospitalRequirements, professions } from 'queries'

import Onboarding from './Onboarding'

const VolunteerView = ({
  hospitalId
}) => {

  const { data, loading } = useQuery(hospitalRequirements, { variables: {
    hospitalId
  }})

  if (loading)
    return null
  
  const requirementsSatisfied = data.hospital_profession_requirement.length === 0
    || some('is_satisfied', data.hospital_profession_requirement)
  
  return requirementsSatisfied
    ? $(Fragment, null,
        $(RequestShift, { hospitalId }),
        $(Box, { padding: 1 }),
        data.volunteer_shift.length > 0 &&
          $(Box, { paddingTop: 2 },
            $(Paper, null,
              $(List, null,
                $(ListSubheader, null, 'Предстоящие смены'),
                map(Shift, data.volunteer_shift)))))
    : $(Onboarding, data)
}

const Shift = ({
  profession
}) =>
  $(ListItem, null,
    $(ListItemText, {
      primary: profession.name,
      secondary: '20 сентября в 10:00'
    }))

const RequestShift = ({
  hospitalId
}) => {

  const [data, setData] = useState({})
  const professionQuery = useQuery(professions, { hospitalId })

  return $(Paper, null,
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
            value: data.date || null,
            size: 'small',
            inputVariant: 'outlined',
            onChange: (date) => setData({ ...data, date }),
            disableToolbar: true }),
          $(Box, { padding: 1 }),
          $(TimePicker, {
            label: 'Время',
            fullWidth: true,
            disablePast: true,
            size: 'small',
            value: data.start || null,
            onChange: (start) => setData({ ...data, start }),
            ampm: false,
            inputVariant: 'outlined',
          })),
          $(Box, { marginTop: 2 },
            $(ToggleButtonGroup, {
              value: data.duration,
              size: 'small',
              onChange: (event, duration) => setData({ ...data, duration }),
              exclusive: true },
              toggleButtons)),
          $(TextField, {
            label: 'Отделение',
            margin: 'normal',
            fullWidth: true,
            select: true,
            size: 'small',
            variant: 'outlined',
            value: data.profession_id || '',
            onChange: event => setData({ ...data, profession_id: event.target.value })
          }, map(ProfesionItem, professionQuery?.data?.professions)),
          $(Box, { marginTop: 1 },
            $(Button, {
              disabled: !data.profession_id || !data.date || !data.start || !data.duration,
              color: 'primary',
              onChange: console.log,
              variant: 'contained' },
            'Отправить заявку')))))
}

const ProfesionItem = ({ uid, name }) => $(MenuItem, { key: uid, value: uid }, name)

const renderToggleButton = (key) =>
  $(ToggleButton, { key, value: (key * 2) + 4 }, (key * 2) + 4, ' часов')

const toggleButtons = map(renderToggleButton, range(0, 5))

// const checkIfSatified = ({ satisfied }) => satisfied.length > 0

export default VolunteerView