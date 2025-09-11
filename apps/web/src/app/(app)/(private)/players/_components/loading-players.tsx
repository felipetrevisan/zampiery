'use client'

import { PlayerRowSkeleton } from './player-row-skeleton'

export function LoadingPlayers() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: dont use index as key
        <PlayerRowSkeleton key={i} />
      ))}
    </div>
  )
}
