import { useQuery } from '@apollo/client'
import { List, ListItem, ListItemText, Paper } from '@material-ui/core'
import map from 'lodash/fp/map'
import { createElement as $, useContext } from 'react'

import { professions } from 'queries'

import HospitalContext from './HospitalContext'
import SubheaderWithBackground from 'components/SubheaderWithBackground'

const Settings = () => {
  const { data, error } = useQuery(professions)
  return $(Paper, null,
    $(List, null,
      $(SubheaderWithBackground, null, 'Доступные профессии'),
      data &&
        map(Profession, data.professions)))
}

const Profession = ({
  uid,
  name
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, { 
      primary: name
    }))
    
export default Settings