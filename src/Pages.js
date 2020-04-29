import { createElement as $ } from 'react'
import Back from 'components/Back'
import { useMediaQuery, useTheme } from '@material-ui/core'
import { Redirect } from 'react-router-dom'

import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Box from '@material-ui/core/Box'

const Pages = ({
  match
}) => {

  const theme = useTheme()
  const notMobile = useMediaQuery(theme.breakpoints.up('sm'))

  return $(Box, notMobile && { display: 'flex', padding: 2 },
  $(Back),
  !texts[match.params.page]
    && $(Redirect, { to: '/'}),
  $(Box, { margin: 'auto', marginTop: 2, maxWidth: '80ex' },
  $(Paper, null,
    $(Box, { padding: 2 },
      $(Typography, { variant: 'body1', style: { whiteSpace: 'pre-line'}},
        texts[match.params.page]))))) // FIXME move to database
}


const texts = {
  coordinators: `
Уважаемые сотрудники больниц города Москвы!
Данный сайт разработан командой Memedic на волонтерских началах, чтобы сделать процесс записи волонтеров в Москве удобным и организованным. 
Наша команда готова предоставить аккаунты любой больнице, принимающей пациентов с коронавирусной инфекцией. 
В аккаунте больницы Вы сможете задать для Вашей больницы расписание волонтерских смен и необходимое число волонтеров, а также отслеживать в режиме онлайн записавшихся и их контактные данные.
Данные волонтеров на сайте полностью защищены.
`,
  volunteers: `
Уважаемые волонтеры! 
На данном сайте вы можете записаться в качестве волонтера в больницы г. Москвы, оказывающие помощь пациентам, зараженным коронавирусной инфекцией. 

К работе волонтерами привлекаются, как люди с медицинским образованием, так и без него. 

Для того чтобы стать волонтером Вам необходимо:
  1. Войти на сайт 
  2. Заполнить в своем профиле необходимые данные
  3. Посмотреть актуальные расписания больниц и выбрать удобные Вам смены (одним кликом на ячейку смены, вторым кликом вы можете убрать запись на смену) 
  4. Дождаться подтверждения координатора из больницы (координатор больницы свяжется с Вами по телефону, а также подтвердит в вашем профиле смену) 

По всем вопросам вы можете писать на email: help@memedic.ru`
}

export default Pages