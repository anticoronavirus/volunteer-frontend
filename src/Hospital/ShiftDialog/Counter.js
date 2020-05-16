import { createElement as $, memo } from 'react'
import { formatLabel } from 'utils'
import map from 'lodash/fp/map'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { styled } from '@material-ui/core/styles'

const Counter = ({
  label,
  format,
  value = 1,
  onChange
}) =>
  $(Box, null,
    $(Typography, { variant: 'caption' }, label),
    $(Box, { marginTop: 1 },
      $(ButtonGroup, { fullWidth: true },
        $(Button, { onClick: () => value > 1 && onChange(value - 1) }, '-'),
        $(ValueHolder, { disabled: true }, format ? formatLabel(format, value) : value),
        $(Button, { onClick: () => onChange(value + 1) }, '+'))))

const ValueHolder = styled(Button)({
  whiteSpace: 'nowrap'
})

export default memo(Counter)