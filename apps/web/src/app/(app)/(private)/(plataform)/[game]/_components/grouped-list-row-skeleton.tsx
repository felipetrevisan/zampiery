'use client'

import { Skeleton } from '@nathy/shared/ui/skeleton'
import { motion } from 'motion/react'

export function GroupedListRowSkeleton() {
  return (
    <motion.div
      className="group relative flex flex-grow overflow-hidden rounded-2xl border border-primary/20 bg-neutral-200/80 p-3 backdrop-blur-2xl dark:bg-neutral-900/80"
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 1.02 }}
    >
      <div className="flex flex-grow items-center justify-between space-x-4 px-4 py-4">
        <div className="grid flex-grow grid-cols-3 items-center gap-4">
          <Skeleton className="h-5 w-24 bg-primary/50" />

          <div className="flex justify-center">
            <Skeleton className="h-5 w-20 bg-primary/50" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-8 w-8 rounded-full bg-primary/50" />
          <Skeleton className="h-8 w-8 rounded-full bg-primary/50" />
        </div>
      </div>
    </motion.div>
  )
}
