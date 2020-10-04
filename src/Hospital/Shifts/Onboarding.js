import { useMutation } from '@apollo/react-hooks'
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, List, Paper, styled, Typography } from '@material-ui/core'
import { ExpandMore } from '@material-ui/icons'
import every from 'lodash/fp/every'
import map from 'lodash/fp/map'
import reject from 'lodash/fp/reject'
import { createElement as $, useContext } from 'react'

import RequirementIcon from 'components/RequirementIcon'
import { confirmRequirements } from 'queries'

import HospitalContext from '../HospitalContext'

const Onboarding = ({
  hospital_profession_requirement
}) => {

  // FIXME should detect private requirements without UID
  const noInstructions = reject(['requirement.uid', '1b113f79-fc2e-4a04-81df-42e99bd02d46'], hospital_profession_requirement)
  const checksDone = every('is_satisfied', noInstructions)

  return checksDone
    ? $(AwaitingInstructions)
    : $(WelcomeScreen, { hospital_profession_requirement: noInstructions })
}

const WelcomeScreen = ({
  hospital_profession_requirement
}) => {

  const { me, hospitalId } = useContext(HospitalContext)

  const [mutate] = useMutation(confirmRequirements, { variables: {
    professionRequest: {
      hospital_id: hospitalId,
      // FIXME should make default profession
      profession_id: 'e35f82bb-de1f-48c3-a688-a4c66e64686c'
    },
    requirements: map(({ requirement }) => ({
      hospital_id: hospitalId,
      volunteer_id: me.uid,
      requirement_id: requirement.uid
    }), reject({ is_satisfied: true }, hospital_profession_requirement))
  }})

  return $(Box, { maxWidth: 480 }, 
    $(Box, { padding: '16px 16px 0 16px' },
      $(Typography, { variant: 'body2' }, 
        'Чтобы начать помогать в этой больнице вам необходимо пройти следующие этапы')),
    $(List, null, 
      map(Requirement, hospital_profession_requirement)),
    $(Box, { padding: '0 16px 16px 16px' },
      $(Typography, { variant: 'body2', paragraph: true }, 
        'После сдачи анализов вы можете оставить заявку на инструктаж'),
      $(Button, {
        variant: 'contained',
        onClick: mutate },
        'Я сдал\\а анализы')))
}

const AwaitingInstructions = () =>
  $(Box, { maxWidth: 480 },
    $(Paper, null,
      $(CustomImage, { src: 'https://image.freepik.com/free-vector/doctors-team-medical-staff-doctor-nurse-group-medics-illustration-flat-style_213307-3.jpg' }),
      $(Box, { padding: 2 },
        $(Typography, { variant: 'body2' }, 
          // FIXME add phone
          'Координатор свяжется с вами по телефону +79652661058 чтобы провести инструктаж'))))

const CustomImage = styled('img')(({
  theme
}) => ({
  width: '100%',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderTopRightRadius: theme.shape.borderRadius
}))

const Requirement = ({
  requirement,
  is_satisfied
}) =>
  $(Accordion, { key: requirement.name },
    $(AccordionSummary, { expandIcon: $(ExpandMore)},
      $(RequirementIcon, { requirement, satisfied: is_satisfied })),
    $(AccordionDetails, null,
      $(Typography, { variant: 'body2' }, requirement.description)))

export default Onboarding