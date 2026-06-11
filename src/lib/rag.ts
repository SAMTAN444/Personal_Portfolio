/*
 * rag.ts — the single seam the real RAG backend plugs into later.
 *
 * Everything the Chat section needs goes through `askMyAI`. Today it returns a
 * canned placeholder; when the FastAPI + pgvector + Bedrock backend is wired up,
 * only the body of `askMyAI` changes — the section, the types, and the
 * PipelinePanel slot stay put.
 */

/** A grounded source the assistant cites. Rendered once the backend supplies them. */
export type Citation = {
  id: string
  title: string
  snippet?: string
  url?: string
}

export type ChatResponse = {
  answer: string
  citations?: Citation[]
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

  if (!res.ok) {
    throw new Error(`Assistant request failed (${res.status})`)
  }

  return (await res.json()) as ChatResponse
}
