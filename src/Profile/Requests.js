import { useQuery } from '@apollo/client'
import { List, Paper } from '@material-ui/core'
import map from 'lodash/fp/map'
import { createElement as $ } from 'react'

import ShiftRequest from 'components/ShiftRequest'
import { profileProfessionRequests } from 'queries'

const Requests = ({ uid }) => {
  const { data } = useQuery(profileProfessionRequests, { variables: { uid } })
  return $(Paper, null, 
    $(List, null,
      map(ShiftRequest, data ? data.requests : [])))
}

export default Requests