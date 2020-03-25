import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import DateFnsUtils from '@date-io/date-fns'
import addDays from 'date-fns/addDays'
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'

const VolunteerForm = () =>
  $(Box, { margin: '32px auto', maxWidth: '70ex' }, 
    $(Paper, null,
      $(Box, { padding: 3 },
        $(Typography, { variant: 'h4', paragraph: true },
          'Регистрация волонтёров'),
          $(Typography, { variant: 'subtitle1', paragraph: true },
            'Anticorona'),
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
        }))),
    $(Box, { height: 16 }),
    $(Paper, null,
      $(MuiPickersUtilsProvider, { utils: DateFnsUtils }, 
        $(DatePicker, {
          autoOk: true,
          variant: 'static',
          openTo: 'date',
          value: new Date(),
          minDate: new Date(),
          maxDate: addDays(new Date(), 14),
          orientation: 'portrait',
          onChange: console.log
        })),
        $(Box, { padding: 3 })
  ))

export default VolunteerForm