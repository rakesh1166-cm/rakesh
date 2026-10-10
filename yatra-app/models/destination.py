from typing import Optional

from sqlmodel import SQLModel, Field, Relationship


class Destination(SQLModel, table=True):
    __tablename__ = "destinations"

    id: Optional[int] = Field(default=None, primary_key=True)
    # stored lower-case so "Goa" and "goa" are the same destination
    name: str = Field(unique=True, index=True)
    state: str
    # what WeatherAPI is asked for; a bare "goa" resolves to Genoa, Italy
    weather_query: str

    # one destination has many places
    places: list["Place"] = Relationship(
        back_populates="destination",
        sa_relationship_kwargs={"cascade": "all, delete-orphan"},
    )


class DestinationCreate(SQLModel):
    name: str = Field(min_length=1)
    state: str = Field(min_length=1)
    weather_query: Optional[str] = Field(default=None, description='Defaults to "<name>, India"')


class DestinationRead(SQLModel):
    id: int
    name: str
    state: str
    weather_query: str
    place_count: int = 0


class Place(SQLModel, table=True):
    __tablename__ = "places"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    category: str = Field(index=True)
    rating: float
    estimated_time_hours: float
    entry_fee: Optional[float] = None

    # Foreign key to destinations table
    destination_id: int = Field(foreign_key="destinations.id", index=True)
    destination: Optional[Destination] = Relationship(back_populates="places")


class PlaceCreate(SQLModel):
    name: str = Field(min_length=1)
    description: str = Field(min_length=1)
    category: str = Field(min_length=1)
    rating: float = Field(ge=0, le=5)
    estimated_time_hours: float = Field(gt=0)
    entry_fee: Optional[float] = Field(default=None, ge=0, description="Entry fee in rupees")


class PlaceRead(SQLModel):
    id: int
    name: str
    description: str
    category: str
    rating: float
    estimated_time_hours: float
    entry_fee: Optional[float]
    destination_id: int


class DestinationDetail(DestinationRead):
    places: list[PlaceRead] = []
