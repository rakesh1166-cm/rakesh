import json
from datetime import date, datetime

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlmodel import Session

from database import engine
from models.schemas import TravelRequestModel
from services.currency import fetch_currency_rates
from services.places import fetch_places
from services.planner import validate_trip_dates, weather_query_for
from services.weather import fetch_weather

router = APIRouter(
    prefix="/stream",
    tags=["Stream"],
)


def _jsonable(value):
    if isinstance(value, BaseModel):
        return value.model_dump()
    if isinstance(value, (date, datetime)):
        return value.isoformat()
    if isinstance(value, list):
        return [_jsonable(item) for item in value]
    if isinstance(value, dict):
        return {key: _jsonable(item) for key, item in value.items()}
    return value


def format_sse(data: dict, event: str = None) -> str:
    json_data = json.dumps(_jsonable(data))
    return f"data: {json_data}\n\n" if event is None else f"event: {event}\ndata: {json_data}\n\n"


async def stream_generator(travel_request: TravelRequestModel):
    # The request's own session may be closed while we are still streaming, so open one here
    with Session(engine) as session:
        yield format_sse({"message": "Starting travel plan aggregation..."}, event="start")
        try:
            yield format_sse({"message": "Fetching weather data..."}, event="weather")
            weather_data = await fetch_weather(
                destination=weather_query_for(session, travel_request.destination),
                start_date=travel_request.start_date,
                end_date=travel_request.end_date,
            )
            yield format_sse({"weather_data": weather_data}, event="weather_complete")

            yield format_sse({"message": "Fetching places to visit..."}, event="places")
            places_data = fetch_places(session, travel_request.destination)
            yield format_sse({"places_data": places_data}, event="places_complete")

            yield format_sse({"message": "Fetching currency data..."}, event="currency")
            currency_data = await fetch_currency_rates(travel_request.base_currency)
            yield format_sse({"currency_data": currency_data}, event="currency_complete")
        except HTTPException as exc:
            # Headers are already sent, so a failure mid-stream becomes an event, not a status code
            yield format_sse({"status_code": exc.status_code, "detail": exc.detail}, event="error")
            return

        yield format_sse({"message": "Travel plan aggregation complete!"}, event="complete")


@router.post("/plan", response_class=StreamingResponse)
async def stream_travel_plan(travel_request: TravelRequestModel):
    """Same plan as POST /plan/, sent piece by piece as Server-Sent Events."""
    validate_trip_dates(travel_request)

    return StreamingResponse(
        stream_generator(travel_request),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
    )
