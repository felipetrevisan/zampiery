import type { SanityAsset } from '@nathy/web/types/assets'
import type { GroupedList } from './grouped-list'

export type Platform = {
  id: string
  title: string
  slug: string
  logo?: SanityAsset
  lists?: GroupedList[]
}

export type PaginatedPlatforms = {
  data: Platform[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
}

export type PaginatedPlatformListByPlatform = {
  data: GroupedList[]
  total: number
  page: number
  pageSize: number
  nextOffset: number
  hasNextPage: boolean
} & Omit<Platform, 'lists'>
