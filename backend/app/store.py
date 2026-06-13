"""Local file-based vector index.

The whole corpus is small (a résumé, a transcript, a few PDFs), so we keep it
dead simple: a pickle holding a normalized embedding matrix plus parallel chunk
metadata. Search is a single matrix-vector product — no database, no server.
"""

from __future__ import annotations

import pickle
from dataclasses import dataclass
from typing import Any

import numpy as np

from .config import settings


@dataclass
class Hit:
    source: str
    page: int
    chunk_index: int
    content: str
    similarity: float


def save(embeddings: np.ndarray, chunks: list[dict[str, Any]]) -> None:
    payload = {
        "model": settings.embed_model,
        "embeddings": embeddings.astype(np.float32),
        "chunks": chunks,
    }
    with open(settings.index_path, "wb") as f:
        pickle.dump(payload, f)


_cache: dict[str, Any] | None = None


def is_built() -> bool:
    return settings.index_path.exists()


def _load() -> dict[str, Any]:
    global _cache
    if _cache is None:
        if not is_built():
            raise FileNotFoundError(
                f"Index not built. Run `python -m app.ingest` first "
                f"(expected {settings.index_path})."
            )
        with open(settings.index_path, "rb") as f:
            _cache = pickle.load(f)
    return _cache


def search(query_vec: np.ndarray, k: int) -> list[Hit]:
    data = _load()
    emb: np.ndarray = data["embeddings"]
    chunks: list[dict[str, Any]] = data["chunks"]
    if len(chunks) == 0:
        return []

    sims = emb @ query_vec  # both sides are unit vectors → cosine similarity
    top = np.argsort(-sims)[:k]
    return [
        Hit(
            source=chunks[i]["source"],
            page=chunks[i]["page"],
            chunk_index=chunks[i]["chunk_index"],
            content=chunks[i]["content"],
            similarity=float(sims[i]),
        )
        for i in top
    ]
