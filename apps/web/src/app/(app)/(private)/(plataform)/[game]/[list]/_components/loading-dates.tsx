'use client'

import { DatesRowSkeleton } from './dates-row-skeleton'

export function LoadingDates() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: dont use index as key
        <DatesRowSkeleton key={i} />
      ))}
    </div>
  )
}
