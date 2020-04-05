import { createElement as $, useState } from 'react'
import map from 'lodash/fp/map'
import get from 'lodash/fp/get'
import sortBy from 'lodash/fp/sortBy'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { Redirect } from 'react-router-dom'
import { me as meQuery, updateVolunteer } from 'queries'
import Shifts from 'ShiftsList'
import Back from 'components/Back'
import AddHospitalShift from 'components/AddHospitalShift'
import { Formik, Form, Field } from 'formik'
import { TextField } from 'formik-material-ui'

import Box from '@material-ui/core/Box'
import Avatar from '@material-ui/core/Avatar'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import Skeleton from '@material-ui/lab/Skeleton'
import CloudDownload from '@material-ui/icons/CloudDownload'
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled'
import Delete from '@material-ui/icons/Delete'
import { useMediaQuery, useTheme } from '@material-ui/core'

const Profile = () => {
  
  const { data, loading } = useQuery(meQuery)

  return !loading && !data.me[0]
    ? $(Redirect, { to: '/' })
    : loading
      ? 'loading'
      : $(ProfilePure, data.me[0])
}

const ProfilePure = data =>  {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))
  const [mutate] = useMutation(updateVolunteer)

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
            $(Typography, { variant: 'subtitle1', align: 'center' }, data.phone),
          $(Formik, {
            initialValues: data,
            onSubmit: variables => mutate({ variables })},
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
                !(dirty && isValid)
                  ? $(Typography, { variant: 'caption' }, 'Пожалуйста, заполните все поля')
                  : $(Button, {
                      onClick: submitForm,
                      variant: 'outlined',
                      fullWidth: true,
                    }, 'Сохранить')))))))
}

const required = value => (!value || value <= 4) && 'Обязательное поле'

export default Profile