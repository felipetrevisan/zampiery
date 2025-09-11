import {
  getGroupedList,
  getGroupedListBySlug,
  getPaginatedGroupedList,
  getPaginatedGroupedListBySlug,
} from '@nathy/web/server/grouped-list'
import type {
  GroupedList,
  PaginatedGroupedList,
  PaginatedSingleGroupedList,
} from '@nathy/web/types/grouped-list'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useGroupedList() {
  const { data, isLoading, isPending } = useQuery<GroupedList[]>({
    queryKey: ['grouped-list'],
    queryFn: () => getGroupedList(),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedRankingList(initialData: PaginatedGroupedList) {
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
  } = useInfiniteQuery<PaginatedGroupedList>({
    queryKey: ['grouped-list-paginated'],
    queryFn: (ctx) => getPaginatedGroupedList({ offset: ctx.pageParam as number, pageSize: 10 }),
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

export function useGroupedListBySlug(initialData: GroupedList, slug: string) {
  const { data, isLoading, isPending } = useQuery<GroupedList>({
    initialData,
    queryKey: ['grouped-list', slug],
    queryFn: () => getGroupedListBySlug(slug),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedRankingListBySlug(
  initialData: PaginatedSingleGroupedList,
  slug: string,
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
  } = useInfiniteQuery<PaginatedSingleGroupedList>({
    queryKey: ['grouped-list-paginated', slug],
    queryFn: (ctx) =>
      getPaginatedGroupedListBySlug({ offset: ctx.pageParam as number, pageSize: 10, slug }),
    getNextPageParam: (lastGroup) => (lastGroup.hasNextPage ? lastGroup.nextOffset : undefined),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  })

  const allData = data?.pages.flatMap((p) => p.data) ?? []

  return {
    status,
    data,
    allData,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  }
}
