import { createElement as $, useContext, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import noop from 'lodash/fp/noop'
import find from 'lodash/fp/find'
import HospitalContext from './HospitalContext'
import { useMutation, useQuery, useApolloClient } from '@apollo/react-hooks'
import { Mutation } from '@apollo/react-components'
import {
  toggleRejection,
  professionRequests,
  addConfirmation,
  removeConfirmation,
  requestFragment
} from 'queries'

import Box from '@material-ui/core/Box'
import IconButton from '@material-ui/core/IconButton'
import Switch from '@material-ui/core/Switch'
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
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash'
import Avatar from '@material-ui/core/Avatar'

const Requests = () => {

  const { hospitalId, isManagedByMe } = useContext(HospitalContext)
  const [onlyActual, setOnlyActual] = useState(true)
  const { data } = useQuery(professionRequests, { variables: { where: {
    hospital_id: { _eq: hospitalId }
  }}})
  
  return $(Fragment, null,
    isManagedByMe &&
      $(Box, { padding: 2, paddingBottom: 0 },
        $(FormControlLabel, {
          control: $(Switch, { checked: onlyActual, onClick: () => setOnlyActual(!onlyActual) }),
          label: $(Box, { padding: 1 }, 'Только необработанные')})),
      data && 
        $(List, null, 
        data.requests.length === 0
          ? $(ListItem, null,
              $(ListItemText, {
                primary: 'Здесь будут заявки волонтёров на смены, требующие особых условий: мед. книжки, трудовой договор и т. д.'}))
          : map(request => $(Request, { key: request.uid, ...request}), data.requests)))
}

const Request = ({
  uid,
  volunteer,
  profession,
  confirmedRequirements,
  requirements,
  isRejected
}) => {

  const { hospitalId } = useContext(HospitalContext)
  const client = useApolloClient()
  const fragment = {
    id: uid,
    fragment: requestFragment,
  }
  const [confirm, confirmOptions] = useMutation(addConfirmation, {
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

  const [remove, removeOptions] = useMutation(removeConfirmation)

  const loading = confirmOptions.loading || removeOptions.loading

  return $(ListItem, { key: uid, alignItems: 'flex-start'},
    $(ListItemAvatar, null,
      $(Avatar)),
    $(ListItemText, {
      primary: `${volunteer.lname} ${volunteer.fname}`,
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
                onClick: loading ? noop : () => !confirmed
                  ? confirm({
                      optimisticResponse: {
                        insert_volunteer_hospital_requirement: {
                          returning: [{ uid: Math.random(), requirement_id: requirement.uid }]
                        }
                      },
                      variables: { requirement_id: requirement.uid }})
                  : remove({
                      optimisticResponse: {
                        delete_volunteer_hospital_requirement: {
                          affected_rows: 1
                        }
                      },
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
    $(ToggleRejection, { uid, isRejected }))
}

const ToggleRejection = ({
  uid,
  isRejected
}) =>
  $(Mutation, {
    mutation: toggleRejection,
    variables: { uid, isRejected: !isRejected } }, onClick =>
    $(ListItemSecondaryAction, null,
      $(IconButton, { onClick },
        isRejected
          ? $(RestoreFromTrash)
          : $(Delete))))

export default Requests