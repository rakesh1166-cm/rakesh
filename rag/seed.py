"""Index data/sample.pdf once (replaces the old app/index.py):  .venv\\Scripts\\python seed.py"""
from pathlib import Path

from sqlmodel import Session, select

from database import create_tables, engine as db
from models.document import Document
import engine

pdf = Path(__file__).parent / "data" / "sample.pdf"

create_tables()
with Session(db) as session:
    if session.exec(select(Document).where(Document.filename == pdf.name)).first():
        print(f"{pdf.name} is already indexed.")
    else:
        doc = engine.ingest_pdf(session, pdf.name, pdf.read_bytes())
        print(f"Indexed {doc.filename}: {doc.pages} pages, {doc.chunk_count} chunks (document id {doc.id}).")
