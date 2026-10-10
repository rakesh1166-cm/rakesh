from datetime import datetime
from enum import Enum
from typing import Optional

from sqlalchemy import Column, JSON, Text
from sqlmodel import SQLModel, Field, Relationship

from models.contract import now


class RiskLevel(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


# Shapes returned by Gemini; stored as JSON lists on the analysis row
class ClauseAnalysis(SQLModel):
    clause_title: str
    clause_text: str
    explanation: str
    is_standard: bool


class RiskFlag(SQLModel):
    risk_title: str
    description: str
    risk_level: RiskLevel
    recommendation: str
    clause_reference: str = ""


# Database table
class Analysis(SQLModel, table=True):
    __tablename__ = "analyses"

    id: Optional[int] = Field(default=None, primary_key=True)
    contract_id: int = Field(foreign_key="contracts.id", index=True, ondelete="CASCADE")
    analysis_date: datetime = Field(default_factory=now)
    summary: str = Field(default="", sa_column=Column(Text, nullable=False, default=""))
    contract_type: str = ""
    key_clauses: list[dict] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    risk_flags: list[dict] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))
    overall_risk_level: RiskLevel = Field(default=RiskLevel.LOW)
    recommendations: list[str] = Field(default_factory=list, sa_column=Column(JSON, nullable=False))

    contract: Optional["Contract"] = Relationship(back_populates="analyses")


# response body
class AnalysisRead(SQLModel):
    id: int
    contract_id: int
    analysis_date: datetime
    summary: str
    contract_type: str
    key_clauses: list[ClauseAnalysis]
    risk_flags: list[RiskFlag]
    overall_risk_level: RiskLevel
    recommendations: list[str]


from models.contract import Contract
Analysis.model_rebuild()
