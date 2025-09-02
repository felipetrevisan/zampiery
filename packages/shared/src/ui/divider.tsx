import { cn } from '@nathy/shared/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const dividerVariants = cva(
  'my-4 h-0 w-screen overflow-hidden border-0 bg-white shadow-[0_0_15px_3px_rgba(255,255,255,0.7)]',
  {
    variants: {
      theme: {
        default: 'shadow-primary',
        secondary: 'shadow-secondary',
        tertiary: 'shadow-tertiary',
      },
    },
    defaultVariants: {
      theme: 'default',
    },
  },
)

function Divider({
  className,
  theme,
  ...props
}: React.ComponentProps<'hr'> & VariantProps<typeof dividerVariants>) {
  return (
    <hr
      className={cn(
        dividerVariants({
          theme,
        }),
        className,
      )}
      {...props}
    />
  )
}

export { Divider, dividerVariants }
