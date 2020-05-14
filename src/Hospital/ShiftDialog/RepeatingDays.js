import { createElement as $, useState } from 'react'
import map from 'lodash/fp/map'
import { styled } from '@material-ui/styles'

const RepeatingDays = ({
  value,
  onChange
}) => {
  const days = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']
  const [picked, setPicked] = useState(value)

  const handleTogglePicked = (day) => {
    const newPicked = picked.includes(day)
     ? picked.filter(i => i !== day)
     : [...picked, day]
    
    setPicked(newPicked)
    onChange(newPicked)
  }

  return $(Days, null, map(day => 
    $(StyledDay, {
      key: day,
      active: picked.includes(day),
      onClick: () => handleTogglePicked(day)
    }, day), 
    days))
}

RepeatingDays.defaultProps = {
  value: []
}

const Days = styled('div')({
  display: 'flex'
})

const StyledDay = styled('button')({ 
  border: 'none',
  color: '#fff',
  height: 30,
  width: 30,
  marginRight: 8,
  outline: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '100%',
  background: ({ active }) => active 
    ? '#1da1f2'
    : 'rgba(255, 255, 255, 0.12)'
})

export default RepeatingDays