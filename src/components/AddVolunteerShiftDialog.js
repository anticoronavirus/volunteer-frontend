import { createElement as $, useState, Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Query } from '@apollo/react-components'
import { filteredShiftData, periodDemandsByHospital } from 'queries'
import HospitalOption from 'components/HospitalOption'
import TaskOption from 'components/TaskOption'
import map from 'lodash/fp/map'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import { useMediaQuery, useTheme } from '@material-ui/core'

const AddVolunteerShiftDialog = ({
  onAdd,
  start,
  end,
  onClose,
  hospitalscount,
  open
}) => {

  const [hospitalId, setHospitalId] = useState(null)
  const [professionWithRequirements, setProfessionWithRequirements] = useState(null)

  const { data } = useQuery(filteredShiftData, {
    variables: { start, end },
  })

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // $(Query, { query: filteredHospitals, variables: { start, end } }, ({ data }) =>
  return $(Dialog, {
    open,
    fullScreen,
    onClose },
    $(DialogTitle, null, $(Box, { marginLeft: -1 }, 'Добавиться в смену')),
    professionWithRequirements
      ? $(ConfirmRequest, professionWithRequirements)
      : $(Fragment, null,
          !data && $(Box, { padding: 2 }, $(CircularProgress)),
          $(List, null,
            data &&
              $(ListSubheader, null, data.hospitals.length > 1  ? 'Выбрать больницу' : 'Больница'),
            data &&
              map(hospital =>
                HospitalOption({ onClick: () => setHospitalId(hospital.uid), ...hospital }),
              data.hospitals),
            data && hospitalId &&
              $(ListSubheader, null, 'Выберите задачу'),
            data && hospitalId &&
              // FIXME add loading
              $(Query, { query: periodDemandsByHospital, variables: { start, end, hospitalId }}, ({ data }) =>
                map(({ uid, profession, notabene }) => // FIXME non notabene
                  TaskOption({
                    onClick: () => notabene
                      ? setProfessionWithRequirements({
                          uid,
                          profession,
                          requirements: [
                            { uid: 'test', name: 'Медицинская книжка' },
                            { uid: 'test', name: 'Диаскин-тест' },
                            { uid: 'test', name: 'Трудовой договор с больницей' }]})
                      : onAdd(hospitalId, uid),
                    ...profession}),
                  data && data.period_demand)))),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      professionWithRequirements &&
        $(Button, { onClick: onClose }, 'Оставить заявку ')))
}

const ConfirmRequest = ({
  // profession,
  requirements,
}) =>
  $(Box, { padding: 2 },
    $(Typography, { paragraph: true }, 'Эта задача требуют наличия следующих документов, подтверждённых больницей:'),
    $(Typography, { paragraph: true, component: 'ul' },
      map(Requirement, requirements)),
    $(Typography, { paragraph: true }, 'Оставьте заявку, чтобы с вами связался координатор для оформления необходимых документов -- после вы сможете добавляться в смены на эту задачу'),
    $(Typography, { paragraph: true }, 'Пока идёт оформление, вы можете помочь в задчах не требующих документов'))

const Requirement = ({
  uid,
  name
}) =>
  $('li', { key: uid }, name)

export default AddVolunteerShiftDialog