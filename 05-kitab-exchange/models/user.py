from sqlmodel import SQLModel, Field, Relationship
from pydantic import EmailStr
from typing import Optional


# Database table ("user" is a reserved word in Postgres, so the table is "users")
class User(SQLModel, table=True):
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    email: str = Field(unique=True)
    college: str

    # one user can have many books
    books: list["Book"] = Relationship(back_populates="owner")


# request body for creating a user
class UserCreate(SQLModel):
    name: str = Field(min_length=1)
    email: EmailStr
    college: str = Field(min_length=1)


# response body
class UserRead(SQLModel):
    id: int
    name: str
    email: str
    college: str


# avoid circular import
from models.book import Book
User.model_rebuild()
