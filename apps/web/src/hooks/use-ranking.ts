import {
  getPaginatedRankingList,
  getPaginatedRankingListBySlug,
  getRankingList,
  getRankingListBySlug,
  getRankingListOrderRank,
} from '@nathy/web/server/ranking'
import type { PaginatedRanking, PaginatedSingleRanking, Ranking } from '@nathy/web/types/ranking'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

export function useRankingList(initialData: Ranking[]) {
  const { data, isLoading, isPending } = useQuery<Ranking[]>({
    initialData,
    queryKey: ['ranking-lists'],
    queryFn: () => getRankingList(),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedRankingList(initialData: PaginatedRanking) {
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
  } = useInfiniteQuery<PaginatedRanking>({
    queryKey: ['ranking-lists-paginated'],
    queryFn: (ctx) => getPaginatedRankingList({ offset: ctx.pageParam as number, pageSize: 10 }),
    getNextPageParam: (lastGroup) => (lastGroup.hasNextPage ? lastGroup.nextOffset : undefined),
    initialPageParam: 0,
    initialData: {
      pages: [initialData],
      pageParams: [0],
    },
  })

  const allRankingList = data?.pages.flatMap((p) => p.data) ?? []

  return {
    status,
    data,
    allRankingList,
    error,
    isFetching,
    isFetchingNextPage,
    isLoading,
    isPending,
    fetchNextPage,
    hasNextPage,
  }
}

export function useRankingListBySlug(initialData: Ranking, slug: string) {
  const { data, isLoading, isPending } = useQuery<Ranking>({
    initialData,
    queryKey: ['ranking-list', slug],
    queryFn: () => getRankingListBySlug(slug),
  })

  return { data, isLoading, isPending }
}

export function usePaginatedRankingListBySlug(initialData: PaginatedSingleRanking, slug: string) {
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
  } = useInfiniteQuery<PaginatedSingleRanking>({
    queryKey: ['ranking-list-paginated', slug],
    queryFn: (ctx) => getPaginatedRankingListBySlug({ offset: ctx.pageParam as number, pageSize: 10, slug }),
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

export function useLastRankingListRankOrder() {
  const { data, isLoading, isPending } = useQuery<string>({
    queryKey: ['last-ranking-list'],
    queryFn: () => getRankingListOrderRank(),
  })

  return { data, isLoading, isPending }
}
