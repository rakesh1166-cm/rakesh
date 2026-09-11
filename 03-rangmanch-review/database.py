import os

from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_db",
)

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)

def create_tables():
    """Create all tables defined by SQLModel Class"""
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency that provides a database session per request"""
    with Session(engine) as session:
        yield session
