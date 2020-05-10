import { createElement as $ } from 'react'
import map from 'lodash/fp/map'

import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import CheckCircle from '@material-ui/icons/CheckCircle'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'

const ShiftRequest = ({
  uid,
  hospital,
  profession,
  requirements
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${profession.name} в ${hospital.shortname}`,
      secondary: $(Box, null,
        map(Requirement, requirements))}))

const Requirement = ({ requirement, satisfied }) =>
  $(Box, { display: 'flex', alignItems: 'center', margin: '8px 0' },
    $(satisfied && satisfied.length
      ? CheckCircle
      : RemoveCircleOutline, { fontSize: 'small' }),
      $(Box, { marginLeft: 1 }, requirement.name))

export default ShiftRequest