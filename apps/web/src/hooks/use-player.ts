import { getPaginatedPlayers, getPlayers } from '@nathy/web/server/player'
import type { PaginatedPlayers, Player } from '@nathy/web/types/player'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function usePlayer(initialData: Player[]) {
  const { data, isLoading, isPending } = useQuery<Player[]>({
    initialData,
    queryKey: ['players'],
    queryFn: () => getPlayers(),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedPlayer(initialData: PaginatedPlayers) {
  const {
    status,
    data,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery<PaginatedPlayers>({
    queryKey: ['players-paginated'],
    queryFn: (ctx) => getPaginatedPlayers({ offset: ctx.pageParam as number, pageSize: 10 }),
    getNextPageParam: (lastGroup) => (lastGroup.hasNextPage ? lastGroup.nextOffset : undefined),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  })

  const allPlayers = data?.pages.flatMap((p) => p.data) ?? []

  return {
    status,
    data,
    allPlayers,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  }
}
