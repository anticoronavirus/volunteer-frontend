import { Mutation, Query } from '@apollo/react-components'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Accordion, AccordionDetails, AccordionSummary, Button } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import Box from '@material-ui/core/Box'
import ButtonBase from '@material-ui/core/ButtonBase'
import green from '@material-ui/core/colors/green'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import CheckCircle from '@material-ui/icons/CheckCircle'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Help from '@material-ui/icons/Help'
import MoreVert from '@material-ui/icons/MoreVert'
import NoteAdd from '@material-ui/icons/NoteAdd'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import Skeleton from '@material-ui/lab/Skeleton'
import { styled } from '@material-ui/styles'
import gql from 'graphql-tag'
import filter from 'lodash/fp/filter'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import some from 'lodash/fp/some'
import { createElement as $, Fragment, useContext, useState } from 'react'

import Hint from 'components/Hint'
import { hospitalRequirements } from 'queries'
import { formatDate, uncappedMap } from 'utils'

import HospitalContext from './HospitalContext'
import Onboarding from './Onboarding'

const ShiftList = () => {
  const { hospitalId, isManagedByMe } = useContext(HospitalContext)

  return isManagedByMe
    ? $('div', null, 'shifts')
    : $(VolunteerView, { hospitalId }) // $(Onboarding)
}

const VolunteerView = ({
  hospitalId
}) => {

  const { data, loading } = useQuery(hospitalRequirements, { variables: {
    hospitalId,
    userId: hospitalId // FIXME test purposes
  }})

  if (loading)
    return null
  
  const requirementsSatisfied = some(checkIfSatified, data.hospital_profession_requirement)
  
  return requirementsSatisfied
    ? $('div', null, 'test')
    : $(Onboarding, data)
}

const checkIfSatified = ({ satisfied }) => satisfied.length > 0

export default ShiftList