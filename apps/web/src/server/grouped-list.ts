'use server'

import { client } from '@nathy/web/client/client'
import { sanityFetch } from '@nathy/web/client/fetch'
import { sanityMutate } from '@nathy/web/client/mutation'
import { getGroupedListBySlugQuery, getGroupedListQuery } from '@nathy/web/client/queries'
import { env } from '@nathy/web/config/env'
import type { Attendance, Game, gameFormSchema } from '@nathy/web/types/game'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { generateSlug } from '@nathy/web/utils/url'
import { format } from 'date-fns'
import type { SanityDocumentStub } from 'next-sanity'
import { v4 } from 'uuid'
import type z from 'zod'

const getClient = () => client.withConfig({ token: env.SANITY_API_WRITE_TOKEN, useCdn: false })

export async function getGroupedList() {
  return sanityFetch<GroupedList[]>({ query: getGroupedListQuery })
}

export async function getGroupedListBySlug(slug: string) {
  return sanityFetch<GroupedList>({ query: getGroupedListBySlugQuery, params: { slug } })
}

export async function mutateCreateGroupedList({
  title,
}: Omit<GroupedList, 'id' | 'slug' | 'games'>) {
  // const compareRank = lastRankOrder ? LexoRank.parse(lastRankOrder) : LexoRank.min()
  // const rank = compareRank.genNext().genNext()

  return sanityMutate<SanityDocumentStub<GroupedList>>({
    type: 'create',
    doc: {
      _type: 'list',
      _id: v4(),
      title,
      slug: { _type: 'slug', current: generateSlug(title) },
      games: [],
    },
  })
}

export async function mutateUpdateGroupedList(
  id: string,
  { title }: Omit<GroupedList, 'id' | 'slug' | 'games'>,
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

export async function mutateAddPlayerGame(data: z.infer<typeof gameFormSchema>) {
  const slug = `${data.player.home.player.name} X ${data.player.guest.player.name} - ${data.date.getTime()} - ${v4()}`

  return sanityMutate<SanityDocumentStub<{ _id: string }>>({
    type: 'create',
    doc: {
      _type: 'game',
      _id: v4(),
      title: `${data.player.home.player.name} X ${data.player.guest.player.name}`,
      slug: { _type: 'slug', current: generateSlug(slug) },
      date: format(new Date(data.date), 'yyyy-MM-dd'),
      player1: { _ref: data.player.home.player.id, _type: 'reference' },
      player2: { _ref: data.player.guest.player.id, _type: 'reference' },
      played: false,
      score1: data.player.home.score,
      score2: data.player.guest.score,
    },
  })
}

export async function mutateAttachGameToList({
  listId,
  game,
}: {
  listId: string
  game: { _id: string }
}) {
  return getClient()
    .patch(listId)
    .setIfMissing({ games: [] })
    .append('games', [
      {
        _type: 'reference',
        _ref: game._id,
      },
    ])
    .commit({ autoGenerateArrayKeys: true })
}

export async function toggleGamePlayed(gameId: string, played: boolean) {
  return getClient().patch(gameId).set({ played }).commit()
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
  return getClient()
    .patch(gameId)
    .set({
      [`attendance${player}`]: attendance === 'indeterminate' ? null : attendance === 'present',
    })
    .commit()
}

export async function saveOrder(listId: string, players: { playerId: string; position: number }[]) {
  return client
    .patch(listId)
    .setIfMissing({ entries: [] })
    .set({
      'entries[0].players': players.map((player) => ({
        _type: 'object',
        player: { _ref: player.playerId, _type: 'reference' },
        played: false,
        position: player.position,
      })),
    })
    .commit({ autoGenerateArrayKeys: true })
}
