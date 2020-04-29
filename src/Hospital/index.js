import { createElement as $, useEffect } from 'react'
import map from 'lodash/fp/map'
import entries from 'lodash/fp/entries'
import Requests from './Requests'
import { Redirect, Switch, Route } from 'react-router-dom'

import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'

const Hospital = ({
  match,
  history
}) => {

  // FIXME mui-org/material-ui#9337
  useEffect(() => {
    return () =>
      window.dispatchEvent(new CustomEvent('resize'))
  })

  return $(Box, null, 
    $(Paper, null, 
      $(Tabs, {
        variant: 'scrollable',
        value: match.params.page || '',
        // action: () => updateIndicator(),
        onChange: (event, value) => history.push(`/hospitals/${match.params.uid}/${value}`) },
        map(([value, { label }]) =>
          $(Tab, { id: value, key: value, value, label }),
          tabsArray)),
        $(Divider),
        $(Switch, null,
          map(([value, { component }]) =>
            $(Route, { key: value, exact: true, path: `/hospitals/${match.params.uid}/${value}` },
              $(component)),
            tabsArray),
          $(Redirect, { to: `/hospitals/${match.params.uid}` }))))
}

const tabs = {
  '': {
    label: 'Смены',
    component: () =>
      $('div', null,'smena')
  },
  schedule: {
    label: 'Расписание',
    component: () =>
      $('div', null,'schedule')
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

export default Hospital