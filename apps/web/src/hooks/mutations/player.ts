import {
  mutateCreatePlayer,
  mutateDeletePlayer,
  mutateUpdatePlayer,
} from '@nathy/web/server/player'
import type { Player } from '@nathy/web/types/player'
import type { Ranking } from '@nathy/web/types/ranking'
import { type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<Player, 'id'>) => mutateCreatePlayer(data),
    onMutate: async ({ name, favoritePosition, favoriteTeam }) => {
      await queryClient.cancelQueries({ queryKey: ['players'] })
      const previousPlayer = queryClient.getQueryData<Player[]>(['players'])

      if (!previousPlayer) return { previousPlayer }

      const optimisticPlayer = {
        id: v4(),
        name,
        favoritePosition,
        favoriteTeam,
      } satisfies Player

      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return []
        return [...oldPlayer, optimisticPlayer]
      })

      return { previousPlayer, optimisticId: optimisticPlayer.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPlayer) {
        queryClient.setQueryData(['players'], context.previousPlayer)
      }
      toast.error('Erro ao criar novo jogador')
    },
    onSuccess: (createdPlayer, _variables, context) => {
      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return oldPlayer

        if (!oldPlayer) return []

        return oldPlayer.map((player) =>
          player.id === context?.optimisticId ? { ...player, ...createdPlayer } : player,
        )
      })

      toast.success('Jogador criado com sucesso')
    },
  })

export const useMutationUpdatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Player, 'id'> }) =>
      mutateUpdatePlayer(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['players'] })
      const previousPlayer = queryClient.getQueryData<Player[]>(['players'])

      if (!previousPlayer) return { previousPlayer }

      const optimisticUpdatedPlayer = {
        name: data.name,
        favoritePosition: data.favoritePosition,
        favoriteTeam: data.favoriteTeam,
      }

      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return []
        return oldPlayer.map((player) =>
          player.id === id ? { ...player, ...optimisticUpdatedPlayer } : player,
        )
      })

      return { previousPlayer }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPlayer) {
        queryClient.setQueryData(['players'], context.previousPlayer)
      }
      toast.error('Erro ao atualizar o jogador')
    },
    onSuccess: (updatedPlayer) => {
      queryClient.setQueryData<Ranking[]>(['ranking-lists'], (oldList) => {
        if (!oldList) return oldList

        return oldList.map((list) =>
          list.id === updatedPlayer.id ? { ...list, ...updatedPlayer } : list,
        )
      })

      toast.success('Jogador atualizado com sucesso')
    },
  })

export const useMutationDeletePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeletePlayer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['players'] })
      const previousPlayer = queryClient.getQueryData<Ranking[]>(['players'])

      if (!previousPlayer) return { previousPlayer }

      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return []
        return oldPlayer?.filter((player) => player.id !== id) ?? []
      })

      return { previousPlayer }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousPlayer) {
        queryClient.setQueryData(['players'], context.previousPlayer)
      }
      toast.error('Erro ao deletar o jogador')
    },
    onSuccess: (updatedPlayer) => {
      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return oldPlayer

        return oldPlayer.filter((player) => player.id !== updatedPlayer.id) ?? []
      })

      toast.success('Jogador deletado com sucesso')
    },
  })
