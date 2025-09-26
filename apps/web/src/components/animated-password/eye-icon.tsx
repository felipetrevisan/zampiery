/**
 * An animated eye icon component that smoothly transitions between open and closed states.
 * Features:
 * - Morphing animation between open and closed eye states
 * - Animated strike-through line for the closed state
 * - Smooth pupil animation using Flubber for path interpolation
 */

'use client'

import { cn } from '@nathy/shared/lib/utils'
import { interpolate } from 'flubber'
import type { AnimationPlaybackControlsWithThen, Variants } from 'motion/react'
import {
  animate,
  type MotionValue,
  motion,
  useAnimation,
  useMotionValue,
  useTransform,
} from 'motion/react'
import type { HTMLAttributes } from 'react'
import { useEffect } from 'react'

export interface EyeOffIconHandle {
  startAnimation: () => void
  stopAnimation: () => void
}

interface EyeOffIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number
  open: boolean
}

// Animation variants for the strike-through line
const pathVariants: Variants = {
  normal: {
    pathLength: 1,
    opacity: 1,
    pathOffset: 0,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
  animate: {
    pathLength: 0,
    opacity: 0,
    pathOffset: 1,
    transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1] },
  },
}

export function EyeIcon({
  onMouseEnter,
  onMouseLeave,
  className,
  size = 28,
  open,
  ...props
}: EyeOffIconProps) {
  const controls = useAnimation()

  // Setup morphing animation for the pupil
  const progress = useMotionValue(0)
  const pupilPath = useFlubber(progress, pupilPaths)

  // Animate between open and closed states
  useEffect(() => {
    let animation: AnimationPlaybackControlsWithThen

    if (open) {
      controls.start('animate')
      animation = animate(progress, 1, {
        duration: 0.25,
        ease: [0.19, 1, 0.22, 1],
      })
    } else {
      controls.start('normal')
      animation = animate(progress, 0, {
        duration: 0.25,
        ease: [0.19, 1, 0.22, 1],
      })
    }
    return () => animation.stop()
  }, [open, controls, progress])

  return (
    <div className={cn(`flex select-none items-center justify-center`, className)} {...props}>
      <svg
        fill="none"
        height={size}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        viewBox="0 0 24 24"
        width={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
        {/* Animated pupil */}
        <motion.path d={pupilPath} />
        <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
        {/* Full eye shape for open state */}
        <path
          className={cn('opacity-0 transition-opacity duration-200', {
            'opacity-100': open,
          })}
          d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
        />
        {/* Animated strike-through line */}
        <motion.path animate={controls} d="m2 2 20 20" variants={pathVariants} />
      </svg>
    </div>
  )
}

// SVG paths for pupil states
const pupilOpenPath =
  'M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z'
const pupilClosedPath = 'M14.084 14.158a3 3 0 0 1-4.242-4.242'

const pupilPaths = [pupilClosedPath, pupilOpenPath]

EyeIcon.displayName = 'EyeIcon'

// Helper function to get array indices for Flubber interpolation
const getIndex = (_: string, index: number) => index

/**
 * Custom hook that uses Flubber to smoothly interpolate between SVG paths.
 * Creates a fluid morphing animation between the closed and open pupil states.
 */
function useFlubber(progress: MotionValue<number>, paths: string[]) {
  return useTransform(progress, paths.map(getIndex), paths, {
    mixer: (a, b) => interpolate(a, b, { maxSegmentLength: 0.1 }),
  })
}
