import { getPaginatedPlatforms } from '@nathy/web/server/platform'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { getPaginatedPlatformListByPlatform, getPlatforms } from '../server/game-platform'
import type {
  PaginatedPlatformListByPlatform,
  PaginatedPlatforms,
  Platform,
} from '../types/platform'

export function usePlatforms(initialData: Platform[]) {
  const { data, isLoading, isPending } = useQuery<Platform[]>({
    initialData,
    queryKey: ['platforms'],
    queryFn: () => getPlatforms(),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedPlatform(initialData: PaginatedPlatforms) {
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
  } = useInfiniteQuery<PaginatedPlatforms>({
    queryKey: ['platforms-paginated'],
    queryFn: (ctx) => getPaginatedPlatforms({ offset: ctx.pageParam as number, pageSize: 10 }),
    getNextPageParam: (lastGroup) => (lastGroup.hasNextPage ? lastGroup.nextOffset : undefined),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  })

  const allPlatforms = data?.pages.flatMap((p) => p.data) ?? []

  return {
    status,
    data,
    allPlatforms,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  }
}

export function usePaginatedPlatformListByPlatform(
  initialData: PaginatedPlatformListByPlatform,
  platform: string,
) {
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
  } = useInfiniteQuery<PaginatedPlatformListByPlatform>({
    queryKey: [platform, 'grouped-list-paginated'],
    queryFn: (ctx) =>
      getPaginatedPlatformListByPlatform({
        offset: ctx.pageParam as number,
        pageSize: 10,
        platform,
      }),
    getNextPageParam: (lastGroup) => (lastGroup.hasNextPage ? lastGroup.nextOffset : undefined),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  })

  const allGroupedList = data?.pages.flatMap((p) => p.data) ?? []

  return {
    status,
    data,
    allGroupedList,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  }
}
