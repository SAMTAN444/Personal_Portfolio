// A page section: semantic landmark + anchor id + the shared content container.
import type { ReactNode } from 'react'

export function Section({
  id,
  children,
  className = '',
}: {
  id: string
  children: ReactNode
  className?: string
}) {
  return (
    <section
      id={id}
      className={`pb-section pt-12 ${className}`}
      aria-labelledby={`${id}-heading`}
    >
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8">{children}</div>
    </section>
  )
}
