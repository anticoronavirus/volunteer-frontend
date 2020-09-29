import { createElement as $ } from 'react'
import AvialableShifts from 'AvailableShifts'
import Hint from 'components/Hint'
import TaskOption from 'components/TaskOption'
import HospitalOption from 'components/HospitalOption'
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
import {
  useQueryParam,
  StringParam,
  //DelimitedArrayParam
} from 'use-query-params'

const Main = ({ history }) => {

  const { data, loading } = useQuery(me)
  const [hospitalId, setHospitals] = useQueryParam('hospital', StringParam)
  const [taskId, setTasks] = useQueryParam('task', StringParam)

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Paper, null,
    $(Box, {
      display: notMobile ? 'flex' : 'block',
      padding: 2,
      alignItems: 'center'
    },
      $(Typography, { variant: notMobile ? 'h4' : 'h6' }, 'Запись волонтёров в больницы Москвы'),
      $(Box, { height: 8, flexGrow: 1 }),
      loading && !data
        ? $(Skeleton, { width: '15ex', height: 24 })
        : $(Box, { flexShrink: 0 },
          data && data.me.length
            ? $(ButtonGroup, { size: 'small' },
                $(Button, { onClick: () => history.push(
                  data.me[0].managedHospitals[0]
                    ? `/hospitals/${data.me[0].managedHospitals[0].hospital.uid}`
                    : '/profile') },
                  `${data.me[0].fname}${data.me[0].managedHospitals[0] ? ' @ ' + data.me[0].managedHospitals[0].hospital.shortname : ''}`),
                $(Tooltip, { title: 'Выход' },
                  $(Button, { onClick: () => logoff().then(() => history.push('/'))},
                  $(ExitToApp, { fontSize: 'small' }))))
            : $(Button, { size: 'small', variant: 'outlined', onClick: () => history.push('/login') }, 'Войти'))),
    $(Box, { 
      padding: 2,
      display: 'flex', 
      flexDirection: notMobile ? 'row' : 'column' },
      $(Box, { marginRight: 2 }, 
        $(MultipleSelector, {
          query: hospitals,
          path: 'hospitals',
          label: 'Больница',
          emptyLabel: 'Выберите больницу',
          Option: HospitalOption,
          defaultValue: {
            shortname: 'Все',
            uid: undefined
          },
          getOptionLabel: hospital => hospital.shortname,
          getOptionValue: hospital => hospital.uid,
          value: hospitalId,
          onChange: setHospitals })),
      $(Box, { marginRight: 2 },
        $(MultipleSelector, {
          query: professions,
          variables: {
            where: {
              periods: {
                uid: {
                  _neq: null
                }
              }
            }
          },
          path: 'professions',
          label: 'Задача',
          Option: TaskOption,
          defaultValue: {
            name: 'Все',
            uid: undefined
          },
          emptyLabel: 'Выберите задачу',
          getOptionLabel: task => task.name,
          getOptionValue: task => task.uid,
          value: taskId,
          onChange: setTasks }))),
    $(Box, { padding: '0 16px', maxWidth: '120ex'},
      $(Hint, { name: 'welcome' })),
    data &&
      $(AvialableShifts, {
        hospitalId,
        taskId,
        userId: data && data.me.length && data.me[0].uid
      }))
}

export default Main