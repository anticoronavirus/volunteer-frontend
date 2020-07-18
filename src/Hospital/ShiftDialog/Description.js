import { createElement as $, memo } from 'react'

import TextField from '@material-ui/core/TextField'

const Description = ({
  value,
  placeholder,
  onChange
}) =>
  $(TextField, {
    variant: 'outlined',
    ...value && { label: 'Описание' },
    fullWidth: true,
    multiline: true,
    value,
    onChange: event => onChange(event.target.value),
    placeholder
  })

export default memo(Description)