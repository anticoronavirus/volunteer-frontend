import { useApolloClient, useMutation, useQuery } from '@apollo/react-hooks'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Switch from '@material-ui/core/Switch'
import Delete from '@material-ui/icons/Delete'
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash'
import filter from 'lodash/fp/filter'
import find from 'lodash/fp/find'
import map from 'lodash/fp/map'
import noop from 'lodash/fp/noop'
import { createElement as $, Fragment, useContext, useState } from 'react'

import ShiftRequest from 'components/ShiftRequest'
import { addConfirmation, professionRequests, removeConfirmation, requestFragment, toggleRejection } from 'queries'

import HospitalContext from './HospitalContext'

const Requests = () => {

  const { hospitalId, hospital, isManagedByMe } = useContext(HospitalContext)
  const [showDeleted, setShowDeleted] = useState(false)
  const { data } = useQuery(professionRequests, { variables: { where: {
    hospital_id: { _eq: hospitalId },
    rejected: { _eq: showDeleted },
  }}})

  return $(Paper, null,
    isManagedByMe &&
      $(Box, { padding: 2, display: 'flex', flexDirection: 'column'},
        $(FormControlLabel, {
          control: $(Switch, { checked: showDeleted, onClick: () => setShowDeleted(!showDeleted) }),
          label: $(Box, { padding: 1 }, 'Удалённые')})),
      data && hospital &&
        $(List, null, 
        data.requests.length === 0
          ? $(ListItem, null,
              $(ListItemText, {
                primary: $(Box, { maxWidth: 400 },
                  'Здесь будут заявки волонтёров на смены, требующие особых условий: мед. книжки, трудовой договор и т. д.') }))
          : map(request => $(isManagedByMe
              ? ManagedRequest
              : ShiftRequest, {
                  key: request.uid,
                  hospital,
                  ...request }),
              data.requests)))
}

const ManagedRequest = ({
  uid,
  volunteer,
  profession,
  confirmedRequirements,
  requirements,
  rejected
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
                      variables: {
                        volunteer_id: volunteer.uid,
                        hospital_id: hospitalId,
                        requirement_id: requirement.uid }})
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
    $(ToggleRejection, { uid, rejected }))
}

const ToggleRejection = ({
  uid,
  rejected
}) => {

  const { hospitalId } = useContext(HospitalContext)
  const [mutate] = useMutation(toggleRejection, {
    optimisticResponse: {
      update_profession_request: {
        returning: {
          uid,
          rejected: !rejected,
          __typename: 'profession_request_mutation_response' 
        }
      }
    },
    update: cache => {
      const data = cache.readQuery({
        query: professionRequests,
        variables: {
          where: {
            hospital_id: { _eq: hospitalId },
            rejected: { _eq: rejected }}}})
      cache.writeQuery({
        query: professionRequests,
        data: {
          ...data,
          requests: filter(request => request.uid !== uid, data.requests)
        },
        variables: {
          where: {
            hospital_id: { _eq: hospitalId },
            rejected: { _eq: rejected }}}})
    },
    variables: { uid, rejected: !rejected }
  })
  
  return $(ListItemSecondaryAction, null,
    $(IconButton, { onClick: mutate },
      rejected
        ? $(RestoreFromTrash)
        : $(Delete)))
}

export default Requests