from fastapi import Depends, APIRouter
from sqlmodel import Session, select, func
from database import get_session

from models.document import Document, Chunk
from models.query import QueryLog
import engine

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    return {
        "documents": session.exec(select(func.count(Document.id))).one(),
        "pages": session.exec(select(func.coalesce(func.sum(Document.pages), 0))).one(),
        "chunks": session.exec(select(func.count(Chunk.id))).one(),
        "queries": session.exec(select(func.count(QueryLog.id))).one(),
        "embedding_model": engine.EMBEDDING_MODEL,
        "chat_model": engine.CHAT_MODEL,
    }
