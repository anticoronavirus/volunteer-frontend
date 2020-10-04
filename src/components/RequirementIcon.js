import { Box } from '@material-ui/core'
import { CheckCircle, RemoveCircleOutline }  from '@material-ui/icons'
import { createElement as $ } from 'react'

const Requirement = ({ requirement, satisfied }) =>
  $(Box, { display: 'flex', alignItems: 'center', margin: '8px 0' },
    $(satisfied && satisfied.length
      ? CheckCircle
      : RemoveCircleOutline, { fontSize: 'small' }),
      $(Box, { marginLeft: 1 }, requirement.name))

export default Requirement