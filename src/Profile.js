import { createElement as $ } from 'react'
import map from 'lodash/fp/map'
import get from 'lodash/fp/get'
import sortBy from 'lodash/fp/sortBy'
import { useQuery } from '@apollo/react-hooks'
import { Mutation } from '@apollo/react-components'
import { Redirect } from 'react-router-dom'
import { me } from 'queries'
import Shifts from 'ShiftsList'
import Back from 'components/Back'
import AddHospitalShift from 'components/AddHospitalShift'



import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'
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
  
  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))
  const { data, loading } = useQuery(me)

  return !loading && !data.me.length
    ? $(Redirect, { to: '/' })
    : loading
      ? 'loading'
      : $(Box, notMobile && { display: 'flex', padding: 2 },
          $(Back),
          $(Box, notMobile ? { marginRight: 2 } : { marginBottom: 2 },
            $(Paper, null,
              $(Box, { padding: 2, width: notMobile ? 360 : 'auto' },
                $(TextField, {
                  value: 'test',
                  label: 'Фамилия',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(TextField, {
                  value: 'test',
                  label: 'Имя',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(TextField, {
                  value: 'test',
                  label: 'Отчество',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                $(TextField, {
                  value: 'test',
                  label: 'Профессиональный статус',
                  margin: 'normal',
                  fullWidth: true,
                  placeholder: 'Например студент-онколог',
                  variant: 'outlined' }),
                $(TextField, {
                  value: 'test',
                  label: 'Электронная почта',
                  margin: 'normal',
                  fullWidth: true,
                  variant: 'outlined' }),
                ))))
}

export default Profile