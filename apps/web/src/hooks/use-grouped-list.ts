import {
  getGroupedListBySlug,
  getGroupedListBySlugAndPlatform,
} from '@nathy/web/server/grouped-list'
import type { GroupedList } from '@nathy/web/types/grouped-list'
import { useQuery } from '@tanstack/react-query'

export function useGroupedListBySlug(initialData: GroupedList, slug: string) {
  const { data, isLoading, isPending } = useQuery<GroupedList>({
    initialData,
    queryKey: ['grouped-list', slug],
    queryFn: () => getGroupedListBySlug(slug),
  })

  return { data, isLoading, isPending }
}

export function useGroupedListBySlugAndPlatform(
  initialData: GroupedList,
  slug: string,
  platform: string,
) {
  const { data, isLoading, isPending } = useQuery<GroupedList>({
    initialData,
    queryKey: [platform, 'grouped-list', slug],
    queryFn: () => getGroupedListBySlugAndPlatform({ slug, platform }),
  })

  return { data, isLoading, isPending }
}
