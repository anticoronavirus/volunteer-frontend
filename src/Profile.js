import { createElement as $ } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Subscription, Mutation } from '@apollo/react-components'
import { Redirect, useHistory } from 'react-router-dom'
import { me as meQuery, updateVolunteer, myShifts, removeVolunteerFromShift } from 'queries'
import Back from 'components/Back'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { logoff } from 'Apollo'
import { requiredProfileFields, formatDate } from 'utils'
import map from 'lodash/fp/map'

import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
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
import { useMediaQuery, useTheme } from '@material-ui/core'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup'
import ToggleButton from '@material-ui/lab/ToggleButton'

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
            initialValues: data,
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
                $(Field, {
                  component: FormikButtonGroup,
                  name: 'profession' }),
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
                $(Box, { height: 16 }),
                isValid
                  ? $(Button, {
                      onClick: submitForm,
                      variant: 'outlined',
                      fullWidth: true,
                    }, 'Сохранить')
                  : $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля')))))),
    $(Box, { maxWidth: '60ex' },
      $(Paper, null,
        $(Box, { padding: 2, style: { whiteSpace: 'pre-line'} },
          $(Typography, { variant: 'body2'},
          `При первом посещении больницы необходимо предоставить следующие документы: 
          1. Паспорт гражданина РФ
          2. Медицинская книжка 
          3. Диплом об окончании образовательного медицинского учреждения или студенческий билет
          `))),
      $(Box, { height: 16 }),
      $(Subscription, { subscription: myShifts }, ({ data }) =>
      $(Paper, null, 
        data &&
          $(List, null,
            $(ListSubheader, { disableSticky: true }, 'Мои смены'),
            map(MyShift, data.volunteer_shift))))))
}

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

const FormikButtonGroup = ({
  form: { setFieldValue, values },
  field: { name },
}) =>
  $(Box, { margin: '16px -16px', overflow: 'scroll', padding: '0 16px' }, 
    $(ToggleButtonGroup, {
      value: values[name],
      exclusive: true,
      onChange: (event, value) => setFieldValue(name, value)
    },
      $(ToggleButton, { value: 'cтудент' }, 'Студент'),
      $(ToggleButton, { value: 'медперсонал' }, 'Медперсонал'),
      $(ToggleButton, { value: 'врач' }, 'Врач'),
      $(ToggleButton, { value: 'немедик' }, 'Немедик'),
      ))

const required = value => (!value || value <= 4) && 'Обязательное поле'

export default Profile