import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
// import ToggleButton from '@material-ui/lab/ToggleButton'
// import DateFnsUtils from '@date-io/date-fns'
import addDays from 'date-fns/addDays'
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
    $(Paper, null,
      $(Table, null,
        $(TableHead, null,
          $(TableRow, null,
            map(day => 
              $(TableCell, { style: { minWidth: '16ex' }}, day),
              days))),
        $(TableBody, null,
          map(
            shift => $(TableRow, null,
              map(
                day => $(TableCell, null,
                  $(Box, null, shift),
                  $(Box, null, '3 места')),
                days)),
            shifts)))
        
      // $(MuiPickersUtilsProvider, { utils: DateFnsUtils }, 
      //   $(DatePicker, {
      //     fullWidth: true,
      //     autoOk: true,
      //     variant: 'static',
      //     openTo: 'date',
      //     value: new Date(),
      //     minDate: new Date(),
      //     maxDate: addDays(new Date(), 14),
      //     orientation: 'portrait',
      //     onChange: console.log
      //   })),
  ))

const today = new Date()
const days = map(
  value => format(addDays(today, value), 'd LLLL'),
  range(0, 13))

const shifts = ['8:00 - 14:00', '14:00 - 20:00', '20:00 - 8:00']

export default VolunteerForm