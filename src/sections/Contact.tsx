// Contact — a closing line and the three links. Big serif invitation; the
// email is the one gold thread.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { GithubIcon, LinkedinIcon, MailIcon } from '../components/icons'
import { LINKS } from '../data/content'

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading id="contact" index="05" eyebrow="GET IN TOUCH" title="Contact" />

      <Reveal>
        <p className="prose-measure font-display text-tagline italic text-muted">
          Open to AI/ML and backend roles for 2027 internships!
        </p>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button variant="primary" href={`mailto:${LINKS.email}`}>
            <MailIcon />
            Email
          </Button>
          <Button href={LINKS.github} target="_blank" rel="noopener noreferrer">
            <GithubIcon />
            GitHub
          </Button>
          <Button href={LINKS.linkedin} target="_blank" rel="noopener noreferrer">
            <LinkedinIcon />
            LinkedIn
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
