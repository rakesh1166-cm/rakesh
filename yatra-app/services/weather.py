from datetime import date

import httpx
from fastapi import HTTPException

from config import WEATHERAPI_API_KEY
from models.schemas import WeatherResponseModel
from services.cache import get_cache, set_cache

# WeatherAPI never forecasts further than this many days ahead (the free plan stops at 3)
MAX_FORECAST_DAYS = 14


async def fetch_weather(
        destination: str,
        start_date: date,
        end_date: date
) -> list[WeatherResponseModel]:
    """Daily forecast for the trip dates that fall inside WeatherAPI's forecast window."""
    cache_key = f"weather_{destination.lower()}_{start_date}_{end_date}"
    cached_data = get_cache(cache_key)

    if cached_data is not None:
        return cached_data

    # "dt" only ever returns that one day, so ask for every day from today up to the trip's end
    days = (end_date - date.today()).days + 1
    if days < 1:
        return []

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                "https://api.weatherapi.com/v1/forecast.json",
                params={
                    "key": WEATHERAPI_API_KEY,
                    "q": destination,
                    "days": min(days, MAX_FORECAST_DAYS),
                },
            )
            response.raise_for_status()
            data = response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Weather service failed: {exc}") from exc

    forecasts = []
    for day in data["forecast"]["forecastday"]:
        if not (start_date <= date.fromisoformat(day["date"]) <= end_date):
            continue
        forecasts.append(WeatherResponseModel(
            date=day["date"],
            condition=day["day"]["condition"]["text"],
            temperature_high=day["day"]["maxtemp_c"],
            temperature_low=day["day"]["mintemp_c"],
            humidity=day["day"]["avghumidity"],
            rain_chance=day["day"]["daily_chance_of_rain"],
        ))

    set_cache(cache_key, forecasts, ttl=3600)  # Cache for 1 hour
    return forecasts
