// Single-page shell. Fixed grid backdrop behind everything; a skip link; the
// sticky nav; then hero and the anchor-scroll sections in order.
import { Nav } from './components/Nav'
import { Hero } from './sections/Hero'
import { Projects } from './sections/Projects'
import { Experience } from './sections/Experience'
import { About } from './sections/About'
import { ChatSection } from './sections/ChatSection'
import { Contact } from './sections/Contact'
import { Footer } from './sections/Footer'

function App() {
  return (
    <>
      {/* Fixed graph-paper grid overlay — one for the whole page, behind content. */}
      <div className="grid-backdrop" aria-hidden="true" />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-gold focus:px-4 focus:py-2 focus:font-mono focus:text-label focus:uppercase focus:text-ink"
      >
        Skip to content
      </a>

      <Nav />

      <main id="main">
        <Hero />
        <Projects />
        <Experience />
        <About />
        <ChatSection />
        <Contact />
      </main>

      <Footer />
    </>
  )
}

export default App
