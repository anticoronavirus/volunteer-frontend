import { useSubscription } from '@apollo/client'
import { Avatar, Badge, Box, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, styled } from '@material-ui/core'
import { Delete } from '@material-ui/icons'
import { Skeleton } from '@material-ui/lab'
import fill from 'lodash/fp/fill'
import groupBy from 'lodash/fp/groupBy'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import { createElement as $, useState } from 'react'

import { orderedHospitalShifts } from 'queries'
import { formatDate } from 'utils'

const ManagedShifts = ({
  hospitalId,

}) => {

  const { data, loading } = useSubscription(orderedHospitalShifts, {
    variables: {
      hospitalId,
      dateInput: { _lte: 'TODAY' },
      orderBy: { date: 'asc' }
    }
  })

  return $(Paper, null,
    $(List, null,
      loading && !data
        ? LoadingDayShifts
        : map(DayShifts,
            groupBy('date', data.volunteer_shift))))
}

const DayShifts = (shifts) =>
  [$(SubheaderWithBackground, { key: 0 }, formatDate(shifts[0].date)),
    ...map(VolunteerShift, shifts)]

const SubheaderWithBackground = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

const VolunteerShift = ({
  uid,
  confirmed,
  start,
  volunteer,
  loading
}) => 
  $(ListItem, { key: uid },
    $(ListItemAvatar, null,
      loading
        ? $(Skeleton, { variant: 'circle', width: 40, height: 40 })
        : $(Avatar)),
    $(ListItemText, {
      primary: loading
        ? $(Skeleton, { variant: 'text', width: '25ex', height: 24 })
        : `${volunteer.lname} ${volunteer.fname}`,
      secondary: loading
        ? $(Skeleton, { variant: 'text', width: '25ex', height: 24 })
        :volunteer.phone,
    }))

// const VolunteerShift = ({
//   uid,
//   confirmed,
//   volunteer: { 
//     uid: volunteer_id,
//     fullName,
//     lname,
//     fname,
//     phone,
//     profession,
//     provisioned_documents_aggregate
//   },
//   loading
//  }) =>
//   $(ListItem, { key: uid, alignItems: 'flex-start'},
//     $(ListItemAvatar, null,
//       loading
//         ? $(Skeleton, { variant: 'circle', width: 40, height: 40 })
//         : $(Mutation, {
//             mutation: confirm,
//             variables: { uid, confirmed: !confirmed },
//             optimisticResponse: {
//               update_volunteer_shift: {
//                 affected_rows: 1,
//                 __typename: 'volunteer_shift_mutation_response'
//               },
//             },
//             update: cache =>
//               cache.writeFragment({
//                 id: uid,
//                 fragment: confirmedFragment,
//                 data: { confirmed: !confirmed }
//               })
//           }, mutate =>
//             $(CustomButtonBase, { onClick: mutate }, 
//               $(Badge, {
//                 overlap: 'circle',
//                 badgeContent: confirmed &&
//                   $(CheckHolder, null, $(CheckCircle, { fontSize: 'small', htmlColor: green[500] })),
//                 anchorOrigin: {
//                   vertical: 'bottom',
//                   horizontal: 'right' }},
//                 $(Avatar))))),
//       $(ListItemText, { 
//       primary:
//         loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 32 }) :
//         fullName || `${lname} ${fname}`,
//       secondary:
//         loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 24 }) :
//         $(Box, { display: 'flex' },
//           !provisioned_documents_aggregate.aggregate.count && 'документы не предоставлены · ', phone, ' · ', profession),
//     }),
//     $(ListItemSecondaryAction, null,
//       loading
//         ? $(Skeleton, { variant: 'text', width: 16, height: 48 })
//         : $(HospitalContext.Consumer, null, ({ isManagedByMe, hospitalId }) => {
//           const removeVolunteerShiftMutation = {
//             mutation: removeVolunteerShift,
//             variables: { uid },
//             update: store =>
//               store.writeQuery({
//                 query: hospitalShiftsQuery,
//                 variables: { hospitalId },
//                 data: {
//                   shifts: map(shift => ({
//                       ...shift,
//                       shiftRequests: filter(request => request.uid !== uid, shift.shiftRequests),
//                     }),
//                     store.readQuery({
//                       query: hospitalShiftsQuery,
//                       variables: { hospitalId }}).shifts)}}),
//             optimisticResponse: {
//               delete_volunteer_shift: {
//                 affected_rows: 1,
//                 __typename: "volunteer_shift_mutation_response"
//               }
//             }
//           }
//           return isManagedByMe
//             ? $(AdditionalControls, {
//               uid,
//               phone,
//               volunteer_id,
//               hospitalId,
//               removeVolunteerShiftMutation,
//               hasDocumentsProvisioned: provisioned_documents_aggregate.aggregate.count  })
//             : $(Mutation, removeVolunteerShiftMutation, mutate =>
//                 $(IconButton, { onClick: mutate },
//                   $(Delete, { fontSize: 'small' })))
//         })))

const LoadingDayShifts = [
  $(SubheaderWithBackground, { key: 0 },
    $(Box, { padding: '10px 0' },
      $(Skeleton, { variant: 'text', width: '10ex', height: 24 }))),
  ...map((uid) => VolunteerShift({ uid, loading: true }), range(1, 5))
]

export default ManagedShifts