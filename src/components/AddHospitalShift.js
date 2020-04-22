import { createElement as $, Fragment, useState } from 'react'
import map from 'lodash/fp/map'
import isEmpty from 'lodash/fp/isEmpty'
import range from 'lodash/fp/range'
import entries from 'lodash/fp/entries'
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
import { useMediaQuery, useTheme, SvgIcon } from '@material-ui/core'
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
        $(Box, { overflow: 'scroll', maxWidth: 420 },
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
          $(Box, { overflow: 'scroll', maxWidth: 420 },
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

const Biohazard = () =>
  $(Box, { marginRight: 1, display: 'flex', alignItems: 'center'},
    $(SvgIcon, { fontSize: 'small' },
      $('path', { d: 'M19.097,15.391c-0.265-0.08-0.561,0.111-0.67,0.365c-0.449,1.045-1.145,1.959-2.016,2.668c-0.214,0.175-0.314,0.512-0.159,0.739l0.006,0.009c0.156,0.228,0.509,0.253,0.725,0.081c1.05-0.839,1.882-1.935,2.403-3.194c0.105-0.255-0.018-0.584-0.281-0.665C19.102,15.393,19.099,15.392,19.097,15.391z M20.506,10.938c-0.717-0.414-1.477-0.679-2.246-0.818C18.729,9.18,19,8.123,19,7c0-3.318-2.311-6.09-5.41-6.81C13.268,0.115,13,0.312,13,0.6c0,0.288,0.264,0.576,0.574,0.693C15.282,1.93,16.5,3.57,16.5,5.5c0,2.485-2.015,4.5-4.501,4.5C9.514,10,7.5,7.985,7.5,5.5c0-1.931,1.218-3.57,2.926-4.209C10.736,1.176,11,0.887,11,0.6s-0.267-0.484-0.59-0.41C7.311,0.909,5,3.682,5,7c0,1.123,0.271,2.18,0.741,3.121c-0.77,0.141-1.53,0.404-2.247,0.818c-2.874,1.658-4.118,5.045-3.192,8.09c0.096,0.317,0.401,0.45,0.65,0.307c0.249-0.145,0.367-0.518,0.312-0.844c-0.302-1.799,0.509-3.674,2.181-4.639c2.153-1.242,4.905-0.504,6.148,1.648c1.243,2.152,0.505,4.904-1.648,6.146c-1.854,1.07-4.147,0.665-5.543-0.842c0,0-0.202,0.117-0.451,0.261s-0.286,0.475-0.06,0.717c2.173,2.323,5.729,2.938,8.603,1.279c0.574-0.331,1.063-0.747,1.503-1.2c0.439,0.455,0.934,0.868,1.509,1.2c2.873,1.659,6.43,1.043,8.604-1.28c0.226-0.242,0.188-0.572-0.061-0.717c-0.249-0.144-0.632-0.06-0.887,0.151c-1.407,1.161-3.436,1.396-5.107,0.431c-2.152-1.243-2.889-3.995-1.646-6.148c1.242-2.152,3.994-2.89,6.147-1.646c1.672,0.965,2.483,2.839,2.181,4.638c-0.055,0.326,0.063,0.699,0.312,0.843s0.554,0.011,0.65-0.307C24.624,15.985,23.38,12.598,20.506,10.938z M12.001,15C10.896,15,10,14.105,10,13s0.896-2,2.001-2c1.103,0,1.998,0.895,1.998,2S13.104,15,12.001,15z M7.018,19.253c0.215,0.172,0.568,0.147,0.725-0.08c0.002-0.003,0.003-0.005,0.005-0.008c0.156-0.229,0.054-0.566-0.16-0.741c-0.87-0.709-1.565-1.624-2.014-2.668c-0.109-0.254-0.405-0.445-0.67-0.366c0,0,0,0-0.001,0c-0.264,0.08-0.389,0.409-0.284,0.664C5.136,17.317,5.968,18.414,7.018,19.253z M9.562,5.898c0.001,0.006,0.002,0.014,0.003,0.02c0.042,0.273,0.321,0.41,0.587,0.337C10.741,6.091,11.36,6,12,6s1.259,0.091,1.848,0.255c0.266,0.073,0.546-0.063,0.587-0.336c0.001-0.007,0.002-0.015,0.003-0.021c0.04-0.273-0.158-0.568-0.426-0.639C13.369,5.092,12.695,5,12,5s-1.369,0.092-2.012,0.26C9.721,5.33,9.522,5.625,9.562,5.898z'})))

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

export default AddHospitalShift