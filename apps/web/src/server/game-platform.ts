'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { getPlatformsPaginatedListByPlatformQuery, getPlatformsQuery } from '../client/queries/game'
import type { PaginatedPlatformListByPlatform, Platform } from '../types/platform'

export async function getPlatforms() {
  return sanityFetch<Platform[]>({ query: getPlatformsQuery })
}

export async function getPaginatedPlatformListByPlatform({
  offset,
  pageSize,
  platform,
}: {
  offset: number
  pageSize: number
  platform: string
}): Promise<PaginatedPlatformListByPlatform> {
  return sanityFetch<PaginatedPlatformListByPlatform>({
    query: getPlatformsPaginatedListByPlatformQuery,
    params: { offset, pageSize, slug: platform },
  })
}
