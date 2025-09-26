import type { Team } from '@nathy/web/types/team'
import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../server/team'

export function useTeam() {
  const { data, isLoading, isPending } = useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: () => getTeams(),
  })

  return { data, isLoading, isPending }
}
