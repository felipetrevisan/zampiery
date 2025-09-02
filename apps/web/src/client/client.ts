import { env } from '@nathy/web/config/env'
import { createClient } from 'next-sanity'

export const client = createClient({
  apiVersion: '2024-03-17',
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  useCdn: true,
  perspective: 'published',
  stega: {
    studioUrl: '/studio',
    logger: console,
    filter: (props) => {
      if (props.sourcePath.at(-1) === 'title') {
        return true
      }

      return props.filterDefault(props)
    },
  },
})
