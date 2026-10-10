import os
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func

from auth import verify_api_key
from database import get_session
from models.analysis import Analysis, AnalysisRead
from routes.analyse import UPLOAD_DIR

router = APIRouter(prefix="/analyses", tags=["analyses"])


@router.get("/", response_model=list[AnalysisRead])
def list_analyses(
    severity: Optional[str] = None,
    crop: Optional[str] = None,
    session: Session = Depends(get_session),
):
    """Every saved analysis, newest first. Filter by severity or crop name."""
    query = select(Analysis)
    if severity:
        query = query.where(Analysis.severity == severity)
    if crop:
        query = query.where(func.lower(Analysis.crop_detected).contains(crop.lower()))
    return session.exec(query.order_by(Analysis.id.desc())).all()


@router.get("/{analysis_id}", response_model=AnalysisRead)
def get_analysis(analysis_id: int, session: Session = Depends(get_session)):
    analysis = session.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")
    return analysis


@router.delete("/{analysis_id}", status_code=204)
def delete_analysis(
    analysis_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    analysis = session.get(Analysis, analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis {analysis_id} not found")

    image_path = os.path.join(UPLOAD_DIR, analysis.stored_name)
    session.delete(analysis)
    session.commit()
    if os.path.exists(image_path):
        os.remove(image_path)
