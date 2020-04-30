import { createElement as $, useState, Fragment } from 'react'
import map from 'lodash/fp/map'
import sortBy from 'lodash/fp/sortBy'
import { Mutation, Query } from '@apollo/react-components'
import { AddHospitalShift, EditHospitalShift } from './ShiftDialog'
import { removeShift, hospitalPeriods } from 'queries'
import HospitalContext from './HospitalContext'

import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Skeleton from '@material-ui/lab/Skeleton'
import IconButton from '@material-ui/core/IconButton'
import Delete from '@material-ui/icons/Delete'
// import { styled } from '@material-ui/core/styles'

const Schedule = () =>
  $(HospitalContext.Consumer, null, ScheduleWithContext)

const ScheduleWithContext = ({
  hospitalId,
  isManagedByMe
}) =>
  $(Query, { query: hospitalPeriods, variables: { hospitalId } }, ({ data, loading }) =>
    loading
      ? LoadingPeriods
      : $(List, null,
          $(ListSubheader, { disableSticky: true },
            data.periods.length
              ? 'Доступные смены'
              : 'Нет доступных смен'),
          map(
            isManagedByMe
              ? HospitalShiftManaged
              : HospitalShift,
            sortBy('start', data.periods)),
          data && isManagedByMe &&
            $(AddHospitalShift, { uid: hospitalId })))

const LoadingPeriods =
  $(List, null,
    $(ListSubheader, { disableSticky: true },
      $(Box, { padding: '12px 0' },
        $(Skeleton, { variant: 'text', width: '38.2%', height: 24 }))),
    $(ListItem, null,
      $(ListItemText, {
        primary: $(Skeleton, { variant: 'text', width: '13ex', height: 24 }),
        secondary: $(Skeleton, { variant: 'text', width: '13ex', height: 20 }),
      })),
    $(ListItem, null,
      $(ListItemText, {
        primary: $(Skeleton, { variant: 'text', width: '13ex', height: 24 }),
        secondary: $(Skeleton, { variant: 'text', width: '13ex', height: 20 })})))

const HospitalShift = ({
  uid,
  start,
  end,
  period_demands
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${start.slice(0, 5)} до ${end.slice(0, 5)}`,
      secondary: map(Demand, period_demands).join(', ')}))

const HospitalShiftManaged = data => 
  $(HospitalShiftManagedWithState, data)

const HospitalShiftManagedWithState = ({
  uid,
  start,
  end,
  demand,
  period_demands,
  profession_id
}) => {
  const [open, setOpen] = useState(false)
  return $(Fragment, { key: uid },
    $(EditHospitalShift, { uid, start, end, period_demands, demand, profession_id, open, onClose: () => setOpen(false) }),
    $(Mutation, { key: uid, mutation: removeShift }, mutate =>
      $(ListItem, { button: true, onClick: () => setOpen(true) },
        $(ListItemText, {
          primary: `${start.slice(0, 5)} до ${end.slice(0, 5)}`,
          secondary: map(Demand, period_demands).join(', ')}),
        $(ListItemSecondaryAction, null,
          $(IconButton, { onClick: () => mutate({ variables: { uid }}) },
            $(Delete, { fontSize: 'small'}))))))
}

const Demand = ({ demand, profession: { name } }) =>
  `${name}: ${demand}`

export default Schedule