// Chat — the RAG chatbot stub. Messages list + input + send, wired to askMyAI
// (mock today, real backend later via the same seam). Citations render when the
// response carries them. The PipelinePanel slot sits alongside, reserved.
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { PipelinePanel } from './PipelinePanel'
import { SendIcon } from '../components/icons'
import { askMyAI, type Citation, type RagTrace } from '../lib/rag'
import { onPrefillChat } from '../lib/chatBus'

type Message = {
  id: number
  role: 'user' | 'assistant'
  text: string
  citations?: Citation[]
}

const SUGGESTIONS = [
  'What did you do at Singtel?',
  'What did you do at Fleur Capital?',
  'How does Optima recommend schools?',
]

export function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const [trace, setTrace] = useState<RagTrace | null>(null)
  const [lastQuery, setLastQuery] = useState('')
  const nextId = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // A project's "Details →" hands us a question; drop it in the composer and
  // focus it so the user can edit or send. We don't auto-send.
  useEffect(
    () =>
      onPrefillChat((question) => {
        setInput(question)
        inputRef.current?.focus()
      }),
    [],
  )

  async function send(query: string) {
    const trimmed = query.trim()
    if (!trimmed || pending) return

    const userMsg: Message = { id: nextId.current++, role: 'user', text: trimmed }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLastQuery(trimmed)
    setPending(true)

    try {
      const res = await askMyAI(trimmed)
      setTrace(res.trace ?? null)
      setMessages((prev) => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: res.answer, citations: res.citations },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId.current++,
          role: 'assistant',
          text: 'Something went wrong reaching the assistant. Please try again.',
        },
      ])
    } finally {
      setPending(false)
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    void send(input)
  }

  return (
    <Section id="chat">
      <SectionHeading
        id="chat"
        index="04"
        eyebrow="ASK MY AI"
        title="Chat with my work"
      />

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        {/* Conversation */}
        <div className="flex flex-col rounded-sm border border-grid bg-panel/60">
          <div
            className="flex min-h-[320px] flex-1 flex-col gap-4 overflow-y-auto p-5"
            aria-live="polite"
            aria-label="Conversation"
          >
            {messages.length === 0 ? (
              <div className="m-auto max-w-sm text-center">
                <p className="prose-measure text-base leading-relaxed text-muted">
                  Ask about my projects, experience, or stack. Answers come from a small RAG
                  pipeline over my own documents — grounded, source-cited, and it&rsquo;ll say when
                  it doesn&rsquo;t know. Watch it work in the panel.
                </p>
                <ul className="mt-5 flex flex-col items-center gap-2">
                  {SUGGESTIONS.map((s) => (
                    <li key={s}>
                      <button
                        type="button"
                        onClick={() => void send(s)}
                        className="font-mono text-label uppercase text-faint transition-colors hover:text-gold"
                      >
                        {s}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              messages.map((m) => <ChatBubble key={m.id} message={m} />)
            )}

            {pending && (
              <div className="self-start font-mono text-label uppercase text-faint">
                Thinking<span className="animate-pulse-dot">…</span>
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={onSubmit} className="flex items-center gap-2 border-t border-grid p-3">
            <label htmlFor="chat-input" className="sr-only">
              Ask a question about Samuel's work
            </label>
            <input
              id="chat-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my work…"
              autoComplete="off"
              className="flex-1 bg-transparent px-2 py-2 font-body text-base text-offwhite placeholder:text-faint focus:outline-none"
            />
            <button
              type="submit"
              disabled={pending || input.trim().length === 0}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-gold text-ink transition-colors duration-200 ease-out hover:bg-gold-deep disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </div>

        {/* Live "how it works" — visualizes the real retrieval trace per query. */}
        <PipelinePanel trace={trace} pending={pending} query={lastQuery} />
      </div>
    </Section>
  )
}

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'
  return (
    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
      <span className="mb-1 font-mono text-[0.65rem] uppercase tracking-label text-faint">
        {isUser ? 'You' : 'Assistant'}
      </span>
      <div
        className={`max-w-[85%] rounded-sm px-4 py-3 text-base leading-relaxed ${
          isUser ? 'bg-panel text-offwhite' : 'border border-grid text-muted'
        }`}
      >
        {/* Render prose as paragraphs so blank-line breaks read cleanly. */}
        {message.text
          .split(/\n{2,}/)
          .map((para) => para.trim())
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className={i > 0 ? 'mt-3' : undefined}>
              {para}
            </p>
          ))}
        {message.citations && message.citations.length > 0 && (
          <ul className="mt-3 flex flex-col gap-1 border-t border-grid pt-3">
            {message.citations.map((c) => (
              <li key={c.id} className="font-mono text-label uppercase text-faint">
                {c.url ? (
                  <a href={c.url} className="hover:text-gold" target="_blank" rel="noopener noreferrer">
                    {c.title}
                  </a>
                ) : (
                  c.title
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
