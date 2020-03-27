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
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Checkbox from '@material-ui/core/Checkbox'
import { useSubscription, useMutation } from '@apollo/react-hooks'
import {
  shifts,
  addVolunteerToShift,
  removeVolunteerFromShift
} from 'queries'

const now = new Date()

const AvailableShifts = memo(() => {

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
  $(TableCell, { key: date, style: { minWidth: '16ex' }}, format(new Date(date), 'd MMMM', { locale: ru }))

const Row = ([key, cells]) =>
  $(TableRow, { key }, map(CellFunction, cells))

const CellFunction = cell => $(Cell, { key: cell.uid, ...cell })

const Cell = ({
  uid,
  start,
  end,
  volunteers,
  professions
}) => {
  const { profession, volunteer_id } = useParams()

  const required = find({ name: profession }, professions)

  const available = required ? required.number - volunteers.length : 0

  return $(TableCell, { key: uid, style: { minWidth: '16ex' }},
    $(Box, null, start.slice(0, 5), ' - ', end.slice(0, 5)),
    $(Box, null, formatAvailable(available)),
    volunteer_id &&
      $(AddSelf, { uid, volunteer_id, volunteers, available }))
}

const AddSelf = ({
  uid,
  volunteer_id,
  volunteers,
  available
}) => {

  const me = find({ uid: volunteer_id }, volunteers)

  const [mutate, { loading }] = useMutation(
    me ? removeVolunteerFromShift : addVolunteerToShift,
    { variables: { shift_id: uid, volunteer_id }})

  return $(Fragment, null,
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

export default AvailableShifts