import { createElement as $, useContext, Fragment } from 'react'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import find from 'lodash/fp/find'
import HospitalContext from './HospitalContext'
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks'
import { professionRequests, addConfirmation, removeConfirmation, requestFragment } from 'queries'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
// import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
// import Delete from '@material-ui/icons/Delete'
import Avatar from '@material-ui/core/Avatar'

const Requests = () => {

  const { hospitalId } = useContext(HospitalContext)

  const { data } = useQuery(professionRequests, { variables: { hospitalId }})
  
  return $(List, null,
    !data ? null :
      data.requests.length === 0
        ? $(ListItem, null,
            $(ListItemText, {
              primary: 'Здесь будут заявки волонтёров на смены, требующие особых условий: мед. книжки, трудовой договор и т. д.'}))
        : map(request => $(Request, request), data.requests))
}

const Request = ({
  uid,
  volunteer,
  profession,
  confirmedRequirements,
  requirements
}) => {

  const { hospitalId } = useContext(HospitalContext)
  const client = useApolloClient()
  const fragment = {
    id: uid,
    fragment: requestFragment,
  }
  const [confirm] = useMutation(addConfirmation, {
    update: (store, result) =>
      client.writeFragment({
        ...fragment,
        data: {
          confirmedRequirements: [
            ...confirmedRequirements,
            result.data.insert_volunteer_hospital_requirement.returning[0]
          ]
        }
      }),
    variables: {
      volunteer_id: volunteer.uid,
      hospital_id: hospitalId
    }})

  const [remove] = useMutation(removeConfirmation)

  return $(ListItem, { key: uid, alignItems: 'flex-start'},
    $(ListItemAvatar, null,
      $(Avatar)),
    $(ListItemText, {
      primary: `${volunteer.fname} ${volunteer.lname}`,
      secondary: $(Fragment, null,
        $(FormLabel, null, `${profession.name} · ${volunteer.phone}`),
        $(FormGroup, null,
          map(({
            uid,
            requirement,
          }) => {
            const confirmed = find({ requirement_id: requirement.uid }, confirmedRequirements)
            return $(FormControlLabel, {
              key: uid,
              label: requirement.name,
              control: $(Checkbox, {
                onClick: () => !confirmed
                  ? confirm({ variables: { requirement_id: requirement.uid }})
                  : remove({
                      update: () =>
                        client.writeFragment({
                          ...fragment,
                          data: {
                            confirmedRequirements: filter(
                              data => data.requirement_id !== requirement.uid,
                              confirmedRequirements)
                          }
                        }),
                      variables: { uid: confirmed.uid }}),
                checked: !!confirmed })})
              },
          requirements)))}),
    // $(ListItemSecondaryAction, null,
    //   $(Delete))
      )
}

export default Requests