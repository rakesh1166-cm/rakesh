from datetime import date, datetime
from typing import Any, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql import JSONB
from sqlmodel import SQLModel, Field


def now() -> datetime:
    """Current local time, timezone-aware (columns are TIMESTAMP WITH TIME ZONE)"""
    return datetime.now().astimezone()


# A saved travel plan: the request plus a snapshot of what the services returned
class Trip(SQLModel, table=True):
    __tablename__ = "trips"

    id: Optional[int] = Field(default=None, primary_key=True)
    destination: str = Field(index=True)
    start_date: date
    end_date: date
    base_currency: str
    created_at: datetime = Field(default_factory=now)

    weather: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False))
    places: list[dict[str, Any]] = Field(default_factory=list, sa_column=Column(JSONB, nullable=False))
    currency_rates: dict[str, float] = Field(default_factory=dict, sa_column=Column(JSONB, nullable=False))


# list view: no snapshots, just what identifies the trip
class TripSummary(SQLModel):
    id: int
    destination: str
    start_date: date
    end_date: date
    base_currency: str
    created_at: datetime
    place_count: int
    forecast_days: int


class TripRead(SQLModel):
    id: int
    destination: str
    start_date: date
    end_date: date
    base_currency: str
    created_at: datetime
    weather: list[dict[str, Any]]
    places: list[dict[str, Any]]
    currency_rates: dict[str, float]
