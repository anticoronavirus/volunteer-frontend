import { createElement as $, useContext, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import filter from 'lodash/fp/filter'
import noop from 'lodash/fp/noop'
import find from 'lodash/fp/find'
import ShiftRequest from 'components/ShiftRequest'
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

  const { hospitalId, hospital, isManagedByMe } = useContext(HospitalContext)
  const [showDeleted, setShowDeleted] = useState(false)
  const { data } = useQuery(professionRequests, { variables: { where: {
    hospital_id: { _eq: hospitalId },
    rejected: showDeleted ? { _eq: true } : { _neq: true }
  }}})
  
  return $(Fragment, null,
    isManagedByMe &&
      $(Box, { padding: 2 },
        $(FormControlLabel, {
          control: $(Switch, { checked: showDeleted, onClick: () => setShowDeleted(!showDeleted) }),
          label: $(Box, { padding: 1 }, 'Показать удалённые')})),
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
    $(ToggleRejection, { uid, rejected }))
}

const ToggleRejection = ({
  uid,
  rejected
}) =>
  $(HospitalContext.Consumer, null, ({ hospitalId }) =>
    $(Mutation, {
      mutation: toggleRejection,
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
              rejected: rejected ? { _eq: true } : { _neq: true }}}})
        cache.writeQuery({
          query: professionRequests,
          data: {
            ...data,
            requests: filter(request => request.uid !== uid, data.requests)
          },
          variables: {
            where: {
              hospital_id: { _eq: hospitalId },
              rejected: rejected ? { _eq: true } : { _neq: true }}}})
      },
      variables: { uid, rejected: !rejected } }, onClick =>
      $(ListItemSecondaryAction, null,
        $(IconButton, { onClick },
          rejected
            ? $(RestoreFromTrash)
            : $(Delete)))))

export default Requests