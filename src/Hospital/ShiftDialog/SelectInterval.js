import { createElement as $, memo } from 'react'

import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

const SelectInterval = ({
  value,
  onChange,
}) =>
  $(Box, null,
    $(Typography, { variant: 'caption' }, 'Настройки повторения'),
    $(Box, { marginTop: 1 },
      $(ToggleButtonGroup, {
        value,
        exclusive: true,
        size: 'small',
        onChange: (event, value) => onChange(value) },
        $(ToggleButton, { value: null }, 'Однократно'),
        $(ToggleButton, { value: 'daily' }, 'День'),
        $(ToggleButton, { value: 'weekly' }, 'Неделя'))))

export default memo(SelectInterval)