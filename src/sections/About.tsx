// About — short bio + a compact skills cluster of mono tags. No photo card.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Eyebrow } from '../components/Eyebrow'
import { Reveal } from '../components/Reveal'
import { ABOUT_BIO, SKILLS } from '../data/content'

export function About() {
  return (
    <Section id="about">
      <SectionHeading id="about" index="03" eyebrow="WHO I AM" title="About" />

      <div className="grid gap-12 md:grid-cols-[1fr_0.7fr]">
        <Reveal>
          <p className="prose-measure text-lg leading-relaxed text-muted">{ABOUT_BIO}</p>
        </Reveal>

        <Reveal delay={100}>
          <Eyebrow className="!text-faint">// SKILLS</Eyebrow>
          <ul className="mt-5 flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <li
                key={skill}
                className="rounded-sm border border-grid px-3 py-1.5 font-mono text-label uppercase text-muted"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  )
}
