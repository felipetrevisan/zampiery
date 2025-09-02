import type { Metadata } from 'next'
import { GroupedListView } from './_components'

export const metadata: Metadata = {
  title: 'List Games',
  description: 'List of games',
}

export default async function List() {
  return <GroupedListView />
}

