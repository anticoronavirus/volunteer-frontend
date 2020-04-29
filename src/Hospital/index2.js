import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import find from 'lodash/fp/find'
import merge from 'lodash/fp/merge'
import get from 'lodash/fp/get'
import sortBy from 'lodash/fp/sortBy'
import omit from 'lodash/fp/omit'
import entries from 'lodash/fp/entries'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { Mutation } from '@apollo/react-components'
import { Redirect } from 'react-router-dom'
import { hospital, removeShift, exportShifts } from 'queries'
// import { formatLabel } from 'utils'
import Shifts from './ShiftsList'
import Back from 'components/Back'
import { AddHospitalShift, EditHospitalShift } from 'components/HospitalShift'
import HowToGet from 'components/HowToGet'
import generateXlsx from 'zipcelx'
import HospitalContext from './HospitalContext'

import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
// import Tooltip from '@material-ui/core/Tooltip'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Skeleton from '@material-ui/lab/Skeleton'
import CloudDownload from '@material-ui/icons/CloudDownload'
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled'
import Delete from '@material-ui/icons/Delete'

const Hospital = ({
  match
}) => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  const { data, loading } = useQuery(hospital, { variables: { uid: match.params.uid }})
  const client = useApolloClient()

  const isManagedByMe = data &&
    find(
      { coophone: get(['me', 0, 'phone'], data) },
      get(['me', 0, 'managedHospitals'], data))

  return !loading && !data.hospital
    ? $(Redirect, { to: '/hospitals'})
    : $(Box, notMobile && { display: 'flex', padding: 2 },
        $(Back),
        $(Box, notMobile ? { marginRight: 2, width: 360 } : { marginBottom: 2, width: 'auto' },
          $(Paper, null,
            $(Box, { padding: 2 },
              loading
                ? $(Skeleton, { variant: 'text', width: '61%', height: 45 }) // FIXME shouldbe more precise
                : $(Typography, { variant: 'h4' }, data.hospital.shortname),
              loading
                ? $(Box, null,
                    $(Skeleton, { variant: 'text', width: '80%', height: 20 }),
                    $(Skeleton, { variant: 'text', width: '61.8%', height: 20 }))
                : $(Typography, { variant: 'subtitle2' }, data.hospital.name)),
            $(Box, { padding: '0 16px' },
              isManagedByMe &&
                  $(ButtonGroup, null,
                    $(Button, { onClick: () =>
                        client.query({ query: exportShifts, variables: { hospitalId: data.hospital.uid } })
                          .then(result => generateXlsx({
                            filename: `Заявки волонтёров ${data.hospital.shortname}`,
                            sheet: {
                              data: [
                                headers,
                                ...map(formatShift, result.data.volunteer_shift)]
                            }
                          })) },
                      $(CloudDownload, { fontSize: 'small' })),
                    $(Button, { onClick: console.log, disabled: true },
                      $(PersonAddDisabled, { fontSize: 'small' })))),
            loading
              ? LoadingPeriods
              : $(List, null,
                  $(ListSubheader, { disableSticky: true },
                    data.hospital.periods.length
                      ? 'Доступные смены'
                      : 'Нет доступных смен'),
                  map(
                    isManagedByMe
                      ? HospitalShiftManaged
                      : HospitalShift,
                    sortBy('start', data.hospital.periods)),
                  data && isManagedByMe &&
                    $(AddHospitalShift, { uid: data.hospital.uid, hospital: data.hospital }))),
        data && (data.hospital.directions || isManagedByMe) &&
          $(Box, { marginTop: 2 },
            $(Paper, null,
              $(HowToGet, {
                uid: data.hospital.uid,
                editable: isManagedByMe,
                directions: data.hospital.directions })))),
        data && data.hospital.periods.length > 0 &&
          $(Box, notMobile && { maxWidth: 360, flexGrow: 1 },
            $(HospitalContext.Provider, {
              value: {
                hospital_id: match.params.uid,
                isManagedByMe,
                periods: data.hospital.periods }},
              $(Shifts, { hospitalId: match.params.uid, isManagedByMe })))
              )
}

const headers = map(value => ({ value, type: 'string' }), [
  'дата',
  'начало смены',
  'конец смены',
  'подтверждён',
  'фамилия',
  'имя',
  'отчество',
  'телефон',
  'профессия',
  'электронная почта',
  'документы предоставлены'
])

const formatShift = shift => 
  map(formatValue, entries(omit(['volunteer', '__typename'], merge(shift, shift.volunteer))))

const formatValue = ([key, value]) => ({
  value: customFormats[key]
    ? customFormats[key](value)
    : value,
  type: 'string' })

const customFormats = {
  confirmed: value => value ? 'Да' : 'Нет',
  start: value => value.slice(0, 5),
  end: value => value.slice(0, 5),
  provisioned_documents: value => value.length ? 'Да' : 'Нет'
}

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
  period_demands
}) => {
  const [open, setOpen] = useState(false)
  return $(Fragment, null,
    open &&
      $(EditHospitalShift, { uid, start, end, period_demands, open, setOpen }),
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
        secondary: $(Skeleton, { variant: 'text', width: '13ex', height: 20 }),
      })))

export default Hospital