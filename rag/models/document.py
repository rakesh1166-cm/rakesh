from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import Column, Float, ForeignKey, Integer
from sqlalchemy.dialects.postgresql import ARRAY
from sqlmodel import SQLModel, Field, Relationship


def now():
    return datetime.now(timezone.utc)


# One uploaded PDF
class Document(SQLModel, table=True):
    __tablename__ = "documents"

    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str = Field(index=True)
    pages: int = 0
    chunk_count: int = 0
    uploaded_at: datetime = Field(default_factory=now)

    # one document has many chunks; deleting the document deletes its chunks
    chunks: list["Chunk"] = Relationship(
        back_populates="document",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


# One piece of a document's text, plus its embedding vector.
# Postgres here has no pgvector, so the vector is a plain float[] and
# similarity is computed in Python (see engine.py).
class Chunk(SQLModel, table=True):
    __tablename__ = "chunks"

    id: Optional[int] = Field(default=None, primary_key=True)
    document_id: int = Field(
        sa_column=Column(Integer, ForeignKey("documents.id", ondelete="CASCADE"), index=True, nullable=False)
    )
    page: int
    content: str
    embedding: list[float] = Field(sa_column=Column(ARRAY(Float), nullable=False))

    document: Optional[Document] = Relationship(back_populates="chunks")


# response bodies
class DocumentRead(SQLModel):
    id: int
    filename: str
    pages: int
    chunk_count: int
    uploaded_at: datetime


class ChunkRead(SQLModel):
    id: int
    document_id: int
    page: int
    content: str
