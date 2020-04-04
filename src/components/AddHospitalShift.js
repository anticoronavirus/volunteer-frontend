import { createElement as $, Fragment, useState } from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Add from '@material-ui/icons/Add'

const AddHospitalShift = () => {
  const [open, setOpen] = useState(false)
  return $(Fragment, null,
    $(Dialog, { open, onClose: () => setOpen(false) },
      $(DialogTitle, null, 'Новая смена'),
      $(DialogContent, null, 
        'test'),
      $(DialogActions, null,
        $(Button, { onClick: console.log}, 'Добавить'))),
    $(ListItem, { button: true, onClick: () => setOpen(true) },
      $(ListItemIcon, null,
        $(Add)),
      $(ListItemText, {
        primary: 'Добавить смену'
      })))
}

export default AddHospitalShift