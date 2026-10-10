import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session, select

from auth import verify_api_key
from config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, UPLOAD_DIR
from database import get_session
from models import Analysis, AnalysisRead, Contract, ContractDetail, ContractRead
from service.document_parser import extract_text

router = APIRouter(prefix="/contracts", tags=["contracts"])


@router.post("/upload", response_model=ContractDetail, status_code=201)
async def upload_contract(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    """Upload a PDF or TXT contract; its text is extracted and stored."""
    ext = os.path.splitext(file.filename or "")[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail=f"File type not allowed. Use {', '.join(ALLOWED_EXTENSIONS)}")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File size exceeds the maximum limit of {MAX_FILE_SIZE_MB} MB")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_name)
    with open(file_path, "wb") as f:
        f.write(content)

    try:
        parsed = extract_text(file_path)
    except Exception as exc:
        os.remove(file_path)
        raise HTTPException(status_code=400, detail=f"Could not read the document: {exc}")

    contract = Contract(
        filename=unique_name,
        original_name=file.filename,
        text_content=parsed["text"],
        page_count=parsed["page_count"],
        word_count=parsed["word_count"],
    )
    session.add(contract)
    session.commit()
    session.refresh(contract)
    return contract


@router.get("/", response_model=list[ContractRead])
def list_contracts(session: Session = Depends(get_session)):
    """Every uploaded contract, newest first (without the full text)."""
    return session.exec(select(Contract).order_by(Contract.id.desc())).all()


@router.get("/{contract_id}", response_model=ContractDetail)
def get_contract(contract_id: int, session: Session = Depends(get_session)):
    contract = session.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail=f"Contract {contract_id} not found")
    return contract


@router.get("/{contract_id}/analyses", response_model=list[AnalysisRead])
def contract_analyses(contract_id: int, session: Session = Depends(get_session)):
    """Every analysis run for this contract, newest first."""
    if not session.get(Contract, contract_id):
        raise HTTPException(status_code=404, detail=f"Contract {contract_id} not found")
    return session.exec(
        select(Analysis).where(Analysis.contract_id == contract_id).order_by(Analysis.id.desc())
    ).all()


@router.delete("/{contract_id}", status_code=204)
def delete_contract(
    contract_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    """Delete a contract, its analyses and the uploaded file."""
    contract = session.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail=f"Contract {contract_id} not found")

    file_path = os.path.join(UPLOAD_DIR, contract.filename)
    session.delete(contract)
    session.commit()
    if os.path.exists(file_path):
        os.remove(file_path)
