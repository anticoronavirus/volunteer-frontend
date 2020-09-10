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
import { createElement as $, Fragment, useContext, useState } from 'react'

import Hint from 'components/Hint'
import { addToBlackList, confirm, documentsProvisioned, hospitalShiftsQuery, hospitalShiftsSubscription, removeVolunteerShift, volunteerShiftCount } from 'queries'
import { formatDate, uncappedMap } from 'utils'

import HospitalContext from './HospitalContext'

const Shifts = () => {

  const { hospitalId, isManagedByMe } = useContext(HospitalContext)
  const options = { variables: { hospitalId }}
  const { data } = useQuery(hospitalShiftsQuery, options)
  useSubscription(hospitalShiftsSubscription, options)
  const requirements = [{
    name: 'Анализ на ВИЧ', 
    description: 'В местной поликлинике'
  }, {
    name: 'Флюрография',
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на ADC (Дифтерия)', 
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на Гепатит ',
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на Корь', 
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на COVID-19 (антитела)',
    description: 'В местной поликлинике'
  }, {
    name: 'Инструктаж',
    description: 'В больнице, после прохождения анализов'
  }]
  return $(Box, { maxWidth: 480 }, 
    $(Box, { padding: '16px 16px 0 16px' },
      $(Typography, { variant: 'body2' }, 
        'Чтобы начать помогать в этой больнице вам необходимо пройти следующие этапы')),
    $(List, null, 
      map(Requirement, requirements)),
    $(Box, { padding: '0 16px 16px 16px' },
      $(Typography, { variant: 'body2', paragraph: true }, 
        'После сдачи анализов вы можете оставить заявку на инструктаж'),
      $(Button, { variant: 'contained' }, 'Я сдал\\а анализы')))
}

const Requirement = ({
  name,
  description
}) =>
  $(Accordion, { key: name },
    $(AccordionSummary, { expandIcon: $(ExpandMore)},
      $(Typography, null, name)),
    $(AccordionDetails, null,
      $(Typography, null, description)))

export default Shifts