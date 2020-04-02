import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import Paper from '@material-ui/core/Paper'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListSubheader from '@material-ui/core/ListSubheader'
import Divider from '@material-ui/core/Divider'
import Avatar from '@material-ui/core/Avatar'
import Checkbox from '@material-ui/core/Checkbox'
import Box from '@material-ui/core/Box'
import { styled } from '@material-ui/styles'
import { formatDate } from 'utils'

const mockData = {
  shifts: [{
    date: '2020-04-20',
    start: '08:00',
    end: '14:00',
    volunteers: new Array(20).fill({
      uid: 'test',
      fullName: 'Васильев Петр Андреевич',
      phone: '+7 (915) 051-5025',
      email: 'edelweiss.paramedic@gmail.com',
      profession: 'врач-онколог',
      confirmed: true
    })
  }, {
    date: '2020-04-20',
    start: '14:00',
    end: '20:00',
    volunteers: new Array(20).fill({
      uid: 'test',
      fullName: 'Васильев Петр Андреевич',
      phone: '+7 (915) 051-5025',
      email: 'edelweiss.paramedic@gmail.com',
      profession: 'врач-онколог',
      confirmed: true
    })
  }]
}

const Shifts = ({
  data = mockData
}) =>
  $(Box, {
    maxWidth: 400,
    margin: 'auto',
    paddingTop: 10,
    paddingBottom: 10
  },
    $(Paper, null,
      $(List, null,
        map(Section, data.shifts))))

const emptyShifts = new Array(20).fill({ empty: true })

const Section = ({
  date,
  start,
  end,
  volunteers,
}) =>
  $(SectionLI, null,
    $(SectionUL, null, 
      $(ListSubheader, null, formatDate(date), `, c ${start} до ${end}`),
      map(VolunteerShift, volunteers),
      $(Divider)))

const SectionLI = styled('li')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

const SectionUL = styled('ul')({
  backgroundColor: 'inherit',
  listStyle: 'none',
  padding: 0
})

const VolunteerShift = ({
  fullName,
  phone,
  email,
  confirmed
 }) =>
  $(ListItem, null,
    $(ListItemAvatar, null,
      $(Avatar)),
    $(ListItemText, { 
      primary: fullName,
      secondary: phone
    }),
    $(ListItemSecondaryAction, null,
      $(Checkbox, {
        checked: confirmed,
        edge: 'end' })))

export default Shifts