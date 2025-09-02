import { getGroupedList, getGroupedListBySlug } from '@nathy/web/server/grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useQuery } from '@tanstack/react-query'

export function useGroupedList() {
  const { data, isLoading, isPending } = useQuery<GroupedList[]>({
    queryKey: ['grouped-list'],
    queryFn: () => getGroupedList(),
  })

  return { data, isLoading, isPending }
}

export function useGroupedListBySlug(initialData: GroupedList, slug: string) {
  const { data, isLoading, isPending } = useQuery<GroupedList>({
    initialData,
    queryKey: ['grouped-list', slug],
    queryFn: () => getGroupedListBySlug(slug),
  })

  return { data, isLoading, isPending }
}

