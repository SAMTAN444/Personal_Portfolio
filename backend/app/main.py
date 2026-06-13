"""FastAPI app exposing the RAG chat endpoint.

Contract matches the frontend's src/lib/rag.ts:
  POST /chat   { "query": str }  ->  { "answer": str, "citations": Citation[], "trace": Trace }

The `trace` is the real per-query retrieval record — embed model + dims, the
retrieved chunks with their cosine scores, the relevance-gate decision, and stage
timings — so the site's "How it works" panel can visualize the actual pipeline.
"""

from __future__ import annotations

import time

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import store
from .config import settings
from .embeddings import embed_text
from .generate import generate_answer
from .ratelimit import limiter
from .retrieval import Chunk

app = FastAPI(title="Samuel Tan — Portfolio RAG")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
)

OUT_OF_SCOPE = (
    "That's outside what I have in Samuel's materials. Ask me about his projects, "
    "experience, skills, or background — or reach him directly via the contact links."
)

NO_INDEX = "The assistant isn't indexed yet. (Run `python -m app.ingest` on the backend.)"

TOO_LONG = f"Please keep your question under {settings.max_query_chars} characters."


def _client_ip(request: Request) -> str:
    """Real client IP, honoring X-Forwarded-For when behind a proxy/CDN."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _enforce_rate_limit(ip: str) -> None:
    """429 (with Retry-After) if the IP exceeds the per-minute or per-day budget."""
    ok, retry = limiter.hit(f"{ip}:min", settings.rate_limit_per_minute, 60.0)
    if not ok:
        raise HTTPException(
            status_code=429,
            detail="Too many messages — please slow down a moment.",
            headers={"Retry-After": str(int(retry) + 1)},
        )
    ok, retry = limiter.hit(f"{ip}:day", settings.rate_limit_per_day, 86_400.0)
    if not ok:
        raise HTTPException(
            status_code=429,
            detail="Daily message limit reached. Please try again tomorrow.",
            headers={"Retry-After": str(int(retry) + 1)},
        )


class ChatRequest(BaseModel):
    query: str


class Citation(BaseModel):
    id: str
    title: str
    snippet: str | None = None
    url: str | None = None


class RetrievedChunk(BaseModel):
    source: str
    page: int
    similarity: float


class Timings(BaseModel):
    embedMs: float
    searchMs: float
    generateMs: float


class Trace(BaseModel):
    embedModel: str
    dims: int
    topK: int
    threshold: float
    bestSimilarity: float
    refused: bool
    retrieved: list[RetrievedChunk]
    timings: Timings


class ChatResponse(BaseModel):
    answer: str
    citations: list[Citation] = []
    trace: Trace | None = None


def _to_citations(chunks: list[Chunk]) -> list[Citation]:
    citations: list[Citation] = []
    for i, c in enumerate(chunks, start=1):
        title = c["source"] + (f" — p.{c['page']}" if c["page"] else "")
        snippet = " ".join(c["content"].split())[:180]
        citations.append(Citation(id=str(i), title=title, snippet=snippet))
    return citations


@app.get("/health")
def health() -> dict[str, object]:
    return {"status": "ok", "indexed": store.is_built(), "model": settings.anthropic_model}


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest, request: Request) -> ChatResponse:
    _enforce_rate_limit(_client_ip(request))

    query = req.query.strip()
    if not query:
        return ChatResponse(answer=OUT_OF_SCOPE)
    if len(query) > settings.max_query_chars:
        return ChatResponse(answer=TOO_LONG)
    if not store.is_built():
        return ChatResponse(answer=NO_INDEX)

    # 1) Embed the query (local fastembed).
    t0 = time.perf_counter()
    query_vec = embed_text(query)
    t1 = time.perf_counter()

    # 2) Dense vector search (cosine, top-k) over the file index.
    hits = store.search(query_vec, settings.top_k)
    t2 = time.perf_counter()

    best = max((h.similarity for h in hits), default=0.0)
    refused = (not hits) or best < settings.min_similarity

    # 3) Relevance gate → either refuse (no model call) or generate a grounded answer.
    generate_ms = 0.0
    if refused:
        answer = OUT_OF_SCOPE
        citations: list[Citation] = []
    else:
        chunks = [
            Chunk(
                source=h.source,
                page=h.page,
                chunk_index=h.chunk_index,
                content=h.content,
                similarity=h.similarity,
            )
            for h in hits
        ]
        t3 = time.perf_counter()
        answer = generate_answer(query, chunks)
        generate_ms = (time.perf_counter() - t3) * 1000
        citations = _to_citations(chunks)

    trace = Trace(
        embedModel=settings.embed_model,
        dims=len(query_vec),
        topK=settings.top_k,
        threshold=settings.min_similarity,
        bestSimilarity=round(float(best), 4),
        refused=refused,
        retrieved=[
            RetrievedChunk(source=h.source, page=h.page, similarity=round(h.similarity, 4))
            for h in hits
        ],
        timings=Timings(
            embedMs=round((t1 - t0) * 1000, 1),
            searchMs=round((t2 - t1) * 1000, 2),
            generateMs=round(generate_ms, 1),
        ),
    )
    return ChatResponse(answer=answer, citations=citations, trace=trace)
