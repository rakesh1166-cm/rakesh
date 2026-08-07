"""Pydantic models for the landmarks seed resource."""

from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class LandmarkBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=160)
    city: str = Field(..., min_length=1, max_length=120)
    country: str = Field(..., min_length=1, max_length=120)
    description: Optional[str] = None


class LandmarkCreate(LandmarkBase):
    pass


class LandmarkRead(LandmarkBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
