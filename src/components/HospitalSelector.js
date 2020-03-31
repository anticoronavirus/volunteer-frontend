import { createElement as $, Fragment, useState } from 'react'
import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'

const HospitalSelector = () => {

  const [anchorEl, setAnchorEl] = useState(null)
  
  return $(Fragment, null,
    $(TitleButton, {
      endIcon: $(ExpandMoreIcon),
      onClick: event => setAnchorEl(event.currentTarget) },
    'Все больницы'),
    $(Menu, {
      open: Boolean(anchorEl),
      anchorEl: anchorEl,
      onClose: () => setAnchorEl(null) },
      $(MenuItem, null, 'ГКБ №40'),
      $(MenuItem, null, 'ГКБ №52')))
}

const TitleButton = withStyles({
  root: {
    padding: '3px 8px'
  },
  text: {
    fontSize: 24,
    textTransform: 'none'
  }
})(Button)

export default HospitalSelector