import type { Player } from './player'

export type Attendance = 'indeterminate' | 'present' | 'absent'
export type GameStatus = 'none' | 'played' | 'cancelled'

export type Game = {
  id: string
  date: string
  played: boolean
  cancelled: boolean
  players: Players
}

export type Players = {
  guest: {
    player: Pick<Player, 'id' | 'name'>
    score?: number
    attendance?: boolean
  }
  home: {
    player: Pick<Player, 'id' | 'name'>
    score?: number
    attendance?: boolean
  }
}
