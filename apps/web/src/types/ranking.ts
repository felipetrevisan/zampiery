import type { Player } from './player'

export type PaginatedRanking = {
  data: Ranking[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
}

export type Ranking = {
  id: string
  title: string
  slug: string
  players: Player[]
  playersCount?: number
}

export type PaginatedSingleRanking = {
  data: Player[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
} & Ranking
