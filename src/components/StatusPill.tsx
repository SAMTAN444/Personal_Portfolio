// Live-status pill with a gently pulsing green dot. The dot holds still under
// reduced motion. Status text is the single source from content.ts.
import { SITE } from '../data/content'

export function StatusPill({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full bg-panel px-3.5 py-1.5 font-mono text-label uppercase text-offwhite/90 ${className}`}
    >
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-status-green" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-status-green" />
      </span>
      {SITE.status}
    </span>
  )
}
