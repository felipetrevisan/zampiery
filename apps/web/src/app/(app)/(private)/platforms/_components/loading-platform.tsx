'use client'

import { PlatformRowSkeleton } from './platform-row-skeleton'

export function LoadingPlatforms() {
  return (
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: use index as key is safe here
        <PlatformRowSkeleton key={i} />
      ))}
    </div>
  )
}
