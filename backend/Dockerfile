# Single self-contained container for the RAG API. No database — the vector index
# is a local file baked into the image at build time (local embeddings need no key).
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the local embedding model so there's no cold-start fetch.
RUN python -c "from fastembed import TextEmbedding; TextEmbedding('BAAI/bge-small-en-v1.5')"

COPY app ./app
COPY documents ./documents

# Build the index at image-build time (embeddings are local; no API key needed).
RUN python -m app.ingest || true

EXPOSE 8000
# ANTHROPIC_API_KEY is supplied at runtime (env var / secret), not baked in.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
