import type { Game } from './game'

export type PaginatedGroupedList = {
  data: GroupedList[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
}

export type GroupedList = {
  id: string
  title: string
  slug: string
  games: Game[]
}

export type PaginatedSingleGroupedList = {
  data: Game[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
} & Omit<GroupedList, 'games'>
