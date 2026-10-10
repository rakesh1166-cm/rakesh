from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import get_session

from models.destination import Destination, Place
from models.trip import Trip
from services.cache import cache_stats


router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    """Totals: destinations, places, saved trips, the most planned destinations and cache size."""
    top = session.exec(
        select(Trip.destination, func.count(Trip.id).label("trips"))
        .group_by(Trip.destination)
        .order_by(func.count(Trip.id).desc())
        .limit(5)
    ).all()

    return {
        "destinations": session.exec(select(func.count(Destination.id))).one(),
        "places": session.exec(select(func.count(Place.id))).one(),
        "trips": session.exec(select(func.count(Trip.id))).one(),
        "top_destinations": [{"destination": d, "trips": n} for d, n in top],
        "cache_entries": cache_stats()["total_entries"],
    }
