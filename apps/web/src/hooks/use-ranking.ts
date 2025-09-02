import { getRankingList, getRankingListBySlug, getRankingListOrderRank } from '@nathy/web/server/ranking'
import type { Ranking } from '@nathy/web/types/ranking'
import { useQuery } from '@tanstack/react-query'

export function useRankingList(initialData: Ranking[]) {
  const { data, isLoading, isPending } = useQuery<Ranking[]>({
    initialData,
    queryKey: ['ranking-lists'],
    queryFn: () => getRankingList(),
  })

  return { data, isLoading, isPending }
}

export function useRankingListBySlug(initialData: Ranking, slug: string) {
  const { data, isLoading, isPending } = useQuery<Ranking>({
    initialData,
    queryKey: ['ranking-list', slug],
    queryFn: () => getRankingListBySlug(slug),
  })

  return { data, isLoading, isPending }
}

export function useLastRankingListRankOrder() {
  const { data, isLoading, isPending } = useQuery<string>({
    queryKey: ['last-ranking-list'],
    queryFn: () => getRankingListOrderRank(),
  })

  return { data, isLoading, isPending }
}
