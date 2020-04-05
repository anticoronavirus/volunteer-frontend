import { createElement as $ } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Redirect, useHistory } from 'react-router-dom'
import { me as meQuery, updateVolunteer } from 'queries'
import Back from 'components/Back'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'
import { logoff } from 'Apollo'
import { requiredProfileFields } from 'utils'

import CircularProgress from '@material-ui/core/CircularProgress'
import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'
import ExitToApp from '@material-ui/icons/ExitToApp'
import { useMediaQuery, useTheme } from '@material-ui/core'

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
                  component: TextField,
                  name: 'comment',
                  validate: required,
                  label: 'Профессиональный статус',
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
                  : $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля')))))))
}

const required = value => (!value || value <= 4) && 'Обязательное поле'

export default Profile