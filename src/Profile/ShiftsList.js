import { useMutation, useSubscription } from '@apollo/client'
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, styled, Typography } from '@material-ui/core'
import Delete from '@material-ui/icons/Delete'
import map from 'lodash/fp/map'
import { createElement as $, Fragment } from 'react'
import { Link } from 'react-router-dom'

import { myShifts, removeVolunteerFromShift } from 'queries'
import { formatDate } from 'utils'

const ShiftsList = ({ uid }) => {
  const { data } = useSubscription(myShifts, { variables: { uid }})
  return !data
    ? $(CircularProgress)
    : data.volunteer_shift.length === 0
      ? $(Paper, null,
          $(Box, { padding: 2 },
            $(Typography, { variant: 'body2', paragraph: true},
              'У вас пока нет смен, выберите больницу, в которой вам будет удобно помочь'),
            $(Button, {
              variant: 'contained',
              color: 'primary',
              component: Link,
              to: '/hospitals'
              },
              'Выбрать больницу')))
      : $(Fragment, null,
          $(MobileReadyButton, null, 
            $(Button, {
              variant: 'outlined',
              fullWidth: true,
              component: Link,
              to: '/hospitals'
              },
              'Добавить смену')),
          $(Box, { height: '16px' }),
          $(Paper, null,
            $(List, null,
              map(Shifts, data.volunteer_shift))))
}

const MobileReadyButton = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    padding: '0 16px'
  }
}))

const Shifts = (props) =>
  $(ShiftsWithHooks, { key: props.uid, ...props })

const ShiftsWithHooks = ({
  uid,
  confirmed,
  hospital,
  date,
  start,
  end
}) => {
  
  const [mutate] = useMutation(removeVolunteerFromShift, { variables: { uid } })

  return $(ListItem, null,
    $(ListItemText, {
      primary: `${formatDate(date)}, c ${start.slice(0, 5)} до ${end.slice(0, 5)}`,
      secondary: hospital?.shortname || 'Неактивная больница' }),
    $(ListItemSecondaryAction, null,
      $(IconButton, { onClick: mutate },
        $(Delete, { fontSize: 'small' }))))
}

export default ShiftsList