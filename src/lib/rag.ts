/*
 * rag.ts — the single seam the RAG backend plugs into.
 *
 * Everything the Chat section needs goes through `askMyAI`. Mock mode returns a
 * canned placeholder; live mode POSTs to the FastAPI backend and gets back the
 * answer, citations, and a real retrieval `trace` (which the PipelinePanel
 * visualizes).
 */

/** A grounded source the assistant cites. Rendered once the backend supplies them. */
export type Citation = {
  id: string
  title: string
  snippet?: string
  url?: string
}

/** One chunk the vector search returned, with its cosine score. */
export type RetrievedChunk = {
  source: string
  page: number
  similarity: number
}

/** The real per-query pipeline record the backend emits (see backend/app/main.py). */
export type RagTrace = {
  embedModel: string
  dims: number
  topK: number
  threshold: number
  bestSimilarity: number
  refused: boolean
  retrieved: RetrievedChunk[]
  timings: { embedMs: number; searchMs: number; generateMs: number }
}

export type ChatResponse = {
  answer: string
  citations?: Citation[]
  trace?: RagTrace
}

/** Base URL of the RAG API. Empty string = mock mode (no backend yet). */
const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? ''

const PLACEHOLDER_ANSWER =
  'This assistant will soon answer questions about my work using a RAG pipeline — coming once the backend is wired up.'

/**
 * Ask the assistant a question about Samuel's work.
 *
 * Mock mode (no VITE_API_BASE_URL): resolves a canned placeholder after a short
 * delay so the UI can be built and felt end-to-end. Live mode: POSTs to the
 * backend and expects a {@link ChatResponse}.
 */
export async function askMyAI(query: string): Promise<ChatResponse> {
  if (!API_BASE_URL) {
    await new Promise((resolve) => setTimeout(resolve, 650))
    return { answer: PLACEHOLDER_ANSWER }
  }

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  })

  // Rate-limited: surface the friendly message instead of a generic error.
  if (res.status === 429) {
    let message = "You're sending messages a bit fast — give it a moment and try again."
    try {
      const body = (await res.json()) as { detail?: string }
      if (body?.detail) message = body.detail
    } catch {
      /* keep the default message */
    }
    return { answer: message }
  }

  if (!res.ok) {
    throw new Error(`Assistant request failed (${res.status})`)
  }

  return (await res.json()) as ChatResponse
}
