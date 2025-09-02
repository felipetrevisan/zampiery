'use client'

import { cn } from '@nathy/shared/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { type Transition, type Variants, motion } from 'motion/react'
import type * as React from 'react'

// Configuração de animação dos botões
const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  whileHover: 'hover',
  whileTap: 'tap',
  variants: {
    rest: { maxWidth: '40px' },
    hover: {
      maxWidth: '240px',
      transition: { type: 'spring', stiffness: 200, damping: 35, delay: 0.15 },
    },
    tap: { scale: 0.95 },
  },
  transition: { type: 'spring', stiffness: 250, damping: 25 },
} as const

const LABEL_VARIANTS: Variants = {
  rest: { opacity: 0, x: 4 },
  hover: { opacity: 1, x: 0, visibility: 'visible' },
  tap: { opacity: 1, x: 0, visibility: 'visible' },
}

const LABEL_TRANSITION: Transition = {
  type: 'spring',
  stiffness: 200,
  damping: 25,
}

export type ToolbarButton<T = void> = {
  icon: LucideIcon
  label: string
  ariaLabel: string
  className?: string
  onClick: (ctx: T) => void
}

function Toolbar<T = void>({
  buttons,
  context,
  className,
}: {
  buttons: ToolbarButton<T>[]
  context: T
  className?: string
}) {
  function doAction(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    callback: (ctx: T) => void,
    ctx: T,
  ) {
    e.stopPropagation()
    e.preventDefault()
    callback(ctx)
  }

  return (
    <div className={cn('z-2 flex flex-wrap items-center gap-y-2', className)}>
      <div className="mx-3 h-6 w-px rounded-full bg-border" />

      <motion.div layout layoutRoot className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap">
        {buttons.map(({ icon: Icon, label, ariaLabel, className, onClick }, idx) => (
          <motion.button
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            key={idx}
            {...BUTTON_MOTION_CONFIG}
            className={cn(
              'flex h-10 cursor-pointer items-center space-x-2 overflow-hidden whitespace-nowrap rounded-full px-2.5 py-2 text-sm',
              className,
            )}
            aria-label={ariaLabel}
            onClick={(e) => doAction(e, onClick, context)}
          >
            <Icon size={20} className="shrink-0" />
            <motion.span
              variants={LABEL_VARIANTS}
              transition={LABEL_TRANSITION}
              className="invisible"
            >
              {label}
            </motion.span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  )
}

export { Toolbar }
