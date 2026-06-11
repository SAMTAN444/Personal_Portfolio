// Contact — a closing line, the three links, and a résumé download. Big serif
// invitation; the email is the one gold thread.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Button } from '../components/Button'
import { Reveal } from '../components/Reveal'
import { DownloadIcon, GithubIcon, LinkedinIcon, MailIcon } from '../components/icons'
import { LINKS, SITE } from '../data/content'

export function Contact() {
  return (
    <Section id="contact">
      <SectionHeading id="contact" index="05" eyebrow="GET IN TOUCH" title="Contact" />

      <Reveal>
        <p className="prose-measure font-display text-tagline italic text-muted">
          Open to AI/ML and backend roles. The fastest way to reach me is{' '}
          <a href={`mailto:${LINKS.email}`} className="text-gold underline-offset-4 hover:underline">
            email
          </a>
          .
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
          <Button href={SITE.resumeHref} target="_blank" rel="noopener noreferrer">
            <DownloadIcon />
            Download Résumé (PDF)
          </Button>
        </div>
      </Reveal>
    </Section>
  )
}
