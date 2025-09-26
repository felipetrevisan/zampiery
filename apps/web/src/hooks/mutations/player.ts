import type { PlayerFormSchema } from '@nathy/web/config/schemas/player'
import {
  mutateCreatePlayer,
  mutateDeletePlayer,
  mutateUpdatePlayer,
} from '@nathy/web/server/player'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import type { Team } from '@nathy/web/types/team'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: PlayerFormSchema) => mutateCreatePlayer(data),
    onMutate: async ({ name, avatar, favoritePosition, favoriteTeam }) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['players'] })

      const previousDataPaginated = queryClient.getQueryData<{ pages: PaginatedPlayers[] }>([
        'players-paginated',
      ])
      const previousData = queryClient.getQueryData<Player[]>(['players'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      const team = {
        ...favoriteTeam,
      } as Team

      const optimisticPlayer: Player = {
        id: v4(),
        avatar,
        name,
        favoritePosition,
        favoriteTeam: team,
        isFavorite: false,
      }

      queryClient.setQueryData<{ pages: PaginatedPlayers[] }>(['players-paginated'], (old) => {
        if (!old) return old
        const newPages = old.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                data: [optimisticPlayer, ...page.data],
                total: page.total + 1,
              }
            : page,
        )
        return { ...old, pages: newPages }
      })

      queryClient.setQueryData<Player[]>(['players'], (old) => {
        if (!old) return []
        return [...old, optimisticPlayer]
      })

      return { previousData, previousDataPaginated, optimisticId: optimisticPlayer.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['players-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['players'], context.previousData)
      }

      toast.error('Não foi possível criar novo jogador no momento.')
    },
    onSuccess: (_createdPlayer, _variables, _context) => {
      toast.success('Jogador foi criado com sucesso')
    },
  })

export const useMutationUpdatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlayerFormSchema }) =>
      mutateUpdatePlayer(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['players'] })

      const previousDataPaginated = queryClient.getQueryData<{ pages: PaginatedPlayers[] }>([
        'players-paginated',
      ])

      const previousData = queryClient.getQueryData<Player[]>(['players'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      const team = {
        ...data.favoriteTeam,
      } as Team

      const optimisticUpdatedPlayer: Omit<Player, 'id'> = {
        name: data.name,
        avatar: data.avatar,
        favoritePosition: data.favoritePosition,
        favoriteTeam: team,
        isFavorite: data.isFavorite,
      }

      queryClient.setQueryData<{ pages: PaginatedPlayers[] }>(['players-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((player) =>
              player.id === id ? { ...player, ...optimisticUpdatedPlayer } : player,
            ),
          })),
        }
      })

      queryClient.setQueryData<Player[]>(['players'], (old) => {
        if (!old) return old

        return old.map((player) =>
          player.id === id ? { ...player, ...optimisticUpdatedPlayer } : player,
        )
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['players-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['players'], context.previousData)
      }

      toast.error('Não foi possível atualizar o jogador no momento.')
    },
    onSuccess: (_updatedPlayer) => {
      toast.success('Jogador foi atualizado com sucesso')
    },
  })

export const useMutationDeletePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeletePlayer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['players'] })

      const previousDataPaginated = queryClient.getQueryData<PaginatedPlayers[]>([
        'players-paginated',
      ])

      const previousData = queryClient.getQueryData<Player[]>(['players'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      queryClient.setQueryData<InfiniteData<PaginatedPlayers>>(['players-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((player) => player.id !== id),
            total: page.total - 1,
          })),
        }
      })

      queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
        if (!oldPlayer) return []
        return oldPlayer?.filter((player) => player.id !== id) ?? []
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['players-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['players'], context.previousData)
      }

      toast.error(
        'Erro ao deletar o jogador. Ele pode estar associado em alguma lista. Verifique e tente novamente.',
      )
    },
    onSuccess: (_updatedPlayer) => {
      toast.success('Jogador deletado com sucesso')
    },
  })
