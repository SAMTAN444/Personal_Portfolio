/** @type {import('tailwindcss').Config} */
// Design tokens. Source of truth mirrored in DESIGN.md frontmatter.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0B0C', // canvas — tinted near-black, never #000
        panel: '#111113', // one-step tonal lift
        offwhite: '#ECE7DD', // primary text / first name (15.96:1 on ink)
        muted: '#978F82', // secondary text (6.15:1 on ink — WCAG AA)
        faint: '#847E73', // tertiary text / separators (4.88:1 on ink — WCAG AA)
        gold: '#C9A227', // the one accent
        'gold-deep': '#A9871C', // gold hover / pressed
        grid: '#1B1B1E', // graph-paper grid lines
        'status-green': '#5FB87A',
      },
      fontFamily: {
        display: ['Fraunces', 'Newsreader', 'Georgia', 'serif'],
        body: ['"Hanken Grotesk"', 'Geist', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Space Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        display: ['clamp(3rem, 9vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        tagline: ['clamp(1.25rem, 2.5vw, 1.75rem)', { lineHeight: '1.3' }],
        heading: ['clamp(1.75rem, 4vw, 2.5rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
        label: ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        DEFAULT: '2px',
        sm: '2px',
      },
      maxWidth: {
        prose: '70ch',
      },
      spacing: {
        section: 'clamp(4rem, 12vh, 7.5rem)',
      },
      letterSpacing: {
        label: '0.12em',
      },
      transitionTimingFunction: {
        // ease-out, never bounce
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        pulse_dot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'pulse-dot': 'pulse_dot 2s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
      },
    },
  },
  plugins: [],
}
