# Samuel Tan — Portfolio

A single-page, dark, editorial portfolio for a software / AI-ML engineer — with a
retrieval-augmented (RAG) chatbot that answers questions from my own documents and
a live "How it works" panel that visualizes the real retrieval pipeline.

**Live:** https://samueltan.dev

**Stack:** Vite + React 19 + TypeScript + Tailwind CSS v3 — a pure client-side SPA
(no SSR) deployed as a static build on **AWS S3 + CloudFront**. The chatbot backend
is a separate **FastAPI** service (Anthropic API + local embeddings) on **Render**.
Design quality enforced with [Impeccable](https://impeccable.style) — see
`PRODUCT.md` and `DESIGN.md`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173 (talks to localhost:8000 via .env)
npm run build      # type-check + production build to dist/ (uses .env.production)
npm run preview    # serve the production build locally
```

## Configuration

The only knob is the RAG backend URL, read in `src/lib/rag.ts`:

| File | Used by | Value |
|---|---|---|
| `.env` (git-ignored) | `npm run dev` | `VITE_API_BASE_URL=http://localhost:8000` |
| `.env.production` (tracked) | `npm run build` | `VITE_API_BASE_URL=https://…onrender.com` |

An empty `VITE_API_BASE_URL` = mock mode (canned chat answers, no backend needed).

## Structure

```
src/
  components/      shared UI primitives (Nav, Button, StatusPill, Reveal, icons…)
  sections/        page sections (Hero, Experience, Projects, About, Chat,
                   PipelinePanel, Contact, Footer)
  lib/rag.ts       the seam the RAG backend plugs into — askMyAI()
  lib/chatBus.ts   tiny event bus (a project's "Ask" prefills the chat)
  data/content.ts  all real content (one source of truth)
  hooks/           prefers-reduced-motion, active-section
  theme.css        grid backdrop, keyframes, reduced-motion rules
tailwind.config.js design tokens (mirrors DESIGN.md frontmatter)
public/            favicon, résumé / recommendation-letter PDFs, company logos
```

## The RAG chatbot

The backend lives in [`backend/`](backend/README.md) — a FastAPI service doing
retrieval-augmented answers over my own documents. Deliberately low-infra:

- **Answers** — Claude via the **Anthropic API** (`claude-haiku-4-5`).
- **Embeddings** — **local** (`fastembed`, runs on CPU, no API key).
- **Vector store** — a **local file** (`rag_index.pkl`). No database.
- **Guards** — out-of-scope refusal, source-cited answers, and per-IP rate limiting.

The flow — query → embed → cosine vector search → relevance gate → grounded, cited
answer — is visualized live per query by `src/sections/PipelinePanel.tsx` (the
"How it works" panel beside the chat). Dense retrieval today; hybrid search and
reranking are on the roadmap.

- **Add documents**: drop PDFs / résumé in [`backend/documents/`](backend/documents/README.md),
  then `python -m app.ingest`.
- **Run it**: see [`backend/README.md`](backend/README.md).
- **Connect the site**: set `.env` → `VITE_API_BASE_URL=http://localhost:8000`, restart `npm run dev`.

All retrieval/answer logic stays behind `askMyAI(query): Promise<ChatResponse>` in
`src/lib/rag.ts`; `ChatResponse` carries `citations` and a real retrieval `trace`
that the panel renders.

## Deploy

Frontend → **S3 + CloudFront**, backend → **Render**, DNS → **Cloudflare**
(`samueltan.dev`). Full runbook in [`DEPLOY.md`](DEPLOY.md). In short: deploy the
backend, build the frontend with `.env.production` pointing at it, sync `dist/` to
S3, invalidate CloudFront, and set the backend's `CORS_ORIGINS` to the site origin.

## Project docs

- [`PRODUCT.md`](PRODUCT.md) — strategy: audience, voice, principles.
- [`DESIGN.md`](DESIGN.md) — the visual design system (tokens, type, components).
- [`DEPLOY.md`](DEPLOY.md) — deployment runbook.
- [`backend/README.md`](backend/README.md) — the RAG service.
