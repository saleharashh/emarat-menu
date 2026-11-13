import * as React from "react"
import { cn } from "cn"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-xl border border-white/75 bg-card/60 px-3 py-2 text-base text-foreground shadow-[inset_0_1px_2px_rgba(56,30,16,0.06)] backdrop-blur-xl transition-all outline-none placeholder:text-muted-foreground focus-visible:border-primary/80 focus-visible:ring-3 focus-visible:ring-primary/25 disabled:cursor-not-allowed disabled:bg-muted/40 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:border-white/12 dark:bg-card/40 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
