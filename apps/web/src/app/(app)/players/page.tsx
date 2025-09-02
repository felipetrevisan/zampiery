import type { Metadata } from 'next'
import { PlayersList } from './_components'

export const metadata: Metadata = {
  title: 'Players',
  description: 'List of players',
}

export default async function Players() {
  return <PlayersList />
}
