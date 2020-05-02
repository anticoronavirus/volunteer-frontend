import { createElement as $, useState, useEffect } from 'react'
import Markdown from './Markdown'
import noop from 'lodash/fp/noop'

import Box from '@material-ui/core/Box'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
// import Typography from '@material-ui/core/Typography'
// import CircularProgress from '@material-ui/core/CircularProgress'
// import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import Edit from '@material-ui/icons/Edit'
import RemoveRedEye from '@material-ui/icons/RemoveRedEye'
import { styled } from '@material-ui/core/styles'

const MarkdownWithPreview = ({
  content,
  onChange
}) => {
  const [editing, setEditing] = useState(false)
  const [source, setSource] = useState(content)
  useEffect(() => setSource(content) || noop, [content])
  return $(Box, null,
    onChange &&
      $(Box, {
        position: 'sticky',
        top: 16,
        zIndex: 2,
        height: 36.4,
        display: 'flex',
        justifyContent: 'flex-end'
      },
        $(StyledButtonGroup, { color: 'primary', variant: 'contained' }, 
          source !== content &&
            $(Button, {
              onClick: () => onChange(source)}, 'Сохранить'),
          $(Button, { onClick: () => setEditing(!editing) },
            editing
              ? $(RemoveRedEye, { fontSize: 'small' })
              : $(Edit, { fontSize: 'small' })))),
    onChange && !editing &&
      $(Box, { height: 19 }),
    editing
      ? $(TextField, {
          multiline: true,
          fullWidth: true,
          label: 'Редактирование',
          onChange: event => setSource(event.target.value),
          value: source })
      : $(Markdown, { source }))
}

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper
}))

export default MarkdownWithPreview