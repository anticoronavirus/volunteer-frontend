import { createElement as $, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import find from 'lodash/fp/find'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import noop from 'lodash/fp/noop'
import entries from 'lodash/fp/entries'
import { Redirect, Switch, Route } from 'react-router-dom'
import { useIsDesktop } from 'utils'
import Requests from './Requests'
import ShiftsList from './ShiftsList'
import HospitalContext from './HospitalContext'
import Schedule from './Schedule'
import Actions from './Actions'
import { hospital } from 'queries'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Skeleton from '@material-ui/lab/Skeleton'
import { styled } from '@material-ui/core/styles'

const Hospital = ({
  match,
  history
}) => {

  const { data, loading } = useQuery(hospital, { variables: { uid: match.params.uid }})
  const isManagedByMe = data &&
    find({ coophone: get(['me', 0, 'phone'], data) },
      get(['me', 0, 'managedHospitals'], data))

  // FIXME mui-org/material-ui#9337
  useEffect(() =>
    window.dispatchEvent(new CustomEvent('resize')) && noop)

  const isDesktop = useIsDesktop()

  console.log('test')

  return $(Box, null,
    $(Paper, null, 
      $(Box, isDesktop && { display: 'flex', alignItems: 'center', flexDirection: 'column' }, 
        $(Box, { padding: 3 },
          $(Typography, { variant: 'h4', align: 'center' }, loading
            ? $(CustomSkeleton, { width: '6ex'})
            : data.hospital.shortname),
          $(Typography, { variant: 'subtitle2', align: 'center' }, loading
            ? $(CustomSkeleton, { width: '20ex'})
            : data.hospital.name)),
        isManagedByMe && data &&
          $(Actions, { hospitalId: match.params.uid, shortname: data.hospital.shrotname }),
        $(Tabs, {
          variant: 'scrollable',
          value: match.params.page || '',
          // action: () => updateIndicator(),
          onChange: (event, value) => history.push(`/hospitals/${match.params.uid}/${value}`) },
          map(([value, { label }]) =>
            $(Tab, { id: value, key: value, value, label }),
            tabsArray)))),
    $(Box, isDesktop ? { display: 'flex', justifyContent: 'center', marginTop: 2 } : { marginTop: 2 },
      $(Paper, null, 
        $(HospitalContext.Provider, {
          value: {
            hospitalId: match.params.uid,
            isManagedByMe,
            // periods: data.hospital.periods
          }},
          $(Switch, null,
            map(([value, { component }]) =>
              $(Route, { key: value, exact: true, path: `/hospitals/${match.params.uid}/${value}` },
                $(component)),
              tabsArray),
            $(Redirect, { to: `/hospitals/${match.params.uid}` }))))))
}

const tabs = {
  '': {
    label: 'Смены',
    component: ShiftsList
  },
  schedule: {
    label: 'Расписание',
    component: Schedule
  },
  requests: {
    label: 'Заявки',
    component: Requests
  },
  directions: {
    label: 'Как добраться',
    component: () =>
      $('div', null,'smena')
  }
}

const tabsArray = entries(tabs)

const CustomSkeleton = styled(Skeleton)({
  display: 'inline-block'
})

export default Hospital