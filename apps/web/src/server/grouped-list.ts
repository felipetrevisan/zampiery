'use server'

import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import {
  getGroupedListByPlatformQuery,
  getGroupedListBySlugAndPlatformQuery,
  getGroupedListBySlugQuery,
} from '@nathy/web/client/queries/grouped-list'
import type { Attendance, GameStatus } from '@nathy/web/types/game'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { generateSlug } from '@nathy/web/utils/url'
import { format } from 'date-fns'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'
import { getClient } from '../config/sanity'
import type { GameFormSchema } from '../config/schemas/game'
import type { Platform } from '../types/platform'

export async function getGroupedListByPlatform(platform: string) {
  return sanityFetch<GroupedList[]>({ query: getGroupedListByPlatformQuery, params: { platform } })
}

export async function getGroupedListBySlug(slug: string) {
  return sanityFetch<GroupedList>({ query: getGroupedListBySlugQuery, params: { slug } })
}

export async function getGroupedListBySlugAndPlatform({
  slug,
  platform,
}: {
  slug: string
  platform: string
}): Promise<GroupedList> {
  return sanityFetch<GroupedList>({
    query: getGroupedListBySlugAndPlatformQuery,
    params: { slug, platform },
  })
}

export async function mutateCreateGroupedList({
  title,
  platform,
}: Omit<GroupedList, 'id' | 'slug' | 'games' | 'platform'> & { platform: Platform }) {
  return sanityMutate<SanityDocumentStub<GroupedList>>({
    type: 'create',
    doc: {
      _type: 'list',
      _id: v4(),
      title,
      slug: { _type: 'slug', current: generateSlug(title) },
      platform: { _ref: platform.id, _type: 'reference' },
      games: [],
    },
  })
}

export async function mutateUpdateGroupedList(
  id: string,
  { title }: Omit<GroupedList, 'id' | 'slug' | 'games' | 'platform'>,
) {
  return sanityMutate<SanityDocumentStub<GroupedList>>({
    type: 'patch',
    id,
    patchData: {
      title,
      slug: { _type: 'slug', current: generateSlug(title) },
    },
  })
}

export async function mutateDeleteGroupedList(id: string) {
  return sanityMutate<SanityDocumentStub<GroupedList>>({
    type: 'delete',
    id,
  })
}

export async function mutateAddPlayerGame(data: GameFormSchema) {
  const _id = v4()

  data?.date.setHours(0, 0, 0, 0)

  await sanityMutate<SanityDocumentStub<{ _id: string }>>({
    type: 'create',
    doc: {
      _type: 'game',
      _id,
      title: `${data.player.home.player.name} X ${data.player.guest.player.name}`,
      date: format(data.date, 'yyy-MM-dd'),
      player1: { _ref: data.player.home.player.id, _type: 'reference' },
      player2: { _ref: data.player.guest.player.id, _type: 'reference' },
      played: false,
      score1: data.player.home.score,
      score2: data.player.guest.score,
    },
  })

  return { _id }
}

export async function mutateAttachGameToList({
  listId,
  gameId,
}: {
  listId: string
  gameId: string
}) {
  return getClient('write')
    .patch(listId)
    .setIfMissing({ games: [] })
    .append('games', [
      {
        _type: 'reference',
        _ref: gameId,
      },
    ])
    .commit({ autoGenerateArrayKeys: true })
}

export async function toggleGameStatus(gameId: string, status: GameStatus) {
  return getClient('write')
    .patch(gameId)
    .set({
      played: status === 'played',
      cancelled: status === 'cancelled',
    })
    .commit()
}

export async function mutateToggleAttendance({
  gameId,
  player,
  attendance,
}: {
  gameId: string
  player: 1 | 2
  attendance: Attendance
}) {
  return getClient('write')
    .patch(gameId)
    .set({
      [`attendance${player}`]: attendance === 'indeterminate' ? null : attendance === 'present',
    })
    .commit()
}
