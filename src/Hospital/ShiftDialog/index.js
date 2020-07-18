import { createElement as $, Fragment, useContext, useState } from 'react'
import { useIsDesktop, formatJustLabel } from 'utils'
import Professions from './Professions'
import Description from './Description'
import Requirements from './Requirements'
import SelectTime from './SelectTime'
import HospitalContext from '../HospitalContext'
import RepeatingDays from './RepeatingDays'
import Counter from './Counter'
import SelectInterval from './SelectInterval'
// import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import Button from '@material-ui/core/Button'
import { styled } from '@material-ui/core/styles'

const currentDay = 2 ** ((new Date().getDay() || 7) - 1)

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
  const [profession, setProfession] = useState(values.profession)
  const [demand, setDemand] = useState(values.demand || 1)
  const [notabene, setNotabene] = useState(values.notabene || '')
  const [requirements, setRequirements] = useState(values.requirements)
  const { hospitalId } = useContext(HospitalContext)
  const [repeats, setRepeats] = useState(null)
  const [repeatOn, setRepeatOn] = useState(values.repeatOn)

  return $(Dialog, {
    open,
    onClose,
    fullWidth: true,
    scroll: 'paper',
    fullScreen: !fullScreen
  },
    $(DialogTitle, null, isEditing
      ? 'Редактирование смены'
      : 'Добавление смены'),
    $(DialogContent, { dividers: true },
      $(Container, null,
        $(Professions, {
          selected: profession,
          onChange: setProfession
        }),
        profession && $(Fragment, null,
          $(Description, {
            value: notabene,
            placeholder: profession.description,
            onChange: setNotabene
          }),
          $(Requirements, {
            professionId: profession.id,
            hospitalId,
            value: requirements,
            onChange: setRequirements
          }),
          $(Counter, {
            label: 'Количество волонтёров',
            value: demand,
            onChange: setDemand
          }),
          $(SelectTime, {
            onChange: () => { },
          }),
          $(SelectInterval, {
            value: repeats,
            onChange: value => {
              setRepeats(value)
              setRepeatOn(value === 'daily'
                ? 1
                : currentDay
              )
            }
          }),
          repeats && (
            repeats === 'daily'
              ? $(Counter, {
                label: `Повторять ${formatJustLabel('each', repeatOn)}`,
                format: 'day',
                value: repeatOn,
                onChange: setRepeatOn
              })
              : $(RepeatingDays, { value: repeatOn, onChange: setRepeatOn }))))),
    $(DialogActions, null,
      $(Button, { onClick: onClose }, 'Отмена'),
      start && end && profession &&
      $(Button, {
        onClick: () => {
          console.log(
            {
              start: `${start}:00+0300`,
              end: `${end}:00+0300`,
              demand,
              notabene,
              requirements,
              profession_id: profession.uid,
              repeats,
              repeatOn
            }
          )
        }
      }, isEditing
        ? 'Сохранить'
        : 'Добавить')
    ))
}

const Container = styled('div')({
  '& > *': {
    marginTop: 24
  }
})
