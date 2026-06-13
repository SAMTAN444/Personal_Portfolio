"""Local embeddings via fastembed (CPU, ONNX) — no API key, no network at request
time after the model has downloaded once.

Vectors are L2-normalized so a dot product equals cosine similarity, which keeps
retrieval (a matrix-vector product) trivial.
"""

from __future__ import annotations

from functools import lru_cache

import numpy as np
from fastembed import TextEmbedding

from .config import settings


@lru_cache(maxsize=1)
def _model() -> TextEmbedding:
    # First construction downloads the model into the fastembed cache.
    return TextEmbedding(model_name=settings.embed_model)


def embed_texts(texts: list[str]) -> np.ndarray:
    vecs = np.asarray(list(_model().embed(texts)), dtype=np.float32)
    norms = np.linalg.norm(vecs, axis=1, keepdims=True)
    norms[norms == 0] = 1.0
    return vecs / norms


def embed_text(text: str) -> np.ndarray:
    return embed_texts([text])[0]
