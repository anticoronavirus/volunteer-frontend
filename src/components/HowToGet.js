import { createElement as $, useState } from 'react'
import Markdown from 'components/Markdown'
import { useMutation } from '@apollo/react-hooks'
import { updateDirections } from 'queries'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import TextField from '@material-ui/core/TextField'
import IconButton from '@material-ui/core/IconButton'
import Edit from '@material-ui/icons/Edit'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import { styled } from '@material-ui/core/styles'

const HowToGet = ({
  uid,
  directions,
  editable
}) => {

  const [source, setSource] = useState(directions)
  const [editing, setEditing] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [mutate] = useMutation(updateDirections, { variables: { uid, directions: source }})

  return $(ExpansionPanel, { onChange: (event, value) => setExpanded(value) },
    $(ExpansionPanelSummary, null,
      $(Box, { flexGrow: 1 }, 'Как добраться'),
      editable && expanded &&
        $(IconButton, {
          size: 'small',
          onClick: event => event.stopPropagation() || setEditing(!editing)},
          $(editing ? RemoveRedEye : Edit, { fontSize: 'small'}))),
    $(ExpansionPanelDetails, null,
      $(Box, null,
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
        editable && source !== directions &&
          $(StyledBox, null, 
            $(Button, {
              color: 'primary',
              variant: 'contained',
              fullWidth: true,
              onClick: mutate
            }, 'Обновить')))))
}

const StyledBox = styled(Box)({
  position: 'sticky',
  bottom: 0
})

const Helper = styled(Typography)({
  padding: '4px 0',
})

export default HowToGet