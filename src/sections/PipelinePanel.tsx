/*
 * PipelinePanel — the live "How it works" visualizer.
 *
 * Driven by the real per-query trace the backend emits (src/lib/rag.ts RagTrace):
 * it shows the ACTUAL pipeline — query → embed → dense vector search (with the
 * retrieved chunks + cosine scores) → relevance gate → grounded answer — with
 * real timings. Honest about what's live: hybrid search + reranking are marked
 * as roadmap, not shown as active.
 */
import type { ReactNode } from 'react'
import { Eyebrow } from '../components/Eyebrow'
import type { RagTrace } from '../lib/rag'

const truncate = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s)
const shortModel = (m: string) => m.split('/').pop() ?? m

export function PipelinePanel({
  trace,
  pending,
  query,
}: {
  trace?: RagTrace | null
  pending?: boolean
  query?: string
}) {
  const live = !!trace
  const t = trace

  return (
    <aside
      id="pipeline"
      aria-label="How the assistant works"
      className="self-start rounded-sm border border-grid p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <Eyebrow className="!text-faint">// HOW IT WORKS</Eyebrow>
        {pending && (
          <span className="inline-flex items-center gap-1.5 font-mono text-label uppercase text-gold">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-gold" />
            running
          </span>
        )}
      </div>

      <p className="mt-3 font-display text-lg text-offwhite">Retrieval pipeline</p>
      <p className="prose-measure mt-1 text-sm leading-relaxed text-faint">
        The real flow behind each answer — embed the question, dense vector-search my documents,
        gate for relevance, then a grounded, cited reply.
      </p>

      <ol className="mt-6 flex flex-col gap-3">
        <Stage n="01" label="QUERY" active={live || !!pending}>
          {query ? `“${truncate(query, 40)}”` : '—'}
        </Stage>

        <Stage n="02" label="EMBED" active={live}>
          {t ? `${shortModel(t.embedModel)} · ${t.dims}-dim · ${t.timings.embedMs}ms` : '—'}
        </Stage>

        <Stage n="03" label="VECTOR SEARCH" active={live}>
          {t ? `top-${t.topK} · cosine · ${t.timings.searchMs}ms` : '—'}
          {t && t.retrieved.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {t.retrieved.map((c, i) => (
                <Bar key={`${c.source}-${c.page}-${i}`} label={chunkLabel(c.source, c.page)} value={c.similarity} threshold={t.threshold} />
              ))}
            </ul>
          )}
        </Stage>

        <Stage n="04" label="RELEVANCE GATE" active={live}>
          {t ? (
            <span className="inline-flex flex-wrap items-center gap-2">
              best {t.bestSimilarity.toFixed(2)} {t.refused ? '<' : '≥'} {t.threshold.toFixed(2)}
              <span
                className={`rounded-sm px-1.5 py-0.5 text-[0.65rem] ${
                  t.refused ? 'bg-panel text-muted' : 'bg-gold/15 text-gold'
                }`}
              >
                {t.refused ? 'OUT OF SCOPE' : 'PASS'}
              </span>
            </span>
          ) : (
            '—'
          )}
        </Stage>

        <Stage n="05" label="GROUNDED ANSWER" active={live && !t?.refused}>
          {t
            ? t.refused
              ? 'refused — no model call'
              : `${t.timings.generateMs}ms · ${t.retrieved.length} sources cited`
            : '—'}
        </Stage>
      </ol>

    </aside>
  )
}

function chunkLabel(source: string, page: number): string {
  const name = truncate(source, 22)
  return page ? `${name} · p${page}` : name
}

function Stage({
  n,
  label,
  active,
  children,
}: {
  n: string
  label: string
  active?: boolean
  children: ReactNode
}) {
  return (
    <li className="flex gap-3">
      <span className={`font-mono text-label ${active ? 'text-gold' : 'text-faint/60'}`}>{n}</span>
      <div className="min-w-0 flex-1">
        <p className={`font-mono text-label uppercase ${active ? 'text-offwhite' : 'text-faint/60'}`}>
          {label}
        </p>
        <div className="mt-1 font-mono text-[0.72rem] leading-relaxed text-muted">{children}</div>
      </div>
    </li>
  )
}

function Bar({ label, value, threshold }: { label: string; value: number; threshold: number }) {
  const pct = Math.max(4, Math.min(100, value * 120)) // scale cosine (~0.3–0.7) into a readable bar
  const hot = value >= threshold
  return (
    <li className="flex items-center gap-3">
      <span className="w-[8.5rem] shrink-0 truncate text-faint" title={label}>
        {label}
      </span>
      <span className="relative h-1 flex-1 overflow-hidden rounded-full bg-grid">
        <span
          className={`absolute inset-y-0 left-0 rounded-full ${hot ? 'bg-gold' : 'bg-faint'}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className={`w-10 shrink-0 text-right tabular-nums ${hot ? 'text-gold' : 'text-faint'}`}>
        {value.toFixed(2)}
      </span>
    </li>
  )
}
