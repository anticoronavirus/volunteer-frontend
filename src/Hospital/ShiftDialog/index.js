import { createElement as $, Fragment, useContext, useState, useRef, useEffect } from 'react'
import { useIsDesktop } from 'utils'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import Professions from './Professions'
import Description from './Description'
import Requirements from './Requirements'
import get from 'lodash/get'
import HospitalContext from '../HospitalContext'

export const HospitalShift = ({
  isEditing,
  open,
  onClose,
  onSubmit,
  ...values
}) => {
  const fullScreen = useIsDesktop()
  const [start, setStart] = useState(values.start ? parseInt(values.start.slice(0, 2)) : undefined)
  const [end, setEnd] = useState(values.end ? parseInt(values.end.slice(0, 2)) : undefined)
  const [professionId, setProfessionId] = useState(get(values, 'profession.uid', ''))
  const [demand, setDemand] = useState(values.demand || 1)
  const [notabene, setNotabene] = useState(values.notabene || '')
  const { hospitalId } = useContext(HospitalContext)

  return $(Dialog, {
    open,
    onClose,
    scroll: 'paper',
    fullScreen: !fullScreen
  },
    $(DialogTitle, null, isEditing
      ? 'Редактирование смены'
      : 'Добавление смены'),
    $(DialogContent, { dividers: true },
      $('div', null,
        $(Professions, {
          selected: professionId,
          onChange: profession => {
            setProfessionId(profession.uid)
            setNotabene(profession.description)
          }
        })),
        professionId && $(Description, { text: notabene, onChange: setNotabene }),
        professionId && $(Requirements, { professionId, hospitalId })
      ),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      start && end && professionId && 'Сохранить'
        // $(Button, { onClick: () => onSubmit({
        //   start: `${start}:00+0300`,
        //   end: `${end}:00+0300`,
        //   demand,
        //   notabene,
        //   profession_id: professionId
        // }) }, isEditing
        //   ? 'Сохранить'
        //   : 'Добавить')
        ))
}
