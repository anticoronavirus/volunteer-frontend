import { useQuery } from '@apollo/client'
import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, ListSubheader, Paper, styled } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import groupBy from 'lodash/fp/groupBy'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import sortBy from 'lodash/fp/sortBy'
import { createElement as $, useContext } from 'react'

import ToggleCancelShift from 'components/ToggleCancelShift'
import { orderedHospitalShifts } from 'queries'
import { formatDate } from 'utils'

import HospitalContext from '../HospitalContext'

const ManagedShifts = () => {

  const { hospitalId } = useContext(HospitalContext)

  const { data, loading } = useQuery(orderedHospitalShifts, {
    variables: {
      hospitalId,
      dateInput: { _gte: 'TODAY' },
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
    ...map(VolunteerShift, sortBy(['start', 'volunteer.phone'], shifts))]

const SubheaderWithBackground = styled(ListSubheader)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

const VolunteerShift = ({
  uid,
  is_cancelled,
  start,
  end,
  volunteer,
  loading
}) => 
  $(ListItemWithCancelled, { key: uid, is_cancelled },
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
        : `${start.slice(0, -6)}—${end.slice(0, -6)} · ${volunteer.phone}` }),
    $(ListItemSecondaryAction, null,
      $(ToggleCancelShift, { uid, is_cancelled })))

const ListItemWithCancelled = styled(ListItem)(({ is_cancelled }) => ({
  opacity: is_cancelled ? 0.5 : 1,
  textDecoration: is_cancelled && 'line-through'
}))

const LoadingDayShifts = [
  $(SubheaderWithBackground, { key: 0 },
    $(Box, { padding: '10px 0' },
      $(Skeleton, { variant: 'text', width: '10ex', height: 24 }))),
  ...map((uid) => VolunteerShift({ uid, loading: true }), range(1, 5))
]

export default ManagedShifts