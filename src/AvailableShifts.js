import { createElement as $, memo } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import entries from 'lodash/fp/entries'
import reduce from 'lodash/fp/reduce'
import {
  shifts,
  addVolunteerToShift,
  removeVolunteerFromShift
} from 'queries'
import { formatLabel, formatDate, uncappedMap } from 'utils'
import { useHistory, useRouteMatch } from 'react-router-dom'

import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TableContainer from '@material-ui/core/TableContainer'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Skeleton from '@material-ui/lab/Skeleton'
import Check from '@material-ui/icons/Check'
import DoubleCheck from '@material-ui/icons/DoneAll'
import green from '@material-ui/core/colors/green'
import orange from '@material-ui/core/colors/orange'
import { useSubscription, useMutation } from '@apollo/react-hooks'

const AvailableShifts = memo(({ userId = null, hospitalId }) => {

  const { data } = useSubscription(shifts, { variables: {
    userId,
    hospitalId: hospitalId ? `{${hospitalId}}` : null }
  })

  const generatedTable = data && reduce(generateTableReducer({ userId, hospitalId }), {
    columns: new Set(),
    rows: {}
  }, data.shifts)

  return $(Paper, null,
    $(TableContainer, null,
      $(Table, null,
        $(TableHead, null,
          $(TableRow, null,
            !data
              ? LoadingTableHeader
              : map(Header, Array.from(generatedTable.columns)))),
          $(TableBody, null,
            !data
              ? LoadingTableBody
              : map(Row, entries(generatedTable.rows))))))
})

const generateTableReducer = ids => (result, shift) => {
  result.columns.add(shift.date)
  if (!result.rows[`${shift.start}-${shift.end}`])
    result.rows[`${shift.start}-${shift.end}`] = []
  result.rows[`${shift.start}-${shift.end}`].push({ ...ids, ...shift })
  return result
}

const Header = date =>
  $(TableCell, { key: date, style: { minWidth: '16ex' }}, formatDate(date))

const Row = ([key, cells]) =>
  $(TableRow, { key }, map(CellFunction, cells))

const CellFunction = cell => $(Cell, { key: cell.date + cell.start + cell.end, ...cell })

const Cell = ({
  date,
  start,
  end,
  hospitalscount,
  placesavailable,
  shiftRequests,
  userId
}) => {

  const disabled = !shiftRequests.length && !placesavailable
  const history =  useHistory()
  const match = useRouteMatch('/:hospitalId')
  const hospitalId = match && match.params && match.params.hospitalId
  const [addToShift] = useMutation(addVolunteerToShift, { variables: { userId, hospitalId }})
  const [removeFromShift] = useMutation(removeVolunteerFromShift)

  const color = disabled
    ? 'textSecondary'
    : shiftRequests.length
      ? 'inherit'
      : 'initial'

  const toggleShift = () =>
    !userId
      ? history.push('/login')
      : shiftRequests.length
        ? removeFromShift({ variables: { uid: shiftRequests[0].uid } }) 
        : !hospitalId
          ? null
          : addToShift({ variables: { date, start, end } })

  return $(CellPure, { 
    date,
    start,
    end,
    placesavailable,
    hospitalscount,
    hospitalSelected: hospitalId,
    myShift: shiftRequests[0],
    toggleShift
  })
}

const CellPure = ({
  date,
  start,
  end,
  placesavailable,
  hospitalscount,
  hospitalSelected,
  toggleShift,
  myShift,
  loading
}) =>
  $(TableCell, { padding: 'none' },
    $(ButtonBase, { onClick: toggleShift, disabled: !myShift && !placesavailable },
      $(Box, {
        width: 148,
        padding: 2,
        textAlign: 'left',
        style: {
          opacity: !myShift && !placesavailable && .4,
          backgroundColor: !myShift
            ? 'inherit'
            : myShift.confirmed
              ? green[500]
              : orange[500]
        }
      },
        $(Typography, { variant: 'overline' },
            loading
              ? $(Skeleton, { width: '13ex' })
              : `${start.slice(0, 5)}—${end.slice(0, 5)}`),
        !hospitalSelected &&
          $(Typography, { variant: 'body2' },
            loading
              ? $(Skeleton, { width: '11ex' })
              : formatLabel('hospital', hospitalscount)),
        $(Typography, { variant: 'body2'},
          loading
            ? $(Skeleton, { width: '8ex' })
            : placesavailable
              ? formatLabel('place', placesavailable)
              : 'укомплектовано'),
        $(Box, {
          display: 'flex',
          alignItems: 'center',
          paddingTop: 1,
        },
          !myShift
            ? $(Box, { height: 24 }) // FIXME empty box for preserving height 
            : myShift.confirmed
              ? $(DoubleCheck)
              : $(Check),
          $(Box, { width: '1ex'}),
          myShift &&
            $(Typography, { variant: 'body2' },
                !hospitalSelected
                  ? myShift.hospital.shortname
                  : myShift.confirmed
                    ? 'Подтверждено'
                    : 'Отправлено')))))

// Loading stuff

const loadingRange = range(1, 14)

const LoadingHeaderCell = (value, key) => 
  $(TableCell, { key },
    $(Skeleton, { width: '10ex', variant: 'text', }))

const LoadingTableHeader =
  uncappedMap(LoadingHeaderCell, loadingRange)

const LoadingBodyCell = (value, key) =>
  $(CellPure, { key, loading: true })

const LoadingTableBody = [
  $(TableRow, { key: 1 }, uncappedMap(LoadingBodyCell, loadingRange)),
  $(TableRow, { key: 2 }, uncappedMap(LoadingBodyCell, loadingRange)),
  $(TableRow, { key: 3 }, uncappedMap(LoadingBodyCell, loadingRange))
]

export default AvailableShifts