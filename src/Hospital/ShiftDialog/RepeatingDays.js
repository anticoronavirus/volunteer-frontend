import { createElement as $, memo } from 'react'
import fpMap from 'lodash/fp/map'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import ButtonBase from '@material-ui/core/ButtonBase'
import { styled } from '@material-ui/core/styles'

const map = fpMap.convert({ cap: false })

const RepeatingDays = ({
  value = 0,
  onChange
}) => $(Box, null,
  $(Typography, { variant: 'caption' }, 'Повторять по'),
  $(Box, { display: 'flex', marginTop: 1, paddingBottom: '4px' },
    map((children, index) => {
      const powerOfTwo = 2 ** index
      const selected = (value & powerOfTwo) !== 0
      return $(Weekday, {
        selected,
        children,
        key: powerOfTwo,
        onClick: () => onChange(selected
          ? value - powerOfTwo
          : value + powerOfTwo)
      })
    }, days)))

const Weekday = styled(ButtonBase)(({ theme, selected }) => ({
  ...theme.typography.caption,
  textTransform: 'uppercase',
  height: 32,
  width: 32,
  borderRadius: '50%',
  transition: `background ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeOut}`,
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.grey[theme.palette.type === 'dark' ? 700 : 300],
  '&:not(:last-child)': {
    marginRight: 8
  }
}))

const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

export default memo(RepeatingDays)
