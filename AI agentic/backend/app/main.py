"""FastAPI entrypoint for the HolidayLandmarks backend."""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from app.core.config import APP_NAME, APP_VERSION, FRONTEND_ORIGINS
from app.db.database import Base, engine
from app.routes.api import router as api_router

# Imported for their side effect: registering tables on Base.metadata.
from app import models  # noqa: F401


logger = logging.getLogger(__name__)

app = FastAPI(title=APP_NAME, version=APP_VERSION)

app.add_middleware(
    CORSMiddleware,
    allow_origins=FRONTEND_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    """Create tables if they are missing. A dead DB must not kill the app —
    /api/health/db reports the failure instead."""
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database schema ready")
    except SQLAlchemyError as exc:
        logger.error("Database unavailable at startup: %s", type(exc).__name__)


app.include_router(api_router)
