import { useMutation, useQuery } from '@apollo/client'
import DateFnsUtils from '@date-io/date-fns'
import { Paper } from '@material-ui/core'
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, MenuItem, styled, TextField, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/format'
import ruLocale from 'date-fns/locale/ru'
import concat from 'lodash/fp/concat'
import find from 'lodash/fp/find'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import some from 'lodash/fp/some'
import update from 'lodash/fp/update'
import { createElement as $, Fragment, useState } from 'react'

import ToggleCancelShift from 'components/ToggleCancelShift'
import { addOwnShift, hospitalRequirements, professions } from 'queries'

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
  uid,
  profession,
  date,
  start,
  end,
  is_cancelled
}) =>
  $(ListItemWithCancelled, { key: uid, is_cancelled },
    $(ListItemText, {
      primary: profession.name,
      secondary: `${date} ${start.slice(0, -6)}—${end.slice(0, -6)}`
    }),
    $(ListItemSecondaryAction, null, 
      $(ToggleCancelShift, { uid, is_cancelled })))

const ListItemWithCancelled = styled(ListItem)(({ is_cancelled }) => ({
  opacity: is_cancelled ? 0.5 : 1,
  textDecoration: is_cancelled && 'line-through'
}))

const RequestShift = ({
  hospitalId
}) => {

  const [data, setData] = useState({})
  const professionQuery = useQuery(professions, { hospitalId })
  const [mutate, { loading }] = useMutation(addOwnShift)
  const handleSubmit = () => {
    const mutationData = {
      date: data.date,
      start: format('ppp', data.start),
      end: format('ppp', addHours(data.duration, data.start)),
      profession_id: data.profession_id,
      hospital_id: hospitalId
    }
    const query = {
      query: hospitalRequirements,
      variables: { hospitalId }
    }
    mutate({
      update: (cache, response) =>
        cache.writeQuery({
          ...query,
          data: update(
            'volunteer_shift',
            concat(response.data.insert_volunteer_shift_one),
            cache.readQuery(query))
        }),
      optimisticResponse: {
        __typename: 'Mutation',
        insert_volunteer_shift_one: {
          __typename: 'volunteer_shift',
          profession: find({ uid: data.profesison_id }, professionQuery.data),
          ...mutationData
        }
      },
      variables: { data: mutationData }})
  }

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
            minutesStep: 30,
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
              disabled: !data.profession_id || !data.date || !data.start || !data.duration || loading,
              color: 'primary',
              onClick: handleSubmit,
              variant: 'contained' },
            'Отправить заявку')))))
}

const ProfesionItem = ({ uid, name }) => $(MenuItem, { key: uid, value: uid }, name)

const renderToggleButton = (key) =>
  $(ToggleButton, { key, value: (key * 2) + 4 }, (key * 2) + 4, ' часов')

const toggleButtons = map(renderToggleButton, range(0, 5))

// const checkIfSatified = ({ satisfied }) => satisfied.length > 0

export default VolunteerView