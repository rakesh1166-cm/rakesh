"""Landmarks resource — a thin CRUD slice that exercises the DB wiring."""

from typing import List

from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.models.landmark import Landmark
from app.schemas.landmark import LandmarkCreate, LandmarkRead


router = APIRouter(prefix="/api/landmarks", tags=["landmarks"])


@router.get("", response_model=List[LandmarkRead])
def list_landmarks(db: Session = Depends(get_db)) -> List[Landmark]:
    return db.query(Landmark).order_by(Landmark.id).all()


@router.post("", response_model=LandmarkRead, status_code=status.HTTP_201_CREATED)
def create_landmark(payload: LandmarkCreate, db: Session = Depends(get_db)) -> Landmark:
    landmark = Landmark(**payload.model_dump())
    db.add(landmark)
    db.commit()
    db.refresh(landmark)
    return landmark
