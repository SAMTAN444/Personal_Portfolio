// Small uppercase monospace eyebrow/label, e.g. `// SAMUELTAN.DEV`.
import type { ReactNode } from 'react'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-label uppercase text-faint ${className}`}>{children}</span>
  )
}
