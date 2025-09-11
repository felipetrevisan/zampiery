'use client'

import { cn } from '@nathy/shared/lib/utils'
import type { LucideIcon } from 'lucide-react'
import { motion, type Transition, type Variants } from 'motion/react'
import type * as React from 'react'

// Configuração de animação dos botões
const BUTTON_MOTION_CONFIG = {
  initial: 'rest',
  transition: { damping: 25, stiffness: 250, type: 'spring' },
  variants: {
    hover: {
      maxWidth: '240px',
      transition: { damping: 35, delay: 0.15, stiffness: 200, type: 'spring' },
    },
    rest: { maxWidth: '40px' },
    tap: { scale: 0.95 },
  },
  whileHover: 'hover',
  whileTap: 'tap',
} as const

const LABEL_VARIANTS: Variants = {
  hover: { opacity: 1, visibility: 'visible', x: 0 },
  rest: { opacity: 0, x: 4 },
  tap: { opacity: 1, visibility: 'visible', x: 0 },
}

const LABEL_TRANSITION: Transition = {
  damping: 25,
  stiffness: 200,
  type: 'spring',
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

      <motion.div className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap" layout layoutRoot>
        {buttons.map(({ icon: Icon, label, ariaLabel, className, onClick }, idx) => (
          <motion.button
            // biome-ignore lint/suspicious/noArrayIndexKey: avoid use index
            key={idx}
            {...BUTTON_MOTION_CONFIG}
            aria-label={ariaLabel}
            className={cn(
              'flex h-10 cursor-pointer items-center space-x-2 overflow-hidden whitespace-nowrap rounded-full px-2.5 py-2 text-sm',
              className,
            )}
            onClick={(e) => doAction(e, onClick, context)}
          >
            <Icon className="shrink-0" size={20} />
            <motion.span
              className="invisible"
              transition={LABEL_TRANSITION}
              variants={LABEL_VARIANTS}
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
