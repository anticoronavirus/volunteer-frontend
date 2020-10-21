import { Mutation, Query, Subscription } from '@apollo/react-components'
import { useMutation, useQuery } from '@apollo/react-hooks'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { styled } from '@material-ui/core'
import Avatar from '@material-ui/core/Avatar'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Delete from '@material-ui/icons/Delete'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { Field, Form, Formik } from 'formik'
import { TextField } from 'formik-material-ui'
import entries from 'lodash/fp/entries'
import map from 'lodash/fp/map'
import omit from 'lodash/fp/omit'
import { createElement as $, Fragment, useEffect } from 'react'
import MaskedInput from 'react-input-mask'
import { Link, Redirect, Route, Switch, useHistory, useParams } from 'react-router-dom'

import { logoff } from 'Apollo'
import ShiftRequest from 'components/ShiftRequest'
import { me as meQuery, myShifts, profileProfessionRequests, removeVolunteerFromShift, updateVolunteer } from 'queries'
import { formatDate } from 'utils'

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
    // $(Back),
    $(Box, notMobile ? { margin: 'auto', maxWidth: 480 } : { marginBottom: 2 },
      $(Paper, null,
        $(Box, { justifyContent: 'flex-end', display: 'flex', marginBottom: -7, padding: 1 },
          $(Tooltip, { title: 'Выход' },
              $(IconButton, { onClick: () => logoff() && history.push('/')},
                $(ExitToApp, { fontSize: 'small' })))),
        $(Box, {
          display: 'flex',
          alignItems: 'center',
          padding: 3,
          justifyContent: 'center'}, 
          $(Avatar, { style: { width: 84, height: 84 } })),
          $(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center' },
            $(Typography, { variant: 'subtitle1', align: 'center' }, data.phone)),
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
        $(Box, { padding: 1 }),
        $(Switch, null,
          map(([value, { component }]) =>
            $(Route, { key: value, exact: true, path: `/profile/${value}` },
              $(component, data)),
            entries(tabs)),
          $(Redirect, { to: '/profile/' }))))
}

const ProfileForm = data => {
  const [mutate] = useMutation(updateVolunteer)
  const history = useHistory()

  return $(Paper, null,
    $(Box, { padding: 2 },
      $(Formik, {
        initialValues: omit(['managedHospitals', '__typename'], data),
        // validateOnBlur: false,
        validateOnMount: true,
        onSubmit: data =>
          mutate({ variables: { data, uid: data.uid }})
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
              validate: value => value && value.trim().length < 11 && 'Заполните номер целиком, ключая регион',
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
              : $(Box, { padding: '8px 0' }, $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля'))))))
}

const tabs = {
  '': {
    label: 'Профиль',
    component: ProfileForm
  },
  shifts: {
    label: 'Смены',
    component: ({ uid }) => $(Subscription, { subscription: myShifts, variables: { uid } }, ({ data }) =>
      !data
        ? $(CircularProgress)
        : data.volunteer_shift.length === 0
          ? $(Paper, null,
              $(Box, { padding: 2 },
                $(Typography, { variant: 'body2', paragraph: true},
                  'У вас пока нет смен, выберите больницу, в которой вам будет удобно помочь'),
                $(Button, {
                  variant: 'contained',
                  color: 'primary',
                  component: Link,
                  to: '/hospitals'
                  },
                  'Выбрать больницу')))
          : $(Fragment, null,
              $(MobileReadyButton, null, 
                $(Button, {
                  variant: 'outlined',
                  fullWidth: true,
                  component: Link,
                  to: '/hospitals'
                  },
                  'Добавить смену')),
              $(Box, { height: '16px' }),
              $(Paper, null,
                $(List, null,
                  map(Shifts, data.volunteer_shift)))))
  },
  requests: {
    label: 'Заявки',
    component: ({ uid }) =>
      $(Paper, null, 
        $(Query, { query: profileProfessionRequests, variables: { uid } }, ({ data }) =>
          $(List, null,
            map(ShiftRequest, data ? data.requests : []))))
  }
}

const MobileReadyButton = styled(Box)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    padding: '0 16px'
  }
}))

const LicensePlate = other =>
  $(MaskedInput, {
    ...other,
    onChange: event => {
      event.target.value = event.target.value.toUpperCase()
      other.onChange(event)
    },
    formatChars: {
      'A': '[АВЕКМНОРСТУХаверкмнорстух]',
      '9': '[0-9]',
      '?': '[0-9 ]',
    },
    maskChar: null,
    mask: 'A 999 AA 99?',
  })

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
      secondary: hospital?.shortname || 'Неактивная больница' }),
    $(Mutation, { mutation: removeVolunteerFromShift, variables: { uid } }, mutate =>
    $(ListItemSecondaryAction, null,
      $(IconButton, { onClick: mutate },
        $(Delete, { fontSize: 'small' })))))

const required = value => (!value || value <= 4) && 'Обязательное поле'

export default Profile