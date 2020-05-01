import { createElement as $, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
// import { Query } from '@apollo/react-components'
import { Subscription, Mutation, Query } from '@apollo/react-components'
import MaskedInput from 'react-input-mask'
import { Redirect, useHistory, useParams, Switch, Route } from 'react-router-dom'
import { me as meQuery, 
  // professions,
  profileProfessionRequests,
  updateVolunteer,
  myShifts,
  removeVolunteerFromShift
} from 'queries'
import Back from 'components/Back'
// import Biohazard from 'components/Biohazard'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { logoff } from 'Apollo'
import { formatDate } from 'utils'
import map from 'lodash/fp/map'
import omit from 'lodash/fp/omit'
import entries from 'lodash/fp/entries'

import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Delete from '@material-ui/icons/Delete'
import CheckCircle from '@material-ui/icons/CheckCircle'
import RemoveCircleOutline from '@material-ui/icons/RemoveCircleOutline'
import { useMediaQuery, useTheme } from '@material-ui/core'
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
// import ToggleButton from '@material-ui/lab/ToggleButton'

const Profile = () => {
  
  const { data, loading } = useQuery(meQuery)

  return !loading && !data.me[0]
    ? $(Redirect, { to: '/' })
    : loading && !data
      ? $(Box, { padding: 2 }, $(CircularProgress))
      : $(ProfilePure, data.me[0])
}

const ProfilePure = data =>  {

  const theme = useTheme()
  const { page = '' } = useParams()
  const { push } = useHistory()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))
  const history = useHistory()

  // FIXME mui-org/material-ui#9337
  useEffect(() => {
    return () =>
      window.dispatchEvent(new CustomEvent('resize'))
  })

  return $(Box, notMobile && { display: 'flex', padding: 2 },
    $(Back),
    $(Box, notMobile ? { marginRight: 2, maxWidth: 480 } : { marginBottom: 2 },
      $(Paper, null,
        $(Box, {
          display: 'flex',
          alignItems: 'center',
          padding: 3,
          justifyContent: 'center'}, 
          $(Avatar, { style: { width: 84, height: 84 } })),
          $(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            $(Typography, { variant: 'subtitle1', align: 'center' }, data.phone),
            $(Tooltip, { title: 'Выход' },
              $(Button, { onClick: () => logoff() && history.push('/')},
              $(ExitToApp, { fontSize: 'small' })))),
      $(Box, { height: 16 }),
      $(Divider),
      $(Tabs, {
        variant: 'fullWidth',
        value: page,
        // action: () => updateIndicator(),
        onChange: (event, value) => push(`/profile/${value}`) },
        map(([value, { label }]) =>
          $(Tab, { id: value, key: value, value, label }),
          entries(tabs)))),
        $(Box, { height: 16 }),
        $(Paper, null,
          $(Switch, null,
            map(([value, { component }]) =>
              $(Route, { key: value, exact: true, path: `/profile/${value}` },
                $(component, data)),
              entries(tabs)),
            $(Redirect, { to: '/profile/' })))))
        
    // $(Box, { maxWidth: '60ex' },
      // $(ShiftsAndRequests)
      // $(Paper, null,
      //   $(Query, { query: professions }, ({ data }) =>
      //     !data
      //       ? $(CircularProgress)
      //       : map(Profession, data.professions))),
      // $(Box, { height: 16 }),
                // ))
}

const ProfileForm = data => {
  const [mutate] = useMutation(updateVolunteer, { variables: { uid: data.uid }})
  const history = useHistory()

  return $(Box, { padding: 2 },
    $(Formik, {
      initialValues: omit(['managedHospital', '__typename'], data),
      // validateOnBlur: false,
      validateOnMount: true,
      onSubmit: data =>
        mutate({ variables: { data }})
          .then(() => history.push('/'))
        },
      ({ submitForm, isValid, dirty }) =>
        $(Form, null, 
          $(Field, {
            component: TextField,
            name: 'lname',
            validate: required,
            label: 'Фамилия',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined' }),
          $(Field, {
            component: TextField,
            name: 'fname',
            validate: required,
            label: 'Имя',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined' }),
          $(Field, {
            component: TextField,
            name: 'mname',
            validate: required,
            label: 'Отчество',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined' }),
          // $(Field, {
          //   component: FormikButtonGroup,
          //   name: 'profession' }),
          $(Field, {
            component: TextField,
            name: 'comment',
            validate: required,
            label: 'Специализация',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            placeholder: 'Например студент-онколог',
            variant: 'outlined' }),
          $(Field, {
            component: TextField,
            name: 'email',
            validate: value => value.match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/) ? null : 'Введите корректную почту',
            label: 'Электронная почта',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined' }),
          $(Field, {
            component: TextField,
            name: 'car',
            label: 'Марка машины',
            validate: value => value && value.length > 16 && 'Сократите описание',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined' }),
          $(Field, {
            component: TextField,
            name: 'licenceplate',
            label: 'Номер машины',
            validate: value => value && value !== '_ ___ __ __' && value.match('_') && 'Заполните номер целиком, ключая регион',
            margin: 'normal',
            fullWidth: true,
            helperText: ' ',
            variant: 'outlined',
            InputProps: {
              inputComponent: LicensePlate
            } }),
          $(Box),
          isValid
            ? $(Button, {
                onClick: submitForm,
                variant: 'outlined',
                fullWidth: true,
                disabled: !dirty
              }, 'Сохранить')
            : $(Box, { padding: '8px 0' }, $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля')))))
}

const tabs = {
  '': {
    label: 'Профиль',
    component: ProfileForm
  },
  shifts: {
    label: 'Смены',
    component: () => $(Subscription, { subscription: myShifts }, ({ data }) =>
      !data ? $(CircularProgress) :
        $(List, null,
          map(Shifts, data.volunteer_shift)))
  },
  requests: {
    label: 'Заявки',
    component: ({ uid }) =>
      $(Query, { query: profileProfessionRequests, variables: { uid } }, ({ data }) =>
        $(List, null,
          map(ShiftRequest, data ? data.requests : [])))
  }
}

const LicensePlate = other =>
  $(MaskedInput, {
    ...other,
    onChange: event => {
      event.target.value = event.target.value.toUpperCase()
      other.onChange(event)
    },
    formatChars: {
      'A': '[АВЕКМНОРСТУХаверкмнорстух]',
      '9': '[0-9]'
    },
    mask: 'A 999 AA 99',
  })

const ShiftRequest = ({
  uid,
  hospital,
  profession,
  requirements
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${profession.name} в ${hospital.shortname}`,
      secondary: $(Box, null,
        map(Requirement, requirements))}))

const Requirement = ({ requirement, satisfied }) =>
  $(Box, { display: 'flex', alignItems: 'center', margin: '8px 0' },
    $(satisfied.length
      ? CheckCircle
      : RemoveCircleOutline, { fontSize: 'small' }),
      $(Box, { marginLeft: 1 }, requirement.name))

const Shifts = ({
  uid,
  confirmed,
  hospital,
  date,
  start,
  end
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${formatDate(date)}, c ${start.slice(0, 5)} до ${end.slice(0, 5)}`,
      secondary: `${hospital.shortname} · ${confirmed ? 'подтверждено' : 'ожидает подтверждения'}` }),
    $(Mutation, { mutation: removeVolunteerFromShift, variables: { uid } }, mutate =>
    $(ListItemSecondaryAction, null,
      $(IconButton, { onClick: mutate },
        $(Delete, { fontSize: 'small' })))))

// const FormikButtonGroup = ({
//   form: { setFieldValue, values },
//   field: { name },
// }) =>
//   $(Box, { margin: '16px -16px', overflow: 'scroll', padding: '0 16px' }, 
//     $(Query, { query: professions }, ({ data }) => 
//       $(ToggleButtonGroup, {
//         value: values[name],
//         exclusive: true,
//         onChange: (event, value) => setFieldValue(name, value)
//       }, data &&
//       map(Profession, data.professions))))

// const Profession = ({ uid, name, dangerous }) =>
//   $(ToggleButton, { value: uid }, dangerous && $(Biohazard), name)

const required = value => (!value || value <= 4) && 'Обязательное поле'

export default Profile