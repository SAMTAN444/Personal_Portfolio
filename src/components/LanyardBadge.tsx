// Hero badge slot. Decides whether to mount the costly 3D scene at all:
//
//   - below md, or under prefers-reduced-motion → render the static BadgeCard
//     (no canvas mounted; 3D physics is wasteful on mobile and is motion the
//     user asked to avoid). This is a clean conditional, not a hidden canvas.
//   - desktop with motion allowed → lazy-load LanyardScene behind <Suspense>,
//     falling back to the static badge while the three.js bundle streams in.
import { Suspense, lazy } from 'react'
import { BadgeCard } from './BadgeCard'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const LanyardScene = lazy(() => import('./lanyard/LanyardScene'))

export function LanyardBadge() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const reducedMotion = usePrefersReducedMotion()

  // Static badge on mobile and when motion is reduced — the 3D canvas is never
  // mounted in those cases.
  if (!isDesktop || reducedMotion) {
    return (
      <div className="flex h-full w-full items-start justify-center pt-4">
        <BadgeCard />
      </div>
    )
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-full w-full items-start justify-center pt-4">
          <BadgeCard />
        </div>
      }
    >
      <LanyardScene />
    </Suspense>
  )
}
