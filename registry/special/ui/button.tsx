import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "group/button relative inline-flex shrink-0 select-none items-center justify-center whitespace-nowrap",
    "border border-transparent bg-clip-padding text-label font-medium outline-none",
    "transition-[color,background-color,border-color,box-shadow,transform] duration-fast ease-special",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/25",
    "active:not-aria-[haspopup]:translate-y-px",
    "disabled:pointer-events-none disabled:opacity-45",
    "aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/15",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.14)] hover:bg-primary-hover active:bg-primary-pressed",
        secondary:
          "border-border bg-secondary text-secondary-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.22)] hover:border-border-strong hover:bg-muted",
        outline:
          "border-border bg-card text-foreground hover:border-border-strong hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary active:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive-hover focus-visible:border-destructive focus-visible:ring-destructive/20",
        link: "h-auto rounded-none px-0 text-primary underline-offset-4 hover:underline active:translate-y-0",
      },
      size: {
        sm: "h-8 gap-1.5 rounded-sm px-2.5 text-caption",
        default: "h-9 gap-2 rounded-md px-3.5",
        lg: "h-10 gap-2 rounded-md px-4 text-body",
        icon: "size-9 rounded-md",
        "icon-sm": "size-8 rounded-sm [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10 rounded-md [&_svg:not([class*='size-'])]:size-[1.125rem]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

type ButtonProps = ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {loading && (
        <LoaderCircle
          data-slot="button-spinner"
          className="absolute size-4 animate-spin motion-reduce:animate-none"
          aria-hidden="true"
        />
      )}
      <span className={cn("inline-flex items-center gap-[inherit]", loading && "opacity-0")}>
        {children}
      </span>
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
export type { ButtonProps }
