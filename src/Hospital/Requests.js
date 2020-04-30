import { createElement as $, useContext, Fragment } from 'react'
import map from 'lodash/fp/map'
import HospitalContext from './HospitalContext'
import { professionRequests } from 'queries'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Delete from '@material-ui/icons/Delete'
import Avatar from '@material-ui/core/Avatar'
import { useQuery } from '@apollo/react-hooks'

const Requests = () => {

  const { hospitalId } = useContext(HospitalContext)

  const { data } = useQuery(professionRequests, { variables: { hospitalId }})
  
  return $(List, null,
    !data ? null :
      data.requests.length === 0
        ? $(ListItem, null,
            $(ListItemText, {
              primary: 'Здесь будут заявки волонтёров на смены, требующие особых условий: мед. книжки, трудовой договор и т. д.'}))
        : map(Request, data.requests))
}

const Request = ({
  uid,
  volunteer,
  profession,
  requirements
}) =>
  $(ListItem, { key: uid, alignItems: 'flex-start'},
    $(ListItemAvatar, null,
      $(Avatar)),
    $(ListItemText, {
      primary: volunteer.name,
      secondary: $(Fragment, null,
        $(FormLabel, null, `${profession.name} · ${volunteer.phone}`),
        $(FormGroup, null,
          map(Requirement, requirements)))}),
    $(ListItemSecondaryAction, null,
      $(Delete)))

const Requirement = ({
  uid,
  requirement,
  confirmed
}) =>
  $(FormControlLabel, {
    control: $(Checkbox, { checked: confirmed }),
    label: requirement.name
  })

export default Requests