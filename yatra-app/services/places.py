from sqlmodel import Session, select

from models.destination import Destination, Place, PlaceRead

# Seed data, written to Postgres on first startup (this used to be the whole "database")
SEED = {
    "manali": {
        "state": "Himachal Pradesh",
        "weather_query": "Manali, Himachal Pradesh, India",
        "places": [
            dict(name="Solang Valley", description="A beautiful valley known for its adventure sports and scenic views",
                 category="Nature", rating=4.5, estimated_time_hours=4),
            dict(name="Rohtang Pass", description="A high mountain pass offering breathtaking views of the Himalayas",
                 category="Nature", rating=4.7, estimated_time_hours=6),
            dict(name="Hadimba Temple", description="An ancient cave temple surrounded by cedar forests",
                 category="Religious Site", rating=4.6, estimated_time_hours=1),
        ],
    },
    "goa": {
        "state": "Goa",
        "weather_query": "Panaji, Goa, India",
        "places": [
            dict(name="Baga Beach", description="A popular beach in Goa known for its nightlife and water sports",
                 category="Beach", rating=4.5, estimated_time_hours=3),
            dict(name="Fort Aguada", description="A well-preserved 17th-century Portuguese fort overlooking the Arabian Sea",
                 category="Historical Site", rating=4.7, estimated_time_hours=2, entry_fee=10.0),
            dict(name="Dudhsagar Waterfalls", description="A majestic waterfall located on the Mandovi River, surrounded by lush greenery",
                 category="Nature", rating=4.8, estimated_time_hours=5, entry_fee=5.0),
            dict(name="Basilica of Bom Jesus", description="A UNESCO World Heritage Site and a famous church in Old Goa",
                 category="Religious Site", rating=4.6, estimated_time_hours=1),
        ],
    },
    "jaipur": {
        "state": "Rajasthan",
        "weather_query": "Jaipur, Rajasthan, India",
        "places": [
            dict(name="Amber Fort", description="A majestic fort located on a hilltop, known for its artistic Hindu style elements",
                 category="Historical Site", rating=4.7, estimated_time_hours=3),
            dict(name="City Palace", description="A beautiful palace complex that showcases a blend of Rajasthani and Mughal architecture",
                 category="Historical Site", rating=4.5, estimated_time_hours=2),
            dict(name="Hawa Mahal", description="A unique five-story palace with a facade resembling a honeycomb, known for its intricate latticework",
                 category="Historical Site", rating=4.4, estimated_time_hours=1),
            dict(name="Jantar Mantar", description="An astronomical observatory with a collection of architectural astronomical instruments",
                 category="Historical Site", rating=4.3, estimated_time_hours=1),
        ],
    },
}


def seed_destinations(session: Session) -> None:
    """Insert the starter destinations, only into an empty table."""
    if session.exec(select(Destination)).first():
        return
    for name, info in SEED.items():
        destination = Destination(name=name, state=info["state"], weather_query=info["weather_query"])
        destination.places = [Place(**place) for place in info["places"]]
        session.add(destination)
    session.commit()


def find_destination(session: Session, name: str) -> Destination | None:
    return session.exec(select(Destination).where(Destination.name == name.strip().lower())).first()


def fetch_places(session: Session, destination: str) -> list[PlaceRead]:
    """Places of interest for a destination, best rated first (empty for unknown destinations)."""
    found = find_destination(session, destination)
    if not found:
        return []
    places = sorted(found.places, key=lambda p: p.rating, reverse=True)
    return [PlaceRead.model_validate(p) for p in places]
