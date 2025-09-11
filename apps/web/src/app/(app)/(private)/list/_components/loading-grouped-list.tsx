'use client'

import { GroupedListRowSkeleton } from './grouped-list-row-skeleton'

export function LoadingGroupedList() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: dont use index as key
        <GroupedListRowSkeleton key={i} />
      ))}
    </div>
  )
}
