// Experience — a vertical list with a single hairline rail. Each entry: role,
// org, mono dates, and a line or two. No cards; the rail and spacing carry it.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { EXPERIENCE } from '../data/content'

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading id="experience" index="02" eyebrow="WHERE I'VE WORKED" title="Experience" />

      <ol className="relative ml-1 border-l border-grid">
        {EXPERIENCE.map((item, i) => (
          <Reveal as="li" key={item.org} delay={i * 80} className="relative pb-12 pl-8 last:pb-0">
            {/* node */}
            <span
              className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full border border-gold bg-ink"
              aria-hidden="true"
            />
            <p className="font-mono text-label uppercase text-faint">{item.dates}</p>
            <h3 className="mt-2 font-display text-xl text-offwhite">{item.role}</h3>
            <p className="mt-1 font-mono text-label uppercase text-gold">{item.org}</p>
            <p className="prose-measure mt-3 text-base leading-relaxed text-muted">
              {item.description}
            </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
