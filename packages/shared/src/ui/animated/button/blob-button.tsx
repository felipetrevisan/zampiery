import { cn } from '@nathy/shared/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const buttonVariants = cva(
  'group relative cursor-pointer overflow-hidden px-12 font-bold uppercase shadow-2xl [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'active:scale-95 active:shadow-none',
      },
      theme: {
        default: '',
      },
      size: {
        default: 'max-w-fit p-4 [&_svg]:size-6',
        sm: 'h-8 px-3 text-xs [&_svg]:size-4',
        lg: 'h-10 px-8 [&_svg]:size-4',
        xl: 'h-14 px-6 text-md [&_svg]:size-5',
        '2xl': 'h-16 px-8 text-md [&_svg]:size-6',
        '3xl': 'h-16 px-8 text-lg [&_svg]:size-7',
        '4xl': 'h-20 px-10 text-xl [&_svg]:size-8',
      },
      rounded: {
        none: 'rounded-none',
        full: 'rounded-full',
        lg: 'rounded-lg',
        xl: 'rounded-2xl',
        '2xl': 'rounded-3xl',
      },
      fullWidth: {
        true: 'w-full',
      },
      sticky: {
        true: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      theme: 'default',
      size: 'default',
      rounded: 'none',
      fullWidth: false,
    },
  },
)

const buttonTextVariants = cva(
  'relative z-10 flex items-center justify-center gap-4 transition-colors duration-500',
  {
    variants: {
      theme: {
        default: 'text-primary-foreground group-hover:text-secondary-foreground',
      },
    },
    defaultVariants: {
      theme: 'default',
    },
  },
)

const buttonBaseVariants = cva('absolute inset-0 z-0', {
  variants: {
    theme: {
      default: 'bg-primary',
    },
    rounded: {
      none: 'rounded-none',
      full: 'rounded-full',
      lg: 'rounded-lg',
      xl: 'rounded-2xl',
      '2xl': 'rounded-3xl',
    },
    sticky: {
      true: '',
    },
  },
  defaultVariants: {
    theme: 'default',
    rounded: 'none',
  },
})

const buttonBlobContainerVariants = cva('absolute inset-0 z-0 overflow-hidden', {
  variants: {
    rounded: {
      none: 'rounded-none',
      full: 'rounded-full',
      lg: 'rounded-lg',
      xl: 'rounded-2xl',
      '2xl': 'rounded-3xl',
    },
  },
  defaultVariants: {
    rounded: 'none',
  },
})

const buttonBlobVariants = cva(
  'absolute top-[140%] h-full w-1/4 scale-[1.6] rounded-full transition-all duration-700 ease-out group-hover:top-0',
  {
    variants: {
      theme: {
        default: 'bg-secondary',
      },
    },
    defaultVariants: {
      theme: 'default',
    },
  },
)

type BlobButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  numOfBlobs?: number
} & VariantProps<typeof buttonVariants>

export default function BlobButton({
  children,
  numOfBlobs = 5,
  className,
  variant,
  theme,
  rounded,
  size,
  fullWidth,
  ...props
}: BlobButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, theme, rounded, fullWidth, className }))}
      type="button"
      {...props}
    >
      <span className={cn(buttonTextVariants({ theme }))} data-slot="button-text">
        {children}
      </span>

      <span className={cn(buttonBaseVariants({ theme, rounded }))} data-slot="button-base" />

      <span className={buttonBlobContainerVariants({ rounded })} data-slot="button-blobs">
        <span className="relative block h-full w-full [filter:url(#goo)]">
          {Array.from({ length: numOfBlobs }).map((_, i) => {
            const blobKey = `blob-${numOfBlobs}-${i}`
            return (
              <span
                className={cn(buttonBlobVariants({ theme }))}
                data-slot="button-blob"
                key={blobKey}
                style={{
                  left: `${i * 25}%`,
                  transitionDelay: `${i * 120}ms`,
                }}
              />
            )
          })}
        </span>
      </span>
    </button>
  )
}
