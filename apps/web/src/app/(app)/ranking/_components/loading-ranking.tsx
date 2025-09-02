'use client'

import { RankingRowSkeleton } from "./ranking-row-skeleton"

export function LoadingRanking() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <RankingRowSkeleton key={i} />
      ))}
    </div>
  )
}
