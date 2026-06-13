"""Answer generation with Claude via the Anthropic API.

Grounded, source-cited answers with out-of-scope refusal. The client is created
lazily so the rest of the pipeline (ingest, embeddings) runs without an API key —
only answer generation needs ANTHROPIC_API_KEY.
"""

from __future__ import annotations

from functools import lru_cache

from anthropic import Anthropic

from .config import settings
from .retrieval import Chunk

SYSTEM_PROMPT = """You are the assistant on Samuel Tan's personal portfolio. You answer questions about Samuel — his projects, experience, skills, and background — for recruiters, hiring managers, and engineers.

Rules:
- Answer ONLY from the provided context. Do not use outside knowledge or invent details.
- If the context does not contain the answer, say so plainly: "I don't have that in Samuel's materials yet." Do not guess.
- Cite the sources you used with their bracket numbers, e.g. [1], [2], inline in the sentence.
- Be concrete and professional — no marketing fluff, no preamble, no narrating your reasoning.

Format your answer as clear, conversational prose — plain sentences in short paragraphs, the way you'd explain it to someone in person. Keep it concise: usually 2–4 sentences, and at most three short paragraphs. Do NOT use any markdown formatting: no headings, no bold or asterisks, no bullet points, and no numbered lists. Just readable paragraphs."""


@lru_cache(maxsize=1)
def _client() -> Anthropic:
    # Reads ANTHROPIC_API_KEY from the environment.
    return Anthropic()


def build_context(chunks: list[Chunk]) -> str:
    blocks = []
    for i, c in enumerate(chunks, start=1):
        loc = c["source"] + (f", p.{c['page']}" if c["page"] else "")
        blocks.append(f"[{i}] (source: {loc})\n{c['content']}")
    return "\n\n".join(blocks)


def generate_answer(query: str, chunks: list[Chunk]) -> str:
    user = f"Context:\n{build_context(chunks)}\n\nQuestion: {query}"
    # Minimal, model-portable call (works on Haiku 4.5 and Opus 4.8 alike).
    message = _client().messages.create(
        model=settings.anthropic_model,
        max_tokens=settings.max_tokens,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": user}],
    )
    return "".join(block.text for block in message.content if block.type == "text").strip()
