import { cn } from '@nathy/shared/lib/utils'
import { motion } from 'framer-motion'
import type * as React from 'react'

function Textarea({ className, ...props }: React.ComponentProps<typeof motion.textarea>) {
  return (
    <motion.textarea
      data-slot="textarea"
      className={cn(
        'flex h-12 w-full min-w-0 rounded-2xl border-2 border-tertiary/20 bg-input/10 px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-tertiary selection:text-tertiary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
