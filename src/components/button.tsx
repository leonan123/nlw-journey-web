import type { ComponentProps } from 'react'
import { tv, VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'flex items-center justify-center gap-2 rounded-lg px-5 py-2 font-medium transition-colors',

  variants: {
    variant: {
      primary: 'bg-lime-300 text-lime-950 hover:bg-lime-400',
      secondary: 'bg-zinc-800 text-zinc-200 hover:bg-zinc-700',
    },

    size: {
      default: 'py-2',
      full: 'w-full h-11',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

type ButtonVariants = VariantProps<typeof buttonVariants>
type ButtonProps = ComponentProps<'button'> & ButtonVariants

export function Button({ variant, size, children, ...props }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant, size })} {...props}>
      {children}
    </button>
  )
}
