from fastapi import APIRouter, Depends
from sqlmodel import Session

from database import get_session
from models.schemas import TravelRequestModel
from services.cache import cache_stats, clear_cache
from services.planner import build_plan, validate_trip_dates

from auth import verify_api_key

router = APIRouter(
    prefix="/plan",
    tags=["Travel Plan"],
)


@router.post("/")
async def create_travel_plan(
    travel_request: TravelRequestModel,
    session: Session = Depends(get_session),
):
    """Aggregate Weather, Currency, and Places data into a single travel plan (not saved)."""
    trip_days = validate_trip_dates(travel_request)
    plan = await build_plan(session, travel_request)
    return {
        "message": "Travel plan created successfully",
        "trip_days": trip_days,
        **plan,
    }


@router.get("/cache-stats")
def get_cache_stats():
    """What the in-memory cache is holding for weather and currency lookups."""
    return cache_stats()


@router.delete("/cache")
def delete_cache(api_key: str = Depends(verify_api_key)):
    return {"message": "Cache cleared", "cleared": clear_cache()}
