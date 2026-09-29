from fastapi import Depends, HTTPException, APIRouter, Query
from typing import Optional
from sqlmodel import Session, select
from database import get_session

from models.book import Book, BookCreate, BookRead, BookUpdate
from models.user import User

from auth import verify_api_key

router = APIRouter(prefix="/books", tags=["books"])


def get_book_or_404(book_id: int, session: Session) -> Book:
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book {book_id} not found")
    return book


@router.get("/", response_model=list[BookRead])
def list_books(
    title: Optional[str] = Query(default=None, description="Case-insensitive partial match"),
    author: Optional[str] = Query(default=None, description="Case-insensitive partial match"),
    user_id: Optional[int] = Query(default=None, description="Only books listed by this user"),
    include_sold: bool = Query(default=False, description="Also return books already sold"),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    session: Session = Depends(get_session)
):
    query = select(Book)

    if not include_sold:
        query = query.where(Book.is_sold == False)  # noqa: E712
    if title:
        query = query.where(Book.title.ilike(f"%{title}%"))
    if author:
        query = query.where(Book.author.ilike(f"%{author}%"))
    if user_id is not None:
        query = query.where(Book.user_id == user_id)

    query = query.order_by(Book.id.desc()).offset(skip).limit(limit)
    return session.exec(query).all()


@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, session: Session = Depends(get_session)):
    return get_book_or_404(book_id, session)


@router.post("/", response_model=BookRead, status_code=201)
def create_book(
    book_data: BookCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    # Postgres enforces the foreign key, so check the owner up front for a clean 404
    if not session.get(User, book_data.user_id):
        raise HTTPException(status_code=404, detail=f"User {book_data.user_id} not found")

    book = Book.model_validate(book_data)
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


@router.patch("/{book_id}", response_model=BookRead)
def update_book(
    book_id: int,
    updates: BookUpdate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    book = get_book_or_404(book_id, session)

    book_data = updates.model_dump(exclude_unset=True)
    for key, value in book_data.items():
        setattr(book, key, value)

    session.add(book)
    session.commit()
    session.refresh(book)
    return book


@router.patch("/{book_id}/sold", response_model=BookRead)
def mark_book_sold(
    book_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    book = get_book_or_404(book_id, session)
    if book.is_sold:
        raise HTTPException(status_code=400, detail=f"Book {book_id} is already sold")

    book.is_sold = True
    session.add(book)
    session.commit()
    session.refresh(book)
    return book


@router.delete("/{book_id}")
def delete_book(
    book_id: int,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    book = get_book_or_404(book_id, session)
    session.delete(book)
    session.commit()
    return {"message": f"Book {book_id} deleted"}
