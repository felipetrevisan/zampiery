import { cn } from '@nathy/shared/lib/utils'
import { motion } from 'motion/react'

function Input({
  className,
  type,
  icon: Icon,
  ...props
}: React.ComponentProps<typeof motion.input> & { icon?: React.ElementType }) {
  return (
    <div className="relative">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
          <Icon />
        </div>
      )}
      <motion.input
        className={cn(
          'flex h-12 w-full min-w-0 rounded-md border-1 border-accent bg-input/10 px-3 py-1 text-base shadow-xs outline-none transition-[color,box-shadow] selection:bg-muted selection:text-muted-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          'focus-visible:border-primary focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          className,
          {
            'ps-10': Icon,
          },
        )}
        data-slot="input"
        type={type}
        {...props}
      />
    </div>
  )
}

export { Input }
