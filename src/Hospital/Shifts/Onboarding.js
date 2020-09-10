import { Accordion, AccordionDetails, AccordionSummary, Box, Button, List, Paper, styled, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import map from 'lodash/fp/map'
import { createElement as $, useState } from 'react'

const Onboarding = ({
  setRequirementsSatisfied,
  hospital_profession_requirement
}) => {

  // const checksDone = true FIXME should check all but instruzionne
  const [checksDone, setChecksDone] = useState(false)

  return checksDone
    ? $(AwaitingInstructions, { setRequirementsSatisfied })
    : $(WelcomeScreen, { hospital_profession_requirement, setChecksDone })
}

const WelcomeScreen = ({
  hospital_profession_requirement,
  setChecksDone
}) =>
  $(Box, { maxWidth: 480 }, 
    $(Box, { padding: '16px 16px 0 16px' },
      $(Typography, { variant: 'body2' }, 
        'Чтобы начать помогать в этой больнице вам необходимо пройти следующие этапы')),
    $(List, null, 
      map(Requirement, hospital_profession_requirement)),
    $(Box, { padding: '0 16px 16px 16px' },
      $(Typography, { variant: 'body2', paragraph: true }, 
        'После сдачи анализов вы можете оставить заявку на инструктаж'),
      $(Button, { variant: 'contained', onClick: () => setChecksDone(true) }, 'Я сдал\\а анализы')))

const AwaitingInstructions = ({ setRequirementsSatisfied }) => {
  return $(Box, { maxWidth: 480 },
    $(Paper, null,
      $(CustomImage, { src: 'https://image.freepik.com/free-vector/doctors-team-medical-staff-doctor-nurse-group-medics-illustration-flat-style_213307-3.jpg' }),
      $(Box, { padding: 2 },
        $(Typography, { variant: 'body2' }, 
          // FIXME add phone
          'Координатор свяжется с вами по телефону +79652661058 чтобы провести инструктаж'),
        $(Box, { padding: 1 }),
        $(Button, { variant: 'contained', onClick: () => setRequirementsSatisfied(true) }, 'Подтвердить'))))
}

const CustomImage = styled('img')(({
  theme
}) => ({
  width: '100%',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius
}))

const Requirement = ({
  requirement: {
    name,
    description
  }
}) =>
  $(Accordion, { key: name },
    $(AccordionSummary, { expandIcon: $(ExpandMore)},
      $(Typography, { variant: 'body2' }, name)),
    $(AccordionDetails, null,
      $(Typography, { variant: 'body2' }, description)))

export default Onboarding