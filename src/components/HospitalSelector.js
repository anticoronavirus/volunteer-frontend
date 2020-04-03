import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import { useQuery } from '@apollo/react-hooks'
import { hospitals } from 'queries'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { withStyles } from '@material-ui/core/styles'

const mockData = {
  hospitals: [{
    uid: 1,
    shortName: 'ГКБ №40'
  }, {
    uid: 2,
    shortName: 'ГКБ №41'
  }]
}

const HospitalSelector = ({ hospital: [value, onChange]}) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const { data = mockData } = useQuery(hospitals) // FIXME get actual data
  
  const hospital = find({ uid: value }, data.hospitals)
  if (!value)
    onChange(null)

  return $(Fragment, null,
    $(TitleButton, {
      endIcon: $(ExpandMoreIcon),
      onClick: event => setAnchorEl(event.currentTarget) },
      hospital ? hospital.shortName : 'Все больницы'),
    $(Menu, {
      open: Boolean(anchorEl),
      anchorEl: anchorEl,
      onClose: () => setAnchorEl(null) },
      map(({ uid, shortName }) =>
        $(MenuItem, {
          key: uid,
          onClick: () => {
            setAnchorEl(null)
            onChange(uid) 
          }},
          shortName),
        data.hospitals)))
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