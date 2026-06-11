/*
 * A tiny typed event bus so a "Details →" on a project can hand a question to the
 * Chat composer without coupling the two sections through shared state or a store.
 * Plain DOM CustomEvent — no state library, no storage.
 */

const PREFILL_EVENT = 'rag:prefill'

/** Fire a question at the chat composer (it focuses the input, doesn't auto-send). */
export function prefillChat(question: string): void {
  window.dispatchEvent(new CustomEvent<string>(PREFILL_EVENT, { detail: question }))
}

/** Subscribe the composer to prefill requests. Returns an unsubscribe fn. */
export function onPrefillChat(handler: (question: string) => void): () => void {
  const listener = (e: Event) => handler((e as CustomEvent<string>).detail)
  window.addEventListener(PREFILL_EVENT, listener)
  return () => window.removeEventListener(PREFILL_EVENT, listener)
}
