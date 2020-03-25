import { createElement as $ } from 'react'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'

const VolunteerForm = () =>
  $(Box, { margin: 'auto', maxWidth: '60ex' }, 
    $(Paper, null,
      $(Box, { padding: 2 },
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
        })
        )))

export default VolunteerForm