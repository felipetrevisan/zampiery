import type { Settings } from '@nathy/web/types/settings'
import { useQuery } from '@tanstack/react-query'

export function useSettings() {
  const { data, isLoading, isPending } = useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      const res = await fetch('/api/settings', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to load settings')
      return (await res.json()) as Settings
    },
  })

  return { data, isLoading, isPending }
}
