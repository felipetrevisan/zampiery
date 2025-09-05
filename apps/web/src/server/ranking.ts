'use server'

import { client } from '@nathy/web/client/client'
import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import {
  getLastRankingListRankQuery,
  getPaginatedRankingListBySlugQuery,
  getPaginatedRankingListsQuery,
  getRankingListBySlugQuery,
  getRankingListsQuery,
} from '@nathy/web/client/queries'
import { env } from '@nathy/web/config/env'
import type { Player } from '@nathy/web/types/player'
import type { PaginatedRanking, PaginatedSingleRanking, Ranking } from '@nathy/web/types/ranking'
import { generateSlug } from '@nathy/web/utils/url'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'

const getClient = () => client.withConfig({ token: env.SANITY_API_WRITE_TOKEN, useCdn: false })

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

export async function getRankingListOrderRank() {
  return sanityFetch<string>({ query: getLastRankingListRankQuery })
}

export async function mutateCreateRanking({
  title,
}: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'>) {
  // const compareRank = lastRankOrder ? LexoRank.parse(lastRankOrder) : LexoRank.min()
  // const rank = compareRank.genNext().genNext()

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
  { title }: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'>,
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
  return getClient()
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
  return getClient()
    .patch(ranking.id)
    .unset([`players[_ref=="${playerId}"]`])
    .commit()
}
