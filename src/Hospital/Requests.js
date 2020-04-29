import { createElement as $, useContext, useState } from 'react'
import map from 'lodash/fp/map'
import HospitalContext from './HospitalContext'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'

const Requests = () => {

  const { hospitalId } = useContext(HospitalContext)

  const { data = {
    requests: [{
      uid: 'test',
      volunteer: {
        uid: 'test',
        name: 'geh'
      }
    }]
  }} = {}
  
  return $(List, null,
    map(Request, data.requests))
}

const Request = ({
  uid,
  volunteer,
  requirements
}) =>
  $(ListItem, null,
    $(ListItemText, {
      primary: volunteer.name
    }))

export default Requests