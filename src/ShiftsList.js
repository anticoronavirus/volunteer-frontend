import { createElement as $, useState, Fragment } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import random from 'lodash/fp/random'
import format from 'date-fns/format'
import addDays from 'date-fns/addDays'
import { Subscription } from '@apollo/react-components'
import { formatDate } from 'utils'
import { shifts } from 'queries'

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
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MoreVert from '@material-ui/icons/MoreVert'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Phone from '@material-ui/icons/Phone'
import Delete from '@material-ui/icons/Delete'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import green from '@material-ui/core/colors/green'
import { styled } from '@material-ui/styles'
import Skeleton from '@material-ui/lab/Skeleton'

// const mockData = {
//   shifts: [{
//     date: '2020-04-20',
//     start: '08:00',
//     end: '14:00',
//     required: 20,
//     volunteers: new Array(15).fill({
//       uid: 'test',
//       fullName: 'Васильев Петр Андреевич',
//       phone: '+7 (915) 051-5025',
//       email: 'edelweiss.paramedic@gmail.com',
//       profession: 'врач-онколог',
//       confirmed: true
//     })
//   }]
// }

const Shifts = () =>
  $(Subscription, {
    variables,
    subscription: shifts,
  }, ShiftsPure)

const now = new Date()
const variables = {
  from: format(now, 'yyyy-MM-dd'),
  to: format(addDays(now, 14), 'yyyy-MM-dd')
}

const ShiftsPure = ({ data }) =>
  $(Paper, null,
    $(List, null,
      map(Section, data ? data.shifts : emptyShifts)))

const emptyShifts = map(() => ({
  uid: random(0, 1000),
  loading: true,
  volunteers: map(() => ({
    uid: random(0, 1000),
    loading: true,
  }), range(0, 5))
}), range(0, 14))

const Section = ({
  uid,
  date,
  start,
  end,
  required = 10,
  volunteers,
  loading
}) =>
  $(SectionLI, { key: uid },
    $(SectionUL, null,
      $(ZIndexedListSubheader, null,
        $(Box, { display: 'flex', justifyContent: 'space-between' },
          loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 42 }) : 
          `${formatDate(date)}, c ${start.slice(0, 5)} до ${end.slice(0, 5)}`,
          $(Box),
          loading ? $(Skeleton, { variant: 'text', width: '5ex', height: 42 }) : 
          `${volunteers.length}/${required}`)),
      map(VolunteerShift, volunteers),
      $(Divider)))

const ZIndexedListSubheader = styled(ListSubheader)({
  zIndex: 2
})

const SectionLI = styled('li')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

const SectionUL = styled('ul')({
  backgroundColor: 'inherit',
  listStyle: 'none',
  padding: 0
})

const VolunteerShift = ({
  uid,
  fullName,
  lname,
  fname,
  phone,
  profession = 'врач',
  email,
  confirmed = random(0, 25) > 10,
  loading
 }) =>
  $(ListItem, { key: uid },
    $(ListItemAvatar, null,
      loading ? $(Skeleton, { variant: 'circle', width: 40, height: 40 }) :
      $(Badge, {
        overlap: 'circle',
        badgeContent: confirmed &&
          $(CheckHolder, null, $(CheckCircle, { fontSize: 'small', htmlColor: green[500] })),
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'right' }},
        $(Avatar))),
    $(ListItemText, { 
      primary:
        loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 32 }) :
        fullName || `${lname} ${fname}`,
      secondary:
        loading ? $(Skeleton, { variant: 'text', width: '25ex', height: 24 }) :
        profession,
    }),
    $(ListItemSecondaryAction, null,
      loading ? $(Skeleton, { variant: 'text', width: 16, height: 48 }) :
      $(AdditionalControls, { uid, phone })))

const CheckHolder = styled('div')(({ theme }) => ({
  padding: '.5px',
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper
}))

const AdditionalControls = ({ uid }) => {

  const [anchorEl, setAnchorEl] = useState(null)

  return $(Fragment, null,
    $(IconButton, { edge: 'end', onClick: event => setAnchorEl(event.currentTarget) },
      $(MoreVert)),
    $(Menu, {
      anchorEl,
      onClose: () => setAnchorEl(null),
      open: Boolean(anchorEl) },
      $(MenuItem, null,
        $(ListItemIcon, null, $(Phone, { fontSize: 'small' })),
        $(Typography, { variant: 'inherit' }, 'Позвонить')),
      $(MenuItem, null,
        $(ListItemIcon, null, $(Delete, { fontSize: 'small' })),
        $(Typography, { variant: 'inherit' }, 'Удалить из смены')),
      $(MenuItem, null,
        $(ListItemIcon, null, $(RemoveCircle, { fontSize: 'small' })),
        $(Typography, { variant: 'inherit' }, 'В черный список'))))
}

export default Shifts