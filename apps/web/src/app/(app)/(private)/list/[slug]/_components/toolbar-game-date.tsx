'use client'

import { PlusCircle } from 'lucide-react'
import { type Transition, type Variants, motion } from 'motion/react'
import * as React from 'react'

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

function Toolbar({ onAddGame }: { onAddGame: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-y-2 shadow-lg">
      <div className="mx-3 h-6 w-px rounded-full bg-border" />

      <motion.div layout layoutRoot className="mx-auto flex flex-wrap space-x-2 sm:flex-nowrap">
        <motion.button
          {...BUTTON_MOTION_CONFIG}
          className="flex h-10 items-center space-x-2 overflow-hidden whitespace-nowrap rounded-lg bg-neutral-600/80 px-2.5 py-2 text-neutral-200"
          aria-label="edit player"
          onClick={onAddGame}
        >
          <PlusCircle size={20} className="shrink-0" />
          <motion.span
            variants={LABEL_VARIANTS}
            transition={LABEL_TRANSITION}
            className="invisible text-sm"
          >
            Adicinar Jogo
          </motion.span>
        </motion.button>
      </motion.div>
    </div>
  )
}

export { Toolbar }
