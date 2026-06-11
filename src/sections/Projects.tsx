// Projects — a clean list, not a card grid. Each row: index, title (+ in-progress
// mark), one-line description, a muted mono tech-stack line, and a Details →
// affordance. Hierarchy from type and a single hairline divider per row.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ArrowRightIcon } from '../components/icons'
import { PROJECTS } from '../data/content'
import { prefillChat } from '../lib/chatBus'

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading id="projects" index="01" eyebrow="SELECTED WORK" title="Projects" />

      <ul className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <Reveal as="li" key={project.title} delay={i * 80}>
            <a
              href="#chat"
              onClick={() => prefillChat(`Tell me about ${project.title.split(' / ')[0]}.`)}
              className="group block border-t border-grid py-8 transition-colors last:border-b hover:border-faint"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-label text-faint">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="font-display text-2xl text-offwhite transition-colors group-hover:text-gold">
                    {project.title}
                    {project.inProgress && (
                      <span className="ml-3 align-middle font-mono text-label uppercase text-faint">
                        · In progress
                      </span>
                    )}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-label uppercase text-muted transition-colors group-hover:text-gold">
                  Details
                  <ArrowRightIcon className="transition-transform duration-200 ease-out group-hover:translate-x-1" />
                </span>
              </div>

              <p className="prose-measure mt-4 text-base leading-relaxed text-muted sm:pl-10">
                {project.description}
              </p>

              <p className="mt-4 font-mono text-label uppercase text-faint sm:pl-10">
                {project.stack.join('  ·  ')}
              </p>
            </a>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
