import {
  mutateAddPersonToRanking,
  mutateCreateRanking,
  mutateDeletePersonFromRanking,
  mutateDeleteRanking,
  mutateUpdateRanking,
} from '@nathy/web/server/ranking'
import type { PaginatedRanking, PaginatedSingleRanking, Ranking } from '@nathy/web/types/ranking'
import { generateSlug } from '@nathy/web/utils/url'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<Ranking, 'id' | 'players' | 'slug' | 'total'>) =>
      mutateCreateRanking(data),

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'])

      const previousData = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticList: Ranking = {
        id: v4(),
        title,
        slug: generateSlug(title),
        players: [],
        total: 0,
      }

      queryClient.setQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'], (old) => {
        if (!old) return old

        const firstPage = old.pages[0]
        const newFirstPage: PaginatedRanking = {
          ...firstPage,
          data: [optimisticList, ...firstPage.data],
          total: firstPage.total + 1,
        }

        return {
          ...old,
          pages: [newFirstPage, ...old.pages.slice(1)],
        }
      })

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (old) => [
        ...(old ?? []),
        optimisticList,
      ])

      return { previousDataPaginated, previousData, optimisticId: optimisticList.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['ranking-lists-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['ranking-lists'], context.previousData)
      }

      toast.error('Não foi possível criar nova lista rankeada no momento.')
    },
    onSuccess: (_createdList, _variables, _context) => {
      toast.success('Lista rankeada foi criada com sucesso')
    },
  })

export const useMutationUpdateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Omit<Ranking, 'id' | 'players' | 'slug' | 'total'>
    }) => mutateUpdateRanking(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'])
      const previousData = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticUpdatedList = {
        title: data.title,
        slug: generateSlug(data.title),
      }

      queryClient.setQueryData<{ pages: PaginatedRanking[] }>(
        ['ranking-lists-paginated'],
        (old) => {
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
        },
      )

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (old) => {
        if (!old) return []
        return old.map((list) => (list.id === id ? { ...list, ...optimisticUpdatedList } : list))
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['ranking-lists-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['ranking-lists'], context.previousData)
      }

      toast.error('Não foi possível atualizar a lista rankeada no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista rankeada foi atualizada com sucesso')
    },
  })

export const useMutationDeleteRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeleteRanking(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'])
      const previousData = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousDataPaginated) return { previousDataPaginated }

      queryClient.setQueryData<InfiniteData<PaginatedRanking>>(
        ['ranking-lists-paginated'],
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

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (old) => {
        if (!old) return []
        return old?.filter((list) => list.id !== id) ?? []
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['ranking-lists-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['ranking-lists'], context.previousData)
      }

      toast.error('Não foi possível deletar a lista rankeada no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista rankeada foi deletada com sucesso')
    },
  })

export const useMutationAddPersonToRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      ranking,
      player,
    }: {
      ranking: PaginatedSingleRanking
      player: { id: string; name: string }
    }) => mutateAddPersonToRanking({ ranking, player: { id: player.id } }),
    onMutate: async ({ ranking, player }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-list-paginated', ranking.slug] })
      await queryClient.cancelQueries({ queryKey: ['ranking-list', ranking.slug] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedSingleRanking[]
        pageParams: unknown[]
      }>(['ranking-list-paginated', ranking.slug])

      const previousData = queryClient.getQueryData<Ranking>([
        'ranking-list-paginated',
        ranking.slug,
      ])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticPlayer = {
        id: player.id,
        name: player.name ?? 'Sem nome',
      }

      queryClient.setQueryData<{ pages: PaginatedSingleRanking[]; pageParams: unknown[] }>(
        ['ranking-list-paginated', ranking.slug],
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page, idx) => {
              if (idx === 0) {
                return {
                  ...page,
                  total: page.total + 1,
                  data: [...page.data, optimisticPlayer],
                }
              }
              return page
            }),
          }
        },
      )

      queryClient.setQueryData<Ranking>(['ranking-list', ranking.slug], (old) => {
        if (!old) return old

        return {
          ...old,
          players: [...(old.players ?? []), optimisticPlayer],
          total: old.total ?? 0 + 1,
        }
      })

      return { previousDataPaginated, previousData, optimisticId: optimisticPlayer.id }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(
          ['ranking-list-paginated', variables.ranking.slug],
          context.previousDataPaginated,
        )
      }

      if (context?.previousData) {
        queryClient.setQueryData(['ranking-list', variables.ranking.slug], context.previousData)
      }

      toast.error('Não foi possível adicionar a pessoa a lista no momento.')
    },
    onSuccess: (_createdRankingPlayer, _variables) => {
      toast.success('Jogador foi adicionado com sucesso a lista')
    },
  })

export const useMutationDeletePersonFromRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ ranking, playerId }: { ranking: PaginatedSingleRanking; playerId: string }) =>
      mutateDeletePersonFromRanking({ ranking, playerId }),
    onMutate: async ({ ranking, playerId }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-list-paginated', ranking.slug] })
      await queryClient.cancelQueries({ queryKey: ['ranking-list', ranking.slug] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedSingleRanking[]
        pageParams: unknown[]
      }>(['ranking-list-paginated', ranking.slug])

      const previousData = queryClient.getQueryData<Ranking[]>(['ranking-list', ranking.slug])

      if (!previousDataPaginated) return { previousDataPaginated }

      queryClient.setQueryData<InfiniteData<PaginatedSingleRanking>>(
        ['ranking-list-paginated', ranking.slug],
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              total: page.total - 1,
              data: page.data.filter((player) => player.id !== playerId),
            })),
          }
        },
      )

      queryClient.setQueryData<Ranking>(['ranking-list', ranking.slug], (old) => {
        if (!old) return old

        return {
          ...old,
          players: old.players.filter((player) => player.id !== playerId),
          total: old.total ? old.total - 1 : 0,
        }
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(
          ['ranking-list-paginated', variables.ranking.slug],
          context.previousDataPaginated,
        )
      }

      if (context?.previousData) {
        queryClient.setQueryData(['ranking-list', variables.ranking.slug], context.previousData)
      }

      toast.error('Não foi possível deletar a pessoa da lista no momento.')
    },

    onSuccess: (_updatedRanking, _variables) => {
      toast.success('Pessoa foi deletada com sucesso da lista')
    },
  })
