import { createElement as $ } from 'react'
import Biohazard from './Biohazard'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

const TaskOption = ({ onClick, ...task }) =>
  $(ListItem, { button: true, key: task.uid || '', value: task.uid, onClick },
    $(ListItemText, {
      // disableTypography: true,
      primary: $(Box, { display: 'flex' }, task.dangerous && $(Biohazard), task.name),
      secondary: $(Box, { maxWidth: '60ex' },
        // task.requirements &&
        //   $(Typography, { component: 'span', variant: 'caption' }, task.requirements),
        // task.requirements &&
        //   $(Typography, { component: 'span' }, ' · '),
        $(Typography, { component: 'span', variant: 'caption' }, task.periods ? task.periods[0].notabene : task.description))}))

export default TaskOption