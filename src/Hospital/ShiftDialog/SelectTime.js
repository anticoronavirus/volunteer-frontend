import { createElement as $, useRef, useState,  useLayoutEffect, memo } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import DateFnsUtils from '@date-io/date-fns';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import ruLocale from "date-fns/locale/ru"
import startOfDay from 'date-fns/startOfDay'
import endOfDay from 'date-fns/endOfDay'
import addMinutes from 'date-fns/addMinutes'
import addHours from 'date-fns/addHours'
import isBefore from 'date-fns/isBefore'
import isEqual from 'date-fns/isEqual'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import format from 'date-fns/format'
import { styled } from '@material-ui/core/styles'
import MenuItem from '@material-ui/core/MenuItem'

const SelectDateAndTime = ({
  onChange = console.log
}) => {
  const [selectedDate, setSelectedDate] = useState(Date.now())
  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)
  const startOptions = getStartOptions(selectedDate)
  const endOptions = getEndOptions(selectedDate, startTime)

  return $(Wrapper, null,
    $(SelectDate, { value: selectedDate, onChange: setSelectedDate }),
    $(Box, { style: { display: 'flex ', flex: 1 }},
      $(SelectTime, {
        value: startTime,
        options: startOptions,
        label: 'Начало',
        onChange: setStartTime
      }),
      $(SelectTime, {
        value: endTime,
        options: endOptions,
        label: 'Окончание',
        disabled: !startTime,
        onChange: setEndTime
      })))
}

const Wrapper = styled(Box)({
  display: 'flex',
  alignItems: 'flex-end'
})

const SelectTime = ({
  value,
  options,
  onChange,
  label,
  disabled
}) => {
  return $(TextField, {
    select: true,
    value,
    onChange: event => onChange(event.target.value),
    label,
    disabled,
    style: { width: '50%' },
    SelectProps: {
      IconComponent: () => '',
      renderValue: () => format(value, 'HH:mm')
    }
  }, map(Time, options))
}

const Time = ({ label, value }) =>
  $(MenuItem, { key: value, value }, label)

const SelectDate = ({
  value,
  onChange
}) => {
  const handleDateChange = (date) => {
    console.log(date)
    onChange(date)
  }

  return $(MuiPickersUtilsProvider, { utils: DateFnsUtils, locale: ruLocale },
    $(KeyboardDatePicker, {
      disableToolbar: true,
      autoOk: true,
      variant: 'inline',
      format: 'MM/dd/yyyy',
      label: 'Выберите день',
      value,
      onChange: handleDateChange,
      KeyboardButtonProps: {
        'aria-label': 'Изменить дату',
      },
      TextFieldComponent: props => $(TextField, {...props, disabled: true, style: { width: 180 }})
    }))
}

const getStartOptions = (selectedDate) => {
  const options = []
  const start = startOfDay(selectedDate)
  const end = endOfDay(selectedDate)
  for (let i = start; isBefore(i, end); i = addMinutes(i, 30)) {
    options.push({
      label: format(i, 'HH:mm'),
      value: i.valueOf()
    })
  }
  return options
}

const getEndOptions = (selectedDate, startTime) => {
  const options = []
  const start = addHours(startTime, 4)
  const end = addHours(startTime, 24)

  for (let i = start; isBefore(i, end) || isEqual(i, end); i = addMinutes(i, 30)) {
    options.push({
      label: `${format(i, 'HH:mm')} (${differenceInMinutes(i, startTime)/60} ч.)`,
      value: i.valueOf()
    })
  }
  return options
}

export default memo(SelectDateAndTime)
