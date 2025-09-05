import {
  mutateCreatePlayer,
  mutateDeletePlayer,
  mutateUpdatePlayer,
} from '@nathy/web/server/player'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import type { Ranking } from '@nathy/web/types/ranking'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

// export const useMutationCreatePlayer = (queryClient: QueryClient) =>
//   useMutation({
//     mutationFn: (data: Omit<Player, 'id'>) => mutateCreatePlayer(data),
//     onMutate: async ({ name, favoritePosition, favoriteTeam }) => {
//       await queryClient.cancelQueries({ queryKey: ['players'] })
//       const previousPlayer = queryClient.getQueryData<Player[]>(['players'])

//       if (!previousPlayer) return { previousPlayer }

//       const optimisticPlayer = {
//         id: v4(),
//         name,
//         favoritePosition,
//         favoriteTeam,
//       } satisfies Player

//       queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
//         if (!oldPlayer) return []
//         return [...oldPlayer, optimisticPlayer]
//       })

//       return { previousPlayer, optimisticId: optimisticPlayer.id }
//     },
//     onError: (_err, _variables, context) => {
//       if (context?.previousPlayer) {
//         queryClient.setQueryData(['players'], context.previousPlayer)
//       }
//       toast.error('Erro ao criar novo jogador')
//     },
//     onSuccess: (createdPlayer, _variables, context) => {
//       queryClient.setQueryData<Player[]>(['players'], (oldPlayer) => {
//         if (!oldPlayer) return oldPlayer

//         if (!oldPlayer) return []

//         return oldPlayer.map((player) =>
//           player.id === context?.optimisticId ? { ...player, ...createdPlayer } : player,
//         )
//       })

//       toast.success('Jogador criado com sucesso')
//     },
//   })
export const useMutationCreatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<Player, 'id'>) => mutateCreatePlayer(data),

    onMutate: async ({ name, favoritePosition, favoriteTeam }) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })

      // Pega todas as páginas atuais do infinite query
      const previousDataPaginated = queryClient.getQueryData<{ pages: PaginatedPlayers[] }>([
        'players-paginated',
      ])
      const previousData = queryClient.getQueryData<Player[]>(['players'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticPlayer: Player = {
        id: v4(),
        name,
        favoritePosition,
        favoriteTeam,
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
      toast.error('Erro ao criar novo jogador')
    },

    onSuccess: (_createdPlayer, _variables, _context) => {
      toast.success('Jogador criado com sucesso')
    },
  })

export const useMutationUpdatePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Player, 'id'> }) =>
      mutateUpdatePlayer(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })

      // Pega todas as páginas atuais do infinite query
      const previousData = queryClient.getQueryData<{ pages: PaginatedPlayers[] }>([
        'players-paginated',
      ])

      if (!previousData) return { previousData }

      const optimisticUpdatedPlayer: Omit<Player, 'id'> = {
        name: data.name,
        favoritePosition: data.favoritePosition,
        favoriteTeam: data.favoriteTeam,
      }

      queryClient.setQueryData<{ pages: PaginatedPlayers[] }>(['players-paginated'], (old) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((player) =>
              player.id === id
                ? { ...player, ...optimisticUpdatedPlayer } // substitui pelos novos dados
                : player,
            ),
          })),
        }
      })

      return { previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['players-paginated'], context.previousData)
      }
      toast.error('Erro ao atualizar o jogador')
    },
    onSuccess: (_updatedPlayer) => {
      toast.success('Jogador atualizado com sucesso')
    },
  })

export const useMutationDeletePlayer = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeletePlayer(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['players-paginated'] })
      const previousDataPaginated = queryClient.getQueryData<PaginatedPlayers[]>([
        'players-paginated',
      ])
      const previousData = queryClient.getQueryData<Player[]>(['players'])

      if (!previousDataPaginated) return { previousDataPaginated }

      queryClient.setQueryData<InfiniteData<PaginatedPlayers>>(['players-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((player) => player.id !== id),
            total: page.total - 1, // opcional: decrementa o total
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
      toast.error('Erro ao deletar o jogador')
    },
    onSuccess: (_updatedPlayer) => {
      toast.success('Jogador deletado com sucesso')
    },
  })
