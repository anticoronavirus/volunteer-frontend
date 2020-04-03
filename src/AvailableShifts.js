import { createElement as $, memo } from 'react'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import map from 'lodash/fp/map'
import random from 'lodash/fp/random'
import entries from 'lodash/fp/entries'
import reduce from 'lodash/fp/reduce'
import ButtonBase from '@material-ui/core/ButtonBase'
import CircularProgress from '@material-ui/core/CircularProgress'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Check from '@material-ui/icons/Check'
import green from '@material-ui/core/colors/green'
import { useSubscription } from '@apollo/react-hooks'
import {
  shifts,
} from 'queries'
import { formatLabel, formatDate } from 'utils'

const now = new Date()
const range = {
  from: format(now, 'yyyy-MM-dd'),
  to: format(addDays(now, 14), 'yyyy-MM-dd')
}

const AvailableShifts = memo(() => {

  const { data } = useSubscription(shifts, {
    variables: {
      profession: 'врач',
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
  $(TableCell, { key: date, style: { minWidth: '16ex' }}, formatDate(date))

const Row = ([key, cells]) =>
  $(TableRow, { key }, map(CellFunction, cells))

const CellFunction = cell => $(Cell, { key: cell.uid, ...cell })

const Cell = ({
  uid,
  date,
  start,
  end,
  hospitalsCount = random(0, 25) || random(0, 25),
  placesAvailable = random(0, 25) < 10 ? 0 : random(0, 25),
  myShift = random(0, 25) < 10 && { hospital: { shortName: 'ГКБ №40' } }
}) => {
  const disabled = !myShift && !placesAvailable
  const user = true // FIXME
  const hospitalSelected = true // FIXME
  const color = disabled
    ? 'textSecondary'
    : myShift
      ? 'inherit'
      : 'initial'

  const onClick = () =>
    !user
      ? 'register'
      : !hospitalSelected
        ? 'open hospitals'
        : 'send'

  return $(TableCell, {
    key: uid,
    align: 'left',
    padding: 'none',
    style: {
      verticalAlign: 'top',
      borderBottomColor: myShift && green[300],
      backgroundColor: myShift && green[500]
    }
  },
    $(ButtonBase, { onClick, disabled },
      $(Box, {
        padding: 2,
        width: 148,
        textAlign: 'left',
      },
        $(Typography, { variant: 'overline', color },
          start.slice(0, 5), '—', end.slice(0, 5)),
        $(Typography, { variant: 'body2', color },
          formatLabel('hospital', hospitalsCount)),
        $(Typography, { variant: 'body2', color },
          placesAvailable === 0
            ? 'укомплектовано'
            : formatLabel('place', placesAvailable)),
      !myShift
        ? $(Box, { padding: '14px' })
        : $(Box, { display: 'flex', alignItems: 'center', paddingTop: 1 },
            $(Check, { fontSize: 'small', htmlColor: green[100] }),
            $(Box, { width: '8px', }),
            $(Typography, { variant: 'body2' }, myShift.hospital.shortName.slice(0, 10))))))
}

export default AvailableShifts