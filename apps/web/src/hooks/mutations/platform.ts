import type { PlatformFormSchema } from '@nathy/web/config/schemas/platform'
import {
  mutateCreatePlatform,
  mutateDeletePlatform,
  mutateUpdatePlatform,
} from '@nathy/web/server/platform'
import type { PaginatedPlatforms, Platform } from '@nathy/web/types/platform'
import { generateSlug } from '@nathy/web/utils/url'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreatePlatform = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: PlatformFormSchema) => mutateCreatePlatform(data),
    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ['platforms-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['platforms'] })

      const previousDataPaginated = queryClient.getQueryData<{ pages: PaginatedPlatforms[] }>([
        'platforms-paginated',
      ])
      const previousData = queryClient.getQueryData<Platform[]>(['platforms'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      const optimisticPlatform: Platform = {
        id: v4(),
        title,
        slug: generateSlug(title),
      }

      queryClient.setQueryData<{ pages: PaginatedPlatforms[] }>(['platforms-paginated'], (old) => {
        if (!old) return old
        const newPages = old.pages.map((page, index) =>
          index === 0
            ? {
                ...page,
                data: [optimisticPlatform, ...page.data],
                total: page.total + 1,
              }
            : page,
        )
        return { ...old, pages: newPages }
      })

      queryClient.setQueryData<Platform[]>(['platforms'], (old) => {
        if (!old) return []
        return [...old, optimisticPlatform]
      })

      return { previousData, previousDataPaginated, optimisticId: optimisticPlatform.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['platforms-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['platforms'], context.previousData)
      }

      toast.error('Não foi possível criar nova plataforma no momento.')
    },
    onSuccess: (_createdPlatform, _variables, _context) => {
      toast.success('Plataforma foi criada com sucesso')
    },
  })

export const useMutationUpdatePlatform = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: PlatformFormSchema }) =>
      mutateUpdatePlatform(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['platforms-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['platforms'] })

      const previousDataPaginated = queryClient.getQueryData<{ pages: PaginatedPlatforms[] }>([
        'platforms-paginated',
      ])

      const previousData = queryClient.getQueryData<Platform[]>(['platforms'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      const optimisticUpdatedPlatform: Omit<Platform, 'id'> = {
        title: data.title,
        slug: generateSlug(data.title),
      }

      queryClient.setQueryData<{ pages: PaginatedPlatforms[] }>(['platforms-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.map((platform) =>
              platform.id === id ? { ...platform, ...optimisticUpdatedPlatform } : platform,
            ),
          })),
        }
      })

      queryClient.setQueryData<Platform[]>(['platforms'], (old) => {
        if (!old) return old

        return old.map((platform) =>
          platform.id === id ? { ...platform, ...optimisticUpdatedPlatform } : platform,
        )
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['platforms-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['platforms'], context.previousData)
      }

      toast.error('Não foi possível atualizar a plataforma no momento.')
    },
    onSuccess: (_updatedPlatform) => {
      toast.success('Plataforma foi atualizada com sucesso')
    },
  })

export const useMutationDeletePlatform = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeletePlatform(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['platforms-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['platforms'] })

      const previousDataPaginated = queryClient.getQueryData<PaginatedPlatforms[]>([
        'platforms-paginated',
      ])

      const previousData = queryClient.getQueryData<Platform[]>(['platforms'])

      if (!previousDataPaginated && !previousData) {
        return { previousDataPaginated, previousData }
      }

      queryClient.setQueryData<InfiniteData<PaginatedPlatforms>>(['platforms-paginated'], (old) => {
        if (!old) return old

        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            data: page.data.filter((platform) => platform.id !== id),
            total: page.total - 1,
          })),
        }
      })

      queryClient.setQueryData<Platform[]>(['platforms'], (oldPlatform) => {
        if (!oldPlatform) return []
        return oldPlatform?.filter((platform) => platform.id !== id) ?? []
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['platforms-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['platforms'], context.previousData)
      }

      toast.error(
        'Erro ao deletar o plataforma. Ela pode conter listas. Verifique e tente novamente.',
      )
    },
    onSuccess: (_updatedPlatform) => {
      toast.success('Plataforma deletada com sucesso')
    },
  })
