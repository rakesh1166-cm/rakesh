"""Validated response models for the home and health endpoints."""

from typing import Literal, Optional

from pydantic import BaseModel, Field


class HomeResponse(BaseModel):
    app: str = Field(..., description="Application name")
    version: str
    environment: str
    message: str
    docs_url: str


class HealthResponse(BaseModel):
    status: Literal["ok"] = "ok"
    app: str
    version: str


class DatabaseHealthResponse(BaseModel):
    status: Literal["connected", "error"]
    dialect: str
    database: Optional[str] = None
    server_version: Optional[str] = None
    detail: Optional[str] = Field(
        default=None, description="User-safe error message when status is 'error'"
    )
