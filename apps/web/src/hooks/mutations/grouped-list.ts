import {
  mutateCreateGroupedList,
  mutateDeleteGroupedList,
  mutateUpdateGroupedList,
} from '@nathy/web/server/grouped-list'
import type { GroupedList, PaginatedGroupedList } from '@nathy/web/types/grouped-list'
import { generateSlug } from '@nathy/web/utils/url'
import { type InfiniteData, type QueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { v4 } from 'uuid'

export const useMutationCreateGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (data: Omit<GroupedList, 'id' | 'games' | 'slug'>) => mutateCreateGroupedList(data),

    onMutate: async ({ title }) => {
      await queryClient.cancelQueries({ queryKey: ['grouped-list-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['grouped-list'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedGroupedList[]
        pageParams: unknown[]
      }>(['grouped-list-paginated'])

      const previousData = queryClient.getQueryData<GroupedList[]>(['grouped-list'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticList: GroupedList = {
        id: v4(),
        title,
        slug: generateSlug(title),
        games: [],
      }

      queryClient.setQueryData<{
        pages: PaginatedGroupedList[]
        pageParams: unknown[]
      }>(['grouped-list-paginated'], (old) => {
        if (!old) return old

        const firstPage = old.pages[0]
        const newFirstPage: PaginatedGroupedList = {
          ...firstPage,
          data: [optimisticList, ...firstPage.data],
          total: firstPage.total + 1,
        }

        return {
          ...old,
          pages: [newFirstPage, ...old.pages.slice(1)],
        }
      })

      queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) => [
        ...(old ?? []),
        optimisticList,
      ])

      return { previousDataPaginated, previousData, optimisticId: optimisticList.id }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['grouped-list-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['grouped-list'], context.previousData)
      }

      toast.error('Não foi possível criar nova lista no momento.')
    },
    onSuccess: (_createdList, _variables, _context) => {
      toast.success('Lista foi criada com sucesso')
    },
  })

export const useMutationUpdateGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<GroupedList, 'id' | 'games' | 'slug'> }) =>
      mutateUpdateGroupedList(id, data),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ['grouped-list-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['grouped-list'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedGroupedList[]
        pageParams: unknown[]
      }>(['grouped-list-paginated'])
      const previousData = queryClient.getQueryData<GroupedList[]>(['grouped-list'])

      if (!previousDataPaginated) return { previousDataPaginated }

      const optimisticUpdatedList = {
        title: data.title,
        slug: generateSlug(data.title),
      }

      queryClient.setQueryData<{ pages: PaginatedGroupedList[] }>(
        ['grouped-list-paginated'],
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

      queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) => {
        if (!old) return []
        return old.map((list) => (list.id === id ? { ...list, ...optimisticUpdatedList } : list))
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['grouped-list-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['grouped-list'], context.previousData)
      }

      toast.error('Não foi possível atualizar a lista no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista foi atualizada com sucesso')
    },
  })

export const useMutationDeleteGroupedList = (queryClient: QueryClient) =>
  useMutation({
    mutationFn: (id: string) => mutateDeleteGroupedList(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['grouped-list-paginated'] })
      await queryClient.cancelQueries({ queryKey: ['grouped-list'] })

      const previousDataPaginated = queryClient.getQueryData<{
        pages: PaginatedGroupedList[]
        pageParams: unknown[]
      }>(['grouped-list-paginated'])
      const previousData = queryClient.getQueryData<GroupedList[]>(['grouped-list'])

      if (!previousDataPaginated) return { previousDataPaginated }

      queryClient.setQueryData<InfiniteData<PaginatedGroupedList>>(
        ['grouped-list-paginated'],
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

      queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) => {
        if (!old) return []
        return old?.filter((list) => list.id !== id) ?? []
      })

      return { previousDataPaginated, previousData }
    },
    onError: (_err, _variables, context) => {
      if (context?.previousDataPaginated) {
        queryClient.setQueryData(['grouped-list-paginated'], context.previousDataPaginated)
      }

      if (context?.previousData) {
        queryClient.setQueryData(['grouped-list'], context.previousData)
      }

      toast.error('Não foi possível deletar a lista no momento.')
    },
    onSuccess: (_updatedList) => {
      toast.success('Lista foi deletada com sucesso')
    },
  })

// const { mutateAsync: createGroupedList } = useMutation({
//     mutationFn: (data: Omit<GroupedList, 'id' | 'games' | 'slug'>) => mutateCreateGroupedList(data),
//     onSuccess: (newList) => {
//       const sanitizedList = {
//         ...newList,
//         id: newList.id,
//         slug: newList.slug,
//       }

//       queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) =>
//         old ? [...old, sanitizedList] : [sanitizedList],
//       )

//       toast.success('Lista criada com sucesso')
//     },
//     onError: () => {
//       toast.error('Erro ao criar a lista')
//     },
//   })

//   const { mutateAsync: updateGroupedList } = useMutation({
//     mutationFn: ({ id, data }: { id: string; data: Omit<GroupedList, 'id' | 'games' | 'slug'> }) =>
//       mutateUpdateGroupedList(id, data),
//     onSuccess: (updatedList) => {
//       queryClient.setQueryData<GroupedList[]>(['grouped-list'], (old) =>
//         old
//           ? old.map((list) => (list.id === updatedList.id ? { ...list, ...updatedList } : list))
//           : [updatedList],
//       )
//       toast.success('Lista atualizada com sucesso')
//     },
//     onError: () => {
//       toast.error('Erro ao atualizar a lista')
//     },
//   })

// const { mutateAsync: deleteList } = useMutation({
//   mutationFn: (id: string) => mutateDeleteList(id),
//   onSuccess: (_, id) => {
//     queryClient.setQueryData<List[]>(
//       ['lists-names'],
//       (old) => old?.filter((list) => list.id !== id) ?? [],
//     )
//     toast.success('Lista deletada com sucesso')
//   },
//   onError: () => {
//     toast.error('Erro ao deletar a lista')
//   },
// })
