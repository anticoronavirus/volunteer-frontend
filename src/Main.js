import { createElement as $ } from 'react'
import AvialableShifts from 'AvailableShifts'
import Hint from 'components/Hint'
import HospitalSelector from 'components/HospitalSelector'
import { useQuery } from '@apollo/react-hooks'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { me } from 'queries'
import { logoff } from 'Apollo'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Tooltip from '@material-ui/core/Tooltip'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Skeleton from '@material-ui/lab/Skeleton'

const Main = ({ history, match }) => {

  const { data, loading } = useQuery(me)
  const hospital = [match.params.hospitalId, hospitalId => history.push(`/${hospitalId}`)]

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Paper, null,
    $(Box, { padding: 2 },
      $(Typography, { variant: notMobile ? 'h4' : 'h6' }, 'Запись волонтёров-медиков в больницы Москвы')),
    $(Box, { 
      padding: 2,
      alignItems: 'center',
      display: notMobile ? 'flex' : 'block',
      justifyContent: 'space-between' },
    $(HospitalSelector, { hospital }),
    $(Box),
    loading
      ? $(Skeleton, { width: '15ex', height: 48 })
      : data && data.me.length
        ? $(ButtonGroup, { size: 'small' },
            $(Button, { onClick: () => history.push(
              data.me[0].managedHospital
                ? `/hospitals/${data.me[0].managedHospital.uid}`
                : '/profile') },
              `${data.me[0].fname}${data.me[0].managedHospital ? ' @ ' + data.me[0].managedHospital.shortname : ''}`),
            $(Tooltip, { title: 'Выход' },
              $(Button, { onClick: () => logoff() && history.push('/')},
              $(ExitToApp, { fontSize: 'small' }))))
        : $(Button, { size: 'small', variant: 'outlined', onClick: () => history.push('/login') }, 'Войти')),
    $(Box, { padding: '0 16px', maxWidth: '120ex'},
      $(Hint, { name: 'welcome' })),
    data &&
      $(AvialableShifts, {
        hospitalId: match.params.hospitalId,
        userId: data && data.me.length && data.me[0].uid
      }))
}

export default Main