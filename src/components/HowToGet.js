import { createElement as $, useState } from 'react'
import Markdown from 'components/Markdown'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { useMutation } from '@apollo/react-hooks'
import { updateDirections } from 'queries'

const HowToGet = ({ uid, directions }) => {

  const [source, setSource] = useState(directions)
  const [mutate] = useMutation(updateDirections, { variables: { uid, directions: source }})

  return $(Box, { padding: 2 },
    $(TextField, {
      label: 'Как добраться',
      multiline: true,
      fullWidth: true,
      onChange: event => setSource(event.target.value),
      value: source
    }),
    $(Button, { fullWidth: true, onClick: mutate }, 'Обновить'),
    $(Markdown, { source }))
}

export default HowToGet