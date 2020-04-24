import { createElement as $, useState, Fragment, createContext } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import entries from 'lodash/fp/entries'
import groupBy from 'lodash/fp/groupBy'
import { 
  // Subscription, 
  Query, Mutation } from '@apollo/react-components'
import { formatDate, uncappedMap } from 'utils'
import { documentsProvisioned, volunteerShiftCount, hospitalShifts, confirm, removeVolunteerShift, addToBlackList } from 'queries'
import Hint from 'components/Hint'
import gql from 'graphql-tag'

import Paper from '@material-ui/core/Paper'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MoreVert from '@material-ui/icons/MoreVert'
import NoteAdd from '@material-ui/icons/NoteAdd'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Phone from '@material-ui/icons/Phone'
import Delete from '@material-ui/icons/Delete'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import green from '@material-ui/core/colors/green'
import { styled } from '@material-ui/styles'
import Skeleton from '@material-ui/lab/Skeleton'

const Shifts = ({ hospitalId, isManagedByMe }) =>
  $(Query, {
    pollInterval: 6000,
    query: hospitalShifts,
    variables: { hospitalId }
  }, ({ data }) =>
  $(Paper, null,
    isManagedByMe &&
      $(Query, { query: volunteerShiftCount }, ({ data }) =>
        !data || (data && !data.volunteer_shift_aggregate.aggregate.count)
          ? null
          : $(PaddedHint, { name: 'how_confirm' })),
    $(IsManagedByMe.Provider, { value: { isManagedByMe, hospital_id: hospitalId } },
      $(List, null,
        map(Section, data ? data.shifts : emptyShifts)))))

const PaddedHint = styled(Hint)({
  padding: 16
})
      
// this is so geh
const emptyShifts = uncappedMap((value, index) => ({
  date: index + 1,
  start: index + 2,
  end: index + 3,
  loading: true,
  volunteers: uncappedMap((value, index) => ({
    uid: index,
    loading: true,
  }), range(0, 5))
}), range(0, 14))

const Section = ({
  date,
  start,
  end,
  demand,
  placesavailable,
  shiftRequests,
  loading
}) =>
  $(SectionLI, { key: `${date}-${start}-${end}` },
    $(SubheaderWithData, {
      title: !loading && `${formatDate(date)}, c ${start.slice(0, 5)} до ${end.slice(0, 5)}`,
      right: !loading && `${demand - placesavailable}/${demand}`
    }),
    shiftRequests &&
      map(TaskShifts, entries(groupBy('period_demand.profession.name', shiftRequests))),
    $(Divider))

const SubheaderWithData = ({ title, right, loading, position }) =>
  $(ZIndexedListSubheader, { position },
    $(Box, { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      loading
        ? $(Box, { padding: '8px 0' },
            $(Skeleton, { variant: 'text', width: '25ex', height: 32 }))
        : title,
      $(Box),
      loading
        ? $(Box, { padding: '8px 0' },
            $(Skeleton, { variant: 'text', width: '5ex', height: 32 }))
        : right))

const ZIndexedListSubheader = styled(ListSubheader)(
({ position = 0 }) => ({
  // zIndex: 2,
  top: 48 * position,
}))

const SectionLI = styled('li')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

const TaskShifts = ([key, shifts]) =>
  $(Fragment, { key },
    $(SubheaderWithData, {
      title: key,
      right: `${shifts.length}/${0}`
    }),
    map(VolunteerShift, shifts))

// const SectionUL = styled('ul')({
//   backgroundColor: 'inherit',
//   listStyle: 'none',
//   padding: 0
// })

const VolunteerShift = ({
  uid,
  confirmed,
  volunteer: { 
    uid: volunteer_id,
    fullName,
    lname,
    fname,
    phone,
    profession,
    provisioned_documents_aggregate
  },
  loading
 }) =>
  $(ListItem, { key: uid, alignItems: 'flex-start'},
    $(ListItemAvatar, null,
      loading
        ? $(Skeleton, { variant: 'circle', width: 40, height: 40 })
        : $(Mutation, {
            mutation: confirm,
            variables: { uid, confirmed: !confirmed },
            optimisticResponse: {
              update_volunteer_shift: {
                affected_rows: 1,
                __typename: 'volunteer_shift_mutation_response'
              },
            },
            update: cache =>
              cache.writeFragment({
                id: uid,
                fragment: confirmedFragment,
                data: { confirmed: !confirmed }
              })
          }, mutate =>
            $(CustomButtonBase, { onClick: mutate }, 
              $(Badge, {
                overlap: 'circle',
                badgeContent: confirmed &&
                  $(CheckHolder, null, $(CheckCircle, { fontSize: 'small', htmlColor: green[500] })),
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'right' }},
                $(Avatar))))),
      $(ListItemText, { 
      primary:
        loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 32 }) :
        fullName || `${lname} ${fname}`,
      secondary:
        loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 24 }) :
        $(Box, { display: 'flex' },
          !provisioned_documents_aggregate.aggregate.count && 'документы не предоставлены · ', phone, ' · ', profession),
    }),
    $(ListItemSecondaryAction, null,
      loading
        ? $(Skeleton, { variant: 'text', width: 16, height: 48 })
        : $(IsManagedByMe.Consumer, null, ({ isManagedByMe, hospital_id }) => isManagedByMe
            ? $(AdditionalControls, {
                uid,
                phone,
                volunteer_id,
                hospital_id,
                hasDocumentsProvisioned: provisioned_documents_aggregate.aggregate.count  })
            : $(Mutation, { mutation: removeVolunteerShift, variables: { uid } }, mutate =>
                $(IconButton, { onClick: mutate },
                  $(Delete, { fontSize: 'small' }))))))

const CustomButtonBase = styled(ButtonBase)({
  borderRadius: '50%',
})

const CheckHolder = styled('div')(({ theme }) => ({
  padding: '.5px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper
}))

const confirmedFragment = gql`
  fragment confirmedFragment on volunteer_shift {
    uid
    confirmed,
}`

const AdditionalControls = ({ uid, phone, volunteer_id, hospital_id, hasDocumentsProvisioned }) => {

  const [anchorEl, setAnchorEl] = useState(null)

  return $(Fragment, null,
    $(IconButton, { edge: 'end', onClick: event => setAnchorEl(event.currentTarget) },
      $(MoreVert)),
    $(Menu, {
      anchorEl,
      onClose: () => setAnchorEl(null),
      open: Boolean(anchorEl) },
      $(MenuItem, { component: 'a', href: `tel:${phone}`},
        $(ListItemIcon, null, $(Phone, { fontSize: 'small' })),
        $(Typography, { variant: 'inherit' }, 'Позвонить')),
      $(Mutation, { mutation: removeVolunteerShift, variables: { uid } }, mutate =>
        $(MenuItem, { onClick: mutate },
          $(ListItemIcon, null, $(Delete, { fontSize: 'small' })),
          $(Typography, { variant: 'inherit' }, 'Удалить из смены'))),
      $(Mutation, { mutation: addToBlackList, variables: { uid: volunteer_id, comment: 'прст' } }, mutate =>  
        $(MenuItem, { onClick: mutate },
          $(ListItemIcon, null, $(RemoveCircle, { fontSize: 'small' })),
          $(Typography, { variant: 'inherit' }, 'В черный список'))),
      !hasDocumentsProvisioned &&
        $(Mutation, { mutation: documentsProvisioned, variables: { volunteerId: volunteer_id, hospitalId: hospital_id  } }, mutate =>  
          $(MenuItem, { onClick: mutate },
            $(ListItemIcon, null, $(NoteAdd, { fontSize: 'small' })),
            $(Typography, { variant: 'inherit' }, 'Документы предоставлены')))))
}

export default Shifts