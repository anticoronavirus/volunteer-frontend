import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import map from 'lodash/fp/map'
import { createElement as $ } from 'react'

import Requirement from './RequirementIcon'

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

export default ShiftRequest