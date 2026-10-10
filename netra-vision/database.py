import os

from sqlmodel import SQLModel, Session, create_engine

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/netra_db",
)

engine = create_engine(DATABASE_URL, echo=False, pool_pre_ping=True)


def create_tables():
    """Create all tables defined by SQLModel classes"""
    # Importing the models registers their tables on SQLModel.metadata
    import models  # noqa: F401
    SQLModel.metadata.create_all(engine)


def get_session():
    """Dependency that provides a database session per request"""
    with Session(engine) as session:
        yield session
