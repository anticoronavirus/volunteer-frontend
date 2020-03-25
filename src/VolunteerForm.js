import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import map from 'lodash/fp/map'
import reduce from 'lodash/fp/reduce'
import find from 'lodash/fp/find'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { useParams } from 'react-router-dom'
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
// import ToggleButton from '@material-ui/lab/ToggleButton'
// import DateFnsUtils from '@date-io/date-fns'
import format from 'date-fns/format'
// import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const VolunteerForm = () =>
  $(Box, { display: 'flex', padding: 3 },
    $(Box, { maxWidth: '60ex', flexShrink: 0 },
      $(Paper, null,
        $(Box, { padding: 3 },
          $(Typography, { variant: 'h4', paragraph: true },
            'Регистрация волонтёров-врачей'),
            $(Typography, { variant: 'subtitle1', paragraph: true },
              'Anticorona'),
          // $(ToggleButtonGroup, { size: 'small', exclusive: true,  },
          //   $(ToggleButton, { value: 1 }, 'Врач'),
          //   $(ToggleButton, { value: 2 }, 'Водитель'),
          //   $(ToggleButton, { value: 3 }, 'Программист')),
          $(TextField, {
            margin: 'normal',
            label: 'Фамилия',
            variant: 'outlined',
            fullWidth: true
          }),
          $(TextField, {
            margin: 'normal',
            label: 'Имя',
            variant: 'outlined',
            fullWidth: true
          }),
          $(TextField, {
            margin: 'normal',
            label: 'Отчество',
            variant: 'outlined',
            fullWidth: true
          }),
          $(TextField, {
            margin: 'normal',
            label: 'Телефон',
            variant: 'outlined',
            fullWidth: true
          }),
          $(TextField, {
            margin: 'normal',
            label: 'Электропочта',
            variant: 'outlined',
            fullWidth: true
          }),
          $(Box, { height: 16 }),))),
    $(Box, { height: 16, minWidth: 16 }),
    $(Paper, null, $(Shifts)))

const Shifts = () => {

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
            // map(day => 
            //   $(TableCell, { style: { minWidth: '16ex' }}, day),
            //   days))
        $(TableBody, null,
          map(Row, generatedTable.rows)))
}

const generateTableReducer = (result, shift) => {
  result.columns.add(shift.date)
  if (!result.rows[`${shift.start}-${shift.end}`])
    result.rows[`${shift.start}-${shift.end}`] = []
  result.rows[`${shift.start}-${shift.end}`].push(shift)
  return result
}

const Header = date =>
  $(TableCell, { style: { minWidth: '16ex' }}, format(new Date(date), 'd MMMM'))

const Row = cells =>
  $(TableRow, null, map(Cell, cells))

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

  return $(TableCell, { style: { minWidth: '16ex' }},
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