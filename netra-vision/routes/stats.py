from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func

from database import get_session
from models.analysis import Analysis

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    """Totals: analyses performed, count per severity, and the most common crops."""
    by_severity = session.exec(
        select(Analysis.severity, func.count(Analysis.id)).group_by(Analysis.severity)
    ).all()
    top_crops = session.exec(
        select(Analysis.crop_detected, func.count(Analysis.id))
        .group_by(Analysis.crop_detected)
        .order_by(func.count(Analysis.id).desc())
        .limit(5)
    ).all()

    return {
        "total": session.exec(select(func.count(Analysis.id))).one(),
        "by_severity": {sev or "unknown": count for sev, count in by_severity},
        "top_crops": [{"crop": crop or "unknown", "count": count} for crop, count in top_crops],
    }
