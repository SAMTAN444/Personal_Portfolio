# Portfolio RAG backend

A small FastAPI service that answers questions about Samuel using a retrieval-
augmented pipeline over his own documents. Deliberately low-infra:

- **Answers** — Claude via the **Anthropic API** (`claude-haiku-4-5` by default).
- **Embeddings** — **local** (`fastembed`, runs on CPU, no API key, downloads once).
- **Vector store** — a **local file** (`rag_index.pkl`). No database, no Docker.

One secret for the whole thing: `ANTHROPIC_API_KEY`.

```
documents/  ← drop your PDFs + résumé here (the corpus)
app/
  config.py      env-driven settings (model, embed model, thresholds)
  embeddings.py  local embeddings via fastembed (normalized for cosine)
  store.py       local file index + brute-force cosine search
  ingest.py      PDF/text → chunk → embed → write rag_index.pkl
  retrieval.py   semantic search + out-of-scope cutoff
  generate.py    Claude (Anthropic API) — grounded, cited, refuses out-of-scope
  main.py        FastAPI: POST /chat -> { answer, citations[] }
```

## Setup

```bash
cd backend
cp .env.example .env            # then set ANTHROPIC_API_KEY

python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Put resume.pdf + any other PDFs in ./documents, then build the index
# (first run downloads the ~33MB embedding model; no API key needed for this step)
python -m app.ingest

# Run the API
uvicorn app.main:app --reload --port 8000
```

Check it: `curl localhost:8000/health` → `{"status":"ok","indexed":true,...}`.

Try a query (needs `ANTHROPIC_API_KEY` set):

```bash
curl -s localhost:8000/chat -H 'content-type: application/json' \
  -d '{"query":"What did Samuel study at NTU?"}' | python -m json.tool
```

## Point the site at it

In the **frontend** `.env` (project root):

```bash
VITE_API_BASE_URL=http://localhost:8000
```

Restart `npm run dev`. The Chat section now answers from your corpus instead of
the canned mock. Leave `VITE_API_BASE_URL` empty to go back to mock mode.

## How it answers (v1)

- **Retrieve**: embed the question locally, cosine-search the top `TOP_K` chunks.
- **Refuse out-of-scope**: if the best match is below `MIN_SIMILARITY`, return a
  refusal without calling Claude (no hallucination, no spend).
- **Generate**: Claude answers *only* from the retrieved chunks, cites sources by
  number, and the API returns those chunks as structured citations.

Structured so the PRODUCT.md roadmap — hybrid (BM25 + vector) search, a reranking
pass, and an evaluation harness — drops in behind the same `/chat` contract.

## Cost & deploy

- **Embeddings + vector store: $0** (local, in-process).
- **Answers**: pay-per-use Claude — Haiku 4.5 ≈ $0.003/question. Cents at portfolio
  volume. Set `ANTHROPIC_MODEL=claude-opus-4-8` for top quality (~$0.017/question).
- **Hosting**: one small container (see `Dockerfile`) on a free tier (Render /
  Fly.io / Railway) or a tiny VPS. Set `ANTHROPIC_API_KEY` + `CORS_ORIGINS` (your
  CloudFront domain) as env vars. The index is baked into the image at build;
  rebuild whenever `documents/` changes.

> **Résumé download button.** The site serves `public/resume.pdf` for the download
> button (separate from the corpus). Keep both in sync:
> `cp backend/documents/resume.pdf public/resume.pdf`.
