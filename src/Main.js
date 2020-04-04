import { createElement as $, useState } from 'react'
import AvialableShifts from 'AvailableShifts'
import HospitalSelector from 'components/HospitalSelector'
import { useQuery, useApolloClient } from '@apollo/react-hooks'
import { me } from 'queries'

import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Skeleton from '@material-ui/lab/Skeleton'

const Main = ({ history }) => {

  const { data, loading } = useQuery(me)
  const hospital = useState()
  const [hospitalId] = hospital
  const client = useApolloClient()

  return $(Paper, null,
    $(Box, { 
      padding: 1,
      paddingBottom: 0,
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'space-between' },
    $(HospitalSelector, { hospital }),
    $(Box),
    loading
      ? $(Skeleton, { width: '15ex', height: 48 })
      : data && data.me.length
        ? $(ButtonGroup, null,
            $(Button, { onClick: () => history.push(
              data.me[0].managedHospital
                ? `/hospitals/${data.me[0].managedHospital.uid}`
                : '/profile') },
              data.me[0].fname),
            $(Tooltip, { title: 'Выход' },
              $(Button, { onClick: () => {
                localStorage.removeItem('authorization')
                client.resetStore()
                history.push('/')
              }}, $(ExitToApp, { fontSize: 'small' }))))
        : $(Button, { variant: 'outlined', onClick: () => history.push('/login') }, 'Войти')),
    $(Box, { padding: '0 16px', maxWidth: '120ex'},
      $(Typography, { variant: 'body2' },
        `Спасибо за то, что готовы помочь! Нажмите на свободную смену ниже, чтобы записаться, а мы позвоним накануне и напомним.
        Двойная галочка означет подтверждение смены. Если вы не уверены, не ставьте галочку, потому что другие не смогут записаться на это время.`)),
    $(AvialableShifts, { hospitalId, userId: data && data.me && data.me.uid }))
}

export default Main