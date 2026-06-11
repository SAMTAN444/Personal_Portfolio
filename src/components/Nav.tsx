// Sticky top nav. Left: brand mark. Center: smooth-scroll anchor links with the
// active section reflected in gold. Right: status pill + RESUME. Below md it
// collapses to a single menu button revealing a clean panel.
import { useEffect, useState } from 'react'
import { NAV_LINKS, SITE } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { StatusPill } from './StatusPill'
import { CloseIcon, MenuIcon } from './icons'

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''))

export function Nav() {
  const [open, setOpen] = useState(false)
  const active = useActiveSection(SECTION_IDS)

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-grid bg-ink">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 sm:px-8"
      >
        {/* Brand mark */}
        <a
          href="#top"
          className="font-mono text-label uppercase text-offwhite transition-colors hover:text-gold"
        >
          {SITE.brandMark}
        </a>

        {/* Center anchor links (desktop) */}
        <ul className="hidden items-center gap-7 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.replace('#', '')
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? 'true' : undefined}
                  className={`font-mono text-label uppercase transition-colors hover:text-offwhite ${
                    isActive ? 'text-gold' : 'text-muted'
                  }`}
                >
                  {link.label}
                </a>
              </li>
            )
          })}
        </ul>

        {/* Right cluster (desktop) */}
        <div className="hidden items-center gap-4 md:flex">
          <StatusPill />
          <a
            href={SITE.resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-label uppercase text-muted transition-colors hover:text-gold"
          >
            RESUME
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="-mr-2 flex h-11 w-11 items-center justify-center text-offwhite md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon width={22} height={22} /> : <MenuIcon width={22} height={22} />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-grid bg-ink px-6 pb-8 pt-4 md:hidden"
        >
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-mono text-label uppercase text-muted transition-colors hover:text-gold"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between border-t border-grid pt-6">
            <StatusPill />
            <a
              href={SITE.resumeHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="font-mono text-label uppercase text-muted transition-colors hover:text-gold"
            >
              RESUME
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
