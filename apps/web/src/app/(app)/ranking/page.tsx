import type { Metadata } from 'next'
import { RankingList } from './_components'

export const metadata: Metadata = {
  title: 'Ranking',
  description: 'List of ranking players',
}

export default async function Ranking() {
  return <RankingList />
}

