import { createElement as $, useState, memo } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
// import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import reduce from 'lodash/fp/reduce'
import find from 'lodash/fp/find'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useParams } from 'react-router-dom'
import format from 'date-fns/format'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

const VolunteerForm = () => {

  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const [mutate, { data }] = useMutation(addVolunteer)

  console.log(data)

  return $(Box, matches && { display: 'flex', padding: 3 },
    $(Box, { maxWidth: '60ex', flexShrink: 0 },
      $(Paper, null,
        $(Box, { padding: 3 },
          $(Typography, { variant: 'h4', paragraph: true },
            'Регистрация волонтёров-врачей'),
            $(Typography, { variant: 'subtitle1', paragraph: true },
              'Anticorona'),
          $(Formik, {
            initialValues,
            onSubmit: variables => mutate({ variables })
          }, ({ submitForm, isValid, dirty }) =>
            $(Form, null, 
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'lname',
                type: 'text',
                label: 'Фамилия'
              }),
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'fname',
                type: 'text',
                label: 'Имя'
              }),
              $(Field, {
                component: TextField,
                validate: required,
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'mname',
                type: 'text',
                label: 'Отчество'
              }),
              $(Field, {
                component: TextField,
                validate: value => required(value) || (value.length < 10 && 'Введите корректный телефон'),
                helperText: ' ',
                variant: 'standard',
                fullWidth: true,
                margin: 'dense',
                name: 'phone',
                type: 'phone',
                label: 'Телефон'
              }),
              $(Field, {
                component: TextField,
                variant: 'standard',
                validate: required,
                helperText: ' ',
                fullWidth: true,
                margin: 'dense',
                name: 'email',
                type: 'email',
                label: 'Электропочта',
              }),
              dirty && isValid &&
                $(Button, { onClick: submitForm, fullWidth: true, variant: 'outlined' }, 'Отправить' )))))),
    $(Box, { height: 16, minWidth: 16 }),
    $(Paper, !matches && { style: { overflowX: 'scroll' }},
      $(Shifts)))
}

const initialValues = {
  lname: '', 
  mname: '', 
  fname: '', 
  phone: '', 
  email: '', 
}

const required = value => !value && 'Обязательное поле'

const addVolunteer = gql`
mutation UpsertVolunteer(
  $fname: String
  $mname: String
  $lname: String
  $email: String
  $phone: String
) {
  insert_volunteer(
    objects: [{
      fname: $fname
      mname: $mname
      lname: $lname
      email: $email
      phone: $phone
    }]
    on_conflict: {
      constraint: volunteer_phone_email_key
      update_columns: [
        fname
        mname
        lname
      ]
    }) {
    returning {
      uid
      shifts {
        uid
      }
    }
  }
}
`

const Shifts = memo(() => {

  const { data, loading } = useQuery(shifts)

  const generatedTable = data && reduce(generateTableReducer, {
    columns: new Set(),
    rows: {}
  }, data.shifts)

  return loading
    ? null
    : $(Table, null,
        $(TableHead, null,
          $(TableRow, null,
            map(Header, Array.from(generatedTable.columns)))),
        $(TableBody, null,
          map(Row, entries(generatedTable.rows))))
})

const generateTableReducer = (result, shift) => {
  result.columns.add(shift.date)
  if (!result.rows[`${shift.start}-${shift.end}`])
    result.rows[`${shift.start}-${shift.end}`] = []
  result.rows[`${shift.start}-${shift.end}`].push(shift)
  return result
}

const Header = date =>
  $(TableCell, { key: date, style: { minWidth: '16ex' }}, format(new Date(date), 'd MMMM'))

const Row = ([key, cells]) =>
  $(TableRow, { key }, map(CellFunction, cells))

const CellFunction = cell => $(Cell, { key: cell.uid, ...cell })

const Cell = ({
  uid,
  date,
  start,
  end,
  volunteers,
  professions
}) => {
  let { profession } = useParams()

  const required = find({ name: profession }, professions)
  const available = required ? required.number : 0

  return $(TableCell, { key: uid, style: { minWidth: '16ex' }},
    $(Box, null, 
      start.slice(0, 5), ' - ', end.slice(0, 5)),
    $(Box, null, formatAvailable(available)),
    $(Box, { marginLeft: -1.5 },
      $(Checkbox, { disabled: !available })))
}

const formatAvailable = available =>
  available === 0
    ? 'нет мест'
    : available === 1
      ? '1 место'
      : available > 4
        ? `${available} мест`
        : `${available} места`

const shifts = gql`
query Shifts($from: date $to: date) {
  shifts(
    order_by: { date: asc, start: asc }
    where: { date: { _gt: $from  _lt: $to } }) {
    uid
    date
    start
    end
    professions {
      name
      number
    }
    volunteers {
      uid
      fname
      mname
      lname
      phone
    }
  }
}
`

export default VolunteerForm