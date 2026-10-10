from datetime import datetime
from typing import Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field

from models.document import now


# Every question asked, with the answer and the chunks it was based on
class QueryLog(SQLModel, table=True):
    __tablename__ = "queries"

    id: Optional[int] = Field(default=None, primary_key=True)
    question: str
    answer: str
    sources: list[dict] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False))
    created_at: datetime = Field(default_factory=now)


# request body for asking a question
class QueryRequest(SQLModel):
    question: str = Field(min_length=1)
    top_k: int = Field(default=4, ge=1, le=20)
    document_id: Optional[int] = Field(default=None, description="Limit the search to one document")


class Source(SQLModel):
    chunk_id: int
    document_id: int
    filename: str
    page: int
    score: float
    content: str


# response bodies
class QueryResponse(SQLModel):
    id: int
    question: str
    answer: str
    sources: list[Source]
    created_at: datetime


class QueryLogRead(QueryResponse):
    pass
