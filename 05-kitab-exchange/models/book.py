from datetime import datetime
from sqlmodel import SQLModel, Field, Relationship
from typing import Optional


def now() -> datetime:
    """Current local time, timezone-aware (columns are TIMESTAMP WITH TIME ZONE)"""
    return datetime.now().astimezone()


class Book(SQLModel, table=True):
    __tablename__ = "books"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    author: str = Field(index=True)
    price: int
    is_sold: bool = Field(default=False, index=True)
    listed_at: datetime = Field(default_factory=now)

    # Foreign key to users table
    user_id: int = Field(foreign_key="users.id", index=True)
    owner: Optional["User"] = Relationship(back_populates="books")


# request body for creating a book
class BookCreate(SQLModel):
    title: str = Field(min_length=1)
    author: str = Field(min_length=1)
    price: int = Field(gt=0, description="Price in rupees")
    user_id: int


# response body
class BookRead(SQLModel):
    id: int
    title: str
    author: str
    price: int
    is_sold: bool
    listed_at: datetime
    user_id: int


# PATCH: every field optional
class BookUpdate(SQLModel):
    title: Optional[str] = Field(default=None, min_length=1)
    author: Optional[str] = Field(default=None, min_length=1)
    price: Optional[int] = Field(default=None, gt=0)
    is_sold: Optional[bool] = None


from models.user import User
Book.model_rebuild()
