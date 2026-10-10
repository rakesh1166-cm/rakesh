from datetime import datetime, timezone
from enum import Enum
from typing import Optional

from sqlalchemy import Column, Text
from sqlmodel import SQLModel, Field, Relationship


def now() -> datetime:
    return datetime.now(timezone.utc)


class ContractStatus(str, Enum):
    UPLOADED = "uploaded"
    ANALYZING = "analyzing"
    ANALYZED = "analyzed"
    ERROR = "error"


# Database table
class Contract(SQLModel, table=True):
    __tablename__ = "contracts"

    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str = Field(unique=True)          # name on disk (uuid + ext)
    original_name: str = Field(index=True)      # name the user uploaded
    upload_date: datetime = Field(default_factory=now)
    text_content: str = Field(default="", sa_column=Column(Text, nullable=False, default=""))
    page_count: int = 0
    word_count: int = 0
    status: ContractStatus = Field(default=ContractStatus.UPLOADED)

    # one contract can have many analyses
    analyses: list["Analysis"] = Relationship(
        back_populates="contract",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


# response body for lists (no full text, keeps payloads small)
class ContractRead(SQLModel):
    id: int
    filename: str
    original_name: str
    upload_date: datetime
    page_count: int
    word_count: int
    status: ContractStatus


# response body for a single contract
class ContractDetail(ContractRead):
    text_content: str


# avoid circular import
from models.analysis import Analysis
Contract.model_rebuild()
