import { getPaginatedRankingList } from '@nathy/web/server/ranking'
import type { Metadata } from 'next'
import { RankingList } from './_components'

export const metadata: Metadata = {
  title: 'Ranking',
  description: 'List of ranking players',
}

export default async function Page() {
  const data = await getPaginatedRankingList({ offset: 0, pageSize: 10 })

  return <RankingList data={data} />
}
