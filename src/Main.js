import { createElement as $ } from 'react'
import AvialableShifts from 'AvailableShifts'
import Hint from 'components/Hint'
import MultipleSelector from 'components/MultipleSelector'
import { useQuery } from '@apollo/react-hooks'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { me, professions, hospitals } from 'queries'
import { logoff } from 'Apollo'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Tooltip from '@material-ui/core/Tooltip'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Skeleton from '@material-ui/lab/Skeleton'
import { useQueryParam, DelimitedArrayParam } from 'use-query-params'

const Main = ({ history, match }) => {

  const { data, loading } = useQuery(me)
  const [hospitalsValue, setHospitals] = useQueryParam('hospitals', DelimitedArrayParam)
  const [tasks, setTasks] = useQueryParam('tasks', DelimitedArrayParam)

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Paper, null,
    $(Box, { padding: 2 },
      $(Typography, { variant: notMobile ? 'h4' : 'h6' }, 'Запись волонтёров в больницы Москвы')),
    $(Box, { 
      padding: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between' },
      $(MultipleSelector, {
        query: hospitals,
        path: 'hospitals',
        label: 'Больницы',
        emptyLabel: 'Выберите больницу',
        getOptionLabel: hospital => hospital.shortname,
        getOptionValue: hospital => hospital.uid,
        value: hospitalsValue,
        onChange: setHospitals }),
      $(MultipleSelector, {
        query: professions,
        path: 'professions',
        label: 'Задачи',
        emptyLabel: 'Выберите задачу',
        getOptionLabel: task => task.name,
        getOptionValue: task => task.name,
        value: tasks,
        onChange: setTasks }),
    // loading
    //   ? $(Skeleton, { width: '15ex', height: 48 })
    //   : data && data.me.length
    //     ? $(ButtonGroup, { size: 'small' },
    //         $(Button, { onClick: () => history.push(
    //           data.me[0].managedHospital
    //             ? `/hospitals/${data.me[0].managedHospital.uid}`
    //             : '/profile') },
    //           `${data.me[0].fname}${data.me[0].managedHospital ? ' @ ' + data.me[0].managedHospital.shortname : ''}`),
    //         $(Tooltip, { title: 'Выход' },
    //           $(Button, { onClick: () => logoff() && history.push('/')},
    //           $(ExitToApp, { fontSize: 'small' }))))
    //     : $(Button, { size: 'small', variant: 'outlined', onClick: () => history.push('/login') }, 'Войти')
        ),
    $(Box, { padding: '0 16px', maxWidth: '120ex'},
      $(Hint, { name: 'welcome' })),
    data &&
      $(AvialableShifts, {
        hospitalId: match.params.hospitalId,
        userId: data && data.me.length && data.me[0].uid
      })
      )
}

export default Main