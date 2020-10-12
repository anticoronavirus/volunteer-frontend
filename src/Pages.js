import { useMutation, useQuery } from '@apollo/react-hooks'
import Box from '@material-ui/core/Box'
import Paper from '@material-ui/core/Paper'
import { createElement as $ } from 'react'
import { Redirect } from 'react-router-dom'

import Back from 'components/Back'
import MarkdownWithPreview from 'components/MarkdownWithPreview'
import { page, updatePage } from 'queries'
import { useIsDesktop } from 'utils'

const Pages = ({
  match
}) => {

  const isDekstop = useIsDesktop()
  const { data } = useQuery(page, { variables: { name: match.params.page }})
  const [update] = useMutation(updatePage, {
    ignoreResults: true,
    update: (cache, { data }) =>
      cache.writeQuery({
        query: page,
        variables: { name: match.params.page },
        data: {
          page: data.insert_page.returning
        }
      })})
  return $(Box, isDekstop && { display: 'flex', padding: 2 },
    $(Back),
    data && data.page.length === 0 &&
      $(Redirect, { to: '/'}),
    $(Box, isDekstop && { margin: 'auto', marginTop: 2, width: '70ex' },
    $(Paper, null,
      data && data.page[0] &&
        $(Box, { padding: 2 },
          $(MarkdownWithPreview, {
            onChange: !data.me[0] || data.me[0].managedHospitals_aggregate.aggregate.count === 0
              ? null
              : content => update({ variables: { content, name: match.params.page },
                // optimisticResponse: {
                //   __typename: 'Mutation',
                //   insert_page: {
                //     __typename: 'page_mutation_response',
                //     returning: [{
                //       uid: Math.random,
                //       content,
                //       __typename: 'page'
                //     }]
                //   }
                // }
              }),
            content: data.page[0].content})))))
}

export default Pages