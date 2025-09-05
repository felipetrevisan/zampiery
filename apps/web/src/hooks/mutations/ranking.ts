import {
  mutateAddPersonToRanking,
  mutateCreateRanking,
  mutateDeletePersonFromRanking,
  mutateDeleteRanking,
  mutateUpdateRanking,
} from '@nathy/web/server/ranking'
import type { PaginatedRanking, PaginatedSingleRanking, Ranking } from '@nathy/web/types/ranking'
import { generateSlug } from '@nathy/web/utils/url'
import { type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'>) =>
      mutateCreateRanking(data),

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists-paginated'] })

      const previousData = queryClient.getQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'])

      if (!previousData) return { previousData }

      const optimisticList: Ranking = {
        id: v4(),
        title,
        slug: generateSlug(title),
        players: [],
        playersCount: 0,
      }

      queryClient.setQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'], (oldData) => {
        if (!oldData) return oldData

        const firstPage = oldData.pages[0]
        const newFirstPage: PaginatedRanking = {
          ...firstPage,
          data: [optimisticList, ...firstPage.data],
          total: firstPage.total + 1,
        }

        return {
          ...oldData,
          pages: [newFirstPage, ...oldData.pages.slice(1)],
        }
      })

      return { previousData, optimisticId: optimisticList.id }
    },

    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['ranking-lists-paginated'], context.previousData)
      }
      toast.error('Erro ao criar nova lista rankeada')
    },

    onSuccess: (createdList, _variables, context) => {
      queryClient.setQueryData<{
        pages: PaginatedRanking[]
        pageParams: unknown[]
      }>(['ranking-lists-paginated'], (oldData) => {
        if (!oldData) return oldData

        const newPages = oldData.pages.map((page, pageIndex) => {
          if (pageIndex !== 0) return page // só a primeira página recebe a nova lista

          return {
            ...page,
            data: page.data.map((list) =>
              list.id === context?.optimisticId ? { ...list, ...createdList } : list,
            ),
          }
        })

        return {
          ...oldData,
          pages: newPages,
        }
      })

      toast.success('Lista rankeada criada com sucesso')
    },
  })

export const useMutationUpdateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'>
    }) => mutateUpdateRanking(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })
      const previousList = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousList) return { previousList }

      const optimisticUpdatedList = {
        title: data.title,
        slug: generateSlug(data.title),
      }

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return []
        return oldList.map((list) =>
          list.id === id ? { ...list, ...optimisticUpdatedList } : list,
        )
      })

      return { previousList }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['ranking-lists'], context.previousList)
      }
      toast.error('Erro ao atualizar a lista rankeada')
    },
    onSuccess: (updatedList) => {
      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return oldList

        return oldList.map((list) =>
          list.id === updatedList.id ? { ...list, ...updatedList } : list,
        )
      })

      toast.success('Lista rankeada atualizada com sucesso')
    },
  })

export const useMutationDeleteRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeleteRanking(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })
      const previousList = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousList) return { previousList }

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return []
        return oldList?.filter((list) => list.id !== id) ?? []
      })

      return { previousList }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['ranking-lists'], context.previousList)
      }
      toast.error('Erro ao deletar a lista rankeada')
    },
    onSuccess: (updatedList) => {
      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return oldList

        return oldList.filter((list) => list.id !== updatedList.id) ?? []
      })

      toast.success('Lista rankeada deletada com sucesso')
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

      const previousRanking = queryClient.getQueryData<{
        pages: PaginatedSingleRanking[]
        pageParams: unknown[]
      }>(['ranking-list-paginated', ranking.slug])

      if (!previousRanking) return { previousRanking }

      const optimisticPlayer = {
        id: player.id,
        name: player.name ?? 'Sem nome',
      }

      queryClient.setQueryData(
        ['ranking-list-paginated', ranking.slug],
        (oldData?: typeof previousRanking) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx) => {
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

      return { previousRanking, optimisticId: optimisticPlayer.id }
    },
    onError: (_err, variables, context) => {
      if (context?.previousRanking) {
        queryClient.setQueryData(
          ['ranking-list-paginated', variables.ranking.slug],
          context.previousRanking,
        )
      }
      toast.error('Erro ao adicionar a pessoa ao ranking')
    },
    onSuccess: (createdRankingPlayer, variables) => {
      queryClient.setQueryData(
        ['ranking-list-paginated', variables.ranking.slug],
        (oldData?: { pages: PaginatedSingleRanking[]; pageParams: unknown[] }) => {
          if (!oldData) return oldData

          const sanityPlayer = createdRankingPlayer.players?.[0]
          const newPlayerId = sanityPlayer?.player?._ref

          if (!newPlayerId) return oldData

          const syncedPlayer = {
            id: newPlayerId,
            name: variables.player.name ?? 'Sem nome',
          }

          return {
            ...oldData,
            pages: oldData.pages.map((page, idx) => {
              if (idx === 0) {
                return {
                  ...page,
                  total: page.total,
                  data: [...page.data, syncedPlayer],
                }
              }
              return page
            }),
          }
        },
      )

      toast.success('Jogador adicionado com sucesso')
    },
  })

export const useMutationDeletePersonFromRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ ranking, playerId }: { ranking: PaginatedSingleRanking; playerId: string }) =>
      mutateDeletePersonFromRanking({ ranking, playerId }),

    onMutate: async ({ ranking, playerId }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-list-paginated', ranking.slug] })
      const previousData = queryClient.getQueryData<{
        pages: PaginatedSingleRanking[]
        pageParams: unknown[]
      }>(['ranking-list-paginated', ranking.slug])

      if (!previousData) return { previousData }

      // Otimisticamente remove o jogador do cache
      queryClient.setQueryData(
        ['ranking-list-paginated', ranking.slug],
        (oldData?: typeof previousData) => {
          if (!oldData) return oldData

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              total: page.total - 1,
              data: page.data.filter((player) => player.id !== playerId),
            })),
          }
        },
      )

      return { previousData }
    },

    onError: (_err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['ranking-list-paginated', variables.ranking.slug],
          context.previousData,
        )
      }
      toast.error('Erro ao deletar a pessoa do ranking')
    },

    onSuccess: (_updatedRanking, _variables) => {
      // Se quiser, você pode sincronizar de novo com o server aqui,
      // mas geralmente o otimistic update já garante que o UI está correto
      toast.success('Pessoa deletada com sucesso do ranking')
    },
  })
