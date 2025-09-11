import { getPaginatedGroupedList } from '@nathy/web/server/grouped-list'
import type { Metadata } from 'next'
import { GroupedListView } from './_components'

export const metadata: Metadata = {
  title: 'Games List',
  description: 'List of games',
}

export default async function List() {
  const data = await getPaginatedGroupedList({ offset: 0, pageSize: 10 })

  return <GroupedListView data={data} />
}
