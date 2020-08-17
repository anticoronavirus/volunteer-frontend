import { Box, Paper, ToggleButtonGroup, ToggleButton } from '@material-ui/core'
import map from 'lodash/fp/map'
import { createElement as $, useState } from 'react'

import TaskOption from 'components/TaskOption'
import MultipleSelector from 'components/MultipleSelector'
import { professions } from 'queries'

const ShiftOffer = ({
  hospitalId
}) => {

  const [taskId, setTaskId] = useState()
  const [duration, setDuration] = useState()

  return $(Paper, null,
    $(Box, { padding: 2 }),
    $(MultipleSelector, {
      query: professions,
      // variables: {},
      path: 'professions',
      label: 'Задача',
      Option: TaskOption,
      defaultValue: {
        name: 'Все',
        uid: undefined
      },
      emptyLabel: 'Выберите задачу',
      getOptionLabel: task => task.name,
      getOptionValue: task => task.uid,
      value: taskId,
      onChange: console.log }),
      $(ToggleButtonGroup, {
        size: 'small',
        exclusive: true,
        value: duration,
        onChange: (_, value) => setDuration(value)},
        map(Duration, durations)))
}

const Duration = key =>
  $(ToggleButton, { key }, `${key} часа`)

const durations = [2,4,6,8,12]



export default ShiftOffer