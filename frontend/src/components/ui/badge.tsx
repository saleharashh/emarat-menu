import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all backdrop-blur-md focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default:
          "border-white/30 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-xs [a]:hover:brightness-105",
        secondary:
          "border-white/15 bg-white/[0.08] text-stone-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] [a]:hover:bg-white/[0.12]",
        destructive:
          "border-destructive/30 bg-destructive/15 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 [a]:hover:bg-destructive/25",
        outline:
          "border-white/15 bg-white/[0.05] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] [a]:hover:bg-white/[0.1]",
        ghost:
          "hover:bg-card/60 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
