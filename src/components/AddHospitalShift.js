import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import isEmpty from 'lodash/fp/isEmpty'
import range from 'lodash/fp/range'
import entries from 'lodash/fp/entries'
import Biohazard from 'components/Biohazard'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { addShift, professions as professionsQuery } from 'queries'

import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { useMediaQuery, useTheme } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
// import yellow from '@material-ui/core/colors/yellow'
// import Warning from '@material-ui/icons/Warning'

const AddHospitalShift = ({ uid }) => {

  const [open, setOpen] = useState(false)
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const demands = useState({})
  const { data } = useQuery(professionsQuery)

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [mutate] = useMutation(addShift, {
    // FIXME optimistic response does not work
    // optimisticResponse: {
    //   insert_period: {
    //     returning: {
    //       __typename: 'period_mutation_response',
    //       returning: {
    //         hospital: {
    //           ...hospital,
    //           periods: [
    //             ...hospital.periods, {
    //               uid: Math.random(),
    //               start: `${start}:00+03:00`,
    //               end: `${end}:00+03:00`,
    //               demand: 10,
    //               period_demands: {
    //                 data: map(([key, value]) => ({
    //                   uid: Math.random(),
    //                   profession_id: key,
    //                   demand: value
    //                 }), entries(demands[0]))
    //               }
    //             }
    //           ]
    //         }
    //       }
    //     }
    //   }
    // },
    variables: {
      shift: {
        hospital_id: uid,
        start: `${start}:00+03:00`,
        end: `${end}:00+03:00`,
        demand: 10,
        period_demands: {
          data: map(([key, value]) => ({
            profession_id: key,
            demand: value
          }), entries(demands[0]))
        }
      }
    }
  })

  return $(Fragment, null,
    $(Dialog, {
      open,
      fullScreen,
      onClose: () => setOpen(false) },
      $(DialogTitle, null, 'Новая смена'),
      $(DialogContent, null,
        $(Typography, { variant: 'caption' }, 'Начало смены'),
        $(Box, { overflow: 'scroll' },
          $(ToggleButtonGroup, {
            size: 'small',
            exclusive: true,
            value: start,
            onChange: (event, value) => setStart(value) },
            map(RangeButton, range(0, 23)))),
        $(Box, { height: 16 }),
        start !== null &&
          $(Typography, { variant: 'caption' }, 'Конец смены'),
        start !== null &&
          $(Box, { overflow: 'scroll' },
            $(ToggleButtonGroup, {
              size: 'small',
              exclusive: true,
              value: end,
              onChange: (event, value) => setEnd(value) },
              map(RangeButton, range(start + 4, start + 2 + 24)))),
        $(Box, { height: 16 }),
        !!end &&
          $(Typography, { variant: 'caption' }, 'Задачи, помечена работа в карантинной зоне'),
        !!end && data &&
          map(Demand(demands), data.professions)),
      $(DialogActions, null,
        $(Button, { onClick: () => setOpen(false) }, 'Закрыть'),
        $(Button, {
          disabled: !start === null || !end === null || isEmpty(demands[0]),
          onClick: () => { setOpen(false); mutate().then() }}, 'Добавить'))),
    $(ListItem, { button: true, onClick: () => setOpen(true) },
      $(ListItemIcon, null,
        $(Add)),
      $(ListItemText, {
        primary: 'Добавить смену'
      })))
}

const Demand = ([
  demands,
  onChange
])=>({
  uid,
  name,
  dangerous
}) =>
  $(Box, { key: name, margin: '16px 0' },
    $(ButtonGroup, { fullWidth: true },
      $(Button, {
        style: { flexGrow: 1, width: 'initial' },
        onClick: () => onChange({ ...demands, [uid]: (demands[uid] || 0) + 1 }) },
        dangerous && $(Biohazard), 
        `${name} ${demands[uid] || 0}`),
      $(Button, {
        style: { width: 'initial' },
        onClick: () => demands[uid] > 0 && onChange({ ...demands, [uid]: (demands[uid] || 0) - 1 })}, '-')))

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

export default AddHospitalShift