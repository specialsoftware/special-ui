import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  [
    "w-full min-w-0 border border-input bg-card type-body text-foreground outline-none",
    "transition-[color,background-color,border-color,box-shadow] duration-fast ease-special",
    "placeholder:text-subtle-foreground",
    "hover:not-disabled:border-border-strong",
    "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/15",
    "disabled:cursor-not-allowed disabled:bg-muted/70 disabled:text-muted-foreground disabled:opacity-70",
    "read-only:bg-secondary/70 read-only:text-muted-foreground",
    "aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/15",
    "file:mr-3 file:border-0 file:bg-transparent file:type-label file:text-foreground",
  ],
  {
    variants: {
      inputSize: {
        sm: "h-8 rounded-sm px-2.5 type-label",
        default: "h-9 rounded-md px-3",
        lg: "h-10 rounded-md px-3.5 type-body",
      },
    },
    defaultVariants: {
      inputSize: "default",
    },
  }
)

type InputProps = Omit<React.ComponentProps<"input">, "size"> &
  VariantProps<typeof inputVariants>

function Input({ className, type, inputSize = "default", ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={inputSize}
      className={cn(inputVariants({ inputSize, className }))}
      {...props}
    />
  )
}

export { Input, inputVariants }
export type { InputProps }
