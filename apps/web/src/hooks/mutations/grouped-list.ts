import type { GameFormSchema } from '@nathy/web/config/schemas/game'
import {
  mutateAddPlayerGame,
  mutateAttachGameToList,
  mutateCreateGroupedList,
  mutateDeleteGroupedList,
  mutateUpdateGroupedList,
} from '@nathy/web/server/grouped-list'
import type { Game } from '@nathy/web/types/game'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import type { PaginatedPlatformListByPlatform, Platform } from '@nathy/web/types/platform'
import { generateSlug } from '@nathy/web/utils/url'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreateGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (
      data: Omit<GroupedList, 'id' | 'games' | 'slug' | 'platform'> & { platform: Platform },
    ) => mutateCreateGroupedList({ ...data, platform: data.platform }),
    onMutate: async ({ title, platform }) => {
      await queryClient.cancelQueries({ queryKey: [platform.slug, 'grouped-list-paginated'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedPlatformListByPlatform[]
        pageParams: unknown[]
      }>([platform.slug, 'grouped-list-paginated'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticList: GroupedList = {
        id: v4(),
        title,
        slug: generateSlug(title),
        platform,
        games: [],
      }

      queryClient.setQueryData<{
        pages: PaginatedPlatformListByPlatform[]
        pageParams: unknown[]
      }>([platform.slug, 'grouped-list-paginated'], (old) => {
        if (!old) return old

        const firstPage = old.pages[0]
        const newFirstPage: PaginatedPlatformListByPlatform = {
          ...firstPage,
          data: [optimisticList, ...firstPage.data],
          total: firstPage.total + 1,
        }

        return {
          ...old,
          pages: [newFirstPage, ...old.pages.slice(1)],
        }
      })

      return { previousDataPaginated, optimisticId: optimisticList.id }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(
          [variables.platform.slug, 'grouped-list-paginated'],
          context.previousDataPaginated,
        )
      }

      toast.error('Não foi possível criar nova lista no momento.')
    },
    onSuccess: (_createdList, _variables, _context) => {
      toast.success('Lista foi criada com sucesso')
    },
  })

export const useMutationUpdateGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      platform: string
      data: Omit<GroupedList, 'id' | 'games' | 'slug' | 'platform'>
    }) => mutateUpdateGroupedList(id, data),
    onMutate: async ({ data, id, platform }) => {
      await queryClient.cancelQueries({ queryKey: [platform, 'grouped-list-paginated'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedPlatformListByPlatform[]
        pageParams: unknown[]
      }>([platform, 'grouped-list-paginated'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticUpdatedList = {
        title: data.title,
        slug: generateSlug(data.title),
      }

      queryClient.setQueryData<{
        pages: PaginatedPlatformListByPlatform[]
        pageParams: unknown[]
      }>([platform, 'grouped-list-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((list) =>
              list.id === id ? { ...list, ...optimisticUpdatedList } : list,
            ),
          })),
        }
      })

      return { previousDataPaginated }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData<{
          pages: PaginatedPlatformListByPlatform[]
          pageParams: unknown[]
        }>([variables.platform, 'grouped-list-paginated'], context.previousDataPaginated)
      }

      toast.error('Não foi possível atualizar a lista no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista foi atualizada com sucesso')
    },
  })

export const useMutationDeleteGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id }: { id: string; platform: string }) => mutateDeleteGroupedList(id),
    onMutate: async ({ id, platform }) => {
      await queryClient.cancelQueries({ queryKey: [platform, 'grouped-list-paginated'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedPlatformListByPlatform[]
        pageParams: unknown[]
      }>([platform, 'grouped-list-paginated'])

      if (!previousDataPaginated) return { previousDataPaginated }

      queryClient.setQueryData<InfiniteData<PaginatedPlatformListByPlatform>>(
        [platform, 'grouped-list-paginated'],
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              data: page.data.filter((list) => list.id !== id),
              total: page.total - 1,
            })),
          }
        },
      )

      return { previousDataPaginated }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(
          [variables.platform, 'grouped-list-paginated'],
          context.previousDataPaginated,
        )
      }

      toast.error('Não foi possível deletar a lista no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista foi deletada com sucesso')
    },
  })

export const useMutationAddPlayerToGameAndAttach = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: async ({ list, data }: { list: GroupedList; data: GameFormSchema }) => {
      const gameId = (await mutateAddPlayerGame(data))._id
      const currentList = await mutateAttachGameToList({ listId: list.id, gameId })

      return { gameId, currentList, data }
    },
    onMutate: async ({ list, data }) => {
      await queryClient.cancelQueries({
        queryKey: [list.platform.slug, 'grouped-list', list.slug],
      })

      const previousData = queryClient.getQueryData<GroupedList>([
        list.platform.slug,
        'grouped-list',
        list.slug,
      ])

      if (!previousData) {
        return { previousData }
      }

      const date = new Date(data.date)
      date.setUTCHours(0, 0, 0, 0)

      const optimisticGame: Game = {
        id: v4(),
        date: format(date, 'yyy-MM-dd'),
        played: data.player.guest.score !== undefined && data.player.home.score !== undefined,
        cancelled: false,
        players: {
          guest: {
            player: {
              id: data.player.guest.player.id,
              name: data.player.guest.player.name,
            },
            score: data.player.guest.score ?? undefined,
          },
          home: {
            player: {
              id: data.player.home.player.id,
              name: data.player.home.player.name,
            },
            score: data.player.home.score ?? undefined,
          },
        },
      }

      const newData: GroupedList = {
        ...previousData,
        games: [...(previousData.games ?? []), optimisticGame],
      }

      queryClient.setQueryData<GroupedList>(
        [list.platform.slug, 'grouped-list', list.slug],
        newData,
      )

      return { previousData }
    },
    onError: (_err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          [variables.list.platform.slug, 'grouped-list', variables.list.slug],
          context.previousData,
        )
      }

      toast.error('Não foi possível criar jogo no momento.')
    },
    onSuccess: (_createdGame, _variables, _context) => {
      toast.success('Jogo foi criada com sucesso')
    },
  })
