import { createElement as $, useState, Fragment } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { Query, Mutation } from '@apollo/react-components'
import {
  filteredHospitals,
  filteredHospitalProfessions,
  addProfessionRequest
} from 'queries'
import HospitalOption from 'components/HospitalOption'
import TaskOption from 'components/TaskOption'
import map from 'lodash/fp/map'
import { useSnackbar } from 'notistack'
import { useIsDesktop } from 'utils'
import {
  useQueryParam,
  StringParam,
} from 'use-query-params'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Box from '@material-ui/core/Box'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'

const AddVolunteerShiftDialog = ({
  onAdd,
  start,
  end,
  onClose,
  userId,
  hospitalscount,
  open
}) => {
  
  const [queryParamHospitalId] = useQueryParam('hospital', StringParam)
  const [hospitalId, setHospitalId] = useState(queryParamHospitalId)
  const [professionWithRequirements, setProfessionWithRequirements] = useState(null)
  const { enqueueSnackbar } = useSnackbar()

  const { data } = useQuery(filteredHospitals, {
    variables: { start, end },
    skip: !open
  })

  const isDekstop = useIsDesktop()

  // $(Query, { query: filteredHospitals, variables: { start, end } }, ({ data }) =>
  return $(Dialog, {
    open,
    fullScreen: !isDekstop,
    onClose },
    $(DialogTitle, null, $(Box, { marginLeft: -1 }, 'Добавиться в смену')),
    professionWithRequirements
      ? $(ConfirmRequest, professionWithRequirements)
      : $(Fragment, null,
          !data && $(Box, { padding: 2 }, $(CircularProgress)),
          $(Box, { width: 480 }), // Required for the dialog to be full width
          $(List, null,
            data &&
              $(ListSubheader, null, data.hospitals.length > 1  ? 'Выбрать больницу' : 'Больница'),
            data &&
              map(hospital =>
                HospitalOption({
                  onClick: () => setHospitalId(hospital.uid),
                  selected: hospital.uid === hospitalId,
                  ...hospital }),
              data.hospitals),
            data && hospitalId &&
              $(ListSubheader, null, 'Выберите задачу'),
            data && hospitalId &&
              // FIXME add loading
              $(Query, { query: filteredHospitalProfessions, variables: { start, end, hospitalId }}, ({ data, loading }) =>
                loading
                  ? $(Box, { padding: 2 }, $(CircularProgress))
                  : map(profession =>
                      TaskOption({
                        onClick: () => profession.requirements.length > 0
                          ? setProfessionWithRequirements(profession)
                          : onAdd(hospitalId, profession.uid),
                        ...profession}),
                      data.professions)))),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      professionWithRequirements &&
        $(Mutation, {
          mutation: addProfessionRequest,
          variables: {
            hospitalId,
            userId,
            professionId: professionWithRequirements.uid
          }}, mutate =>
          $(Button, { onClick: () => {
            mutate()
            enqueueSnackbar('Вы можете отследить статус заявки в своём профиле')
            onClose()
          } }, 'Оставить заявку '))))
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
  requirement
}) =>
  $('li', { key: uid }, requirement.name)

export default AddVolunteerShiftDialog