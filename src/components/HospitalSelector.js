import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import { useQuery } from '@apollo/react-hooks'
import { hospitals } from 'queries'

import Button from '@material-ui/core/Button'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Box from '@material-ui/core/Box'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Skeleton from '@material-ui/lab/Skeleton'
import { withStyles } from '@material-ui/core/styles'

const HospitalSelector = ({ hospital: [value, onChange]}) => {

  const [anchorEl, setAnchorEl] = useState(null)
  const { data } = useQuery(hospitals)

  const hospital = data && value && find({ uid: value }, data.hospitals)

  const Hospital = ({ uid, shortname }) =>
    $(MenuItem, {
      key: uid,
      onClick: () => {
        setAnchorEl(null)
        onChange(uid)
      }},
      shortname)

  return !data
    ? $(Box, { padding: '3px', paddingLeft: 1 }, 
        $(Skeleton, { variant: 'text', height: 42, width: 200 }))
    : $(Fragment, null,
        $(TitleButton, {
          endIcon: $(ExpandMoreIcon),
          onClick: event => setAnchorEl(event.currentTarget) },
          hospital ? hospital.shortname : 'Все больницы'),
        $(Menu, {
          open: Boolean(anchorEl),
          anchorEl: anchorEl,
          onClose: () => setAnchorEl(null) },
          Hospital({shortname: 'Все больницы', uid: null }),
          map(Hospital, data.hospitals)))
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