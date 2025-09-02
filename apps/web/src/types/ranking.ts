import type { Player } from './player'

export type Ranking = {
  id: string
  title: string
  slug: string
  players: Player[]
  playersCount: number
}
