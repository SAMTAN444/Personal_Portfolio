# Single self-contained container for the RAG API. No database. Ships a PREBUILT
# index (rag_index.pkl) so your source PDFs stay out of the repo/image — build it
# locally with `python -m app.ingest` and commit the resulting rag_index.pkl.
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download the local embedding model — it's used to embed incoming queries at
# request time, so it must be present in the image (no cold-start fetch).
RUN python -c "from fastembed import TextEmbedding; TextEmbedding('BAAI/bge-small-en-v1.5')"

COPY app ./app
COPY rag_index.pkl ./rag_index.pkl

EXPOSE 8000
# Render (and most hosts) inject $PORT; default to 8000 locally. ANTHROPIC_API_KEY
# and CORS_ORIGINS are supplied at runtime as env/secret, never baked in.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
