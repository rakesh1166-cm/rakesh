from fastapi import Depends, HTTPException, APIRouter
from sqlmodel import Session, select
from database import get_session

from models.document import Document
from models.query import QueryLog, QueryRequest, QueryResponse, QueryLogRead

from auth import verify_api_key
import engine

router = APIRouter(prefix="/query", tags=["query"])


@router.post("/", response_model=QueryResponse)
def ask(
    body: QueryRequest,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    """Retrieve the closest chunks, let the LLM answer from them, and log the exchange."""
    if body.document_id is not None and not session.get(Document, body.document_id):
        raise HTTPException(status_code=404, detail=f"Document {body.document_id} not found")

    sources = engine.search(session, body.question, body.top_k, body.document_id)
    log = QueryLog(question=body.question, answer=engine.answer(body.question, sources), sources=sources)
    session.add(log)
    session.commit()
    session.refresh(log)
    return log


@router.get("/history", response_model=list[QueryLogRead])
def history(limit: int = 20, session: Session = Depends(get_session)):
    return session.exec(select(QueryLog).order_by(QueryLog.id.desc()).limit(limit)).all()
