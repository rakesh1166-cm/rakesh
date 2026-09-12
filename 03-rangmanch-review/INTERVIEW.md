# INTERVIEW — questions this project actually prepares you for

Twenty-six questions: the ones asked in almost every FastAPI/Python backend interview, answered
with this codebase as the evidence. Depth on any of them is in [FLOW.md](FLOW.md).

Answer format that works: **state the rule, then point at the code.**

---

## FastAPI & structure

### 1. Why FastAPI over Flask or Django REST Framework?

Type hints do double duty — the same annotation is the validation rule, the serializer, and the
OpenAPI documentation. You write `review: ReviewCreate` once and get parsing, a 422 on bad input,
and interactive `/docs` for free. It's ASGI, so async is native rather than bolted on.

The honest trade-off: no built-in ORM, admin, or auth. Django gives you those; with FastAPI you
assemble them yourself — here, SQLModel + PostgreSQL.

### 2. What is `Depends`, and why is `get_session` a generator?

`Depends` is dependency injection: FastAPI calls the function before your handler and passes the
result in. It's how shared setup — DB sessions, auth, pagination — stays out of the handlers.

It's a **generator** because of cleanup:

```python
def get_session():
    with Session(engine) as session:
        yield session
```

Code before `yield` runs before the handler; code after runs once the response is finished. So the
`with` block closes the session and returns the connection to the pool **even if the handler
raised**. A plain `return` would leak connections.

The rule underneath: **one session per request, never a global.** A `Session` is a transaction —
sharing one across concurrent requests means two requests interfering inside one transaction.

### 3. What is `lifespan` for?

Startup and shutdown work, as an async context manager. Everything before `yield` runs once before
the first request — here `create_tables()`. Everything after runs on shutdown, for closing pools or
flushing caches. It replaces the deprecated `@app.on_event("startup")`.

### 4. You use `yield` in two different places. Are they the same thing?

Three appearances, two mechanisms — and the distinction is a good one to have straight.

**1. `main.py` — a generator turned into a context manager by `contextlib`:**

```python
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()      # before yield  → startup
    yield                # app serves traffic here
    print("Shutting down")   # after yield → shutdown
```

`@asynccontextmanager` is what makes a function with one `yield` usable in an `async with`.
(`@contextmanager` is the synchronous twin.) FastAPI enters it when the app boots and exits it on
shutdown.

**2. `database.py` — a bare generator, deliberately *not* decorated:**

```python
def get_session():
    with Session(engine) as session:
        yield session
```

FastAPI detects generator dependencies on its own and drives them: it advances the generator to get
the session before the handler, then resumes it once the response is sent. **Decorating this with
`@contextmanager` would break it** — the handler would receive a `_GeneratorContextManager` object
instead of a `Session`.

**3. Inside that, `with Session(engine) as session:`** uses SQLAlchemy's own context manager — the
ordinary `__enter__`/`__exit__` protocol.

**The shared idea:** `return` hands back a value and ends the function. **`yield` hands back a value
and stays paused**, keeping its local variables alive, so it can run cleanup after the caller is
finished. That pause is the seam between setup and teardown.

> **The safety detail worth adding:** put teardown inside a `with` or a `try/finally`. If the
> handler raises, the exception is thrown back into the generator *at the `yield`*, so anything
> after a bare `yield` is skipped. Here the `with` block owns the closing, so the connection
> returns to the pool whether the request succeeded or blew up.

### 5. What does `response_model` do?

It filters and validates what goes **out**. `response_model=ReviewRead` means only the fields
declared on `ReviewRead` are serialized — so if someone adds a `password_hash` column next month,
it cannot leak through this endpoint. It also documents the response shape in OpenAPI.

### 6. Path vs query vs body parameters — and what is a 422?

FastAPI decides by type and name:

| Kind | How it's declared | Example here |
|---|---|---|
| Path | name matches `/{...}` in the route | `review_id: int` |
| Query | scalar with a default / `Query(...)` | `limit: int = Query(10, ge=1, le=50)` |
| Body | a Pydantic/SQLModel model | `review: ReviewCreate` |

All three validate identically, and a failure is **422 Unprocessable Entity** — raised by Pydantic
**before your handler runs**. `?limit=99` never reaches `list_reviews`.

---

## Data modelling

### 7. Why four models instead of just one `Review`?

Because storage shape, input shape, output shape and patch shape are four different things:

```
Review        (table=True)  → what the DATABASE stores
ReviewCreate                → what the CLIENT may SEND
ReviewRead                  → what the CLIENT may SEE
ReviewUpate                 → what the CLIENT may CHANGE
```

Use one model for all four and you get three bugs quietly: the client can set its own `id`, forge
`created_at`, and see any column added later. `ReviewCreate` has neither `id` nor `created_at`, so
they can't be sent. `ReviewRead` lists its fields explicitly, so nothing leaks by accident.
`ReviewUpate` contains only `rating` and `comment` — **that** is why `play_name` can't be edited.
The rule lives in the model, not in an `if` inside the handler.

### 8. What does `exclude_unset=True` do, and how is PATCH different from PUT?

It returns only the keys the client **actually sent**, which is how you tell *absent* apart from
*null*:

```python
update_data = update.model_dump(exclude_unset=True)
```

Drop that flag and an omitted `comment` arrives as `None` and overwrites the stored comment with
NULL — the most common PATCH bug there is.

That's also PUT vs PATCH in one line: **PATCH sends a delta, PUT sends the whole replacement.**

---

## SQLModel

### 9. What is SQLModel, and why pair it with FastAPI?

SQLModel is a thin layer over **SQLAlchemy** (the ORM) and **Pydantic** (validation), by the author
of FastAPI. One class can be both a database table and a validation schema, so you stop writing the
same fields twice — once as a SQLAlchemy model and again as a Pydantic schema.

Underneath there's no magic: a `table=True` class *is* a SQLAlchemy mapped class, and everything
you know about sessions, `select()` and transactions still applies.

Worth saying out loud: **it removes duplication, not the need for separate shapes.** This project
still has four models, because storage and wire shapes genuinely differ (see Q7).

### 10. What does `table=True` actually change?

It's the switch between "just a Pydantic model" and "a real database table":

| | `table=True` (`Review`) | no `table` (`ReviewCreate`) |
|---|---|---|
| Registered in `SQLModel.metadata` | yes — `create_all` creates it | no |
| Is a SQLAlchemy mapped class | yes | no |
| Can be `session.add()`ed | yes | no |
| **Validates on instantiation** | **no** | **yes** |

That last row is the one people miss — see the next question.

### 11. So are `ge=1, le=5` enforced on the table model?

**No**, and knowing this is worth points. SQLModel turns validation **off** for `table=True`
classes, and the constraint never became a Postgres `CHECK` either. `Review(rating=99)` in a script
commits happily.

The API is safe only because `ReviewCreate` and `ReviewUpate` are non-table models, and those *do*
validate. So the constraint holds for anything arriving over HTTP, and holds for nothing else.

**A rule that must hold no matter who writes — scripts, migrations, psql — belongs in the database
as a constraint, not in Python.**

### 12. `Field()` looks like it's doing two jobs at once. What is it?

It is. `sqlmodel.Field` merges Pydantic's field options with SQLAlchemy's column options in one
call:

```python
id: Optional[int] = Field(default=None, primary_key=True)   # SQLAlchemy: column config
play_name: str = Field(index=True)                          # SQLAlchemy: build an index
rating: int = Field(ge=1, le=5)                             # Pydantic:   validation
```

`primary_key`, `foreign_key`, `index`, `unique`, `sa_column` go to the database side; `ge`, `le`,
`max_length`, `default_factory` go to the validation side. For anything SQLModel doesn't wrap, you
drop to `sa_column=Column(...)`.

### 13. Why is `id` typed `Optional[int]` with `default=None`?

Because **the id doesn't exist yet** when you build the object in Python — Postgres assigns it from
a sequence during `INSERT`. So the type has to permit `None` for the window between construction
and commit.

That's also why `session.refresh()` exists: it re-reads the row to pull the generated `id` back
into the object. And it's why `ReviewRead` declares `id: int` (not optional) — by the time a row is
being *returned*, the id is guaranteed.

### 14. `default_factory=datetime.now` or `default=datetime.now()`?

`default_factory`, always — and this is a classic bug question.

```python
created_at: datetime = Field(default_factory=datetime.now)   # called per row  ✓
created_at: datetime = Field(default=datetime.now())         # called once, at import  ✗
```

The second form evaluates the moment the module is imported, so **every row gets the timestamp of
server startup**. Same trap as a mutable default argument in Python. Any default that is computed,
mutable, or time-dependent needs a factory.

### 15. What does `index=True` on `play_name` buy, and what does it cost?

It creates a database index, so `WHERE play_name = 'x'` becomes an index lookup instead of a full
table scan. It's there because this project filters and aggregates by exactly that column.

The cost, which is what interviewers actually want: **every `INSERT`, `UPDATE` and `DELETE` has to
maintain the index**, and it consumes disk. Indexes are a read/write trade, not free speed — you
add them for columns you filter, join or sort on, not for every column.

### 16. `session.exec()` vs `session.execute()` — and why does the average endpoint unpack a tuple?

`exec()` is SQLModel's wrapper around SQLAlchemy's `execute()`. For `select(Review)` it hands back
**model objects directly**, where plain SQLAlchemy would return `Row` objects you must `.scalars()`
out.

But when you select *columns* rather than a model, there's nothing to unwrap — so you get a row
tuple:

```python
result = session.exec(
    select(func.avg(Review.rating), func.count(Review.id)).where(...)
).first()
avg_rating, total_reviews = result      # a tuple, not a Review
```

So: select a model → get model objects; select columns → get tuples.

### 17. This project has no relationships. How would you add one — and what is N+1?

Split plays into their own table, with a foreign key and a `Relationship` on each side:

```python
class Play(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    reviews: list["Review"] = Relationship(back_populates="play")

class Review(SQLModel, table=True):
    play_id: int = Field(foreign_key="play.id")
    play: Optional[Play] = Relationship(back_populates="reviews")
```

`Field(foreign_key=...)` is the database constraint; `Relationship()` is the Python-side navigation.

**N+1** is the follow-up they're fishing for: list 100 reviews, touch `review.play` on each, and
you've issued 1 query for the list plus 100 more for the plays. The fix is eager loading —
`selectinload(Review.play)` — so it becomes two queries regardless of row count. It's the most
common ORM performance bug there is.

### 18. When is SQLModel the wrong choice?

When the query layer gets complicated. It's deliberately thin, so anything advanced — complex
joins, CTEs, window functions, bulk operations — means dropping into SQLAlchemy directly, and at
that point the unified-class benefit mostly evaporates.

It's also younger and smaller than SQLAlchemy, with rougher edges (the `table=True` validation
behaviour above being the notable one). For a straightforward CRUD API like this, it's a good fit;
for a heavy reporting backend, plain SQLAlchemy plus separate Pydantic schemas is the safer call.

---

## Database & ORM

### 19. Engine vs Session vs connection?

The **engine** is created once at import and connects to nothing — it's a lazy factory plus a
connection pool. The first real socket opens when something executes. A **Session** is a
transaction plus an identity map, short-lived, one per request. Connections are borrowed from the
pool and returned.

`pool_pre_ping=True` matters for a networked database because an idle connection can die between
requests — it tests the connection before handing it over. A SQLite file never had that problem.

### 20. Walk through `add` → `commit` → `refresh`.

Three steps because three different machines are involved:

- `session.add()` — stages the object. **No SQL has run yet.**
- `session.commit()` — emits the `INSERT` and ends the transaction. Postgres assigns the `id` here.
- `session.refresh()` — re-`SELECT`s the row to pull server-generated values back into Python.

Skip `refresh` and `db_review.id` is stale — and `ReviewRead` requires `id: int`, so the response
blows up.

Related: `session.get(Review, id)` is a **primary-key lookup** that checks the session's identity
map first, so a row already loaded in this transaction costs zero queries. Use `get()` for a PK,
`select().where()` for anything else.

### 21. How does pagination work here, and what's wrong with it?

`skip`/`limit` become SQL `OFFSET`/`LIMIT`, so **Postgres** discards the rows — returning 10 of
10,000 transfers 10 rows. That's the difference between pagination and slicing a list you already
loaded into memory.

The flaw: there's **no `ORDER BY`**. SQL guarantees no row order without one, so page 2 can legally
repeat a row from page 1. The fix is `.order_by(Review.id)`.

Also worth knowing: `select()` statements are **immutable**. `.where()` and `.limit()` each return
a *new* statement, which is why the code reads `query = query.where(...)`.

### 22. `create_all()` vs migrations?

`create_all` issues `CREATE TABLE` only for tables that don't exist. **It never `ALTER`s.** Add a
column to `models.py`, restart, and Postgres is unchanged with no warning. That silent gap is
exactly what Alembic exists to fill — versioned, reviewable schema changes.

Related: `metadata` is a registry, and importing `models.py` is what puts `Review` into it. Forget
that import and `create_all()` is a silent no-op — no table, no error.

---

## REST & HTTP

### 23. What status codes does this API return, and what *should* it return?

| Code | When |
|---|---|
| 200 | anything that worked — **including DELETE** |
| 307 | `/review` without the trailing slash (Starlette redirects) |
| 404 | id not found, raised by you via `HTTPException` |
| 422 | validation failed, raised by Pydantic before your code |

What's missing is conventional: **201 on create, 204 on delete**. Neither is wired up. The fix is
one argument — `@router.post("/", status_code=201)`.

### 24. Which HTTP methods are safe and which are idempotent?

- **Safe** (no side effects): GET.
- **Idempotent** (same result if repeated): GET, PUT, DELETE.
- **Neither**: POST — retry it and you get a second row.
- PATCH is **not guaranteed** idempotent, though a field-set patch like this one happens to be.

It matters for retries: a client or proxy may safely repeat a GET or DELETE, never a POST.

---

## Frontend & CORS

### 25. What is CORS, and why did the browser block you when curl worked fine?

**CORS is a browser rule, not a server one.** The server was always willing to reply; the *browser*
refuses to hand a cross-origin response to JavaScript unless the server opts in with headers. curl,
Postman and Swagger `/docs` never need it — none of them is a page from another origin.

The fix is one block in `main.py`:

```python
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], ...)
```

Two follow-ups they may push on:

- **A JSON POST sends two requests.** `Content-Type: application/json` makes it non-simple, so the
  browser sends an `OPTIONS` preflight first and only then the POST.
- **CORS failures are opaque.** JavaScript gets a bare `TypeError: Failed to fetch` — identical to
  "nothing is listening on that port". The status code is unreachable by design, so an error
  message should name both possibilities rather than guess.

### 26. How should a React app talk to an API?

Keep the network in **one module**. In `frontend/src/api.js` every endpoint is one function and
nothing else calls `fetch`. That single choke point is what lets you log every request, swap the
base URL from an env var, or add an auth header — once, in one place.

Beyond that: `useState` for data/loading/error, `useEffect` to load on mount, and **re-read the
list after a write** rather than patching local state — one extra request, paid deliberately, so
the screen can't drift from the database.

---

## If they ask "what would you improve?"

Have these ready — knowing your own code's weak points reads better than claiming it has none:

1. Add `.order_by(Review.id)` so pagination can't repeat rows.
2. Return **201** on create and **204** on delete.
3. Add Alembic — `create_all()` can't evolve a schema.
4. Move `ge=1, le=5` into a real database `CHECK` constraint, since the table model doesn't enforce it.
5. Normalise `play_name` into its own `Play` table with a foreign key, instead of repeating the string on every row.
6. Fix the typo: `ReviewUpate` → `ReviewUpdate`.
=====================================================================================
1. what is api roter
APIRouter==APIRouter groups related endpoints into a separate file. It keeps main.py clean and makes large FastAPI projects easier to maintain.
2. what is depends
Depends==Depends tells FastAPI to run another function first and pass its returned result to the endpoint. Its purpose is to reuse common tasks such as creating a database session, checking the logged-in user, verifying roles and permissions, and validating an authentication token.
3. what is HTTPException
HTTPException stops the endpoint and returns an HTTP error response.

4. what is session
Session communicates with the database. It manages queries, inserts, updates, deletes and transactions.
session: Session = Depends(get_session) is passed inside the function so FastAPI can automatically provide a database session whenever the /reviews/ endpoint is called.
Depends(get_session) — tells FastAPI to call get_session() and inject its result into session
 4. advantage of session
 FastAPI manages the database session automatically, so every endpoint does not need to create and close a session manually.
1-Less repeated code
Without dependency injection:

@router.get("/")
def list_reviews():
    with Session(engine) as session:
        reviews = session.exec(select(Review)).all()
        return reviews

You would repeat with Session(engine) in every endpoint.
2-Automatic cleanup
def get_session():
    with Session(engine) as session:
        yield session

After the request finishes, FastAPI continues after yield, exits the with block, and closes the session—even if the endpoint raises an err
3-Centralized configuration

5. difference between session add,commit and refresh 
session.add(db_review) places the new object inside the session and marks it for insertion. It does not permanently save the record yet.

session.commit()==commit() executes the database transaction and permanently saves the review. The database can generate values such as id and created_at at this stage.

refresh() reads the saved row again from the database and updates db_review with generated or changed values such as id, timestamps and database defaults.

add()     → Prepare the record for insertion
commit()  → Permanently save it in the database
refresh() → Get the latest saved values from the database
6. how One database session used for one HTTP request
One database session should normally be used for one HTTP request.
If three users send requests at the same time, each request receives its own session:

Request A → Session A → closed after response
Request B → Session B → closed after response
Request C → Session C → closed after response
7. what is the power of sqlmodel
SQLModel is powerful because it combines SQLAlchemy’s database capabilities with Pydantic’s data validation in a single Python-friendly library. It allows developers to define database tables, validate API input, serialize responses and write type-safe database queries with less duplicate code. Through Session, select, and func, SQLModel can manage database transactions, retrieve and filter records, and perform calculations such as COUNT, AVG, and SUM, making it especially useful for building clean FastAPI CRUD applications.
8. query
query = select(Review) ===SELECT * FROM review;

query = query.where(Review.play_name == "Hamlet") ===>  SELECT * FROM review
WHERE play_name = 'Hamlet';

select(
    func.avg(Review.rating),
    func.count(Review.id)
)  ====>SELECT AVG(rating), COUNT(id)
FROM review;
9. what imports by sqlmodel 
from sqlmodel import (
    SQLModel,
    Field,
    Session,
    create_engine,
    select,
    Relationship,
    col,
    func
)

SQLModel
Base class== for database tables and validation models
Field==	Defines fields, validation and database settings
Session==	Performs database operations and manages transactions
create_engine==	Creates and configures the database engine
select==	Builds SELECT queries
Relationship==	Connects related database models
col==	Helps type checkers understand column expressions
func===	Runs SQL functions such as COUNT, AVG and SUM

10. what is response model 
response_model validates and filters the returned data, then FastAPI serializes supported Python and Pydantic values into a JSON response

11. what is seralization and deserialization
Serialization is the process of converting a Python object into a format such as JSON so that it can be sent through an API, stored in a file or transferred between applications.

Deserialization is the reverse process: converting JSON back into a Python object.

12. how FastAPI serializes the Python dictionary into JSON:
@app.get("/user")
def get_user():
    return {
        "id": 1,                    # int
        "name": "Ashwani",          # str
        "active": True,             # bool
        "skills": ["Python", "API"],# list
        "address": None             # None
    }
13. how FastAPI serializes the Python dictionary into JSON: using Pydantic model serialization
from pydantic import BaseModel
class UserRead(BaseModel):
    id: int
    name: str
    active: bool

@app.get("/profile", response_model=UserRead)
def get_profile():
    user = UserRead(
        id=1,
        name="Ashwani",
        active=True
    )
    return user
14. how to deserialization
python_data = json.loads(json_data)

