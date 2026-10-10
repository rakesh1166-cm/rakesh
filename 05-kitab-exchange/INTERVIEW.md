# INTERVIEW — questions this project actually prepares you for

Twenty-seven questions a FastAPI/Python backend interview is likely to ask, answered with the
Kitab Exchange code as the evidence. The basics (`Depends`, `yield`, `lifespan`, `add`/`commit`/`refresh`)
are covered in `03-rangmanch-review/INTERVIEW.md`. Enums, audit tables, time zones and stats are covered
in `04-dabbe-wala/INTERVIEW.md`. This file covers what this project adds: **two related tables
(one-to-many), `Relationship`, API-key auth, search with `ILIKE`, email validation, and what changes when
you move from SQLite to Postgres.**

Answer format that works: **state the rule, then point at the code.**

---

## One-to-many: a user has many books

### 1. How is "one user has many books" modelled?

With two separate pieces, and interviewers want to hear that they're different things:

```python
# models/book.py — the "many" side
user_id: int = Field(foreign_key="users.id", index=True)      # a real column
owner: Optional["User"] = Relationship(back_populates="books")  # Python only

# models/user.py — the "one" side
books: list["Book"] = Relationship(back_populates="owner")      # Python only
```

- **The foreign key** (`user_id`) is the actual link. It's a column in `books`, and Postgres enforces it.
- **`Relationship`** creates **no column**. It tells SQLAlchemy how to load related rows, so you can
  write `book.owner` and `user.books` instead of writing the query yourself.

The foreign key always goes on the **many** side. A book has exactly one owner, so it can store one
`user_id`. A user can't store a list of book IDs in one column.

### 2. What does `back_populates` do?

It pairs the two attributes, so changing one side updates the other in memory:

```python
book.owner = aisha
book in aisha.books   # True, before any commit
```

Each side names the attribute **on the other class** (`"books"` ↔ `"owner"`). If you leave it out,
you get two independent relationships that can disagree until the next reload.

### 3. Why is `"users.id"` a string with the table name, while `"User"` is a string with the class name?

They're read by different systems:

- `foreign_key="users.id"` is **SQL**. It names the **table** and column, so it follows `__tablename__`.
  When the table was renamed from `user` to `users`, this string had to change too.
- `Optional["User"]` is a **Python type hint**. It names the **class**, written as a string because
  the class isn't defined yet (a forward reference).

### 4. Why are the imports at the *bottom* of `book.py` and `user.py`?

To break a **circular import**. `book.py` needs `User` and `user.py` needs `Book`. If both imported
each other at the top, one file would run while the other was only half-loaded.

```python
# bottom of models/book.py
from models.user import User
Book.model_rebuild()
```

1. The hints are strings (`"User"`), so Python doesn't need the class while it defines `Book`.
2. The import runs **after** `Book` exists, so when `user.py` imports `Book` back, it's already there.
3. `model_rebuild()` tells Pydantic to resolve the string hints into the real classes.

The common alternative is to put both models in one file, or to use `TYPE_CHECKING` imports.

### 5. When does `user.books` actually hit the database?

On **first access**, not when the user is loaded. The default loading is **lazy**:

```python
user = session.get(User, 1)   # SELECT ... FROM users WHERE id = 1
user.books                    # now: SELECT ... FROM books WHERE user_id = 1
```

Two consequences:

- **The session must still be open.** Accessing `user.books` after the session closes raises a
  `DetachedInstanceError`. Inside a route that uses `Depends(get_session)`, the session stays open
  until the response is built, so it works there.
- **The N+1 problem.** Looping over 50 books and reading `book.owner.name` runs 1 + 50 queries.
  The fix is to load everything up front: `select(Book).options(selectinload(Book.owner))`.

This project avoids N+1 in a different way. The React app fetches `GET /users/` **once**, builds an
`owners` map (`useMemo` in `App.jsx`), and looks up each book's seller in the browser.

### 6. Why don't `BookRead` and `UserRead` include `owner` or `books`?

Because serializing relationships in both directions **never ends**:
`user.books[0].owner.books[0].owner...`. It would also run an extra query per row on every list
endpoint.

The response models include only plain columns (`user_id`, not `owner`). If a client needs the owner
nested, add a separate, one-level model:

```python
class BookReadWithOwner(BookRead):
    owner: UserRead          # one level deep, UserRead has no books field
```

### 7. What happens if you delete a user who still has books?

Postgres **refuses**: the books would point at a user who no longer exists, and the foreign key
forbids that. There's no delete-user endpoint yet, so the problem hasn't come up. When you add one,
pick a behaviour on purpose:

- **Block it**: return a 400 or 409 while the user has books. This is safest for a marketplace.
- **Cascade in Python**: `Relationship(..., sa_relationship_kwargs={"cascade": "all, delete-orphan"})`.
- **Cascade in the database**: `Field(foreign_key="users.id", ondelete="CASCADE")`.
- **Soft delete**: an `is_active` flag. The sales history stays.

### 8. Why check that the owner exists before inserting a book?

```python
if not session.get(User, book_data.user_id):
    raise HTTPException(status_code=404, detail=f"User {book_data.user_id} not found")
```

Without the check, Postgres still rejects the row, but with an `IntegrityError`, which FastAPI turns
into a **500**. A 500 means "the server is broken". The real problem is the client's input, so it
should get a clear 4xx.

It's worth adding that the check alone isn't airtight. A user could be deleted between the check
and the insert. The foreign key is the real guarantee, and the check just produces a nicer error.

### 9. Why `index=True` on `user_id`?

Postgres automatically indexes a **primary key**, but **not the column that references it**.
`GET /users/{id}/books` and `GET /books/?user_id=` both filter on `books.user_id`. Without the
index, both would scan the whole table. It's the same rule as `statuslog.order_id` in dabbe-wala.

---

## SQLite → Postgres: what broke

### 10. The code worked on SQLite. What changed when it moved to Postgres?

Three things, and each one hides a real bug on SQLite:

| | SQLite (default settings) | Postgres |
|---|---|---|
| **Foreign keys** | not enforced unless `PRAGMA foreign_keys=ON` | always enforced |
| **`LIKE`** | case-insensitive for ASCII | case-sensitive |
| **`user` as a table name** | allowed | a reserved word, so it has to be quoted |

- On SQLite, `POST /books/` with `user_id: 999` **succeeded** and created an orphan book. On Postgres
  it's a 500. That's why the owner check in Q8 was added.
- On SQLite, searching "physics" found "Physics". On Postgres it didn't, which is why the search
  switched to `ilike` (Q13).
- The table is now `users` (`__tablename__ = "users"`), so raw SQL doesn't need `"user"` in quotes.

The takeaway: **develop against the database you deploy on.** SQLite's forgiving defaults hid a
data-integrity bug.

### 11. How does the app choose its database?

```python
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/kitab_db",
)
engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
```

- `postgresql+psycopg2://` means "the Postgres dialect, using the psycopg2 driver".
- `pool_pre_ping=True` checks that a pooled connection is still alive before using it, so a
  restarted database doesn't cause errors on the first requests.
- `echo=True` logs every SQL statement. Useful while learning, too noisy for production.
- The fallback URL contains the password `root`. That's fine for local learning, but real
  credentials belong in the environment.

`create_all()` only creates tables that are **missing**. It won't add a column to an existing table,
which is why a real project uses **Alembic** migrations.

---

## Search

### 12. How does the book search work?

Every filter is optional, and each one adds a `WHERE` only when it's present:

```python
query = select(Book)
if not include_sold:
    query = query.where(Book.is_sold == False)
if title:
    query = query.where(Book.title.ilike(f"%{title}%"))
if author:
    query = query.where(Book.author.ilike(f"%{author}%"))
if user_id is not None:
    query = query.where(Book.user_id == user_id)
query = query.order_by(Book.id.desc()).offset(skip).limit(limit)
```

Chained `.where()` calls are combined with **AND**. Nothing runs until `session.exec()`, so building
the query step by step costs nothing.

`user_id is not None` (not just `if user_id`) is deliberate: `if 0` is falsy, so a truthiness test
would silently ignore a real value. It doesn't matter for IDs that start at 1, but the habit prevents
real bugs with fields like `price=0`.

### 13. `ILIKE` vs `LIKE` vs `.contains()`?

- `.contains("x")` becomes `LIKE '%x%'`, which is **case-sensitive** in Postgres.
- `.ilike("%x%")` becomes `ILIKE '%x%'`, which is **case-insensitive**. It's Postgres-specific, but
  SQLAlchemy emulates it with `lower()` on other databases.

### 14. Is `f"%{title}%"` a SQL injection risk?

**No SQL injection**: SQLAlchemy sends the value as a **bound parameter**, never pasted into the
SQL text. But there is a smaller issue, **wildcard injection**. `%` and `_` keep their meaning
inside the value, so `?title=%` matches every book and `?title=_` matches any title with at least
one character. It's harmless here, but the fix is to escape them:

```python
safe = title.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")
Book.title.ilike(f"%{safe}%", escape="\\")
```

### 15. `title` has `index=True`. Does the search use that index?

**No.** A normal B-tree index helps `=`, `<`, and prefix matches like `LIKE 'Harry%'`. A pattern
that **starts** with `%` has to check every row, and `ILIKE` makes it harder still. On a big table,
the fix is a trigram index:

```sql
CREATE EXTENSION pg_trgm;
CREATE INDEX books_title_trgm ON books USING gin (title gin_trgm_ops);
```

For real search (relevance ranking, stemming), use Postgres full-text search (`tsvector`) or a
search engine. Knowing that `index=True` doesn't speed up this query is the point interviewers are
checking.

---

## API-key auth

### 16. How are the write endpoints protected?

With a dependency that reads a header:

```python
def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
```

It's added to every POST, PATCH and DELETE route with `api_key: str = Depends(verify_api_key)`.
GET routes don't have it, so browsing is public.

Two details:

- **Header names:** FastAPI converts `x_api_key` to the header **`x-api-key`** (underscores become
  hyphens, matched case-insensitively). Python names can't contain hyphens, which is why it works
  this way.
- **The parameter isn't used in the handler.** A cleaner form is
  `@router.post("/", dependencies=[Depends(verify_api_key)])`, which runs the check without the
  unused `api_key` argument. To protect a whole router, use `APIRouter(dependencies=[...])`. That
  doesn't fit here, because the GETs on the same router are public.

### 17. Missing key vs wrong key: what does the client get? (the trap)

| Request | Response |
|---|---|
| wrong key | **401** `Invalid API Key` (our `HTTPException`) |
| **no header at all** | **422** `field required, loc: [header, x-api-key]` |

`Header()` with no default makes the header **required**, so FastAPI's validation rejects the
request before `verify_api_key` runs. A missing credential should really be a **401**. The fix is
`x_api_key: str | None = Header(default=None)` with the `None` check inside the function, or
FastAPI's `APIKeyHeader` security class, which also adds an **Authorize** button to Swagger.

### 18. The React app sends the key from `VITE_API_KEY`. Is the key secret?

**No, and saying so is the strongest answer to this question.** Every `VITE_` variable is written into
the JavaScript bundle. Anyone can open DevTools and read the `X-API-Key` header in the network
tab. An API key in a browser app only stops casual curl requests.

What it would take to make this real:

- **Users log in** (password or OAuth). The server issues a session cookie or a JWT, and the API
  checks **who** is calling, not just that they know a shared key.
- A static API key suits **server-to-server** calls, where the key never reaches a browser.

### 19. Authentication vs authorization: what's missing here?

- **Authentication** = who are you? This project only checks "do you know the key?".
- **Authorization** = are you **allowed** to do this?

Anyone with the key can edit, mark sold, or delete **any** student's book. There's no rule that only
the owner can change their own listing. With real logins, that check is one line:

```python
if book.user_id != current_user.id:
    raise HTTPException(403, "You can only change your own listings")
```

**401** = "I don't know who you are". **403** = "I know who you are, and the answer is no".

### 20. Anything wrong with `if x_api_key != API_KEY`?

It's a **non-constant-time comparison**. `!=` stops at the first character that differs, so in
theory an attacker can measure response times to guess the key one character at a time. The
standard fix is one line:

```python
import secrets
if not secrets.compare_digest(x_api_key, API_KEY): ...
```

It's rarely exploitable over a network, but interviewers like to see that you know about it.

---

## Users & validation

### 21. How is email validated and kept unique?

```python
class UserCreate(SQLModel):
    email: EmailStr              # needs the email-validator package

email = user_data.email.lower()
existing = session.exec(select(User).where(User.email == email)).first()
if existing:
    raise HTTPException(status_code=400, detail="Email already registered")
user = User.model_validate(user_data, update={"email": email})
```

- **`EmailStr`** rejects `"nope"` with a 422 before the handler runs.
- **Lower-casing** means `Aisha@College.edu` and `aisha@college.edu` count as the same email. Without
  it, the `unique=True` constraint would treat them as different.
- **`model_validate(..., update={...})`** builds the table row and overrides one field in a single
  step.

### 22. The duplicate check runs before the insert. Is that race-safe?

**No**, it's a check-then-act race. Two registrations with the same email can both pass the
`SELECT`, and then both try to `INSERT`. The **`unique=True` constraint** stops the second insert,
but it arrives as an `IntegrityError`, which is a **500**.

The robust version relies on the constraint and translates its error:

```python
try:
    session.add(user)
    session.commit()
except IntegrityError:
    session.rollback()
    raise HTTPException(409, "Email already registered")
```

**409 Conflict** fits better than 400. The request is valid, but it conflicts with existing data.
Keep the `SELECT` if you like, for the common case, but the constraint is what actually guarantees
uniqueness.

### 23. `GET /users/` has no auth. What's the problem?

It returns **every student's email** to anyone who asks. That's a privacy leak, and a ready-made
spam list. Fix it by requiring auth, or by returning a public model without the email
(`UserPublic: id, name, college`). The general rule: **response models decide what leaves the
server**, so decide for each endpoint what's public.

---

## Books & state

### 24. `PATCH /books/{id}/sold` vs `PATCH /books/{id} {"is_sold": true}`: why both?

`/sold` is an **action** endpoint with a rule: selling an already-sold book returns a 400. The generic
PATCH can also set `is_sold` and **skips that rule**, so there are two ways to do one thing with
different behaviour. That's worth pointing out yourself.

Pick one:

- Remove `is_sold` from `BookUpdate`, and add `/sold` + `/relist` actions, each with its own rules.
- Or keep only the PATCH and move the rule into it.

The "already sold" response should also be **409** (it conflicts with current state), not 400.

### 25. Two buyers mark the same book sold at the same moment. What happens?

Both requests read `is_sold = False`, both pass the check, and both write `True`. Both get a 200,
and **both think they bought it**. It's the same read-decide-write race as dabbe-wala Q8.

The neat fix is to make the check and the write **one atomic statement**:

```python
result = session.exec(
    update(Book).where(Book.id == book_id, Book.is_sold == False).values(is_sold=True)
)
session.commit()
if result.rowcount == 0:
    raise HTTPException(409, "Already sold")
```

Only one `UPDATE` can match `is_sold = False`, so the second one updates 0 rows. `SELECT ... FOR
UPDATE` (row locking) also works.

### 26. What does the data model not capture yet?

Good "what would you design next?" material:

- **Who bought it and when.** `is_sold: bool` loses both. A `sold_to_id` foreign key and a
  `sold_at` timestamp, or a separate `Sale` table, would record the transaction.
- **Money:** `price: int` in whole rupees avoids float rounding. If paise matter, store an integer
  in paise or use `Decimal`/`NUMERIC`, **never float**.
- **Condition, edition, ISBN.** ISBN would allow "who is selling this exact book?".

---

## Stats, HTTP & frontend

### 27. Quick-fire round

**How does `/stats/summary` compute totals, and why `coalesce`?**
It uses `COUNT` + `SUM(price)` for sold and unsold books. `SUM` over **zero rows returns NULL, not
0**, so `func.coalesce(func.sum(Book.price), 0)` turns an empty shelf into `0`. It runs two queries.
One query with `GROUP BY is_sold`, or `COUNT(*) FILTER (WHERE is_sold)`, would do it in one.

**Status codes this API returns:**
201 on both creates, 200 on reads, updates and delete, 404 for a missing user or book, 400 for a
duplicate email or already-sold book, 401 for a wrong key, 422 for validation (including a missing
key header). Missing: **204** on delete, and **409** in place of those 400s.

**Why does CORS matter more here than in dabbe-wala?**
`X-API-Key` is a **custom header**, so the browser sends a **preflight** `OPTIONS` request before
every write. The API has to answer it with `allow_headers` that include `x-api-key` (here, `["*"]`).
If the preflight fails, the real request is never sent, and all the UI sees is a network error.

**Why does the React book card have a long `key`?**
`key={`${b.id}-${b.price}-${b.title}-${b.author}-${b.is_sold}`}`. `Book` has no `updated_at` (unlike
dabbe-wala's `Order`), so the key is built from the editable fields. When any of them changes after
a PATCH, React **remounts** the card and the edit form resets to the saved values. Adding an
`updated_at` column would be the cleaner fix.

**"Port 5175 is already in use", even after stopping the dev server?**
This happened on this project: the `node` child process outlived its parent and kept the port. A
port check with `netstat | grep` missed it because it was bound to **IPv6 `::1`**, not `127.0.0.1`.
Find it with `Get-NetTCPConnection -LocalPort 5175 -State Listen`, then check the owning process
before killing it.

---

## If they ask "what would you improve?"

1. **Real user auth** (login → JWT or session) instead of a shared key baked into the browser
   bundle (Q18), plus an **owner check** so users only edit their own books (Q19).
2. **Atomic "mark sold"** with `UPDATE ... WHERE is_sold = false`, returning **409** (Q25).
3. Catch `IntegrityError` on register and return **409**, so the unique constraint does the real
   work (Q22).
4. **Hide emails** from the public user list (Q23).
5. One way to sell a book, not two (Q24). Record the **buyer and `sold_at`** (Q26).
6. Return **401 for a missing key** (Q17), use `secrets.compare_digest` (Q20), and use
   `dependencies=[...]` instead of an unused parameter (Q16).
7. A **trigram index** for search, and escape `%`/`_` (Q14, Q15).
8. **Alembic** for schema changes, plus **204** on delete.

---

## Quick revision

- **Foreign key** = a real column on the **many** side; Postgres enforces it.
- **`Relationship`** = no column; Python navigation (`book.owner`, `user.books`).
- **`back_populates`** = keeps both sides in sync; each names the other's attribute.
- **`"users.id"`** = table name (SQL); **`"User"`** = class name (Python forward reference).
- **Bottom imports + `model_rebuild()`** = how the circular import is broken.
- **Lazy loading** = query on first access; needs an open session; watch for **N+1**.
- **No relationships in response models**, or serialization loops forever.
- **Check the owner exists** → a 404 instead of an `IntegrityError` 500.
- **Index the FK column yourself**; Postgres only indexes the PK side.
- **SQLite hides bugs**: no FK enforcement, case-insensitive `LIKE`, allows `user` as a name.
- **`ilike`** = case-insensitive; **bound parameters** stop SQL injection, but `%`/`_` still act as wildcards.
- **Leading-`%` search can't use a B-tree index** → `pg_trgm`.
- **`x_api_key`** → header `x-api-key`; missing header = **422**, wrong key = **401**.
- **A key in a browser bundle is public.** Authentication ≠ authorization; **401 vs 403**.
- **`secrets.compare_digest`** for comparing secrets.
- **`EmailStr` + lower-casing + unique constraint**; the constraint is the real guarantee.
- **Check-then-act is a race** → atomic `UPDATE ... WHERE`, or rely on the constraint.
- **`SUM` of no rows is NULL** → `coalesce(..., 0)`.
- **Custom header → CORS preflight** before every write.
============================================
1. how would you define a relationship where one User can own many Book records? Explain what User.books, Book.owner, and back_populates do
==============define==============
class User(SQLModel, table=True):
    books: list["Book"] = Relationship(back_populates="owner")
class Book(SQLModel, table=True):
    owner: Optional["User"] = Relationship(back_populates="books")
=======================use========================
user = session.get(User, 5)  # 5 represent primary key
print([book.title for book in user.books])  # Titles of user 5's books
book = session.get(Book, 10) # here 10 represent primary key 
print(book.owner.name)  # Name of book 10's owner    
2. How do I define a foreign key in SQLModel and use it in a query
===========define===========
class Book(SQLModel, table=True):
    __tablename__ = "books"
    id: int | None = Field(default=None, primary_key=True)
    title: str
    user_id: int = Field(foreign_key="users.id", index=True)
======use============
    books = session.exec(
    select(Book).where(Book.user_id == 5)
     ).all()
3. user = session.get(User, 5)
print([book.title for book in user.books])  # Titles of user 5's books
book = session.get(Book, 10)
print(book.owner.name)  # Name of book 10's owner
4. how to current date and time in the computer’s local timezone.
def now() -> datetime:
    return datetime.now().astimezone()
print(now())
5. returns books whose listed_at is at or after that cutoff.
cutoff = now() - timedelta(hours=24)
recent_books = session.exec(
    select(Book).where(Book.listed_at >= cutoff)
).all()   
6. Does price: int require a positive price?
No. It describes an integer; it does not express the rule “greater than zero.” Add that rule explicitly
price: int = Field(gt=0)
 class Book(SQLModel, table=True):
    __tablename__ = "books"
7. Why would you write author: str = Field(index=True) in the Book model, and how could that index help a query that searches books by author? 
index=True asks the database to create an index on the author column. It can make searches such as WHERE author = 'Riya' faster, especially in a large table. Indexes also use storage and add some work when rows are inserted or updated.

index=True like the index at the back of a book: it helps the database find matching rows without checking every book row.
In your model:
8. How do you define the title field in BookCreate so that it must contain at least one character? What does min_length=1 mean?
title: str = Field(min_length=1)
9. How would you require a book title to have at least 3 characters?
title: str = Field(min_length=3)
10. How would you require an author name to have no more than 50 characters?
 author: str = Field(max_length=50)
11. How would you require a book price to be greater than ₹0 but less than ₹1,000?
price: int = Field(gt=0, lt=1000)
12. How would you define a title field in BookCreate that accepts between 3 and 50 characters, including both limits? What happens if the title has 2 or 51 characters?
title: str = Field(min_length=3, max_length=50)
13. how do you define validation so a book title must contain 3–50 characters and its price must be greater than ₹0? Show how the endpoint uses the validated data to create a Book. If the request contains "title": "AI", does the endpoint function run, and what HTTP response does the client receive?

In BookCreate, define title with Field(min_length=3, max_length=50) and price with Field(gt=0). FastAPI validates the request against BookCreate before calling the endpoint. For a valid request, book = Book.model_validate(data) creates the Book object from the validated data. If the title is "AI", its two characters fail the minimum length rule, so the endpoint function does not run and FastAPI returns HTTP 422 with an error for body.title.

===Define validation in the request model====
class BookCreate(SQLModel):
    title: str = Field(min_length=3, max_length=50)
    price: int = Field(gt=0)
====Use the validated data in the endpoint====
@router.post("/books")
def create_book(data: BookCreate):
    book = Book.model_validate(data)  
14. Why does BookCreate use Field(...) validation rules, BookUpdate make its fields optional for PATCH requests, and BookRead declare fields such as id: int and title: str without Field(...)? Explain what each model does when creating, updating, and returning a book.

BookCreate controls what must be sent to create a book, BookUpdate controls what may be sent to change it, and BookRead controls what the API sends back.

BookCreate validates the data a client must send to add a book, so it requires title, author, price, and user_id and uses Field(...) for rules such as a nonempty title and a price greater than zero. BookUpdate is for PATCH requests, so its fields can be omitted when the client wants to change only one value; its Field(...) rules validate values that are supplied. BookRead defines the data returned to the client, including the generated id and listed_at. Declarations such as id: int and title: str already make those response fields required and specify their types, so Field(...) is unnecessary unless you need extra rules or descriptions.

15. How are the Book and User models connected, and how does SQLAlchemy manage the relationship between their tables using ForeignKey, Relationship, and back_populates?

The Book and User models are connected through a one-to-many relationship, meaning one user can own many books, while each book belongs to one user. In Book, Field(foreign_key="users.id") connects the user_id column to the id column in the users table. Relationship lets you access related objects in Python: book.owner gives the book’s user, and user.books gives that user’s books. back_populates connects these two relationship attributes: back_populates="books" points to User.books, while back_populates="owner" points to Book.owner. SQLAlchemy uses the foreign key to load related records through a database session and coordinates changes between both relationship attributes.

In your Book model:============
user_id: int = Field(foreign_key="users.id", index=True)
owner: Optional["User"] = Relationship(back_populates="books")

The corresponding User model contains:========
books: list["Book"] = Relationship(back_populates="owner")


he Book and User models have a one-to-many relationship: one user can own many books, and each book belongs to one user. Field(foreign_key="users.id") connects books.user_id to users.id in the database. Relationship lets you access related Python objects using book.owner and user.books, while back_populates links these two attributes so SQLAlchemy coordinates both sides. Because "User" is written as a string reference in Book, from models.user import User makes the actual class available. Book.model_rebuild() ==asks Pydantic to resolve any unresolved type references and rebuild its model schema; it does not create the foreign key or establish the database relationship. SQLAlchemy manages those relationships separately, so Book.model_rebuild() is not always needed just for the owner relationship.
16. How are multiple models connected, and how does SQLAlchemy manage relationships between their tables using ForeignKey, Relationship, and back_populates?
Suppose one school has many teachers, and one teacher teaches many classes. These three models connect like this:

from typing import Optional
from sqlmodel import SQLModel, Field, Relationship


class School(SQLModel, table=True):
    __tablename__ = "schools"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    teachers: list["Teacher"] = Relationship(back_populates="school")


class Teacher(SQLModel, table=True):
    __tablename__ = "teachers"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    school_id: int = Field(foreign_key="schools.id")
    school: Optional["School"] = Relationship(back_populates="teachers")

    classes: list["SchoolClass"] = Relationship(back_populates="teacher")


class SchoolClass(SQLModel, table=True):
    __tablename__ = "school_classes"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    teacher_id: int = Field(foreign_key="teachers.id")
    teacher: Optional["Teacher"] = Relationship(back_populates="classes")

 School.model_rebuild()
Teacher.model_rebuild()
SchoolClass.model_rebuild()
17. How can we protect selected FastAPI CRUD endpoints using the X-API-Key header.
To protect selected FastAPI CRUD endpoints with the X-API-Key header, add api_key: str = Depends(verify_api_key) to their function parameters. FastAPI checks the key before running the endpoint; a wrong key returns 401 Unauthorized. Send the header using curl -X DELETE http://localhost:8000/books/1 -H "X-API-Key: your_secret_key". Endpoints without this dependency remain public.

C:\Users\rakes\PycharmProjects\fastapi\05-kitab-exchange\auth.py

=====in endpoints========
@router.post("/", response_model=UserRead, status_code=201)
def register_user(
    user_data: UserCreate,
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key)
):
18. how to dependency injection for efficient api development
Dependency injection in FastAPI uses Depends() to supply shared resources, such as database sessions and API-key checks, to endpoint functions. For example, session: Session = Depends(get_session) provides a database session, while api_key: str = Depends(verify_api_key) validates the request’s API key. This reduces repeated code, keeps endpoints focused on business logic, and makes testing easier because dependencies can be replaced with test versions.

19. list out 10 unique dependency injection mostly used by developer.
| # | Dependency | Endpoint parameter syntax | Purpose |
|---|---|---|---|
| 1 | Database session | `session: Session = Depends(get_session)` | Read and write database records |
| 2 | Current user | `user: User = Depends(get_current_user)` | Identify the logged-in user |
| 3 | API-key verification | `api_key: str = Depends(verify_api_key)` | Protect selected endpoints |
| 4 | Role/permission check | `admin: User = Depends(require_admin)` | Restrict access to administrators |
| 5 | Pagination | `pagination: Pagination = Depends(get_pagination)` | Reuse validated `skip` and `limit` parameters |
| 6 | Application settings | `settings: Settings = Depends(get_settings)` | Access configuration |
| 7 | Business service | `service: BookService = Depends(get_book_service)` | Reuse business logic |
| 8 | Cache client | `cache: Redis = Depends(get_cache)` | Read and write cached data |
| 9 | External HTTP client | `client: AsyncClient = Depends(get_http_client)` | Call other APIs |
| 10 | Rate-limit check | `_: None = Depends(check_rate_limit)` | Limit excessive requests |
20. How do you define a role or permission check dependency and apply it to FastAPI endpoints using dependency injection
def require_admin(user: User = Depends(get_current_user)):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

@router.delete("/books/{book_id}")
def delete_book(book_id: int, admin: User = Depends(require_admin)):
    return {"message": "Admin allowed"}
21. How do you define a pagination check dependency and apply it to FastAPI endpoints using dependency injection
def get_pagination(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    return {"skip": skip, "limit": limit}

@router.get("/books")
def list_books(page: dict = Depends(get_pagination)):
    return page

22. How do you define a Application settings or Access configuration check dependency and apply it to FastAPI endpoints using dependency injection  
from functools import lru_cache
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    app_name: str = "Kitab API"

@lru_cache
def get_settings():
    return Settings()

@router.get("/info")
def app_info(settings: Settings = Depends(get_settings)):
    return {"app_name": settings.app_name}  
23. How do you Reuse business logic check dependency and apply it to FastAPI endpoints using dependency injection     
=============Define the service==================
from fastapi import Depends, HTTPException
from sqlmodel import Session

# Assumes Book and get_session are already defined.

class BookService:
    def __init__(self, session: Session):
        self.session = session

    def get_book(self, book_id: int) -> Book:
        book = self.session.get(Book, book_id)

        if book is None:
            raise HTTPException(
                status_code=404,
                detail="Book not found"
            )

        return book
====================Apply it to an endpoint================ 
@router.get("/books/{book_id}")
def read_book(
    book_id: int,
    service: BookService = Depends(get_book_service)
):
    book = service.get_book(book_id)

    return {"id": book.id, "title": book.title}   

24. How do you define a Cache client check dependency or Read and write cached data and apply it to FastAPI endpoints using dependency injection.
def get_cache(request: Request):
    return request.app.state.redis

@router.get("/cached-title")
async def cached_title(cache = Depends(get_cache)):
    return {"title": await cache.get("book:title")}  
25. How do you define Call other APIs or a External HTTP client check dependency and apply it to FastAPI endpoints using dependency injection.    
def get_http_client(request: Request):
    return request.app.state.http_client

@router.get("/external")
async def external_data(client: httpx.AsyncClient = Depends(get_http_client)):
    response = await client.get("https://example.com")
    response.raise_for_status()
    return {"status": response.status_code}
26. How do you define a Rate-limit check check dependency and apply it to FastAPI endpoints using dependency injection.  
async def check_rate_limit(
    user: User = Depends(get_current_user),
    cache = Depends(get_cache)
):
    key = f"rate:{user.id}:{int(time.time()) // 60}"

    # Transaction ensures increment and expiry run together.
    async with cache.pipeline(transaction=True) as pipe:
        pipe.incr(key)
        pipe.expire(key, 120)
        count, _ = await pipe.execute()

    if count > 60:
        raise HTTPException(status_code=429, detail="Too many requests")

@router.get("/limited", dependencies=[Depends(check_rate_limit)])
def limited_endpoint():
    return {"message": "Request allowed"}
26. how to inject multiple dependence in single endpoints fun
FastAPI resolves each dependency before running the function: session provides database access, user identifies the logged-in user, and api_key verifies the API key. If authentication or key verification raises an exception, the endpoint body does not run.

@router.post("/books")
def create_book(
    book_data: BookCreate,
    session: Session = Depends(get_session),
    user: User = Depends(get_current_user),
    api_key: str = Depends(verify_api_key)
):
    book = Book(
        **book_data.model_dump(exclude={"user_id"}),
        user_id=user.id
    )
    session.add(book)
    session.commit()
    session.refresh(book)
    return book    
27. What is the difference between return user and raise HTTPException(...), and when should each be used? 
return user ends the function and sends the user data as a successful response—201 Created in your endpoint.
raise HTTPException(...) stops normal execution and sends an error response. Use it when registration cannot continue.
28. How do you access a single field, such as email, from submitted registration data and convert its value to lowercase?
Use the request model’s field:
email = user_data.email.lower()
29. Different unique way  to stops normal execution and sends an error response. 
 existing = session.exec(select(User).where(User.email == email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
 An alternative is to return a JSONResponse=====  
  existing = session.exec(select(User).where(User.email == email)).first()
  from fastapi.responses import JSONResponse

if existing:
    return JSONResponse(
        status_code=400,
        content={"detail": "Email already registered"}
    ) 
30. What different conditions can stop an endpoint’s normal execution by raising HTTPException?
# Record already exists
if existing:
    raise HTTPException(400, detail="Email already registered")

# Retrieved user is missing
if user is None:
    raise HTTPException(404, detail="User not found")

# Check directly without storing the user
if session.get(User, user_id) is None:
    raise HTTPException(404, detail="User not found")

# Value outside an allowed range
if not 1 <= price <= 1000:
    raise HTTPException(400, detail="Price must be between 1 and 1000")

# Either condition is true
if user.is_blocked or not user.is_active:
    raise HTTPException(403, detail="Account unavailable")

# Both conditions are true
if book.is_sold and user.role != "admin":
    raise HTTPException(403, detail="Cannot modify a sold book")    
if book.is_sold and user.role != "admin":
    raise HTTPException(403, detail="Cannot modify a sold book")   
if book.is_sold and user.role != "admin" and not user.is_active:
    raise HTTPException(403, detail="Action not allowed")   
book_count = session.exec(
    select(func.count(Book.id)).where(Book.user_id == user_id)
).one()

if book_count >= 10:
    raise HTTPException(400, detail="Maximum 10 books allowed")         
32. What is the difference between Review(**review.model_dump()) and Book.model_validate(book_data) when converting a request model into a database model in a FastAPI POST endpoint?
Review(**review.model_dump()): converts the request object to a dictionary, then unpacks it to create a Review.
Book.model_validate(book_data): directly validates the request object against Book and creates a Book instance.
33. When should you use response_model=list[UserRead] versus response_model=UserRead? Why do GET endpoints that return multiple records often use a list, while POST endpoints that create one record usually use a single model?
Response model==list[UserRead] ==Multiple users, including an empty list==List users
UserRead===Multiple users, One user == Get or create one user
34. How do you insert multiple records into a database in a single FastAPI POST request?
@router.post("/bulk", response_model=list[UserRead], status_code=201)
def create_users(
    users_data: list[UserCreate],
    session: Session = Depends(get_session)
):
    users = [User.model_validate(data) for data in users_data]

    session.add_all(users)
    session.commit()

    for user in users:
        session.refresh(user)

    return users
35. How do you chain query methods using dots, such as select(Book).where(...).order_by(...)? How can you add multiple filtering conditions and sort the results in descending order?  
statement = (
    select(Book)
    .where(Book.user_id == user_id)
    .where(Book.is_sold == False)
    .order_by(Book.id.desc())
)

books = session.exec(statement).all()   
36. How do you apply multiple optional filters when listing data in a FastAPI GET endpoint?
query = select(Book)

if not include_sold:
    query = query.where(Book.is_sold == False)

if title:
    query = query.where(Book.title.ilike(f"%{title}%"))

if author:
    query = query.where(Book.author.ilike(f"%{author}%"))

if user_id is not None:
    query = query.where(Book.user_id == user_id)
38. How do you create and call a reusable get_book_or_404() helper function in a FastAPI GET endpoint to return a book if it exists or raise an HTTP 404 exception if it does not?
def get_book_or_404(book_id: int, session: Session) -> Book:
    book = session.get(Book, book_id)
    if not book:
        raise HTTPException(status_code=404, detail=f"Book {book_id} not found")
    return book
@router.get("/{book_id}", response_model=BookRead)
def get_book(book_id: int, session: Session = Depends(get_session)):
    return get_book_or_404(book_id, session)   
39. How can you reuse logic in Python and FastAPI using seven different approaches? Give an example of each.

| # | Approach | Example | When to use |
|---|---|---|---|
| 1 | **Direct function call** | `get_book_or_404(book_id, session)` | Simple shared logic |
| 2 | **Dependency injection** | `book: Book = Depends(get_book_or_404)` | Load and validate a book before the endpoint runs |
| 3 | **Service class method** | `book_service.get_or_404(book_id)` | Group related business operations |
| 4 | **Repository class method** | `book_repository.get_by_id(book_id)` | Keep database queries together |
| 5 | **Decorator** | `@log_execution` | Apply shared behavior around function execution |
| 6 | **Higher-order function** | `run_operation(get_book_or_404, book_id, session)` | Pass a function to another function as a callback |
| 7 | **Callable object** | `book_finder(book_id, session)` | Reuse configurable logic through a class with `__call__()` |
50. How do you use SQL aggregate functions to return multiple values and unpack them into count and value using SQLModel?
from sqlalchemy import func
from sqlmodel import select

count, value = session.exec(
    select(
        func.count(Book.id),
        func.coalesce(func.sum(Book.price), 0)
    ).where(Book.is_sold == sold)
).one()
51. What is func, and when is it used?
func is a SQLAlchemy object used to build SQL function expressions in your query. The database performs these calculations.
Use it for counts, totals, averages, minimums, maximums, and other SQL functions:
52. How do you use a nested function to reuse logic inside a FastAPI endpoint?
def summary(session: Session = Depends(get_session)):  # Outer function

    def books(sold: bool):  # Nested function
        count, value = session.exec(
            select(
                func.count(Book.id),
                func.coalesce(func.sum(Book.price), 0)
            ).where(Book.is_sold == sold)
        ).one()

        return {"count": count, "value": value}

    return {
        "users": session.exec(select(func.count(User.id))).one(),
        "available": books(False),
        "sold": books(True),
    }
53. When and why should you use a nested function in Python, and how does return behave in the inner and outer functions?
Use one when:
- Its logic is needed only inside the outer function.
- You want to reuse that logic without repeating code.
- It needs access to variables from the outer function, such as your session.
def summary():
    def books(sold):
        if sold:
            return {"count": 2, "value": 500}

        return {"count": 3, "value": 900}

    available = books(False)
    sold = books(True)

    return {
        "available": available,
        "sold": sold
    }
 How does return behave?
1. books(False) runs the inner function.
2. Its return ends only that call to books() and sends its result back to summary().
3. summary() continues and calls books(True).
4. The outer return ends summary() and returns the complete dictionary.
Each return exits the function it belongs to. Returning from an inner function does not automatically exit the outer function.
In your FastAPI endpoint, books() returns data to summary(), and summary() returns the final data to FastAPI.   





     


