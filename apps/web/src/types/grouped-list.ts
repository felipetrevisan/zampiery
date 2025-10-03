import type { Club } from '@nathy/web/types/club'
import type { Game } from './game'
import type { Platform } from './platform'

export type GroupedList = {
  id: string
  title: string
  slug: string
  platform: Platform
  isClub?: boolean
  clubs?: Club
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
