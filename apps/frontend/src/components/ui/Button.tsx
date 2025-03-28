import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-orange-light focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:cursor-pointer hover:scale-105 focus:scale-105 disabled:scale-100",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        green: "bg-green text-primary-foreground shadow-xs hover:bg-green/90 focus:bg-green/90 disabled:hover:bg-green",
        red: "bg-red text-primary-foreground shadow-xs hover:bg-red/90 focus:bg-red/90 disabled:hover:bg-red",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        cta: "relative bg-orange hover:focus:bg-yellow-600 text-white text-lg font-bold py-3 px-8 rounded-full mt-6 transition-transform transform outline-none overflow-hidden duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(255,152,0,0.3)] focus:-translate-y-1 focus:shadow-[0_10px_20px_rgba(255,152,0,0.3)] before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-gradient-to-r before:from-[rgba(255,255,255,0.1)] before:to-[rgba(255,255,255,0.3)] before:-translate-x-full before:transition-transform before:duration-[600ms] hover:before:translate-x-full focus:before:translate-x-full",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        xl: "h-14 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

const Button = ({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) => {
  const Comp = asChild ? Slot : "button"

  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />
}

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
