'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import {
  getPaginatedRankingListBySlugQuery,
  getPaginatedRankingListsQuery,
  getRankingListBySlugQuery,
  getRankingListsQuery,
} from '@nathy/web/client/queries/ranking-list'
import type { Player } from '@nathy/web/types/player'
import type { PaginatedRanking, PaginatedSingleRanking, Ranking } from '@nathy/web/types/ranking'
import { generateSlug } from '@nathy/web/utils/url'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'
import { getClient } from '../config/sanity'

export async function getRankingList() {
  return sanityFetch<Ranking[]>({ query: getRankingListsQuery })
}

export async function getPaginatedRankingList({
  offset,
  pageSize,
}: {
  offset: number
  pageSize: number
}): Promise<PaginatedRanking> {
  return sanityFetch<PaginatedRanking>({
    query: getPaginatedRankingListsQuery,
    params: { offset, pageSize },
  })
}

export async function getRankingListBySlug(slug: string) {
  return sanityFetch<Ranking>({ query: getRankingListBySlugQuery, params: { slug } })
}

export async function getPaginatedRankingListBySlug({
  offset,
  pageSize,
  slug,
}: {
  offset: number
  pageSize: number
  slug: string
}): Promise<PaginatedSingleRanking> {
  return sanityFetch<PaginatedSingleRanking>({
    query: getPaginatedRankingListBySlugQuery,
    params: { offset, pageSize, slug },
  })
}

export async function mutateCreateRanking({
  title,
}: Omit<Ranking, 'id' | 'players' | 'slug' | 'total'>) {
  return sanityMutate<SanityDocumentStub<Ranking>>({
    type: 'create',
    doc: {
      _type: 'ranking-list',
      _id: v4(),
      title,
      slug: { _type: 'slug', current: generateSlug(title) },
      players: [],
    },
  })
}

export async function mutateUpdateRanking(
  id: string,
  { title }: Omit<Ranking, 'id' | 'players' | 'slug' | 'total'>,
) {
  return sanityMutate<SanityDocumentStub<Ranking>>({
    type: 'patch',
    id,
    patchData: {
      title,
      slug: { _type: 'slug', current: generateSlug(title) },
    },
  })
}

export async function mutateDeleteRanking(id: string) {
  return sanityMutate<SanityDocumentStub<Ranking>>({
    type: 'delete',
    id,
  })
}

export async function mutateAddPersonToRanking({
  ranking,
  player,
}: {
  ranking: Ranking
  player: Pick<Player, 'id'>
}) {
  return getClient('write')
    .patch(ranking.id)
    .setIfMissing({ players: [] })
    .insert('after', 'players[-1]', [
      {
        _key: v4(),
        _type: 'reference',
        _ref: player.id,
      },
    ])
    .commit()
}

export async function mutateDeletePersonFromRanking({
  ranking,
  playerId,
}: {
  ranking: Ranking
  playerId: string
}) {
  return getClient('write')
    .patch(ranking.id)
    .unset([`players[_ref=="${playerId}"]`])
    .commit()
}

export async function mutateUpdateOrder({
  ranking,
  newPlayerPosition,
}: {
  ranking: Ranking
  newPlayerPosition: Player[]
}) {
  return getClient('write')
    .patch(ranking.id)
    .setIfMissing({ players: [] })
    .set({
      players: newPlayerPosition.map((player) => ({
        _type: 'reference',
        _key: player.key ?? v4(),
        _ref: player.id,
      })),
    })
    .commit({ autoGenerateArrayKeys: true })
}
