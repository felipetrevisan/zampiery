import {
  mutateAddPersonToRanking,
  mutateCreateRanking,
  mutateDeletePersonFromRanking,
  mutateDeleteRanking,
  mutateUpdateRanking,
} from '@nathy/web/server/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { generateSlug } from '@nathy/web/utils/url'
import { type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'>) =>
      mutateCreateRanking(data),
    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-lists'] })
      const previousList = queryClient.getQueryData<Ranking[]>(['ranking-lists'])

      if (!previousList) return { previousList }

      const optimisticList = {
        id: v4(),
        title,
        players: [],
        playersCount: 0,
        slug: generateSlug(title),
      } satisfies Ranking

      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return []
        return [...oldList, optimisticList]
      })

      return { previousList, optimisticId: optimisticList.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousList) {
        queryClient.setQueryData(['ranking-lists'], context.previousList)
      }
      toast.error('Erro ao criar nova lista rankeada')
    },
    onSuccess: (createdList, _variables, context) => {
      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return oldList

        if (!oldList) return []

        return oldList.map((list) =>
          list.id === context?.optimisticId ? { ...list, ...createdList } : list,
        )
      })

      toast.success('Lista rankeada criada com sucesso')
    },
  })

export const useMutationUpdateRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: { id: string; data: Omit<Ranking, 'id' | 'players' | 'slug' | 'playersCount'> }) =>
      mutateUpdateRanking(id, data),
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
    mutationFn: ({ ranking, player }: { ranking: Ranking; player: { id: string; name: string } }) =>
      mutateAddPersonToRanking({ ranking, player: { id: player.id } }),
    onMutate: async ({ ranking, player }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-list', ranking.slug] })
      const previousRanking = queryClient.getQueryData<Ranking>(['ranking-list', ranking.slug])

      if (!previousRanking) return { previousRanking }

      const optimisticPlayer = {
        id: player.id,
        name: player.name ?? 'Sem nome',
      }

      queryClient.setQueryData<Ranking>(['ranking-list', ranking.slug], (oldRanking) => {
        if (!oldRanking) return oldRanking
        return {
          ...oldRanking,
          players: [...(oldRanking.players ?? []), optimisticPlayer],
        }
      })

      return { previousRanking, optimisticId: optimisticPlayer.id }
    },
    onError: (_err, variables, context) => {
      if (context?.previousRanking) {
        queryClient.setQueryData(['ranking-list', variables.ranking.slug], context.previousRanking)
      }
      toast.error('Erro ao adicionar a pessoa ao ranking')
    },
    onSuccess: (createdRankingPlayer, variables, _context) => {
      queryClient.setQueryData<Ranking>(['ranking-list', variables.ranking.slug], (oldRanking) => {
        if (!oldRanking) return oldRanking

        const sanityPlayer = createdRankingPlayer.players?.[0]
        const newPlayerId = sanityPlayer?.player?._ref

        if (!newPlayerId) return oldRanking

        const syncedPlayer = {
          id: newPlayerId,
          name: variables.player.name ?? 'Sem nome',
        }

        return {
          ...oldRanking,
          players: [...(oldRanking.players ?? []), syncedPlayer],
        }
      })

      toast.success('Lista rankeada criada com sucesso')
    },
  })

export const useMutationDeletePersonFromRanking = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ ranking, playerId }: { ranking: Ranking; playerId: string }) =>
      mutateDeletePersonFromRanking({ ranking, playerId }),
    onMutate: async ({ ranking, playerId }) => {
      await queryClient.cancelQueries({ queryKey: ['ranking-list', ranking.slug] })
      const previousRanking = queryClient.getQueryData<Ranking>(['ranking-list', ranking.slug])

      if (!previousRanking) return { previousRanking }

      queryClient.setQueryData<Ranking[]>(['ranking-list', ranking.slug], (oldRanking) => {
        if (!oldRanking) return []
        return oldRanking.map((r) => {
          if (r.id !== ranking.id) return r

          return {
            ...r,
            players: r.players.filter((p) => p.id !== playerId),
            playersCount: r.playersCount - 1,
          }
        })
      })

      return { previousRanking }
    },
    onError: (_err, variables, context) => {
      if (context?.previousRanking) {
        queryClient.setQueryData(['ranking-list', variables.ranking.slug], context.previousRanking)
      }
      toast.error('Erro ao deletar a pessoa do ranking')
    },
    onSuccess: (updatedRanking, variables) => {
      queryClient.setQueryData<Ranking>(['ranking-list', variables.ranking.slug], (oldRanking) => {
        if (!oldRanking) return oldRanking

        return {
          ...oldRanking,
          players: (oldRanking.players ?? []).filter((p) => p.id !== variables.playerId),
          playersCount: updatedRanking.playersCount,
        }
      })

      toast.success('Pessoa deletada com sucesso do ranking')
    },
  })
