from fastapi import Depends, HTTPException, APIRouter
from sqlmodel import Session, select
from database import get_session

from models.user import User, UserCreate, UserRead
from models.book import Book, BookRead

from auth import verify_api_key

router = APIRouter(prefix="/users", tags=["users"])


@router.post("/", response_model=UserRead, status_code=201)
def register_user(
    user_data: UserCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
    email = user_data.email.lower()
    existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User.model_validate(user_data, update={"email": email})
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.get("/", response_model=list[UserRead])
def list_users(session: Session = Depends(get_session)):
    return session.exec(select(User).order_by(User.id)).all()


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return user


@router.get("/{user_id}/books", response_model=list[BookRead])
def user_books(user_id: int, session: Session = Depends(get_session)):
    """Every book this user has listed, sold or not."""
    if not session.get(User, user_id):
        raise HTTPException(status_code=404, detail=f"User {user_id} not found")
    return session.exec(select(Book).where(Book.user_id == user_id).order_by(Book.id.desc())).all()
