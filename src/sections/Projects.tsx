// Projects — a clean list, not a card grid. Each row: index, title (+ in-progress
// mark), one-line description, a muted mono tech-stack line, and a links row
// (GitHub / Live / Ask the assistant). Hierarchy from type + one hairline per row.
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import { ArrowRightIcon, ArrowUpRightIcon } from '../components/icons'
import { PROJECTS } from '../data/content'
import { prefillChat } from '../lib/chatBus'

export function Projects() {
  return (
    <Section id="projects">
      <SectionHeading id="projects" index="02" eyebrow="SELECTED WORK" title="Projects" />

      <ul className="flex flex-col">
        {PROJECTS.map((project, i) => (
          <Reveal
            as="li"
            key={project.title}
            delay={i * 80}
            className="group border-t border-grid py-8 transition-colors last:border-b hover:border-faint"
          >
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

            <p className="prose-measure mt-4 text-base leading-relaxed text-muted sm:pl-10">
              {project.description}
            </p>

            <p className="mt-4 font-mono text-label uppercase text-faint sm:pl-10">
              {project.stack.join('  ·  ')}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-label uppercase sm:pl-10">
              {project.repo && (
                <a
                  href={project.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-gold"
                >
                  GitHub
                  <ArrowUpRightIcon width={13} height={13} />
                </a>
              )}
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-gold"
                >
                  Live
                  <ArrowUpRightIcon width={13} height={13} />
                </a>
              )}
              <a
                href="#chat"
                onClick={() => prefillChat(`Tell me about ${project.title.split(' / ')[0]}.`)}
                className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-gold"
              >
                Ask
                <ArrowRightIcon
                  width={14}
                  height={14}
                  className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                />
              </a>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  )
}
