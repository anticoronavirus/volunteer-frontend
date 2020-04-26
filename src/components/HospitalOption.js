import { createElement as $ } from 'react'
// import Biohazard from './Biohazard'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import Typography from '@material-ui/core/Typography'
// import Box from '@material-ui/core/Box'

const HospitalOption = ({ onClick, ...hospital }) =>
  $(ListItem, { button: true, key: hospital.uid || '', value: hospital.uid, onClick },
    $(ListItemText, {
      primary: hospital.shortname,
      secondary: hospital.address && hospital.address.split(', ').slice(2).join(', ') }))

export default HospitalOption