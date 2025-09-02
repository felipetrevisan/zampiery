import { getPlayers } from '@nathy/web/server/player'
import type { Player } from '@nathy/web/types/player'
import { useQuery } from '@tanstack/react-query'

export function usePlayer() {
  const { data, isLoading, isPending } = useQuery<Player[]>({
    queryKey: ['players'],
    queryFn: () => getPlayers(),
  })

  return { data, isLoading, isPending }
}
