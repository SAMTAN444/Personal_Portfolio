// Footer — minimal: copyright, built-with note, repeat of socials.
import { LINKS, SITE } from '../data/content'

const SOCIALS = [
  { label: 'GITHUB', href: LINKS.github },
  { label: 'LINKEDIN', href: LINKS.linkedin },
  { label: 'EMAIL', href: `mailto:${LINKS.email}` },
]

export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-grid">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-label uppercase text-muted">
            © {year} {SITE.firstName} {SITE.lastName}
          </span>
          <span className="font-mono text-label uppercase text-faint">
            Built with React · TypeScript · Tailwind
          </span>
        </div>

        <ul className="flex flex-wrap gap-5">
          {SOCIALS.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target={s.href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noopener noreferrer"
                className="font-mono text-label uppercase text-muted transition-colors hover:text-gold"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
