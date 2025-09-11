'use client'

import { cn } from '@nathy/shared/lib/utils'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { type HTMLMotionProps, motion } from 'motion/react'
import * as React from 'react'

type CheckboxProps = React.ComponentProps<typeof CheckboxPrimitive.Root> & HTMLMotionProps<'button'>

function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  const [isChecked, setIsChecked] = React.useState(props?.checked ?? props?.defaultChecked ?? false)

  React.useEffect(() => {
    if (props?.checked !== undefined) setIsChecked(props.checked)
  }, [props?.checked])

  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      setIsChecked(checked)
      onCheckedChange?.(checked)
    },
    [onCheckedChange],
  )

  return (
    <CheckboxPrimitive.Root {...props} asChild onCheckedChange={handleCheckedChange}>
      <motion.button
        className={cn(
          'peer flex size-5 shrink-0 items-center justify-center rounded-sm bg-input transition-colors duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
          className,
        )}
        data-slot="checkbox"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        {...props}
      >
        <CheckboxPrimitive.Indicator asChild forceMount>
          {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
          <motion.svg
            animate={isChecked ? 'checked' : 'unchecked'}
            className="size-3.5"
            data-slot="checkbox-indicator"
            fill="none"
            initial="unchecked"
            stroke="currentColor"
            strokeWidth="3.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M4.5 12.75l6 6 9-13.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              variants={{
                checked: {
                  pathLength: 1,
                  opacity: 1,
                  transition: {
                    duration: 0.2,
                    delay: 0.2,
                  },
                },
                unchecked: {
                  pathLength: 0,
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
            />
          </motion.svg>
        </CheckboxPrimitive.Indicator>
      </motion.button>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox, type CheckboxProps }
