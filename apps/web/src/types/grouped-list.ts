import type { Game } from './game'

export type GroupedList = {
  id: string
  title: string
  slug: string
  games: Game[]
}
