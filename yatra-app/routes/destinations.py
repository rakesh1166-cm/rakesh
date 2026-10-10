from fastapi import Depends, HTTPException, APIRouter
from sqlmodel import Session, select, func
from database import get_session

from models.destination import (
    Destination, DestinationCreate, DestinationRead, DestinationDetail,
    Place, PlaceCreate, PlaceRead,
)

from auth import verify_api_key

router = APIRouter(prefix="/destinations", tags=["destinations"])


def get_destination_or_404(destination_id: int, session: Session) -> Destination:
    destination = session.get(Destination, destination_id)
    if not destination:
        raise HTTPException(status_code=404, detail=f"Destination {destination_id} not found")
    return destination


def to_read(destination: Destination) -> DestinationRead:
    return DestinationRead.model_validate(destination, update={"place_count": len(destination.places)})


@router.get("/", response_model=list[DestinationRead])
def list_destinations(session: Session = Depends(get_session)):
    rows = session.exec(
        select(Destination, func.count(Place.id))
        .join(Place, isouter=True)
        .group_by(Destination.id)
        .order_by(Destination.name)
    ).all()
    return [DestinationRead.model_validate(d, update={"place_count": count}) for d, count in rows]


@router.get("/{destination_id}", response_model=DestinationDetail)
def get_destination(destination_id: int, session: Session = Depends(get_session)):
    destination = get_destination_or_404(destination_id, session)
    places = sorted(destination.places, key=lambda p: p.rating, reverse=True)
    return DestinationDetail.model_validate(
        destination,
        update={"place_count": len(places), "places": [PlaceRead.model_validate(p) for p in places]},
    )


@router.post("/", response_model=DestinationRead, status_code=201)
def create_destination(
    data: DestinationCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    name = data.name.strip().lower()
    if session.exec(select(Destination).where(Destination.name == name)).first():
        raise HTTPException(status_code=400, detail=f"Destination {name} already exists")

    destination = Destination(
        name=name,
        state=data.state.strip(),
        weather_query=(data.weather_query or f"{data.name.strip()}, {data.state.strip()}, India").strip(),
    )
    session.add(destination)
    session.commit()
    session.refresh(destination)
    return to_read(destination)


@router.delete("/{destination_id}")
def delete_destination(
    destination_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    destination = get_destination_or_404(destination_id, session)
    session.delete(destination)  # its places go with it (cascade)
    session.commit()
    return {"message": f"Destination {destination_id} deleted"}


@router.post("/{destination_id}/places", response_model=PlaceRead, status_code=201)
def add_place(
    destination_id: int,
    data: PlaceCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    get_destination_or_404(destination_id, session)
    place = Place.model_validate(data, update={"destination_id": destination_id})
    session.add(place)
    session.commit()
    session.refresh(place)
    return place


@router.delete("/{destination_id}/places/{place_id}")
def delete_place(
    destination_id: int,
    place_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    place = session.get(Place, place_id)
    if not place or place.destination_id != destination_id:
        raise HTTPException(status_code=404, detail=f"Place {place_id} not found in destination {destination_id}")
    session.delete(place)
    session.commit()
    return {"message": f"Place {place_id} deleted"}
