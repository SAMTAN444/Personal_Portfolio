// Editorial index line — parenthetical number on the left, eyebrow on the right,
// a hairline rule spanning between — then the serif section title beneath.
import { Eyebrow } from './Eyebrow'
import { Reveal } from './Reveal'

export function SectionHeading({
  id,
  index,
  eyebrow,
  title,
}: {
  id: string
  index: string
  eyebrow: string
  title: string
}) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-center gap-5">
        <Eyebrow className="!text-gold whitespace-nowrap">({index})</Eyebrow>
        <span className="h-px flex-1 bg-grid" aria-hidden="true" />
        <Eyebrow className="whitespace-nowrap">{eyebrow}</Eyebrow>
      </div>
      <h2 id={`${id}-heading`} className="mt-6 font-display text-heading text-offwhite">
        {title}
      </h2>
    </Reveal>
  )
}
