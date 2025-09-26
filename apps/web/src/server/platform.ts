'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import { getPaginatedPlatformsQuery } from '@nathy/web/client/queries/game'
import type { PaginatedPlatforms, Platform } from '@nathy/web/types/platform'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'
import type { PlatformFormSchema } from '../config/schemas/platform'

export async function getPaginatedPlatforms({
  offset,
  pageSize,
}: {
  offset: number
  pageSize: number
}): Promise<PaginatedPlatforms> {
  return sanityFetch<PaginatedPlatforms>({
    query: getPaginatedPlatformsQuery,
    params: { offset, pageSize },
  })
}

export async function mutateCreatePlatform({ title }: PlatformFormSchema) {
  return sanityMutate<SanityDocumentStub<Platform>>({
    type: 'create',
    doc: {
      _type: 'game-platform',
      _id: v4(),
      title,
    },
  })
}

export async function mutateUpdatePlatform(id: string, { title }: PlatformFormSchema) {
  return sanityMutate<SanityDocumentStub<Platform>>({
    type: 'patch',
    id,
    patchData: {
      title,
    },
  })
}

export async function mutateDeletePlatform(id: string) {
  return sanityMutate<SanityDocumentStub<Platform>>({
    type: 'delete',
    id,
  })
}
