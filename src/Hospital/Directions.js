import { createElement as $, useState, useEffect, useContext } from 'react'
import HospitalContext from './HospitalContext'
import Markdown from 'components/Markdown'
import { useQuery, useMutation } from '@apollo/react-hooks'
import { directions, updateDirections } from 'queries'
import noop from 'lodash/fp/noop'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Edit from '@material-ui/icons/Edit'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import { styled } from '@material-ui/core/styles'

const Directions = () => {

  const { hospitalId, isManagedByMe } = useContext(HospitalContext)
  const { data } = useQuery(directions, { variables: { hospitalId }})
  const [source, setSource] = useState()
  const [editing, setEditing] = useState(false)
  const [mutate] = useMutation(updateDirections, { variables: { hospitalId, directions: source }})
  
  useEffect(() => {
    data &&
      setSource(data.hospital.directions)
    return noop
  }, [data])

  return !data
    ? $(CircularProgress)
    : !(data.hospital.directions || isManagedByMe)
      ? null
      : $(Box, { flexGrow: 1 },
          isManagedByMe &&
            $(Box, { padding: 2 }, 
              $(IconButton, {
                size: 'small',
                onClick: event => event.stopPropagation() || setEditing(!editing)},
                $(editing ? RemoveRedEye : Edit, { fontSize: 'small'}))),
          $(Box, { padding: 2 },
            editing
              ? $(TextField, {
                  multiline: true,
                  fullWidth: true,
                  label: 'Редактирование',
                  onChange: event => setSource(event.target.value),
                  value: source
                })
              : source
                ? $(Markdown, { source })
                : $(Helper, { variant: 'body1' },
                    'Добавьте данные нажав на иконку редактирования'),
            $(Box, { height: 24 }),
            isManagedByMe && source !== data.hospital.directions &&
              $(StyledBox, null, 
                $(Button, {
                  color: 'primary',
                  variant: 'contained',
                  fullWidth: true,
                  onClick: mutate
                }, 'Обновить'))))
}

const StyledBox = styled(Box)({
  position: 'sticky',
  bottom: 0
})

const Helper = styled(Typography)({
  padding: '4px 0',
})


export default Directions