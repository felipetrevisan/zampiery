import type { Player } from '@nathy/web/types/player'

export type Formation = {
  id: string
  title: string
  positions: Position[]
}

export type Position = {
  id: string
  x: number
  y: number
  player?: Pick<Player, "id" | "name" | "avatar">,
  role?: string
}
