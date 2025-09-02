import { cn } from '@nathy/shared/lib/utils'
import { type VariantProps, cva } from 'class-variance-authority'

const alertVariants = cva(
  'relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-2xl border px-4 py-3 has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'shadow-[0_0_15px_3px] outline outline-1',
        outline: 'shadow-[0_0_15px_3px] outline outline-1',
        ghost: 'border-none shadow-none outline-none',
      },
      theme: {
        default:
          'border-primary/20 bg-primary/20 text-primary-foreground shadow-primary/20 outline-primary *:data-[slot=alert-description]:text-primary *:data-[slot=alert-title]:text-lg *:data-[slot=alert-title]:text-primary [&>svg]:fill-primary',
        secondary:
          'border-secondary/20 bg-secondary/20 text-secondary-foreground shadow-secondary/20 outline-secondary *:data-[slot=alert-description]:text-secondary *:data-[slot=alert-title]:text-lg *:data-[slot=alert-title]:text-secondary [&>svg]:fill-secondary',
        tertiary:
          'border-tertiary/20 bg-tertiary/20 text-tertiary-foreground shadow-tertiary/20 outline-tertiary *:data-[slot=alert-description]:text-tertiary *:data-[slot=alert-title]:text-lg *:data-[slot=alert-title]:text-tertiary [&>svg]:fill-tertiary',
      },
    },
    defaultVariants: {
      variant: 'default',
      theme: 'default',
    },
  },
)

function Alert({
  className,
  variant,
  theme,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant, theme }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'col-start-2 mb-4 line-clamp-1 flex min-h-4 items-center gap-2 font-medium tracking-tight',
        className,
      )}
      {...props}
    />
  )
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'col-start-2 grid justify-items-start gap-1 text-md text-muted-foreground [&_p]:leading-relaxed',
        className,
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
