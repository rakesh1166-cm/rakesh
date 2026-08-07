"""Seed table used to prove the database wiring end to end."""

from sqlalchemy import Column, Integer, String, Text

from app.db.database import Base


class Landmark(Base):
    # Prefixed to stay clear of the pre-existing CMS tables in `holidaylandmark`.
    __tablename__ = "agent_landmarks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(160), nullable=False, index=True)
    city = Column(String(120), nullable=False)
    country = Column(String(120), nullable=False)
    description = Column(Text, nullable=True)
