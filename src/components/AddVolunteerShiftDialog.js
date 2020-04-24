import { createElement as $, useState, useEffect } from 'react'
import { useQuery } from '@apollo/react-hooks'
import { filteredShiftData } from 'queries'
import HospitalOption from 'components/HospitalOption'
import TaskOption from 'components/TaskOption'
import map from 'lodash/fp/map'

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

  const { data } = useQuery(filteredShiftData, {
    variables: { start, end, hospitalId },
    skip: !open
  })

  useEffect(() => {
    data && data.hospitals.length === 1 &&
      setHospitalId(data.hospitals[0].uid)
  }, [data])


  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))

  // $(Query, { query: filteredHospitals, variables: { start, end } }, ({ data }) =>
  return $(Dialog, {
    open,
    fullScreen,
    onClose },
    $(DialogTitle, null, $(Box, { marginLeft: -1 }, 'Добавиться в смену')),
    // $(DialogContent, null,
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
          map(({ uid, profession }) =>
            TaskOption({
              onClick: () => onAdd(hospitalId, uid),
              ...profession}),
            data.period_demand)),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена')))
}

export default AddVolunteerShiftDialog