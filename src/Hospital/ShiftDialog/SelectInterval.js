import React, { createElement as $, useState } from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import { styled } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const SelectInterval = () => {
  const [count, setCount] = useState(1)
  const [option, setOption] = useState('day')

  const handleIncrement = () => {
    setCount(count + 1)
  }

  const hanldeDecrement = () => {
    setCount(count - 1 < 1 ? 1 : count - 1)
  }

  return $(Box, null,
    $(ButtonGroup, { variant: 'outlined' },
      $(Button, { onClick: hanldeDecrement }, '-'),
      $(Button, null, count),
      $(Button, { onClick: handleIncrement }, '+')),
      $(SelectIntervalOptions, { count, value: option, onChange: setOption })
  )
}


const SelectIntervalOptions = ({
  value,
  count,
  onChange
}) => {
  const options = [
    {
      key: 'day',
      label: declOfNum(count, ['День', 'Дня', 'Дней']),
    },
    {
      key: 'week',
      label:  declOfNum(count, ['Неделя', 'Недели', 'Недель']),
    },
    {
      key: 'month',
      label: declOfNum(count, ['Месяц', 'Месяца', 'Месяцев']),
    },
    {
      key: 'year',
      label: declOfNum(count, ['Год', 'Года', 'Лет'])
    }
  ]
  const selected = find({ key: value }, options)

  return $(StyledSelect, {
    value: selected,
    onChange: (event) => onChange(event.target.value),
    select: true,
    SelectProps: {
      renderValue: () => $(Typography, { variant: 'subtitle2' }, selected.label)
    }
  },
    map(option =>
      $(MenuItem, { key: option.key, value: option.key }, option.label),
      options
    ))
}

SelectIntervalOptions.defaultProps = {
  onChange: () => {}
}

const StyledSelect = styled(TextField)({
  marginLeft: 16
})

const declOfNum = (number, titles) => 
  titles[ (number % 100 > 4 && number % 100 < 20)
    ? 2 
    : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5] ]

export default SelectInterval