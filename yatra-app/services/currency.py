import httpx
from fastapi import HTTPException

from config import EXCHANGERATE_API_KEY
from services.cache import get_cache, set_cache


async def fetch_currency_rates(base_currency: str) -> dict[str, float]:
    """Fetch currency exchange rates from an external API."""
    cache_key = f"currency_{base_currency}"
    cached_data = get_cache(cache_key)

    if cached_data:
        return cached_data

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            response = await client.get(
                f"https://v6.exchangerate-api.com/v6/{EXCHANGERATE_API_KEY}/latest/{base_currency}"
            )
            data = response.json()
    except (httpx.HTTPError, ValueError) as exc:
        raise HTTPException(status_code=502, detail=f"Currency service failed: {exc}") from exc

    # The API answers an unknown code with 404 and {"error-type": "unsupported-code"}
    if data.get("result") != "success":
        raise HTTPException(
            status_code=400,
            detail=f"Currency service rejected {base_currency}: {data.get('error-type', response.status_code)}",
        )

    rates = data.get("conversion_rates", {})
    set_cache(cache_key, rates, ttl=3600)  # Cache for 1 hour
    return rates
