from datetime import date

from pydantic import BaseModel, Field, field_validator


# request body for /plan, /stream/plan and /trips
class TravelRequestModel(BaseModel):
    destination: str = Field(min_length=1)
    start_date: date
    end_date: date
    base_currency: str = Field(default="INR", min_length=3, max_length=3)

    @field_validator("destination")
    @classmethod
    def strip_destination(cls, value: str) -> str:
        return value.strip()

    @field_validator("base_currency")
    @classmethod
    def upper_currency(cls, value: str) -> str:
        return value.upper()


class WeatherResponseModel(BaseModel):
    date: str
    condition: str
    temperature_high: float
    temperature_low: float
    humidity: float
    rain_chance: float
