// Hero — a single left-aligned column: eyebrow, gold tick, two-line serif name,
// italic tagline, intro paragraph, and the button row.
import { Button } from '../components/Button'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { GithubIcon, LinkedinIcon, MailIcon } from '../components/icons'
import { LINKS, SITE } from '../data/content'

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36"
    >
      <div className="max-w-3xl">
        <Reveal>
          <Eyebrow>{SITE.domain}</Eyebrow>
        </Reveal>

        <Reveal delay={60}>
          <span className="mt-9 block h-0.5 w-12 bg-gold" aria-hidden="true" />
          <h1 className="mt-5 font-display text-display text-offwhite">
            <span className="block">{SITE.firstName}</span>
            <span className="block italic text-gold">{SITE.lastName}</span>
          </h1>
        </Reveal>

        <Reveal delay={120}>
          <p className="mt-6 font-display text-tagline italic text-muted">{SITE.tagline}</p>
        </Reveal>

        <Reveal delay={180}>
          <p className="prose-measure mt-6 text-base leading-relaxed text-muted">{SITE.intro}</p>
        </Reveal>

        <Reveal delay={240}>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button variant="primary" href={LINKS.github} target="_blank" rel="noopener noreferrer">
              <GithubIcon />
              GitHub
            </Button>
            <Button href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedinIcon />
              LinkedIn
            </Button>
            <Button href={`mailto:${LINKS.email}`}>
              <MailIcon />
              Email
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
