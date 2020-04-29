import { createElement as $, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
// import { Query } from '@apollo/react-components'
import { Subscription, Mutation } from '@apollo/react-components'
import MaskedInput from 'react-input-mask'
import { Redirect, useHistory } from 'react-router-dom'
import { me as meQuery, 
  // professions,
updateVolunteer, myShifts, removeVolunteerFromShift } from 'queries'
import Back from 'components/Back'
// import Biohazard from 'components/Biohazard'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { logoff } from 'Apollo'
import { requiredProfileFields, formatDate } from 'utils'
import map from 'lodash/fp/map'

import CircularProgress from '@material-ui/core/CircularProgress'
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
    : loading
      ? $(Box, { padding: 2 }, $(CircularProgress))
      : $(ProfilePure, data.me[0])
}

const ProfilePure = data =>  {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))
  const [mutate] = useMutation(updateVolunteer, { variables: { uid: data.uid }})
  const history = useHistory()

  return $(Box, notMobile && { display: 'flex', padding: 2 },
    $(Back),
    $(Box, notMobile ? { marginRight: 2 } : { marginBottom: 2 },
      $(Paper, null,
        $(Box, { padding: 2, width: notMobile ? 360 : 'auto' },
          $(Box, {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 140 }, 
            $(Avatar, { style: { width: 84, height: 84 } })),
            $(Box, { display: 'flex', justifyContent: 'center', alignItems: 'center' },
              $(Typography, { variant: 'subtitle1', align: 'center' }, data.phone),
              $(Tooltip, { title: 'Выход' },
                $(Button, { onClick: () => logoff() && history.push('/')},
                $(ExitToApp, { fontSize: 'small' })))),
          $(Formik, {
            initialValues: {
              ...data,
              car: '',
              licenceplate: ''
            },
            validateOnBlur: false,
            validateOnMount: true,
            onSubmit: variables =>
              mutate({ variables: requiredProfileFields(variables) })
                .then(() => history.push('/'))},
            ({ submitForm, isValid, dirty }) =>
              $(Form, null, 
                $(Field, {
                  component: TextField,
                  name: 'lname',
                  validate: required,
                  label: 'Фамилия',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(Field, {
                  component: TextField,
                  name: 'fname',
                  validate: required,
                  label: 'Имя',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(Field, {
                  component: TextField,
                  name: 'mname',
                  validate: required,
                  label: 'Отчество',
                  margin: 'normal',
                  fullWidth: true,
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
                  placeholder: 'Например студент-онколог',
                  variant: 'outlined' }),
                $(Field, {
                  component: TextField,
                  name: 'email',
                  validate: value => value.match(/^([a-zA-Z0-9_\-.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/) ? null : 'Введите корректную почту',
                  label: 'Электронная почта',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(Field, {
                  component: TextField,
                  name: 'car',
                  label: 'Марка машины',
                  validate: value => value && value.length > 16 && 'Сократите описание',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(Field, {
                  component: TextField,
                  name: 'licenceplate',
                  label: 'Номер машины',
                  validate: value => value.match('_') && 'Заполните номер целиком, ключая регион',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined',
                  InputProps: {
                    inputComponent: LicensePlate
                  } }),
                $(Box, { height: 16 }),
                isValid
                  ? $(Button, {
                      onClick: submitForm,
                      variant: 'outlined',
                      fullWidth: true,
                    }, 'Сохранить')
                  : $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля')))))),
    $(Box, { maxWidth: '60ex' },
      $(ShiftsAndRequests)
      // $(Paper, null,
      //   $(Query, { query: professions }, ({ data }) =>
      //     !data
      //       ? $(CircularProgress)
      //       : map(Profession, data.professions))),
      // $(Box, { height: 16 }),
                ))
}

const ShiftsAndRequests = () => {
  const [tab, setTab] = useState('schedule')
  return $(Paper, null, 
    $(Tabs, { variant: 'fullWidth', value: tab, onChange: (event, value) => setTab(value) },
      $(Tab, { value: 'schedule', label: 'Смены' }),
      $(Tab, { value: 'requests', label: 'Заявки' })),
      tab === 'requests' && // FIXME add real data
        $(List, null,
          map(ShiftRequest, [1])),
      tab === 'schedule' &&
        $(Subscription, { subscription: myShifts }, ({ data }) =>
          !data ? $(CircularProgress) :
            $(List, null,
              map(MyShift, data.volunteer_shift))))
}

const LicensePlate = other =>
  $(MaskedInput, {
    ...other,
    formatChars: {
      'A': '[АВЕКМНОРСТУХаверкмнорстух]',
      '9': '[0-9]'
    },
    mask: 'A 999 AA 99',
  })

const ShiftRequest = ({
  uid,
  hospital = { name: 'ГКБ №64' },
  profession = { name: 'Санитар' },
  requirements = [{
    name: 'Медицинская книжка',
    confirmed: true
  },{
    name: 'Трудовой договор',
    confirmed: false
  }]
}) =>
  $(ListItem, { key: uid },
    $(ListItemText, {
      primary: `${profession.name} в ${hospital.name}`,
      secondary: $(Box, null,
        map(Requirement, requirements))}))

const Requirement = ({ name, confirmed }) =>
  $(Box, { display: 'flex', alignItems: 'center', margin: '8px 0' },
    $(confirmed ? CheckCircle : RemoveCircleOutline, { fontSize: 'small' }), $(Box, { marginLeft: 1 }, name))

// const Profession = ({ uid, name, dangerous }) =>
//   $(ListItem, null,
//     $(ListItemText, {
//       primary: name,
//       secondary: 'test'
//     }))

const MyShift = ({
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