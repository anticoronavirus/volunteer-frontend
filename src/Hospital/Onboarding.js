import { Accordion, AccordionDetails, AccordionSummary, Box, Button, List, Paper, styled, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import map from 'lodash/fp/map'
import { createElement as $, useContext } from 'react'

import HospitalContext from './HospitalContext'

const Onboarding = () => {

  const { hospitalId } = useContext(HospitalContext)
  const checksDone = true

  return checksDone
    ? $(AwaitingInstructions, { hospitalId })
    : $(WelcomeScreen)
}

const WelcomeScreen = () => {
  const requirements = [{
    name: 'Анализ на ВИЧ', 
    description: 'В местной поликлинике'
  }, {
    name: 'Флюрография',
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на ADC (Дифтерия)', 
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на Гепатит ',
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на Корь', 
    description: 'В местной поликлинике'
  }, {
    name: 'Анализ на COVID-19 (антитела)',
    description: 'В местной поликлинике'
  }, {
    name: 'Инструктаж',
    description: 'В больнице, после прохождения анализов'
  }]
  return $(Box, { maxWidth: 480 }, 
    $(Box, { padding: '16px 16px 0 16px' },
      $(Typography, { variant: 'body2' }, 
        'Чтобы начать помогать в этой больнице вам необходимо пройти следующие этапы')),
    $(List, null, 
      map(Requirement, requirements)),
    $(Box, { padding: '0 16px 16px 16px' },
      $(Typography, { variant: 'body2', paragraph: true }, 
        'После сдачи анализов вы можете оставить заявку на инструктаж'),
      $(Button, { variant: 'contained' }, 'Я сдал\\а анализы')))
}

const AwaitingInstructions = () => {
  return $(Box, { maxWidth: 480 },
    $(Paper, null,
      $(CustomImage, { src: 'https://image.freepik.com/free-vector/doctors-team-medical-staff-doctor-nurse-group-medics-illustration-flat-style_213307-3.jpg' }),
      $(Box, { padding: 2 },
        $(Typography, { variant: 'body2' }, 
          'Координатор свяжется с вами по телефону +79652661058 чтобы провести инструктаж'))))
}

const CustomImage = styled('img')(({
  theme
}) => ({
  width: '100%',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius
}))

const Requirement = ({
  name,
  description
}) =>
  $(Accordion, { key: name },
    $(AccordionSummary, { expandIcon: $(ExpandMore)},
      $(Typography, null, name)),
    $(AccordionDetails, null,
      $(Typography, null, description)))

export default Onboarding