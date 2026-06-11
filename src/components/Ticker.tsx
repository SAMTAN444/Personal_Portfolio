// Full-width infinite marquee of labeled status segments. Two identical halves
// translate -50% for a seamless loop; pauses on hover; frozen under reduced
// motion (the CSS handles the freeze — see theme.css).
import { Fragment } from 'react'
import { TICKER_SEGMENTS } from '../data/content'

function Segments() {
  return (
    <>
      {TICKER_SEGMENTS.map((seg) => (
        <Fragment key={seg.label}>
          <span className="mx-6 inline-flex items-baseline gap-3 font-mono text-label uppercase">
            <span className="text-gold">{seg.label}</span>
            <span className="text-muted">{seg.value}</span>
          </span>
          <span className="text-faint" aria-hidden="true">
            ·
          </span>
        </Fragment>
      ))}
    </>
  )
}

export function Ticker() {
  return (
    <div className="ticker border-y border-grid bg-ink/60 py-3" aria-label="Current status">
      <div className="ticker-mask overflow-hidden">
        <div className="ticker-track animate-marquee">
          {/* Two copies so the -50% translate wraps with no visible seam. */}
          <div className="flex shrink-0 items-center" aria-hidden="false">
            <Segments />
          </div>
          <div className="flex shrink-0 items-center" aria-hidden="true">
            <Segments />
          </div>
        </div>
      </div>
    </div>
  )
}
