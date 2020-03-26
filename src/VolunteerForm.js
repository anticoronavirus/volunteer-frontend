import { createElement as $, memo } from 'react'
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
import { useSubscription, useMutation } from '@apollo/react-hooks'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { useTheme } from '@material-ui/core/styles'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useParams } from 'react-router-dom'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

const VolunteerForm = ({ history }) => {

  const theme = useTheme()
  let { profession } = useParams()
  const matches = useMediaQuery(theme.breakpoints.up('sm'))
  const [mutate, { data }] = useMutation(addVolunteer, { variables: { profession } })

  return $(Box, matches && { display: 'flex', padding: 3 },
    $(Box, { maxWidth: '60ex', flexShrink: 0 },
      $(Paper, null,
        $(Box, { padding: 3 },
          $(Typography, { variant: 'h4', paragraph: true },
            `Регистрация волонтёров-${professions[profession]}`),
            $(Typography, { variant: 'subtitle1', paragraph: true },
              'Anticorona'),
          $(Formik, {
            initialValues,
            onSubmit: variables => mutate({ variables })
              .then(({ data }) => history.push(`/volunteer/${profession}/${data.insert_volunteer.returning[0].uid}`))
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
                validate: value => required(value) || (value.length <= 10 && 'Введите корректный телефон'),
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
    data && data.insert_volunteer.returning[0].uid &&
      $(Paper, !matches && { style: { overflowX: 'scroll' }},
        $(Shifts)))
}

const professions = {
  'врач': 'врачей',
  'медсестра': 'медсестёр',
  'водитель': 'водителей',
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
  $profession: String
  $phone: String
) {
  insert_volunteer(
    objects: [{
      fname: $fname
      mname: $mname
      lname: $lname
      email: $email
      phone: $phone
      profession: $profession
    }]
    on_conflict: {
      constraint: volunteer_phone_email_key
      update_columns: [
        fname
        mname
        lname
        profession
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

const now = new Date()

const Shifts = memo(() => {

  let { profession } = useParams()

  const { data } = useSubscription(shifts, {
    variables: {
      profession,
      from: now,
      to: addDays(now, 14)
    }
  })

  const generatedTable = data && reduce(generateTableReducer, {
    columns: new Set(),
    rows: {}
  }, data.shifts)

  return !data
    ? $(Box, { padding: 2 }, $(CircularProgress))
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
  let { profession, volunteer_id } = useParams()

  const required = find({ name: profession }, professions)
  const me = find({ uid: volunteer_id }, volunteers)

  const available = required ? required.number - volunteers.length : 0
  const [mutate, { loading }] = useMutation(
    me ? removeVolunteerFromShift : addVolunteerToShift,
    { variables: { shift_id: uid, volunteer_id }})

  return $(TableCell, { key: uid, style: { minWidth: '16ex' }},
    $(Box, null, 
      start.slice(0, 5), ' - ', end.slice(0, 5)),
    $(Box, null, formatAvailable(available)),
    loading
      ? $(Box, { paddingTop: 1.1 }, $(CircularProgress, { size: 28 }))
      : $(Box, { marginLeft: -1.5 },
          $(Checkbox, { checked: !!me, disabled: !available, onClick: mutate })))
}

const formatAvailable = available =>
  available === 0
    ? 'нет мест'
    : available === 1
      ? '1 место'
      : available > 4
        ? `${available} мест`
        : `${available} места`

const addVolunteerToShift = gql`
mutation AddVolunteerToShift(
  $volunteer_id: uuid
  $shift_id: uuid
) {
  insert_volunteer_shift(objects: [{
    volunteer_id: $volunteer_id
    shift_id: $shift_id
  }]) {
    returning {
      shift {
        uid
        volunteers {
          uid
        }
      }
    }
  }
}
`

const removeVolunteerFromShift = gql`
mutation AddVolunteerToShift(
  $volunteer_id: uuid
  $shift_id: uuid
) {
  delete_volunteer_shift(where: {
    volunteer_id: { _eq: $volunteer_id }
    shift_id: { _eq: $shift_id }
  }) {
    returning {
      shift {
        uid
        volunteers {
          uid
        }
      }
    }
  }
}
`


const shifts = gql`
subscription Shifts($from: date $to: date $profession: String ) {
  shifts(
    order_by: { date: asc, start: asc }
    where: { date: { _gte: $from  _lt: $to } }) {
    uid
    date
    start
    end
    professions {
      name
      number
    }
    volunteers (where: { profession: { _eq: $profession }}) {
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