"""
The RAG pipeline, kept apart from the routes:

  ingest:  PDF bytes -> pages -> chunks -> embeddings -> rows in Postgres
  query:   question -> embedding -> cosine similarity vs stored chunks -> LLM answer
"""
import io
import os

import numpy as np
from dotenv import load_dotenv
from fastapi import HTTPException
from langchain_text_splitters import RecursiveCharacterTextSplitter
from openai import OpenAI, OpenAIError
from pypdf import PdfReader
from sqlmodel import Session, select

from models.document import Chunk, Document

load_dotenv()

EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
CHAT_MODEL = os.getenv("OPENAI_CHAT_MODEL", "gpt-5")

splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)

_client: OpenAI | None = None


def client() -> OpenAI:
    """Created on first use so the API can start (and list docs) without a key."""
    global _client
    if _client is None:
        if not os.getenv("OPENAI_API_KEY"):
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set in rag/.env")
        _client = OpenAI()
    return _client


def embed(texts: list[str]) -> list[list[float]]:
    vectors = []
    try:
        for i in range(0, len(texts), 100):
            res = client().embeddings.create(model=EMBEDDING_MODEL, input=texts[i:i + 100])
            vectors.extend(d.embedding for d in res.data)
    except OpenAIError as err:
        raise HTTPException(status_code=502, detail=f"OpenAI embeddings failed: {err}")
    return vectors


def ingest_pdf(session: Session, filename: str, data: bytes) -> Document:
    try:
        reader = PdfReader(io.BytesIO(data))
    except Exception as err:
        raise HTTPException(status_code=400, detail=f"Could not read PDF: {err}")

    # Split page by page so every chunk keeps its page number (1-based)
    pieces: list[tuple[int, str]] = []
    for page_no, page in enumerate(reader.pages, start=1):
        text = (page.extract_text() or "").strip()
        pieces.extend((page_no, chunk) for chunk in splitter.split_text(text))

    if not pieces:
        raise HTTPException(status_code=400, detail="No extractable text in this PDF (scanned images?)")

    vectors = embed([text for _, text in pieces])

    doc = Document(filename=filename, pages=len(reader.pages), chunk_count=len(pieces))
    doc.chunks = [
        Chunk(page=page, content=text, embedding=vec)
        for (page, text), vec in zip(pieces, vectors)
    ]
    session.add(doc)
    session.commit()
    session.refresh(doc)
    return doc


def search(session: Session, question: str, top_k: int, document_id: int | None = None) -> list[dict]:
    stmt = (
        select(Chunk.id, Chunk.document_id, Chunk.page, Chunk.content, Chunk.embedding, Document.filename)
        .join(Document, Chunk.document_id == Document.id)
    )
    if document_id is not None:
        stmt = stmt.where(Chunk.document_id == document_id)
    rows = session.exec(stmt).all()
    if not rows:
        return []

    q = np.array(embed([question])[0])
    matrix = np.array([r.embedding for r in rows])
    scores = matrix @ q / (np.linalg.norm(matrix, axis=1) * np.linalg.norm(q))
    best = np.argsort(scores)[::-1][:top_k]

    return [
        {
            "chunk_id": rows[i].id,
            "document_id": rows[i].document_id,
            "filename": rows[i].filename,
            "page": rows[i].page,
            "score": round(float(scores[i]), 4),
            "content": rows[i].content,
        }
        for i in best
    ]


def answer(question: str, sources: list[dict]) -> str:
    if not sources:
        return "I don't know — no documents have been uploaded yet."

    context = "\n\n".join(f"[{s['filename']} · page {s['page']}]\n{s['content']}" for s in sources)
    system_prompt = f"""You are a helpful assistant that answers questions using only the provided context.
If the context does not contain the answer, respond with "I don't know."
Cite the page number(s) you used, e.g. (page 3).

Context:
{context}"""

    try:
        res = client().chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
        )
    except OpenAIError as err:
        raise HTTPException(status_code=502, detail=f"OpenAI chat failed: {err}")
    return res.choices[0].message.content
