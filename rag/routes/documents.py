from fastapi import Depends, HTTPException, APIRouter, UploadFile, File
from sqlmodel import Session, select
from database import get_session

from models.document import Document, DocumentRead, Chunk, ChunkRead

from auth import verify_api_key
import engine

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/", response_model=DocumentRead, status_code=201)
async def upload_document(
    file: UploadFile = File(description="A PDF to index"),
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    """Read the PDF, split it into chunks, embed them and store everything in Postgres."""
    if not (file.filename or "").lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only .pdf files are supported")
    return engine.ingest_pdf(session, file.filename, await file.read())


@router.get("/", response_model=list[DocumentRead])
def list_documents(session: Session = Depends(get_session)):
    return session.exec(select(Document).order_by(Document.id.desc())).all()


@router.get("/{document_id}", response_model=DocumentRead)
def get_document(document_id: int, session: Session = Depends(get_session)):
    doc = session.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
    return doc


@router.get("/{document_id}/chunks", response_model=list[ChunkRead])
def document_chunks(document_id: int, session: Session = Depends(get_session)):
    """Every chunk of this document, in page order (embeddings left out)."""
    if not session.get(Document, document_id):
        raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
    return session.exec(select(Chunk).where(Chunk.document_id == document_id).order_by(Chunk.id)).all()


@router.delete("/{document_id}", status_code=204)
def delete_document(
    document_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    doc = session.get(Document, document_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document {document_id} not found")
    session.delete(doc)
    session.commit()
