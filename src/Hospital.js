import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import merge from 'lodash/fp/merge'
import get from 'lodash/fp/get'
import sortBy from 'lodash/fp/sortBy'
import omit from 'lodash/fp/omit'
import entries from 'lodash/fp/entries'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { Mutation } from '@apollo/react-components'
import { Redirect } from 'react-router-dom'
import { hospital, removeShift, exportShifts } from 'queries'
import { formatLabel } from 'utils'
import Shifts from 'ShiftsList'
import Back from 'components/Back'
import AddHospitalShift from 'components/AddHospitalShift'
import generateXlsx from 'zipcelx'

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
import { useMediaQuery, useTheme } from '@material-ui/core'

const Hospital = ({
  match
}) => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  const { data, loading } = useQuery(hospital, { variables: { uid: match.params.uid }})
  const client = useApolloClient()

  const isManagedByMe = data &&
    get(['hospital', 'uid'], data) ===
    get(['me', 0, 'managedHospital', 'uid'], data)

  return !loading && !data.hospital
    ? $(Redirect, { to: '/hospitals'})
    : $(Box, notMobile && { display: 'flex', padding: 2 },
        $(Back),
        $(Box, notMobile ? { marginRight: 2 } : { marginBottom: 2 },
          $(Paper, null,
            $(Box, { padding: 2, width: notMobile ? 360 : 'auto' },
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
                        client.query({ query: exportShifts })
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
                      ? HospitalShiftDeletable
                      : HospitalShift,
                    sortBy('start', data.hospital.periods)),
                  data && isManagedByMe &&
                    $(AddHospitalShift, { uid: data.hospital.uid, hospital: data.hospital })))),
        data && data.hospital.periods.length > 0 &&
          $(Box, notMobile && { maxWidth: 360, flexGrow: 1 },
            $(Shifts, { hospitalId: match.params.uid, isManagedByMe })))
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
  demand
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${start.slice(0, 5)} до ${end.slice(0, 5)}`,
      secondary: formatLabel('volunteer', demand)}))

const HospitalShiftDeletable = ({
  uid,
  start,
  end,
  demand
}) =>
  $(Mutation, { key: uid, mutation: removeShift }, mutate =>
    $(ListItem, null,
      $(ListItemText, {
        primary: `${start.slice(0, 5)} до ${end.slice(0, 5)}`,
        secondary: formatLabel('volunteer', demand)}),
      $(ListItemSecondaryAction, null,
        $(IconButton, { onClick: () => mutate({ variables: { uid }}) },
          $(Delete, { fontSize: 'small'})))))

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