// Static identity badge — the card face rendered as DOM. Used as the lazy-load
// fallback and as the mobile replacement for the 3D Lanyard (physics on mobile
// is costly, so below md we never mount the canvas). Mirrors the GLB card face.
import { Eyebrow } from './Eyebrow'

export function BadgeCard() {
  return (
    <div className="flex flex-col items-center" aria-hidden="true">
      {/* lanyard strap + clip, drawn so the static badge still reads as "hanging" */}
      <div className="h-10 w-px bg-faint/70" />
      <div className="h-3 w-6 rounded-sm border border-faint/70" />
      <div className="mt-[-1px] w-[230px] rounded-sm border border-grid bg-panel p-5">
        <div className="flex items-start justify-between">
          <Eyebrow className="!text-faint">// ID</Eyebrow>
          <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-ink font-display text-lg text-gold">
            ST
          </span>
        </div>

        <div className="mt-8">
          <p className="font-display text-2xl leading-tight text-offwhite">SAMUEL TAN</p>
          <p className="mt-1 font-mono text-label uppercase text-gold">Full-Stack · AI/ML</p>
        </div>

        <div className="mt-6 border-t border-grid pt-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-label text-muted">
            NTU Computer Science
          </p>
          <p className="mt-1 font-mono text-[0.7rem] uppercase tracking-label text-faint">
            @SAMTAN444
          </p>
        </div>
      </div>
    </div>
  )
}
