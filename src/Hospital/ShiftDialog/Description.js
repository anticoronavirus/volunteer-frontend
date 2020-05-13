import { createElement as $ } from 'react'
import TextField from '@material-ui/core/TextField'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { styled } from '@material-ui/core/styles'

export default ({
  text, onChange
}) =>
  $(Box, { marginTop: 3 },
    $(TextField, {
      size: 'small',
      variant: 'outlined',
      label: 'Описание',
      fullWidth: true,
      multiline: true,
      value: text,
      onChange: event => onChange(event.target.value),
      placeholder: text
    }))
