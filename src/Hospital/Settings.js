import { useQuery } from '@apollo/client'
import { List, ListItem, ListItemText, Paper } from '@material-ui/core'
import map from 'lodash/fp/map'
import { createElement as $, useContext } from 'react'

import SubheaderWithBackground from 'components/SubheaderWithBackground'
import { professions } from 'queries'

import HospitalContext from './HospitalContext'

const Settings = () => {
  const { hospitalId } = useContext(HospitalContext)
  const { data } = useQuery(professions, {
    variables: {
      where: {
        hospital_professions: {
          hospital_id: { _eq: hospitalId },
          default: {
            _neq: true 
          }
        }
      }
    }
  })
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