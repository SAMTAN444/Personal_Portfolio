"""Central configuration, read from the environment (.env supported).

Stack: Anthropic API for answers (Claude Haiku 4.5 by default), local embeddings
(fastembed, runs on CPU, no API key), and a local file-based vector index. One
secret for the whole backend: ANTHROPIC_API_KEY.
"""

from __future__ import annotations

import os
from dataclasses import dataclass, field
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BACKEND_ROOT = Path(__file__).resolve().parent.parent


def _origins() -> list[str]:
    raw = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:5173,http://localhost:5174,http://localhost:5175",
    )
    return [o.strip() for o in raw.split(",") if o.strip()]


@dataclass(frozen=True)
class Settings:
    # Generation — Anthropic API. Bare model id (no provider prefix). Swap to
    # claude-opus-4-8 here if you want top quality over cost.
    anthropic_model: str = os.getenv("ANTHROPIC_MODEL", "claude-haiku-4-5")
    max_tokens: int = int(os.getenv("MAX_TOKENS", "1024"))

    # Embeddings — local model via fastembed (downloads once, then offline).
    # bge-small is ~33MB and 384-dim; good quality for a small corpus.
    embed_model: str = os.getenv("EMBED_MODEL", "BAAI/bge-small-en-v1.5")

    # Local vector index (pickle of normalized embeddings + chunk metadata).
    index_path: Path = BACKEND_ROOT / os.getenv("INDEX_FILE", "rag_index.pkl")

    # Corpus: drop your PDFs / .md / .txt (résumé included) in here.
    documents_dir: Path = BACKEND_ROOT / "documents"

    # Retrieval
    top_k: int = int(os.getenv("TOP_K", "5"))
    # Below this cosine similarity (0..1) the question is treated as out-of-scope
    # and the assistant refuses instead of answering from weak matches.
    min_similarity: float = float(os.getenv("MIN_SIMILARITY", "0.3"))

    # Abuse / cost guards on the public chat endpoint (per client IP).
    rate_limit_per_minute: int = int(os.getenv("RATE_LIMIT_PER_MINUTE", "12"))
    rate_limit_per_day: int = int(os.getenv("RATE_LIMIT_PER_DAY", "300"))
    max_query_chars: int = int(os.getenv("MAX_QUERY_CHARS", "500"))

    # Chunking
    chunk_size: int = int(os.getenv("CHUNK_SIZE", "1000"))
    chunk_overlap: int = int(os.getenv("CHUNK_OVERLAP", "150"))

    cors_origins: list[str] = field(default_factory=_origins)


settings = Settings()
