import { createElement as $ } from 'react'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
// import Typography from '@material-ui/core/Typography'
// import { styled } from '@material-ui/core/styles'

export default ({
  value,
  placeholder,
  onChange
}) =>
  $(Box, { marginTop: 3 },
    $(TextField, {
      variant: 'outlined',
      ...value && { label: 'Описание' },
      fullWidth: true,
      multiline: true,
      value,
      onChange: event => onChange(event.target.value),
      placeholder
    }))
