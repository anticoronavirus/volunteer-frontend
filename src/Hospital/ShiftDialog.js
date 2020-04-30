import { createElement as $, Fragment, useState, useRef, useEffect } from 'react'
import { useIsDesktop } from 'utils'
import map from 'lodash/fp/map'
import noop from 'lodash/fp/noop'
import find from 'lodash/fp/find'
// import set from 'lodash/fp/set'
// import reduce from 'lodash/fp/reduce'
// import isEmpty from 'lodash/fp/isEmpty'
import range from 'lodash/fp/range'
// import entries from 'lodash/fp/entries'
// import Biohazard from 'components/Biohazard'
// import { useMutation } from '@apollo/react-hooks'
// import { Query } from '@apollo/react-components'
import { useQuery } from '@apollo/react-hooks'
import { addShift, updatePeriodDemand, professions as professionsQuery, periodFragment } from 'queries'

import Box from '@material-ui/core/Box'
import ListItem from '@material-ui/core/ListItem'
import Select from '@material-ui/core/Select'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'
import Add from '@material-ui/icons/Add'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { styled } from '@material-ui/core/styles'

// import yellow from '@material-ui/core/colors/yellow'
// import Warning from '@material-ui/icons/Warning'

export const HospitalShift = ({
  uid,
  open,
  onClose,
  ...values
}) => {

  const fullScreen = useIsDesktop()
  const [start, setStart] = useState(values.start ? parseInt(values.start.slice(0, 2)) : undefined)
  const [end, setEnd] = useState(values.end ? parseInt(values.end.slice(0, 2)) : undefined)
  const [professionId, setProfessionId] = useState(values.professionId)
  const [demand, setDemand] = useState(values.demand || 1)
  const startRef = useRef(null)
  const { data } = useQuery(professionsQuery)
  // const endRef = useRef(null)

  useEffect(() => {
    startRef && startRef.current &&
      startRef.current.scrollTo((start * 38) + 24, 0)
    // endRef && endRef.current &&
    // endRef.current.scrollTo((end - start) * 38, 0)
    return noop
  }, [start, startRef])
  
  return $(Dialog, { open, onClose, fullScreen: !fullScreen },
    $(DialogTitle, null, 'Добавление смены'),
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Начало смены'),
    $(Box, { overflow: 'scroll', display: 'flex', ref: startRef },
      $(Box, { minWidth: 24 }),
      $(ToggleButtonGroup, {
        size: 'small',
        exclusive: true,
        value: start,
        onChange: (event, value) => setStart(value) },
        map(RangeButton, range(0, 23))),
      $(Box, { minWidth: 24 }))),
    start !== undefined &&
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Конец смены'),
      $(Box, { overflow: 'scroll', display: 'flex' },
        $(Box, { minWidth: 24 }),
        $(ToggleButtonGroup, {
          size: 'small',
          exclusive: true,
          value: end,
          onChange: (event, value) => setEnd(value) },
          map(RangeButton, range(start + 4, start + 4 + 24))),
        $(Box, { minWidth: 24 }))),
    end !== undefined && data &&
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Профессия'),
      $(Box, { overflow: 'scroll', display: 'flex' },
        $(Box, { minWidth: 24 }),
        $(ToggleButtonGroup, {
          size: 'small',
          exclusive: true,
          value: professionId,
          onChange: (event, value) => setProfessionId(value) },
          map(Profession, data.professions)),
        $(Box, { minWidth: 24 }))),
    professionId &&
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Количество'),
      $(Box, { padding: '0 24px' },
        $(ButtonGroup, { fullWidth: true },
          $(Button, { onClick: () => setDemand(demand + 1) }, '+'),
          $(Button, { disabled: true }, demand),
          $(Button, { onClick: () => demand > 1 && setDemand(demand - 1) }, '-')))),
    professionId &&
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Описание'),
      $(Box, { padding: '0 24px' },
        $(TextField, {
          size: 'small',
          variant: 'outlined',
          fullWidth: true,
          multiline: true,
          placeholder: find({ uid: professionId }, data.professions).description
        }))),
    professionId &&
    $(Box, { marginTop: 3 },
      $(Caption, { variant: 'caption' }, 'Обязательные условия'),
      $(Box, { padding: '0 24px' },
        $(FormGroup, null,
          map(Requirement, [{ uid: 'test', name: 'rest' }, { uid: 'gest', name: 'plest' }])))),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      start && end && professionId &&
        $(Button, { onClick: console.log }, 'Добавить')))
}

const Requirement = ({
  uid,
  name,
  required
}) =>
  $(FormControlLabel, {
    control: $(Checkbox, { checked: true }),
    label: name
  })

const Profession = ({
  uid,
  name
}) =>
  $(Unbreakab1e, {
    key: uid,
    value: uid
  }, name)

const Unbreakab1e = styled(ToggleButton)({
  whiteSpace: 'nowrap'
})

const Caption = styled(Typography)({
  display: 'block',
  padding: '0 24px',
  marginBottom: 8
})

export const AddHospitalShift = () => {

  const [open, setOpen] = useState(false)

  return $(Fragment, null,
    $(HospitalShift, { open, onClose: () => setOpen(false) } ),
    $(ListItem, { button: true, onClick: () => setOpen(true)},
      $(ListItemIcon, null, $(Add)),
      $(ListItemText, {
        primary: 'Добавить смену'
      })))
}

export const EditHospitalShift = HospitalShift

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

export default AddHospitalShift