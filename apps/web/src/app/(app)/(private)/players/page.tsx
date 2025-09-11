import { getPaginatedPlayers } from '@nathy/web/server/player'
import type { Metadata } from 'next'
import { PlayersList } from './_components'

export const metadata: Metadata = {
  title: 'Players',
  description: 'List of players',
}

export default async function Players() {
  const data = await getPaginatedPlayers({ offset: 0, pageSize: 10 })

  return <PlayersList data={data} />
}
