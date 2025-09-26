'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import { getPaginatedPlayersQuery, getPlayersQuery } from '@nathy/web/client/queries/player'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'
import type { PlayerFormSchema } from '../config/schemas/player'

export async function getPlayers() {
  return sanityFetch<Player[]>({ query: getPlayersQuery })
}

export async function getPaginatedPlayers({
  offset,
  pageSize,
}: {
  offset: number
  pageSize: number
}): Promise<PaginatedPlayers> {
  return sanityFetch<PaginatedPlayers>({
    query: getPaginatedPlayersQuery,
    params: { offset, pageSize },
  })
}

export async function mutateCreatePlayer({
  name,
  avatar,
  favoritePosition,
  favoriteTeam,
}: PlayerFormSchema) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'create',
    doc: {
      _type: 'player',
      _id: v4(),
      avatarUrl: avatar,
      name,
      favoritePosition,
      favoriteTeam: { _ref: favoriteTeam?.id, _type: 'reference' },
    },
  })
}

export async function mutateUpdatePlayer(
  id: string,
  { name, avatar, favoritePosition, favoriteTeam }: PlayerFormSchema,
) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'patch',
    id,
    patchData: {
      avatarUrl: avatar,
      name,
      favoritePosition,
      favoriteTeam: { _ref: favoriteTeam?.id, _type: 'reference' },
    },
  })
}

export async function mutateDeletePlayer(id: string) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'delete',
    id,
  })
}
