import z from 'zod'
import type { Player } from './player'

export type Attendance = 'indeterminate' | 'present' | 'absent'

export type Game = {
  id: string
  date: string
  played: boolean
  players: Players
  slug: string
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

export const gameFormSchema = z.object({
  date: z.date(),
  player: z.object({
    home: z.object({
      player: z.object({
        id: z.string().min(1, 'O jogador da casa é obrigatório'),
        name: z.string().min(1, 'O jogador da casa é obrigatório'),
      }),
      score: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().finite().optional(),
      ),
    }),
    guest: z.object({
       player: z.object({
        id: z.string().min(1, 'O jogador visitante é obrigatório'),
        name: z.string().min(1, 'O jogador visitante é obrigatório'),
      }),
      score: z.preprocess(
        (val) => (val === '' ? undefined : Number(val)),
        z.number().finite().optional(),
      ),
    }),
  }),
})