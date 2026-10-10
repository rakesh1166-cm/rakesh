from fastapi import Depends, HTTPException, APIRouter, Query
from fastapi.encoders import jsonable_encoder
from sqlmodel import Session, select
from database import get_session

from models.schemas import TravelRequestModel
from models.trip import Trip, TripRead, TripSummary
from services.planner import build_plan, validate_trip_dates

from auth import verify_api_key

router = APIRouter(prefix="/trips", tags=["trips"])


def get_trip_or_404(trip_id: int, session: Session) -> Trip:
    trip = session.get(Trip, trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail=f"Trip {trip_id} not found")
    return trip


@router.post("/", response_model=TripRead, status_code=201)
async def save_trip(
    travel_request: TravelRequestModel,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    """Build the plan (same as POST /plan/) and keep a snapshot of it in Postgres."""
    validate_trip_dates(travel_request)
    plan = await build_plan(session, travel_request)

    trip = Trip(
        destination=travel_request.destination.lower(),
        start_date=travel_request.start_date,
        end_date=travel_request.end_date,
        base_currency=travel_request.base_currency,
        weather=jsonable_encoder(plan["weather_data"]),
        places=jsonable_encoder(plan["places_data"]),
        currency_rates=plan["currency_rates"],
    )
    session.add(trip)
    session.commit()
    session.refresh(trip)
    return trip


@router.get("/", response_model=list[TripSummary])
def list_trips(
    destination: str | None = Query(default=None, description="Case-insensitive partial match"),
    session: Session = Depends(get_session),
):
    query = select(Trip)
    if destination:
        query = query.where(Trip.destination.ilike(f"%{destination.strip()}%"))
    trips = session.exec(query.order_by(Trip.id.desc())).all()
    return [
        TripSummary.model_validate(t, update={"place_count": len(t.places), "forecast_days": len(t.weather)})
        for t in trips
    ]


@router.get("/{trip_id}", response_model=TripRead)
def get_trip(trip_id: int, session: Session = Depends(get_session)):
    return get_trip_or_404(trip_id, session)


@router.delete("/{trip_id}")
def delete_trip(
    trip_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    trip = get_trip_or_404(trip_id, session)
    session.delete(trip)
    session.commit()
    return {"message": f"Trip {trip_id} deleted"}
