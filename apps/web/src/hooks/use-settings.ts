import { getSettings } from '@nathy/web/server/settings'
import type { Settings } from '@nathy/web/types/settings'
import { useQuery } from '@tanstack/react-query'

export function useSettings() {
  const { data, isLoading, isPending } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
  })

  return { data, isLoading, isPending }
}
