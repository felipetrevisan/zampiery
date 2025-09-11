'use client'

import { PlayerRankingRowSkeleton } from './player-ranking-row-skeleton'

export function LoadingPlayersRanking() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: dont use index as key
        <PlayerRankingRowSkeleton key={i} />
      ))}
    </div>
  )
}
