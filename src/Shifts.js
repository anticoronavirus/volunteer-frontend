import { createElement as $ } from 'react'
import { useSubscription } from '@apollo/react-hooks'
import map from 'lodash/fp/map'
import addDays from 'date-fns/addDays'
import format from 'date-fns/format'
import Box from '@material-ui/core/Box'
import CircularProgress from '@material-ui/core/CircularProgress'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import {
  volunteerShifts,
} from 'queries'

const now = new Date()

const Shifts = () => {

  const { data } = useSubscription(volunteerShifts, {
    variables: {
      from: now,
      to: addDays(now, 14)
    }
  })

  return !data 
    ? $(Box, { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100vw', height: '100vh' },
        $(CircularProgress))
    : $(Table, null,
        $(TableHead, null, 
          $(TableRow, null),
          $(TableCell, null, 'Дата'),
          $(TableCell, null, 'Смена'),
          $(TableCell, null, 'Профессия'),
          $(TableCell, null, 'ФИО'),
          $(TableCell, null, 'Телефон'),
          $(TableCell, null, 'Электропочта')),
        $(TableBody, null,
          map(Row, data.volunteer_shift)))
}

const Row = ({ shift, volunteer }) =>
  $(TableRow, null,
    $(TableCell, null, format(new Date(shift.date), 'd MMMM')),
    $(TableCell, null, shift.start.slice(0, 5), ' - ', shift.end.slice(0, 5)),
    $(TableCell, null, volunteer.profession),
    $(TableCell, null, volunteer.lname, ' ', volunteer.fname, ' ', volunteer.mname, ),
    $(TableCell, null, volunteer.phone),
    $(TableCell, null, volunteer.email),
    )

export default Shifts