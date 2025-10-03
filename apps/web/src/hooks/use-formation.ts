import { getFormations } from '@nathy/web/server/formation'
import type { Formation } from '@nathy/web/types/formation'
import { useQuery } from '@tanstack/react-query'

export function useFormation() {
  const { data, isLoading, isPending } = useQuery<Formation[]>({
    queryKey: ['formation'],
    queryFn: () => getFormations(),
  })

  return { data, isLoading, isPending }
}
