"""Build the local vector index from the corpus.

Reads every PDF / .md / .txt in backend/documents/ (your résumé and any other
PDFs about yourself), splits each into overlapping chunks, embeds them locally,
and writes a single index file. Rebuilds the whole index each run — fast for a
small corpus, and no API key required (embeddings are local).

    python -m app.ingest            # index everything in documents/
    python -m app.ingest resume.pdf # index a subset
"""

from __future__ import annotations

import sys
from pathlib import Path

from pypdf import PdfReader

from . import store
from .config import settings
from .embeddings import embed_texts

TEXT_SUFFIXES = {".txt", ".md"}
SUPPORTED = {".pdf", *TEXT_SUFFIXES}


def chunk_text(text: str) -> list[str]:
    text = " ".join(text.split())
    if not text:
        return []
    size, overlap = settings.chunk_size, settings.chunk_overlap
    step = max(1, size - overlap)
    return [text[i : i + size] for i in range(0, len(text), step) if text[i : i + size].strip()]


def read_pages(path: Path) -> list[tuple[int, str]]:
    """Return (page_number, text) pairs. Text files are a single page 0."""
    if path.suffix.lower() == ".pdf":
        reader = PdfReader(str(path))
        return [(i, page.extract_text() or "") for i, page in enumerate(reader.pages, start=1)]
    if path.suffix.lower() in TEXT_SUFFIXES:
        return [(0, path.read_text(encoding="utf-8", errors="ignore"))]
    return []


def main() -> None:
    docs = settings.documents_dir
    docs.mkdir(exist_ok=True)

    if len(sys.argv) > 1:
        targets = [docs / arg for arg in sys.argv[1:]]
    else:
        # Skip the folder's own instructions file — it's not corpus content.
        targets = sorted(
            p
            for p in docs.iterdir()
            if p.suffix.lower() in SUPPORTED and p.name.lower() != "readme.md"
        )

    chunks: list[dict] = []
    for path in targets:
        if not path.exists():
            print(f"  skip {path.name} (not found)")
            continue
        pages = read_pages(path)
        if not pages:
            print(f"  skip {path.name} (unsupported type)")
            continue
        count = 0
        for page_num, page_text in pages:
            for ci, chunk in enumerate(chunk_text(page_text)):
                chunks.append(
                    {"source": path.name, "page": page_num, "chunk_index": ci, "content": chunk}
                )
                count += 1
        print(f"  + {path.name}: {count} chunks")

    if not chunks:
        print(f"No documents found in {docs}. Drop your PDFs (and résumé) there first.")
        return

    print(f"Embedding {len(chunks)} chunks with {settings.embed_model} (first run downloads the model)…")
    embeddings = embed_texts([c["content"] for c in chunks])
    store.save(embeddings, chunks)
    print(f"Done. Indexed {len(chunks)} chunks → {settings.index_path}")


if __name__ == "__main__":
    main()
