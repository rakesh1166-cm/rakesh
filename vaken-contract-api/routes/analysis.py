from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select

from auth import verify_api_key
from config import GEMINI_API_KEY
from database import get_session
from models import Analysis, AnalysisRead, Contract, ContractStatus
from service.gemini_analyse import analyze_contract

router = APIRouter(prefix="/analysis", tags=["analysis"])


@router.post("/analyse/{contract_id}", response_model=AnalysisRead, status_code=201)
async def analyse_contract(
    contract_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    """Run the contract through Gemini and store the result."""
    if not GEMINI_API_KEY:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY is not configured on the server")

    contract = session.get(Contract, contract_id)
    if not contract:
        raise HTTPException(status_code=404, detail=f"Contract {contract_id} not found")
    if not contract.text_content:
        raise HTTPException(status_code=400, detail="Contract has no text content to analyze")

    contract.status = ContractStatus.ANALYZING
    session.add(contract)
    session.commit()

    try:
        fields = await analyze_contract(contract.text_content)
    except Exception as exc:
        contract.status = ContractStatus.ERROR
        session.add(contract)
        session.commit()
        raise HTTPException(status_code=502, detail=f"AI analysis failed: {exc}")

    analysis = Analysis(contract_id=contract_id, **fields)
    contract.status = ContractStatus.ANALYZED
    session.add(analysis)
    session.add(contract)
    session.commit()
    session.refresh(analysis)
    return analysis


@router.get("/", response_model=list[AnalysisRead])
def list_analyses(session: Session = Depends(get_session)):
    """Every analysis performed, newest first."""
    return session.exec(select(Analysis).order_by(Analysis.id.desc())).all()


@router.get("/contract/{contract_id}", response_model=list[AnalysisRead])
def get_analyses_for_contract(contract_id: int, session: Session = Depends(get_session)):
    """All analyses for one contract (same as GET /contracts/{id}/analyses)."""
    return session.exec(
        select(Analysis).where(Analysis.contract_id == contract_id).order_by(Analysis.id.desc())
    ).all()


@router.get("/{analysis_id}", response_model=AnalysisRead)
def get_analysis(analysis_id: int, session: Session = Depends(get_session)):
    analysis = session.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")
    return analysis
