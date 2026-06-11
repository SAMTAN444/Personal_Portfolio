/*
 * PipelinePanel — RESERVED SLOT (do not build yet).
 *
 * This is where the "how it works" retrieval visualizer will live: a panel that
 * animates the RAG pipeline (query → embed → hybrid search → rerank → grounded
 * answer with citations) alongside the chat. For now it renders only a quiet
 * placeholder so the anchor, layout slot, and routing exist. When the backend
 * lands, replace the body below; the ChatSection already reserves the column.
 *
 * Intentionally minimal. See src/lib/rag.ts (ChatResponse.citations) for the
 * data this panel will consume.
 */
import { Eyebrow } from '../components/Eyebrow'

export function PipelinePanel() {
  return (
    <aside
      id="pipeline"
      aria-label="How the assistant works"
      className="rounded-sm border border-dashed border-grid p-6"
    >
      <Eyebrow className="!text-faint">// HOW IT WORKS</Eyebrow>
      <p className="mt-4 font-display text-lg text-muted">Pipeline visualizer</p>
      <p className="prose-measure mt-2 text-sm leading-relaxed text-faint">
        A live view of the retrieval pipeline — query, hybrid search, reranking, and grounded,
        source-cited answers — will render here once the backend is wired up.
      </p>

      {/* Placeholder stages, purely indicative of the reserved layout. */}
      <ol className="mt-6 flex flex-col gap-2">
        {['QUERY', 'EMBED', 'HYBRID SEARCH', 'RERANK', 'GROUNDED ANSWER'].map((stage, i) => (
          <li key={stage} className="flex items-center gap-3 font-mono text-label uppercase text-faint">
            <span className="text-gold/60">{String(i + 1).padStart(2, '0')}</span>
            {stage}
          </li>
        ))}
      </ol>
    </aside>
  )
}
