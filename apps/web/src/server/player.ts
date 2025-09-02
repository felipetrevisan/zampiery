'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import { getPlayersQuery } from '@nathy/web/client/queries'
import type { Player } from '@nathy/web/types/player'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'

export async function getPlayers() {
  return sanityFetch<Player[]>({ query: getPlayersQuery })
}

export async function mutateCreatePlayer({ name, favoritePosition, favoriteTeam }: Omit<Player, 'id'>) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'create',
    doc: {
      _type: 'player',
      _id: v4(),
      name,
      favoritePosition,
      favoriteTeam,
    }
  })
}

export async function mutateUpdatePlayer(
  id: string,
  { name, favoritePosition, favoriteTeam }: Omit<Player, 'id'>,
) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'patch',
    id,
    patchData: {
      name,
      favoritePosition,
      favoriteTeam
    },
  })
}

export async function mutateDeletePlayer(id: string) {
  return sanityMutate<SanityDocumentStub<Player>>({
    type: 'delete',
    id
  })
}
