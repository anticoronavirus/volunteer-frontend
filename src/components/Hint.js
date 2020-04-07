import { createElement as $ } from 'react'
import { Mutation } from '@apollo/react-components'
import { useQuery } from '@apollo/react-hooks'
import { hint, seenHint } from 'queries'

import Box from '@material-ui/core/Box'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const Hint = ({ name, className }) => {
  const { data } = useQuery(hint, { variables: { name } })
  return !data || !data.hint || !data.hint.length || !data.me.length
    ? null
    : $(Box, { className },
        $(Typography, { variant: 'body2' }, data.hint[0].text),
        $(Box, { marginLeft: -1.5  },
          $(Mutation, {
            mutation: seenHint,
            optimisticResponse: {
              insert_seen_hint:{
                affected_rows: 1,
                __typename: 'seen_hint_mutation_response'
              }
            },
            update: cache =>
              cache.writeQuery({
                query: hint,
                variables: { name },
                data: { ...data, hint: null },
              }),
            variables: { userId: data.me[0].uid, hintId: data.hint[0].uid }
          }, mutate => 
            $(Button, { onClick: mutate },
            'Окей'))))
}


export default Hint