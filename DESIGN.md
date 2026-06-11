---
name: Samuel Tan — Portfolio
description: An editorial, understated-technical portfolio for a software / AI-ML engineer.
colors:
  ink-black: "#0B0B0C"
  panel-black: "#111113"
  off-white: "#ECE7DD"
  muted-gray: "#978F82"
  faint-gray: "#847E73"
  gold: "#C9A227"
  gold-deep: "#A9871C"
  grid-line: "#1B1B1E"
  status-green: "#5FB87A"
typography:
  display:
    fontFamily: "Fraunces, Newsreader, Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 6.5rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  display-italic:
    fontFamily: "Fraunces, Newsreader, Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 6.5rem)"
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.02em"
  tagline:
    fontFamily: "Fraunces, Newsreader, Georgia, serif"
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Hanken Grotesk, Geist, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, Space Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.12em"
rounded:
  none: "0px"
  sm: "2px"
  pill: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "120px"
components:
  button-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.ink-black}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.gold-deep}"
    textColor: "{colors.ink-black}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.off-white}"
    rounded: "{rounded.sm}"
    padding: "12px 24px"
    typography: "{typography.label}"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.gold}"
  chip-skill:
    backgroundColor: "transparent"
    textColor: "{colors.muted-gray}"
    rounded: "{rounded.sm}"
    padding: "6px 12px"
    typography: "{typography.label}"
  status-pill:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
    typography: "{typography.label}"
  input-chat:
    backgroundColor: "{colors.panel-black}"
    textColor: "{colors.off-white}"
    rounded: "{rounded.sm}"
    padding: "14px 16px"
    typography: "{typography.body}"
---

# Design System: Samuel Tan — Portfolio

## 1. Overview

**Creative North Star: "The Lab Notebook, Letterpressed"**

This is the personal site of an engineer who reads type specimens for fun. It carries itself like a well-set technical journal printed on near-black stock: a single warm gold ink used sparingly, a high-contrast serif for the name, monospace for the marginalia, and a clean grotesque for the running text. Depth comes from a faint graph-paper grid and generous vertical rhythm, never from boxes, shadows, or chrome. The page should feel *quiet and exacting* — the restraint is the credential.

It works outward from type and space. The display name is the loudest thing on the page; everything else recedes into a disciplined hierarchy. The one moment of motion-as-spectacle is the Lanyard badge swinging on its physics in the hero — earned, because it is singular. Every other transition is a short, ease-out fade-and-translate that you barely notice.

This system explicitly rejects the visual language of the venture-funded AI tool: no purple→blue gradients, no glassmorphism, no neon glows, no cards nested in cards, no pure black, no Inter, no emoji icons, no bounce easing. If a section needs a border to feel finished, the layout is wrong — fix the spacing instead.

**Key Characteristics:**
- Tinted near-black canvas (`#0B0B0C`), never pure black, under a faint graph-paper grid.
- One gold accent (`#C9A227`), spent rarely and deliberately.
- High-contrast serif display + monospace labels + grotesque body — a three-voice typographic system.
- Hierarchy from scale, weight, and whitespace; almost no borders, zero nested cards.
- Restrained motion everywhere except the Lanyard.

## 2. Colors

A tinted near-black canvas carrying warm off-white text and a single scarce gold accent — monochrome discipline with one warm voice.

### Primary
- **Signal Gold** (`#C9A227`): The one accent. Reserved for the italic last name in the hero, the single filled primary button (GitHub), link hovers, the active nav item, and small emphasis marks. It is the only saturated color on the page and it is spent on ≤10% of any screen.
- **Gold Deep** (`#A9871C`): The pressed / hover state of Signal Gold on filled surfaces. Never used at rest.

### Neutral
- **Ink Black** (`#0B0B0C`): The page canvas. Tinted near-black — warm and slightly lifted off true black so the grid and text read as paper-and-ink, not void.
- **Panel Black** (`#111113`): The faintly-raised surface for the status pill, chat input, and chat message bubbles. One step up from the canvas, tonal not bordered.
- **Off-White** (`#ECE7DD`): Primary text and the first line of the display name. Warm, never pure white, so it sits on the near-black without glare.
- **Muted Gray** (`#978F82`): Secondary text — descriptions, tech-stack lines, dates, skill tags. Tinted warm, never a cold gray-on-color. Holds 6.15:1 on the canvas (WCAG AA).
- **Faint Gray** (`#847E73`): Tertiary text, separators (`·`, `//`), inactive nav, footer fine print. Tuned to 4.88:1 on the canvas so even small mono labels pass WCAG AA.
- **Grid Line** (`#1B1B1E`): The graph-paper overlay lines — barely above the canvas, felt more than seen.

### Tertiary
- **Status Green** (`#5FB87A`): The single pulsing dot in the status pill. A live signal, used nowhere else.

### Named Rules
**The One Voice Rule.** Signal Gold appears on ≤10% of any given screen. Its rarity is the entire point — the moment two golds compete, both lose. There is exactly one filled gold button per view (GitHub); everything else is ghost.

**The No-Pure-Black Rule.** The canvas is `#0B0B0C`, never `#000`. Pure black is forbidden; the tint is what makes it read as considered.

## 3. Typography

**Display Font:** Fraunces (with Newsreader, then Georgia, serif as fallback)
**Body Font:** Hanken Grotesk (with Geist, then system-ui as fallback)
**Label/Mono Font:** JetBrains Mono (with Space Mono, then ui-monospace as fallback)

**Character:** A three-voice system. The serif is high-contrast and confident with a true italic cut used as accent; the monospace is the technical marginalia (labels, eyebrows, nav, tech stacks); the grotesque is calm, legible running text. The tension between an editorial serif and engineer's monospace *is* the brand. All fonts load with `font-display: swap`.

### Hierarchy
- **Display** (500, `clamp(3rem, 9vw, 6.5rem)`, line-height 0.92, letter-spacing −0.02em): The two-line name. First name in Off-White (roman), last name in Signal Gold (italic). Tight leading so the two lines lock together.
- **Tagline** (400 italic, `clamp(1.25rem, 2.5vw, 1.75rem)`, line-height 1.3): The one-line serif italic tagline beneath the name.
- **Headline** (500, `clamp(1.75rem, 4vw, 2.5rem)`, line-height 1.05): Section titles (Projects, Experience, About…), serif.
- **Title** (500, `1.125rem`, line-height 1.3): Project titles and role names within lists, grotesque or serif.
- **Body** (400, `1rem`, line-height 1.65): Running text. Capped at ~70ch line length for readability.
- **Label** (500, `0.75rem`, letter-spacing 0.12em, UPPERCASE): Eyebrows, nav, button text, tech-stack lines, skill chips, the ticker. Monospace. Separated with `//` or `·`.

### Named Rules
**The Two-Voice Name Rule.** The display name is always exactly two lines: first name roman off-white, last name italic gold. Never one line, never all-gold, never all-roman.

**The Mono-For-Machines Rule.** Anything that is metadata — labels, nav, tech stacks, dates, the status pill — is monospace and uppercased. Anything that is *prose* is grotesque. Anything that is *voice* (name, tagline, section titles) is serif. Never mix the roles.

## 4. Elevation

Flat by doctrine. This system uses **tonal layering**, not shadows. Depth is conveyed by the one-step lift from Ink Black (`#0B0B0C`) to Panel Black (`#111113`) and by the faint graph-paper grid, never by drop shadows or glows. The grid is a single fixed full-page background overlay, not a per-section repeat. The only literal depth in the experience is the real 3D of the Lanyard badge.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat at rest. There are no `box-shadow` drops, no `backdrop-filter` blurs, no neon glows. A surface distinguishes itself by tone (`#111113` vs `#0B0B0C`), not by lifting off the page. If you reach for a shadow, reach for spacing instead.

## 5. Components

### Buttons
- **Shape:** Square-ish, near-sharp corners (2px radius). Monospace uppercase labels with 0.12em tracking.
- **Primary:** Filled Signal Gold (`#C9A227`) on Ink Black text, padding 12px 24px. Exactly one per view — GitHub. Hover deepens to Gold Deep (`#A9871C`) with a 2px upward translate (ease-out, ~180ms).
- **Ghost:** Transparent with a 1px Faint Gray hairline border, Off-White label. Hover shifts the label and border to Signal Gold. Used for LinkedIn, Email, Résumé, and all secondary actions.
- **Focus:** Visible 2px gold focus ring (`outline` offset), never removed.

### Chips (skill tags)
- **Style:** Transparent, Muted Gray monospace label, optional 1px hairline. No fill, no pill shape — a 2px-radius tag. Separated by whitespace, wrapping into a cluster.
- **State:** Static; non-interactive. Color alone never carries meaning.

### Cards / Containers
- **Doctrine:** Avoid them. Projects and experience are *lists*, not card grids. Where a faint surface is unavoidable (chat bubbles, status pill), use Panel Black (`#111113`) tonal lift at 2px radius — never a bordered card, never a card inside a card.

### Inputs / Fields
- **Style:** Panel Black (`#111113`) fill, 1px Faint Gray hairline, 2px radius, grotesque body text. Used in the chat composer.
- **Focus:** Border shifts to Signal Gold with a 2px gold focus ring. No glow.

### Navigation
- **Style:** Sticky top bar, monospace uppercase. Left: brand mark `SAMUEL · TAN`. Center: anchor links (`PROJECTS · EXPERIENCE · ABOUT · CHAT · CONTACT`) that smooth-scroll. Right: status pill + `RESUME` link.
- **States:** Default Faint/Muted Gray, hover and active in Off-White / Signal Gold. Active section reflected in the nav. Collapses to a clean mobile menu below `md`. Keyboard-navigable with visible focus.

### Status Pill (signature)
- Panel Black pill (`#111113`, fully rounded), monospace label `Incoming AI/ML @ HTX`, preceded by a single Status Green (`#5FB87A`) dot that pulses gently (and holds still under `prefers-reduced-motion`).

### Lanyard Badge (signature)
- A real 3D badge (React Bits Lanyard) hanging from the top of the hero's right column, swinging on rope physics. Card face shows `SAMUEL TAN`, `Full-Stack · AI/ML`, `NTU Computer Science`, `@SAMTAN444`, with an `ST` initials block. Lazy-loaded behind a lightweight fallback; replaced by a static badge below `md`; auto-motion disabled under `prefers-reduced-motion`.

### Status Ticker (signature)
- Full-width horizontal marquee, monospace labeled segments (`TARGETING  AI/ML & Backend roles · 2027`, `LOCATION  Singapore`, `BUILDING  Production RAG system`), separated by `·`. Smooth infinite scroll, pauses on hover, fully disabled under `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do:
- **Do** keep the canvas tinted near-black (`#0B0B0C`) under a single fixed faint graph-paper grid overlay.
- **Do** render the display name as two lines: first name roman Off-White, last name italic Signal Gold.
- **Do** reserve Signal Gold (`#C9A227`) for ≤10% of any screen and exactly one filled button (GitHub).
- **Do** build Projects and Experience as clean *lists*, leaning on scale and whitespace for hierarchy.
- **Do** use monospace uppercase for all metadata (labels, nav, tech stacks, dates) and cap body text at ~70ch.
- **Do** keep motion restrained — short ease-out fade/translate — and let the Lanyard be the only spectacle.
- **Do** honor `prefers-reduced-motion`: freeze the ticker, scroll-in animations, and Lanyard auto-motion.

### Don't:
- **Don't** use pure black (`#000`); the tint on `#0B0B0C` is the point.
- **Don't** use Inter or system-default fonts for display or body.
- **Don't** use purple→blue gradients anywhere.
- **Don't** use glassmorphism — no frosted translucent panels or `backdrop-filter` blurs.
- **Don't** nest cards inside cards, or default to a card grid where a list reads better.
- **Don't** add dark-mode neon glows or `box-shadow` drops; this system is flat with tonal layering.
- **Don't** use bounce or elastic easing; ease-out only, small distances.
- **Don't** use emoji as icons.
