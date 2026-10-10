from fastapi import APIRouter, Depends
from sqlmodel import Session, func, select

from database import get_session
from models import Analysis, Contract, RiskLevel

router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    """Totals: contracts by status, analyses run, and analyses by overall risk level."""
    by_status = dict(session.exec(select(Contract.status, func.count(Contract.id)).group_by(Contract.status)).all())
    by_risk = dict(
        session.exec(
            select(Analysis.overall_risk_level, func.count(Analysis.id)).group_by(Analysis.overall_risk_level)
        ).all()
    )

    return {
        "contracts": sum(by_status.values()),
        "contracts_by_status": {s.value: c for s, c in by_status.items()},
        "analyses": sum(by_risk.values()),
        "analyses_by_risk": {level.value: by_risk.get(level, 0) for level in RiskLevel},
    }
