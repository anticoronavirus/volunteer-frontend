import { createElement as $, useState } from 'react'
import Markdown from 'components/Markdown'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import TextField from '@material-ui/core/TextField'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import { useMutation } from '@apollo/react-hooks'
import { updateDirections } from 'queries'

const HowToGet = ({ uid, directions }) => {

  const [source, setSource] = useState(directions)
  const [tab, setTab] = useState('edit')
  const [mutate] = useMutation(updateDirections, { variables: { uid, directions: source }})

  return $(ExpansionPanel, null,
    $(ExpansionPanelSummary, null, 'Как добраться'),
    $(ExpansionPanelDetails, null,
      $(Box, null,
        $(Tabs, { value: tab, onChange: (event, value) => setTab(value) },
          $(Tab, { value: 'edit', label: 'Редактирование' }),
          $(Tab, { value: 'preview', label: 'Просмотр' })),
        tab === 'edit'
          ? $(TextField, {
              multiline: true,
              fullWidth: true,
              onChange: event => setSource(event.target.value),
              value: source
            })
          : $(Markdown, { source }),
        $(Box, { height: 24 }),
        $(Button, {
          variant: 'outlined',
          fullWidth: true,
          disabled: source === directions,
          onClick: mutate
        }, 'Обновить'))))
}

export default HowToGet