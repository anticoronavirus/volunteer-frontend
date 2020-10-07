import { useMutation, useQuery } from '@apollo/client'
import { Paper } from '@material-ui/core'
import { Box, Button, List, ListItem, ListItemSecondaryAction, ListItemText, ListSubheader, MenuItem, styled, TextField, Typography } from '@material-ui/core'
import { DatePicker, LocalizationProvider, TimePicker } from '@material-ui/pickers'
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns'
import addHours from 'date-fns/fp/addHours'
import format from 'date-fns/fp/format'
import ruLocale from 'date-fns/locale/ru'
import concat from 'lodash/fp/concat'
import defaultsDeepAll from 'lodash/fp/defaultsDeepAll'
import every from 'lodash/fp/every'
import find from 'lodash/fp/find'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import update from 'lodash/fp/update'
import { createElement as $, Fragment, useContext, useState } from 'react'

import ToggleCancelShift from 'components/ToggleCancelShift'
import { addOwnShift, hospitalRequirements, professions } from 'queries'

import HospitalContext from '../HospitalContext'
import Onboarding from './Onboarding'

const startTime = new Date(0, 0, 0, 8)
const endTime = new Date(0, 0, 0, 20)

const VolunteerView = () => {

  const { hospitalId } = useContext(HospitalContext)

  const { data } = useQuery(hospitalRequirements, {
    returnPartialData: true,
    variables: {
      // FIXME
      professionId: 'e35f82bb-de1f-48c3-a688-a4c66e64686c',
      hospitalId,
    }})

  if (!data || !data.hospital_profession_requirement)
    return null

  const requirementsSatisfied = data.hospital_profession_requirement.length === 0
    || every('is_satisfied', data.hospital_profession_requirement)

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
  const updateData = (nextData) => {
    if (error) setError('')
    setData({ ...data, ...nextData })
  }
  const professionQuery = useQuery(professions, {
    variables: {
      where: {
        hospital_professions: {
          hospital_id: { _eq: hospitalId }
        }
      }
    }
  })
  const [error, setError] = useState('')
  const [mutate, { loading }] = useMutation(addOwnShift, { ignoreResults: true })
  const handleSubmit = () => {
    const mutationData = {
      date: data.date,
      start: format('ppp', data.start),
      end: format('ppp',  data.end),
      profession_id: data.profession_id,
      hospital_id: hospitalId
    }
    const query = {
      query: hospitalRequirements,
      variables: {
        hospitalId,
        professionId: 'e35f82bb-de1f-48c3-a688-a4c66e64686c'
      }
    }
    mutate({
      update: (cache, response) =>
        cache.writeQuery({
          ...query,
          data: update(
            'volunteer_shift',
            data => sortBy('date',
              concat(response.data.insert_volunteer_shift_one, data)),
            cache.readQuery(query))
        }),
      optimisticResponse: {
        __typename: 'Mutation',
        insert_volunteer_shift_one: {
          ...mutationData,
          __typename: 'volunteer_shift',
          date: format('YYY-MM-dd', data.date),
          uid: Math.random(),
          is_cancelled: false,
          profession: find({ uid: data.profession_id }, professionQuery.data.professions),
        }
      },
      variables: { data: mutationData }})
        .catch(({ message }) => setError(message))
  }

  return $(Paper, null,
    $(LocalizationProvider, { dateAdapter: DateFnsUtils, locale: ruLocale },
      $(Box, { padding: 2 },
        $(Typography, { variant: 'h5', paragraph: true },
          'Записаться на смену'),
        $(DatePicker, {
          disablePast: true,
          renderInput: DateTimeTextField({
            label: 'Дата',
            inputProps: {
              placeHolder: 'дд.мм.гггг'
            }
          }),
          value: data.date || null,
          mask: '__.__.____',
          onChange: (date) => updateData({ date }),
        }),
        $(Box, { display: 'flex', paddingTop: 2 }, 
          $(TimePicker, {
            // FIXME pickers tend to fuck up min-max limitation until first pick
            minTime: startTime,
            maxTime: addHours(-2, endTime),
            renderInput: DateTimeTextField({
              label: 'Время начала',
              inputProps: {
                placeHolder: 'чч.мм'
              }
            }),
            value: data.start || null,
            onChange: (start) => updateData({ start }),
          }),
          $(Box, { padding: 1 }),
          $(TimePicker, {
            minTime: addHours(2, data.start || startTime),
            maxTime: endTime,
            renderInput: DateTimeTextField({
              label: 'Окончание',
              inputProps: {
                placeHolder: 'чч.мм'
              }
            }),
            value: data.end || null,
            onChange: (end) => updateData({ end }),
          }),
          // $(TimePicker, {
          //   label: 'Окончание',
          //   fullWidth: true,
          //   disablePast: true,
          //   size: 'small',
          //   value: data.end || null,
          //   onChange: (end) => updateData({ end }),
          //   ampm: false,
          //   inputVariant: 'outlined',
          // })
          ),
          $(TextField, {
            label: 'Отделение',
            margin: 'normal',
            fullWidth: true,
            select: true,
            size: 'small',
            variant: 'outlined',
            value: data.profession_id || '',
            onChange: event => updateData({ profession_id: event.target.value })
          }, map(ProfesionItem, professionQuery?.data?.professions)),
          error &&
            $(Typography, { variant: 'caption', color: 'error' }, 'Похожая смена уже существует'),
          $(Box, { marginTop: 1 },
            $(Button, {
              disabled: !data.profession_id || !data.date || !data.start || loading,
              color: 'primary',
              onClick: handleSubmit,
              variant: 'contained' },
            'Отправить заявку')))))
}

const ProfesionItem = ({ uid, name }) => $(MenuItem, { key: uid, value: uid }, name)

const DateTimeTextField = (customProps) => props =>
  $(TextField, defaultsDeepAll([
    defaultProps,
    props,
    customProps
  ]))

const defaultProps = {
  fullWidth: true,
  size: 'small',
  variant: 'outlined',
  helperText: '',
}

// const checkIfSatified = ({ satisfied }) => satisfied.length > 0

export default VolunteerView