import { useQuery } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import entries from 'lodash/fp/entries'
import find from 'lodash/fp/find'
import get from 'lodash/fp/get'
import map from 'lodash/fp/map'
import noop from 'lodash/fp/noop'
import { createElement as $, useEffect } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { hospital } from 'queries'
import { useIsDesktop } from 'utils'

import Actions from './Actions'
import Directions from './Directions'
import HospitalContext from './HospitalContext'
import HospitalHeader from './HospitalHeader'
import Register from './Register'
import Requests from './Requests'
import Settings from './Settings'
import ManagedShifts from './Shifts/ManagedShifts'
// import Schedule from './Schedule'
import VolunteerView from './Shifts/VolunteerView'

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

  const tabs = !data
    ? []
    : data.me.length === 0
      ? anonymousTabsArray
      : isManagedByMe
        ? coordinatorTabsArray
        : volunteerTabsArray

  return $(Box, null,
    $(HospitalHeader, { loading, ...data },
      isManagedByMe
        ? data && $(Actions, { hospitalId: match.params.uid, shortname: data.hospital.shrotname })
        : $(Box, { height: 32 }),
      $(Tabs, {
        variant: 'scrollable',
        value: match.params.page || '',
        // action: () => updateIndicator(),
        onChange: (event, value) => history.push(`/hospitals/${match.params.uid}/${value}`) },
        map(([value, { label }]) =>
          $(Tab, { id: value, key: value, value, label }),
          tabs))),
    $(Box, isDesktop ? { display: 'flex', justifyContent: 'center', marginTop: 2 } : { marginTop: 2 },
      $(Box, isDesktop && { minWidth: 480, maxWidth: 640 },
        $(HospitalContext.Provider, {
          value: {
            hospitalId: match.params.uid,
            isManagedByMe,
            me: data && data.me[0],
            hospital: data && data.hospital
          }},
          data &&
            $(Switch, null,
              map(([value, { component }]) =>
                $(Route, { key: value, exact: true, path: `/hospitals/${match.params.uid}/${value}` },
                  $(component)),
                tabs),
              $(Redirect, { to: `/hospitals/${match.params.uid}` }))))))
}

const directions = {
  label: 'Как добраться',
  component: Directions
}

const anonymousTabs = {
  '': {
    label: 'Помощь больнице',
    component: Register
  },
  directions
}

const volunteerTabs = {
  '': {
    label: 'Смены',
    component: VolunteerView
  },
  directions
}

const coordinatorTabs = {
  '': {
    label: 'Смены',
    component: ManagedShifts
  },
  requests: {
    label: 'Заявки',
    component: Requests
  },
  settings: {
    label: 'Настройки',
    component: Settings
  },
  archive: {
    label: 'Архив',
    component: ManagedShifts
  },
  directions
}

const anonymousTabsArray = entries(anonymousTabs)
const volunteerTabsArray = entries(volunteerTabs)
const coordinatorTabsArray = entries(coordinatorTabs)

export default Hospital