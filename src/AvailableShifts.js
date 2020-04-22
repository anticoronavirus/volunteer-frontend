import { createElement as $, memo, useState, Fragment } from 'react'
import map from 'lodash/fp/map'
// import set from 'lodash/fp/set'
import range from 'lodash/fp/range'
import entries from 'lodash/fp/entries'
import reduce from 'lodash/fp/reduce'
import {
  shifts,
  // shiftsSubscription,
  addVolunteerToShift,
  removeVolunteerFromShift,
  filteredHospitals,
  shiftFragment
} from 'queries'
import { formatLabel, formatDate, uncappedMap } from 'utils'
import { useHistory } from 'react-router-dom'
import { 
  // useSubscription,
  useQuery, useMutation } from '@apollo/react-hooks'
import { Query } from '@apollo/react-components'
import { useSnackbar } from 'notistack'

import ButtonBase from '@material-ui/core/ButtonBase'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
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
import { useQueryParam, DelimitedArrayParam } from 'use-query-params'

const AvailableShifts = memo(({ userId, hospitalId, taskId }) => {

  hospitalId = hospitalId ? `{${hospitalId}}` : null
  taskId = taskId ? `{${taskId}}` : null

  const { data } = useQuery(shifts, {
    pollInterval: 6000,
    variables: userId ? { userId, hospitalId, taskId } : { hospitalId, taskId },
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
  shiftRequests = [],
  userId
}) => {

  const fragment = { 
    id: `${date}-${start}-${end}`,
    variables: { userId },
    fragment: shiftFragment
  } 

  const history = useHistory()
  const [hospitalId] = useQueryParam('hospitals', DelimitedArrayParam)
  // const match = useRouteMatch('/:hospitalId')
  // const hospitalId = match && match.params && match.params.hospitalId
  const [updating, setUpdating] = useState(false)
  const [anchorEl, setAnchorEl] = useState()
  const { enqueueSnackbar } = useSnackbar()

  const [addToShift] = useMutation(addVolunteerToShift, {
    variables: { userId, hospitalId },
    optimisticResponse: {
      insert_volunteer_shift: {
        returning: [{
          uid: Math.random().toString(),
          confirmed: false, 
          hospital: {
            uid: hospitalId,
            __typename: 'hospital'
          },
          __typename: 'volunteer_shift'
          }],
        __typename: 'volunteer_shift_mutation_response'
      }
    },
    update: (cache, result) => {
      const data = cache.readFragment(fragment)
      cache.writeFragment({
        ...fragment,
        data: {
          ...data,
          placesavailable: placesavailable - 1,
          shiftRequests: result.data.insert_volunteer_shift.returning
        }
      })
    }
  })


  const [removeFromShift] = useMutation(removeVolunteerFromShift, {
    variables: shiftRequests[0] && { uid: shiftRequests[0].uid },
    optimisticResponse: {
      delete_volunteer_shift: {
        affected_rows: 1,
        __typename: 'volunteer_shift_mutation_response'
      }
    },
    update: cache => {
      const data = cache.readFragment(fragment)
      cache.writeFragment({
        ...fragment,
        data: {
          ...data,
          placesavailable: data.placesavailable + 1,
          shiftRequests: []
        }
      })
    }
  })

  const addToShiftWithExtraStuff = hospitalId => {
    setUpdating(true)
    addToShift({ variables: hospitalId ? { date, start, end, hospitalId } : { date, start, end }})
      .then(() => enqueueSnackbar('Спасибо! Координатор позвонит для подтверждения'))
      .then(() => setUpdating(false))
  }

  const toggleShift = event =>
    !userId
      ? history.push('/login')
      : shiftRequests.length
        ? setUpdating(true) || removeFromShift().then(() => setUpdating(false))
        : !hospitalId
          ? setAnchorEl(event.currentTarget)
          : addToShiftWithExtraStuff()

  return $(Fragment, null,
    !hospitalId && anchorEl &&
      $(Query, { query: filteredHospitals, variables: { start, end } }, ({ data }) =>
        $(Menu, {
          open: true,
          onClose: () => setAnchorEl(null),
          anchorEl
        },
          map(hospital =>
            $(MenuItem, {
              key: hospital.uid,
              onClick: () => {
                setAnchorEl(false)
                addToShiftWithExtraStuff(hospital.uid)
              }
            },
              hospital.shortname),
            data && data.hospitals))),
    $(CellPure, {
      date,
      start,
      end,
      placesavailable,
      hospitalscount,
      hospitalSelected: hospitalId,
      myShift: shiftRequests[0],
      toggleShift,
      updating
    }))
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
  loading,
  updating
}) =>
  $(TableCell, {
    padding: 'none',
    style: myShift && {
      borderBottomColor: myShift.confirmed
        ? green[300]
        : orange[300],
    }
  },
    $(ButtonBase, { onClick: toggleShift, disabled: updating || loading || (!myShift && !placesavailable) },
      $(Box, {
        width: 148,
        padding: 2,
        textAlign: 'left',
        style: {
          opacity: !myShift && !placesavailable && .4,
          color: myShift && 'white',
          backgroundColor: !myShift
            ? 'inherit'
            : myShift.confirmed
              ? green[500]
              : orange[500]
        }
      },
        $(Typography, { variant: 'overline', color: 'inherit' },
            loading
              ? $(Skeleton, { width: '13ex' })
              : `${start.slice(0, 5)}—${end.slice(0, 5)}`),
        !hospitalSelected &&
          $(Typography, { variant: 'body2', color: 'inherit' },
            loading
              ? $(Skeleton, { width: '11ex' })
              : formatLabel('hospital', hospitalscount)),
        $(Typography, { variant: 'body2', color: 'inherit' },
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
          loading || !myShift
            ? $(Box, { height: 24, width: 48 }) // FIXME empty box for preserving height 
            : myShift.confirmed
              ? $(DoubleCheck)
              : $(Check),
          $(Box, { width: '1ex'}),
          myShift &&
            $(Typography, { variant: 'body2', color: 'inherit' },
              loading
                ? $(Skeleton, { width: '8ex' })
                : myShift.hospital.shortname)))))

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