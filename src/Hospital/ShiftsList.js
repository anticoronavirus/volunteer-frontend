import { createElement as $, useState, useContext, Fragment } from 'react'
import map from 'lodash/fp/map'
import range from 'lodash/fp/range'
import filter from 'lodash/fp/filter'
import { useQuery, useSubscription } from '@apollo/react-hooks'
import { Query, Mutation } from '@apollo/react-components'
import { formatDate, uncappedMap } from 'utils'
import {
  documentsProvisioned,
  volunteerShiftCount,
  hospitalShiftsSubscription,
  hospitalShiftsQuery,
  confirm,
  removeVolunteerShift,
  addToBlackList,
} from 'queries'
import Hint from 'components/Hint'
import gql from 'graphql-tag'
import HospitalContext from './HospitalContext'

import {
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Badge from '@material-ui/core/Badge'
import IconButton from '@material-ui/core/IconButton'
import ButtonBase from '@material-ui/core/ButtonBase'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import MoreVert from '@material-ui/icons/MoreVert'
import NoteAdd from '@material-ui/icons/NoteAdd'
import CheckCircle from '@material-ui/icons/CheckCircle'
import Help from '@material-ui/icons/Help'
import ExpandMore from '@material-ui/icons/ExpandMore'
import RemoveCircle from '@material-ui/icons/RemoveCircle'
import green from '@material-ui/core/colors/green'
import { styled } from '@material-ui/styles'
import Skeleton from '@material-ui/lab/Skeleton'

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
  // $(ListItem, {
  //   key: name,
  //   button: true,
  //   divider: true },
  //   $(ListItemText, {
  //     primary: name,
  //     // secondary: description
  //   }),
  //   $(ListItemSecondaryAction, null,
  //     $(Box, { display: 'flex', alignItems: 'center' },
  //       $(Help, { fontSize: 'small' }))))

export default Shifts