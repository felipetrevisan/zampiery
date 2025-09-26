'use client'

import { cn } from '@nathy/shared/lib/utils'
import { AnimatePresence, type HTMLMotionProps, motion, type Transition } from 'motion/react'
import type * as React from 'react'

const sizes = {
  default: 'size-8 [&_svg]:size-5',
  sm: 'size-6 [&_svg]:size-4',
  md: 'size-10 [&_svg]:size-6',
  lg: 'size-12 [&_svg]:size-7',
}

const themes = {
  default:
    'bg-linear-to-r from-primary via-primary/80 to-primary hover:bg-primary-foreground hover:text-primary-foreground text-primary-foreground outline-primary-foreground/40',
  secondary:
    'bg-linear-to-r from-secondary via-secondary/80 to-secondary hover:bg-secondary/30 hover:text-secondary-foreground text-secondary-foreground outline-secondary-foreground/40',
  tertiary:
    'bg-linear-to-r from-tertiary via-tertiary/80 to-tertiary text-tertiary-foreground hover:bg-tertiary/30 hover:text-tertiary-foreground outline-tertiary/40 hover:border-tertiary/40',
  custom:
    'bg-linear-to-r from-[var(--header-button-hover-background)] via-[var(--header-button-hover-background)]/80 to-[var(--header-button-hover-background)] text-[var(--header-button-hover-text)] hover:bg-[var(--header-button-hover-background)]/30 hover:text-[var(--header-button-hover-text)] outline-[var(--header-button-hover-background)]/40 hover:border-[var(--header-button-hover-background)]/40',
}

type IconButtonProps = Omit<HTMLMotionProps<'button'>, 'color'> & {
  icon: React.ElementType
  active?: boolean
  className?: string
  animate?: boolean
  size?: keyof typeof sizes
  theme?: keyof typeof themes
  color?: [number, number, number]
  transition?: Transition
}

function IconButton({
  icon: Icon,
  className,
  active = false,
  animate = true,
  size = 'default',
  theme = 'default',
  color = [59, 130, 246],
  transition = { type: 'spring', stiffness: 300, damping: 15 },
  ...props
}: IconButtonProps) {
  return (
    <motion.button
      className={cn(
        'group/icon-button relative inline-flex size-10 shrink-0 cursor-pointer rounded-full',
        sizes[size],
        themes[theme],
        className,
      )}
      data-slot="icon-button"
      style={
        {
          '--icon-button-color': `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
        } as React.CSSProperties
      }
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <motion.div
        aria-hidden="true"
        className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 stroke-muted-foreground"
      >
        <Icon />
      </motion.div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            aria-hidden="true"
            className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2"
            exit={{ opacity: 0, scale: 0 }}
            initial={{ opacity: 0, scale: 0 }}
            transition={transition}
          >
            <Icon />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {animate && active && (
          <>
            <motion.div
              animate={{ scale: [1.2, 1.8, 1.2], opacity: [0, 0.3, 0] }}
              className="absolute inset-0 z-10 rounded-full "
              initial={{ scale: 1.2, opacity: 0 }}
              style={{
                background: `radial-gradient(circle, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.4) 0%, rgba(${color[0]}, ${color[1]}, ${color[2]}, 0) 70%)`,
              }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
            <motion.div
              animate={{ scale: [1, 1.5], opacity: [0.8, 0] }}
              className="absolute inset-0 z-10 rounded-full"
              initial={{ scale: 1, opacity: 0 }}
              style={{
                boxShadow: `0 0 10px 2px rgba(${color[0]}, ${color[1]}, ${color[2]}, 0.6)`,
              }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            {[...Array(6)].map((_, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                animate={{
                  x: `calc(50% + ${Math.cos((i * Math.PI) / 3) * 30}px)`,
                  y: `calc(50% + ${Math.sin((i * Math.PI) / 3) * 30}px)`,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                className="absolute h-1 w-1 rounded-full bg-[var(--icon-button-color)]"
                initial={{ x: '50%', y: '50%', scale: 0, opacity: 0 }}
                key={i}
                transition={{ duration: 0.8, delay: i * 0.05, ease: 'easeOut' }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export { IconButton, sizes, type IconButtonProps }
