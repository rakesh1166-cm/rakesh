"""Aggregates every router into a single object mounted by main.py."""

from fastapi import APIRouter

from app.routes import health, landmarks


router = APIRouter()
router.include_router(health.router)
router.include_router(landmarks.router)
