import { createElement as $, Fragment, useContext, useState, useRef, useEffect } from 'react'
import { useIsDesktop } from 'utils'
import map from 'lodash/fp/map'
import noop from 'lodash/fp/noop'
import find from 'lodash/fp/find'
// import set from 'lodash/fp/set'
// import reduce from 'lodash/fp/reduce'
// import isEmpty from 'lodash/fp/isEmpty'
import range from 'lodash/fp/range'
// import entries from 'lodash/fp/entries'
import Biohazard from 'components/Biohazard'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { Mutation } from '@apollo/react-components'
import {
  addShift,
  editShift,
  addProfessionRequirement,
  removeProfessionRequirement,
  // updatePeriodDemand,
  professions as professionsQuery,
  requirements as requirementsQuery,
  // periodFragment
} from 'queries'

import Box from '@material-ui/core/Box'
import Skeleton from '@material-ui/lab/Skeleton'
import ListItem from '@material-ui/core/ListItem'
// import Select from '@material-ui/core/Select'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import TextField from '@material-ui/core/TextField'
// import DialogContent from '@material-ui/core/DialogContent'
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
import { styled } from '@material-ui/core/styles'
import HospitalContext from './HospitalContext'

// import yellow from '@material-ui/core/colors/yellow'
// import Warning from '@material-ui/icons/Warning'

export const AddHospitalShift = ({
  uid
}) => {

  const [open, setOpen] = useState(false)
  const [mutate] = useMutation(addShift)

  return $(Fragment, null,
    $(HospitalShift, {
      open,
      onClose: () => setOpen(false),
      onSubmit: data => {
        mutate({
          variables: {
            shift: {
              hospital_id: uid,
              ...data
            }
          }
        })
        setOpen(false)
      }
    }),
    $(ListItem, { button: true, onClick: () => setOpen(true)},
      $(ListItemIcon, null, $(Add)),
      $(ListItemText, {
        primary: 'Добавить смену'})))
}

export const EditHospitalShift = props => {
  const [mutate] = useMutation(editShift, { variables: { uid: props.uid }})
  return $(HospitalShift, {
    isEditing: true,
    onSubmit: data => {
      mutate({ variables: { data }})
      props.onClose()
    },
    ...props
  })
}

export const HospitalShift = ({
  isEditing,
  open,
  onClose,
  onSubmit,
  ...values
}) => {
  const [start, setStart] = useState(values.start ? parseInt(values.start.slice(0, 2)) : undefined)
  const [end, setEnd] = useState(values.end ? parseInt(values.end.slice(0, 2)) : undefined)
  const [professionId, setProfessionId] = useState(values.profession && values.profession.uid)
  const [demand, setDemand] = useState(values.demand || 1)
  const [notabene, setNotabene] = useState(values.notabene || '')
  const startRange = [0, 23]
  const endRange = [start + 4, start + 4 + 24]

  const fullScreen = useIsDesktop()
  const startRef = useRef(null)
  const endRef = useRef(null)
  useEffect(() => {
    startRef && startRef.current &&
      startRef.current.scrollTo((start * 38) + 24, 0)
    // endRef && endRef.current &&
    // endRef.current.scrollTo((end - start) * 38, 0)
    return noop
  }, [start, startRef])

  const { hospitalId } = useContext(HospitalContext)
  const professionsResult = useQuery(professionsQuery, { skip: !open })
  const requirementsResult = useQuery(requirementsQuery, { skip: !open || !professionId, variables: {
    where: {
      hospital_id: { _eq: hospitalId  },
      profession_id: { _eq: professionId }
    }
  }})

  const profession = professionId && professionsResult.data
    ? find({ uid: professionId }, professionsResult.data.professions)
    : null

  return $(Dialog, {
    open,
    onClose,
    scroll: 'paper',
    fullScreen: !fullScreen
  },
    $(DialogTitle, null, isEditing
        ? 'Редактирование смены'
        : 'Добавление смены'),
    $(DialogContent, { dividers: true },
      $(Caption, { variant: 'caption' }, 'Начало смены'),
      $(Box, { overflow: 'scroll', display: 'flex', ref: startRef },
        $(ToggleButtonGroup, {
          size: 'small',
          exclusive: true,
          value: start,
          onChange: (_, value) => {
            scrollToChildButton(
              startRef.current,
              diffInHours(startRange[0], value) + 1
            )
            setStart(value)
          }
        },
          map(RangeButton, range(...startRange)))),
      start !== undefined &&
      $(Box, { marginTop: 3 },
        $(Caption, { variant: 'caption' }, 'Конец смены'),
        $(Box, { overflow: 'scroll', display: 'flex', ref: endRef },
          $(ToggleButtonGroup, {
            size: 'small',
            exclusive: true,
            value: end,
            onChange: (_, value) => {
              scrollToChildButton(
                endRef.current,
                diffInHours(endRange[0], value) + 1
              )
              setEnd(value)
            }
          },
            map(RangeButton, range(...endRange))))),
      end !== undefined &&
      $(Box, { marginTop: 3 },
        $(Caption, { variant: 'caption' }, 'Профессия'),
        $(Box, { overflow: 'scroll', display: 'flex' },
          !professionsResult.data
            ? $(Skeleton, { width: '100%', height: 40, variant: 'rect' })
            : $(ToggleButtonGroup, {
                size: 'small',
                exclusive: true,
                value: professionId,
                onChange: (event, value) => setProfessionId(value) },
                map(Profession, professionsResult.data.professions)))),
      profession &&
      $(Box, { marginTop: 3 },
        $(Caption, { variant: 'caption' }, 'Количество'),
        $(ButtonGroup, { fullWidth: true },
          $(Button, { onClick: () => setDemand(demand + 1) }, '+'),
          $(DemandButton, { disabled: true }, demand),
          $(Button, { onClick: () => demand > 1 && setDemand(demand - 1) }, '-'))),
      profession &&
      $(Box, { marginTop: 3 },
        $(Caption, { variant: 'caption' }, 'Описание'),
        $(TextField, {
          size: 'small',
          variant: 'outlined',
          fullWidth: true,
          multiline: true,
          value: notabene,
          onChange: event => setNotabene(event.target.value),
          placeholder: profession.description
        })),
      profession &&
      $(Box, { marginTop: 3 },
        $(Caption, { variant: 'caption' }, 'Обязательные условия'),
        requirementsResult.loading || !requirementsResult.data
          ? map(LoadingRequirement, new Array(10))
          : $(FormGroup, null,
              map(Requirement(hospitalId, professionId), requirementsResult.data.requirements)))),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      start && end && professionId &&
        $(Button, { onClick: () => onSubmit({
          start: `${start}:00+0300`,
          end: `${end}:00+0300`,
          demand,
          notabene,
          profession_id: professionId
        }) }, isEditing
          ? 'Сохранить'
          : 'Добавить')))
}

const DemandButton = styled(Button)(({ theme }) => ({
  '&.Mui-disabled': {
    color: theme.palette.text.primary
  }
}))

const LoadingRequirement = () =>
  $(Box, { padding: '8px 0', display: 'flex'},
    $(Skeleton, { width: 20, height: 21 }),
    $(Box, { width: 16 }),
    $(Skeleton, { width: '20ex', height: 21 }))

const Requirement = (
  hospitalId,
  professionId,
) => ({
  uid,
  name,
  required
}) =>
  $(Mutation, {
    key: uid,
    mutation: required.length > 0
      ? removeProfessionRequirement
      : addProfessionRequirement,
    optimisticResponse: {
      toggle: {
        returning: {
          uid: Math.random(),
          requirement: {
            uid,
            required: required.length > 0
              ? []
              : [{ uid: Math.random() }]
          }
        }
      }
    },
    variables: {
      ...required.length > 0
        ? { uid: required[0].uid }
        : { requirementId: uid },
      hospitalId,
      professionId
    }
  }, (mutate, { loading }) =>
    $(FormControlLabel, {
      key: uid,
      control: $(Checkbox, {
        onClick: loading ? noop : mutate,
        checked: required && required.length > 0 }),
      label: name }))

const Profession = ({
  uid,
  name,
  dangerous
}) =>
  $(Unbreakab1e, {
    key: uid,
    value: uid
  }, dangerous && $(Biohazard), name)

const Unbreakab1e = styled(ToggleButton)({
  whiteSpace: 'nowrap'
})

const Caption = styled(Typography)({
  display: 'block',
  // padding: '0 24px',
  marginBottom: 8
})

const RangeButton = value =>
  $(ToggleButton, {
    key: value,
    onClick: (event => {
      console.log(event.target)
    }),
    value: value < 24 ? value : value - 24 },
    `${value < 24 ? value : value - 24}:00`)

const diffInHours = (start, end) =>
  end - start > 0
    ? end - start
    : end - start + 24

const scrollToChildButton = (parent, childIndex) => {
  const child = parent.querySelector(`button:nth-child(${childIndex})`)
  if (!child) return

  const left = child.offsetLeft
  const width = child.offsetWidth

  parent.scrollTo({
    top: 0,
    left: left - width/2,
    behavior: 'smooth'
  })
}

export default AddHospitalShift
