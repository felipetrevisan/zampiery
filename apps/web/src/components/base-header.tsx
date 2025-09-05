'use client'

import { CountingNumber } from '@nathy/shared/ui/animated/text/counting-number'
import type { ReactNode } from 'react'

interface BaseHeaderProps {
  title: string
  showTotalCount?: boolean
  totalCount: number
  children: ReactNode
}

export function BaseHeader({ title, showTotalCount, totalCount, children }: BaseHeaderProps) {
  return (
    <div className="relative flex flex-grow justify-between overflow-hidden rounded-2xl border-primary/20 border-b-1 bg-primary/5 p-3 backdrop-blur-2xl dark:bg-neutral-900/5">
      <h2 className="flex items-center gap-2 font-bold text-2xl text-accent-foreground tracking-tight">
        {title}
        {showTotalCount && (
          <CountingNumber
            className="w-[50px] rounded-full border-1 border-primary/30 p-2 text-center text-accent-foreground shadow-md shadow-primary/10"
            number={totalCount}
            fromNumber={0}
          />
        )}
      </h2>

      {children}
    </div>
  )
}
