import { createElement as $, memo, Fragment } from 'react'
import { useParams } from 'react-router-dom'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import ru from 'date-fns/locale/ru'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import reduce from 'lodash/fp/reduce'
import find from 'lodash/fp/find'
import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import HospitalSelector from 'components/HospitalSelector'
import {
  shifts,
  addVolunteerToShift,
  removeVolunteerFromShift
} from 'queries'

const now = new Date()
const range = {
  from: format(now, 'yyyy-MM-dd'),
  to: format(addDays(now, 14), 'yyyy-MM-dd')
}

const AvailableShifts = memo(() => {

  let { profession = 'врач' } = useParams()

  const { data } = useSubscription(shifts, {
    variables: {
      profession,
      ...range
    }
  })

  const generatedTable = data && reduce(generateTableReducer, {
    columns: new Set(),
    rows: {}
  }, data.shifts)

  return !data
    ? $(Box, { padding: 2 }, $(CircularProgress))
    : $(Paper, null,
        $(Box, { padding: 1, paddingBottom: 0, display: 'flex', },
          $(HospitalSelector)),
        $(TableContainer, null,
          $(Table, null,
            $(TableHead, null,
              $(TableRow, null,
                map(Header, Array.from(generatedTable.columns)))),
            $(TableBody, null,
              map(Row, entries(generatedTable.rows))))))
})

const generateTableReducer = (result, shift) => {
  result.columns.add(shift.date)
  if (!result.rows[`${shift.start}-${shift.end}`])
    result.rows[`${shift.start}-${shift.end}`] = []
  result.rows[`${shift.start}-${shift.end}`].push(shift)
  return result
}

const Header = date =>
  $(TableCell, { key: date, style: { minWidth: '16ex' }}, format(new Date(date), 'd MMMM', { locale: ru }))

const Row = ([key, cells]) =>
  $(TableRow, { key }, map(CellFunction, cells))

const CellFunction = cell => $(Cell, { key: cell.uid, ...cell })

const Cell = ({
  uid,
  date,
  start,
  end,
  hospitalsCount = 2,
  placesAvailable = 3,
  myShift = { hospital: { shortName: 'ГКБ №40' } }
}) => {
  const user = true // FIXME

  return $(TableCell, { key: uid, style: { minWidth: '16ex' }},
    $(Box, { fontSize: 10 }, start.slice(0, 5), ' - ', end.slice(0, 5)),
    $(Box, null, hospitalsCount),
    $(Box, null, formatAvailable(placesAvailable)),
    user &&
      $(AddSelf, { date, start, end, placesAvailable, myShift }))
}

const AddSelf = ({
  date,
  start,
  end,
  placesAvailable,
  myShift
}) => {

  const [mutate, { loading }] = useMutation(addVolunteerToShift, { // FIXME  should use custom toggleShift
    variables: { date, start, end, volunteer_id: localStorage.me } }) // FIXME get from token

  return $(Fragment, null,
    loading
      ? $(Box, { paddingTop: 1.1 }, $(CircularProgress, { size: 28 }))
      : $(Box, { marginLeft: -1.5 },
          $(Checkbox, {
            checked: !!myShift,
            disabled: !myShift && !placesAvailable,
            onClick: mutate }),
          `в ${myShift.hospital.shortName}`)) // FIXME get actual data
}

const formatAvailable = available =>
  available === 0
    ? 'нет мест'
    : available === 1
      ? '1 место'
      : available > 4
        ? `${available} мест`
        : `${available} места`

export default AvailableShifts