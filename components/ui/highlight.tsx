import type React from "react"
import { cn } from "@/lib/utils"

interface HighlightProps {
  children: React.ReactNode
  className?: string
}

export function Highlight({ children, className }: HighlightProps) {
  return (
    <span className={cn("relative inline-block", className)}>
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -bottom-1 -left-1 -right-1 -top-1 -z-10 bg-accent rounded-md" />
    </span>
  )
}
