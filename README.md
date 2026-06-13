# Samuel Tan — Portfolio

A single-page, dark, editorial portfolio for a software / AI-ML engineer. Built to
later host a RAG chatbot and a "how it works" pipeline panel without rework.

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v3. Pure client-side SPA
(no SSR), targeting a static build on S3 + CloudFront. Design quality enforced
with [Impeccable](https://impeccable.style) — see `PRODUCT.md` and `DESIGN.md`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve the production build locally
```

## Configuration

Copy `.env.example` to `.env`. The only knob is the RAG backend:

```bash
VITE_API_BASE_URL=   # empty = mock mode (canned chat answers); set to enable the live backend
```

## Structure

```
src/
  components/      shared UI primitives (Nav, Button, Ticker, Reveal, icons…)
    lanyard/       React Bits 3D Lanyard + custom badge face (lazy-loaded)
  sections/        page sections (Hero, Projects, Experience, About, Chat, Contact, Footer)
  lib/rag.ts       the single seam the RAG backend plugs into — askMyAI()
  data/content.ts  all real content (one source of truth)
  hooks/           reduced-motion, media query, active-section
  theme.css        grid backdrop, keyframes, reduced-motion rules
tailwind.config.js design tokens (mirrors DESIGN.md frontmatter)
```

## The RAG chatbot

The backend lives in [`backend/`](backend/README.md) — a FastAPI service doing
retrieval-augmented answers over your own documents with **Amazon Bedrock**
(Claude + Titan embeddings) and **Postgres/pgvector**.

- **Add your documents**: drop all your PDFs and your résumé in
  [`backend/documents/`](backend/documents/README.md), then run `python -m app.ingest`.
- **Run it**: see `backend/README.md` (Docker Postgres + `uvicorn`).
- **Connect the site**: set `VITE_API_BASE_URL=http://localhost:8000` in the root
  `.env` and restart `npm run dev`.

On the frontend, all retrieval/answer logic stays behind
`askMyAI(query): Promise<ChatResponse>` in `src/lib/rag.ts` — empty
`VITE_API_BASE_URL` = canned mock; set it = live backend. `ChatResponse` carries
`citations` (rendered by `ChatSection`), and `src/sections/PipelinePanel.tsx` is the
reserved slot for the retrieval visualizer (anchor `#pipeline`).

## The Lanyard

3D badge from [React Bits](https://reactbits.dev/components/lanyard)
(`@react-three/fiber` · `drei` · `rapier` · `three` · `meshline`, with `card.glb`).
The badge face is customized by compositing an SVG (`src/components/lanyard/badgeFace.ts`)
onto the card texture. It is code-split via `React.lazy`, mounts only on `md+`
viewports with motion allowed, and falls back to a static badge on mobile / under
`prefers-reduced-motion`.

## Deploy (S3 + CloudFront)

`npm run build` emits a static `dist/`. Upload to S3, serve via CloudFront, and add
an SPA fallback (403/404 → `/index.html`). Replace `public/resume.pdf` with the real
résumé.
