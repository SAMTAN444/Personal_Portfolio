// Experience — a vertical list with a single hairline rail. Each entry leads with
// the company logo (white tile, left of the text), then role, org, mono dates, and
// a line or two. Entries with no logo get a tidy initials tile so the column stays
// aligned. No cards; the rail and spacing carry it.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ArrowUpRightIcon } from '../components/icons'
import { EXPERIENCE } from '../data/content'

function initials(org: string): string {
  return org
    .replace(/\(.*?\)/g, '') // drop parentheticals like "(Home Team …)"
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function Experience() {
  return (
    <Section id="experience">
      <SectionHeading id="experience" index="01" eyebrow="WHERE I'VE WORKED" title="Experience" />

      <ol className="relative ml-1 border-l border-grid">
        {EXPERIENCE.map((item, i) => (
          <Reveal as="li" key={item.org} delay={i * 80} className="relative pb-12 pl-8 last:pb-0">
            {/* node */}
            <span
              className="absolute -left-[5px] top-2.5 h-2.5 w-2.5 rounded-full border border-gold bg-ink"
              aria-hidden="true"
            />

            <div className="flex items-start gap-4">
              {item.logo ? (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-white p-2">
                  <img
                    src={item.logo}
                    alt={`${item.org} logo`}
                    loading="lazy"
                    className="h-full w-full object-contain"
                  />
                </span>
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md border border-grid bg-panel font-display text-lg text-muted">
                  {initials(item.org)}
                </span>
              )}

              <div className="min-w-0 flex-1">
                <p className="font-mono text-label uppercase text-faint">{item.dates}</p>
                <h3 className="mt-2 font-display text-xl text-offwhite">{item.role}</h3>
                <p className="mt-1 font-mono text-label uppercase text-gold">{item.org}</p>
                <p className="prose-measure mt-3 text-base leading-relaxed text-muted">
                  {item.description}
                </p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1.5 font-mono text-label uppercase text-muted transition-colors hover:text-gold"
                  >
                    {item.linkLabel ?? 'View'}
                    <ArrowUpRightIcon width={13} height={13} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
