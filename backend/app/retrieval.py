"""Retrieval over the local index.

v1 is dense (semantic) search with a cosine cutoff for out-of-scope detection.
The call site stays the same if hybrid (BM25 + vector) or reranking slot in later.
"""

from __future__ import annotations

from typing import TypedDict

from . import store
from .config import settings
from .embeddings import embed_text


class Chunk(TypedDict):
    source: str
    page: int
    chunk_index: int
    content: str
    similarity: float


def search(query: str, k: int | None = None) -> list[Chunk]:
    k = k or settings.top_k
    query_vec = embed_text(query)
    hits = store.search(query_vec, k)
    return [
        Chunk(
            source=h.source,
            page=h.page,
            chunk_index=h.chunk_index,
            content=h.content,
            similarity=h.similarity,
        )
        for h in hits
    ]
