import asyncio

from fastapi import HTTPException
from sqlmodel import Session

from models.schemas import TravelRequestModel
from services.currency import fetch_currency_rates
from services.places import fetch_places, find_destination
from services.weather import fetch_weather


def validate_trip_dates(travel_request: TravelRequestModel) -> int:
    """Shared by /plan, /stream/plan and /trips. Returns the trip length in days."""
    if travel_request.start_date > travel_request.end_date:
        raise HTTPException(status_code=400, detail="Start date cannot be after end date")

    trip_days = (travel_request.end_date - travel_request.start_date).days

    if trip_days < 1:
        raise HTTPException(status_code=400, detail="Travel plan must be at least 1 day long")
    if trip_days > 14:
        raise HTTPException(status_code=400, detail="Travel plan cannot be longer than 14 days")
    return trip_days


def weather_query_for(session: Session, destination: str) -> str:
    """Known destinations carry a precise query; anything else is assumed to be in India."""
    found = find_destination(session, destination)
    return found.weather_query if found else f"{destination}, India"


async def build_plan(session: Session, travel_request: TravelRequestModel) -> dict:
    """Aggregate Weather, Places and Currency data, fetching the two external APIs concurrently."""
    weather_data, currency_rates = await asyncio.gather(
        fetch_weather(
            destination=weather_query_for(session, travel_request.destination),
            start_date=travel_request.start_date,
            end_date=travel_request.end_date,
        ),
        fetch_currency_rates(travel_request.base_currency),
    )
    return {
        "weather_data": weather_data,
        "places_data": fetch_places(session, travel_request.destination),
        "currency_rates": currency_rates,
    }
