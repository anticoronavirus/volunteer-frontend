import { createElement as $, useState } from 'react'
import fpMap from 'lodash/fp/map'

import Box from '@material-ui/core/Box'
import ButtonBase from '@material-ui/core/ButtonBase'
import { styled } from '@material-ui/core/styles'
const map = fpMap.convert({ cap: false })

const RepeatingDays = ({
  value = 0,
  onChange
}) => $(Box, { display: 'flex' },
  map((children, index) => {
    const powerOfTwo = 2 ** index
    const selected = (value & powerOfTwo) !== 0
    return $(Weekday, {
      selected,
      children,
      onClick: () => onChange(selected
        ? value - powerOfTwo
        : value + powerOfTwo)
    })
  }, days))

const Weekday = styled(ButtonBase)(({ theme, selected }) => ({
  ...theme.typography.caption,
  textTransform: 'uppercase',
  height: 32,
  width: 32,
  borderRadius: '50%',
  tranisition: `background ${theme.transitions.duration.short} ${theme.transitions.easing.easeIn}`,
  backgroundColor: selected
    ? theme.palette.primary.main
    : theme.palette.grey[theme.palette.type === 'dark' ? 700 : 300],
  '&:not(:last-child)': {
    marginRight: 8
  }
}))

const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

export default RepeatingDays
