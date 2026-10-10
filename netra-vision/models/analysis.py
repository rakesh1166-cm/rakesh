from datetime import datetime
from typing import Any, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field


def now() -> datetime:
    """Current local time, timezone-aware (columns are TIMESTAMP WITH TIME ZONE)"""
    return datetime.now().astimezone()


# Database table: one row per uploaded image and its AI diagnosis
class Analysis(SQLModel, table=True):
    __tablename__ = "analyses"

    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str                      # original name the user uploaded
    stored_name: str = Field(unique=True)  # name on disk inside uploads/
    content_type: str
    crop_detected: Optional[str] = Field(default=None, index=True)
    severity: Optional[str] = Field(default=None, index=True)
    overall_health: Optional[str] = None
    additional_notes: Optional[str] = None
    diseases: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False))
    treatments: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False))
    created_at: datetime = Field(default_factory=now)


# response body
class AnalysisRead(SQLModel):
    id: int
    filename: str
    stored_name: str
    content_type: str
    crop_detected: Optional[str]
    severity: Optional[str]
    overall_health: Optional[str]
    additional_notes: Optional[str]
    diseases: list[dict[str, Any]]
    treatments: list[dict[str, Any]]
    created_at: datetime
