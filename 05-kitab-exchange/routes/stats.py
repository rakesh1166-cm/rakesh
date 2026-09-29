from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import get_session

from models.book import Book
from models.user import User


router = APIRouter(prefix="/stats", tags=["stats"])


@router.get("/summary")
def summary(session: Session = Depends(get_session)):
    """Marketplace totals: users, books available vs sold, and rupee value of each."""
    def books(sold: bool):
        count, value = session.exec(
            select(func.count(Book.id), func.coalesce(func.sum(Book.price), 0)).where(Book.is_sold == sold)
        ).one()
        return {"count": count, "value": value}

    return {
        "users": session.exec(select(func.count(User.id))).one(),
        "available": books(False),
        "sold": books(True),
    }
