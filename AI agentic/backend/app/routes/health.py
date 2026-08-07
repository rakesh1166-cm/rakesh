"""Home + health routes. No business logic here — only wiring and validation."""

from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.core.config import APP_NAME, APP_VERSION, ENVIRONMENT
from app.db.database import engine, get_db
from app.schemas.health import DatabaseHealthResponse, HealthResponse, HomeResponse


router = APIRouter(tags=["health"])


@router.get("/", response_model=HomeResponse)
def home() -> HomeResponse:
    return HomeResponse(
        app=APP_NAME,
        version=APP_VERSION,
        environment=ENVIRONMENT,
        message="HolidayLandmarks agentic trip assistant — API is running.",
        docs_url="/docs",
    )


@router.get("/api/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(app=APP_NAME, version=APP_VERSION)


@router.get("/api/health/db", response_model=DatabaseHealthResponse)
def database_health(db: Session = Depends(get_db)) -> DatabaseHealthResponse:
    """Round-trip a query to confirm the Postgres connection is live."""
    try:
        row = db.execute(
            text("SELECT current_database() AS db, version() AS server_version")
        ).mappings().one()
        return DatabaseHealthResponse(
            status="connected",
            dialect=engine.dialect.name,
            database=row["db"],
            server_version=str(row["server_version"]).split(",")[0],
        )
    except SQLAlchemyError as exc:
        # Typed, user-safe error — never leak the driver traceback.
        return DatabaseHealthResponse(
            status="error",
            dialect=engine.dialect.name,
            detail=type(exc).__name__,
        )
