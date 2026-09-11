# FLOW — what this project is actually teaching

One page. Read this before an interview instead of re-reading every file.

---

## The app in one line

Theatre reviews for plays: create one, list them with filter + pagination, read one, patch it,
delete it, and ask the database for a play's average rating.
Real persistence — **PostgreSQL 16 on localhost:5433**, database `rangmanch_db`.

## What's new since `02-pincode-lookup`

That project was a dict in memory. This one adds the four things a database forces on you:

| New thing | Where it lives |
|---|---|
| A connection that must be opened, shared, and closed | `database.py` — engine + `get_session` |
| Schema created from Python classes | `models.py` + `create_tables()` |
| Startup work that must finish before request #1 | `main.py` — `lifespan` |
| Routes split out of `main.py` | `routes/reviews.py` — `APIRouter` |

## The four files

| File | Job | The concept it exists to show |
|---|---|---|
| `database.py` | engine, session, `create_tables` | connection lifecycle is its own layer |
| `models.py` | one table class + three schema classes | **the same data has different shapes at different boundaries** |
| `routes/reviews.py` | the 6 endpoints | routers keep `main.py` from growing forever |
| `main.py` | app, lifespan, router include | wiring only — no business logic |

That split *is* the lesson: **connection, shape, routing, and wiring are four different jobs.**

---

## The one idea worth carrying out of this project

```
Review        (table=True)   → what the DATABASE stores
ReviewCreate                 → what the CLIENT may SEND
ReviewRead                   → what the CLIENT may SEE
ReviewUpate                  → what the CLIENT may CHANGE
```

Four classes, one concept. A naive API uses `Review` for all four and quietly gets three bugs:

- the client can **set its own `id`** and collide with a real row,
- the client can **forge `created_at`**,
- a future `password_hash` / `is_admin` column **leaks in the response** the day someone adds it.

`ReviewCreate` has no `id` and no `created_at`, so those can't be sent.
`ReviewRead` lists fields explicitly, so nothing leaks by accident.
`ReviewUpate` contains **only `rating` and `comment`** — that's the entire reason
`play_name` can't be edited. The rule isn't written in the handler; it's written in the model.

> **The catch nobody tells you:** validation constraints on a `table=True` model are **not
> enforced**. `Review.rating` declares `ge=1, le=5`, but SQLModel turns validation off for table
> classes, and the constraint never became a Postgres `CHECK` either. `Review(rating=99)` in a
> script commits happily — verified. Your API is safe *only* because `ReviewCreate` and
> `ReviewUpate` are non-table models and those **do** validate. Rules on the table class are
> documentation, not defence.

---

## Flow 1 — startup, before any request

```
uvicorn  →  lifespan(app)  →  create_tables()  →  CREATE TABLE IF NOT EXISTS  →  yield  →  serving
```

1. uvicorn imports `main.py`. `create_engine(...)` runs — but **connects to nothing yet**; an
   engine is a lazy connection *factory* plus a pool.
2. FastAPI calls `lifespan`. Everything before `yield` runs **before the first request**.
3. `SQLModel.metadata.create_all(engine)` opens the first real connection, asks Postgres which
   tables exist, and issues `CREATE TABLE` only for the missing ones.
4. `yield` — the app now serves traffic.
5. On Ctrl+C, the code after `yield` runs. That's where you'd close pools or flush caches.

**Concept:** `metadata` is a registry. Importing `models.py` is what puts `Review` into it — which
is why `main.py` imports the router (which imports `models`) before `create_tables()` can work.
Forget that import and you get a silent no-op: **no table, no error.**

> **`create_all` creates. It never alters.** Add a column to `models.py` and restart — Postgres is
> unchanged and nothing warns you. That gap is precisely the hole Alembic migrations fill.

## Flow 2 — `POST /review/` (the write path)

```
JSON → ReviewCreate → Review(**dump) → session.add → commit → refresh → ReviewRead → JSON
```

1. Pydantic parses the body into `ReviewCreate`. `rating` outside 1–5 → **422**, and
   `create_review` **never runs**.
2. `Review(**review.model_dump())` — the hand-off from *wire shape* to *table shape*.
   `id` is `None`, `created_at` is filled by `default_factory`.
3. `session.add()` — nothing has touched the database yet. The object is just *pending*.
4. `session.commit()` — now SQLAlchemy emits `INSERT`, Postgres assigns `id` from
   `review_id_seq`, and the transaction closes.
5. `session.refresh()` — re-`SELECT`s the row to pull the server-generated `id` back into the
   Python object. **Skip this and `db_review.id` is stale**, and `ReviewRead` (which requires
   `id: int`) blows up.
6. `response_model=ReviewRead` filters the object down to the six declared fields.

**Concept: add → commit → refresh.** Three steps because three different machines are involved —
your object, the transaction, and the row Postgres actually wrote.

## Flow 3 — `GET /review/?play_name=X` (the read path)

```
query params → Pydantic Query() → select().where().offset().limit() → SQL → list[ReviewRead]
```

1. `Query(0, ge=0)` and `Query(10, ge=1, le=50)` validate **query strings** the same way the body
   was validated. `limit=99` → 422 before your code runs.
2. `select(Review)` builds a statement object — **no SQL has run yet**. `.where()`, `.offset()`,
   `.limit()` each return a *new* statement. That's why the code reads
   `query = query.where(...)` — statements are immutable.
3. `session.exec(query).all()` is the moment SQL is sent.
4. `response_model=list[ReviewRead]` runs each row through the filter.

**Concept:** `skip`/`limit` become `OFFSET`/`LIMIT`, so **Postgres** discards the rows, not Python.
Returning 10 of 10,000 rows should transfer 10 rows. This is the difference between pagination
and slicing a list you already loaded.

> **The bug hiding here:** there's no `ORDER BY`. SQL guarantees *no* row order without one, so
> page 2 can legally repeat a row from page 1. Add `.order_by(Review.id)`.

## Flow 4 — `GET /review/average/{play_name}` (compute where the data is)

```
select(func.avg(...), func.count(...)).where(...)  →  one row: (Decimal, int)
```

1. `func.avg` / `func.count` are **SQL functions**, not Python. The generated statement is
   `SELECT avg(review.rating), count(review.id) FROM review WHERE review.play_name = %(x)s`.
2. A thousand reviews produce **one row on the wire**: the average. The alternative —
   `sum(r.rating for r in session.exec(select(Review)).all()) / len(...)` — drags all thousand
   rows across the socket to compute one number.
3. `.first()` returns a tuple, unpacked as `avg_rating, total_reviews`.
4. `count == 0` → `raise HTTPException(404)`. **`avg` of nothing is `NULL`, not `0`** — which is
   exactly why the code checks `count` and not `avg`.

**Concept:** push the work to the database. Aggregation is what it is fastest at.

> **The migration scar.** On SQLite `avg()` returned a `float`. On Postgres it returns a
> **`Decimal`** (`avg(integer)` → `numeric`). `round()` and JSON serialization both cope, so this
> endpoint survived untouched — but `avg_rating * 1.5` would now raise `TypeError`.
> "Works on SQLite" is not "works on Postgres."

## Flow 5 — `PATCH /review/{id}` (partial update)

```
session.get(id)  →  model_dump(exclude_unset=True)  →  setattr loop  →  commit
```

1. `session.get(Review, review_id)` — primary-key lookup. Checks the session's identity map
   first, so a row already loaded in this transaction costs zero queries.
2. `ReviewUpate` has `Optional` fields defaulting to `None` — so `{"rating": 3}` alone is valid.
3. **`exclude_unset=True` is the whole endpoint.** It yields only keys the client actually sent.
   Drop it and an omitted `comment` arrives as `None` and **overwrites the stored comment with
   NULL** — the single most common PATCH bug there is.
4. The `setattr` loop marks the object dirty; `commit()` emits `UPDATE` for the changed columns.

**Concept:** *absent* and *null* are different. `exclude_unset` is how you tell them apart.
This is also PATCH vs PUT in one line: PATCH sends a delta, PUT sends the whole replacement.

## Flow 6 — the session dependency

```python
def get_session():
    with Session(engine) as session:
        yield session
```

Every handler takes `session: Session = Depends(get_session)`. FastAPI runs this **per request**:
code before `yield` before the handler, code after it when the response is done — so the `with`
block closes the session and returns the connection to the pool **even if the handler raised**.

**Concept:** one session per request, never a global. A `Session` is a transaction plus an
identity map; sharing one across concurrent requests means two requests interfering inside one
transaction. `Depends` exists so this is one function, not a `try/finally` in all six handlers.

---

## The six concepts, compressed

**1. One table model, three schema models**
Storage shape ≠ input shape ≠ output shape ≠ patch shape. The API's rules about what a client may
send, see, and change are expressed as **classes**, not as `if`s in handlers. Everything
`ReviewUpate` omits is a field that cannot be edited — enforced without a single line of code.

**2. The engine is not a connection**
`create_engine` is lazy: a pool + a dialect. The first real socket opens when something executes.
`pool_pre_ping=True` matters now because a network DB's idle connection can die between requests —
a SQLite file never could.

**3. add → commit → refresh**
`add` stages, `commit` writes and ends the transaction, `refresh` re-reads what the server
generated. `id` exists only after step 2 and only reaches Python at step 3.

**4. Push work into the database**
`func.avg` + `WHERE` + `OFFSET/LIMIT` all execute in Postgres. Loading rows to count them in
Python is the mistake this project is built to inoculate you against.

**5. `exclude_unset` — absent vs null**
The one flag standing between a working PATCH and silently nulling every field the client
didn't mention.

**6. Validation lives where the model is non-table**
`ge=1, le=5` on `ReviewCreate` is enforced. The same constraint on `Review` is **not**. If a rule
must hold no matter who writes — scripts, migrations, psql — it belongs in the database as a
`CHECK`, not in Python.

---

## The ORM's payoff, in one observation

Moving SQLite → PostgreSQL changed **`database.py` only**:

```python
# before
DATABASE_URL = "sqlite:///rangmanch.db"
# after
DATABASE_URL = os.getenv("DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_db")
```

`models.py`, `routes/reviews.py`, and `main.py` were **not touched**. SQLAlchemy re-emitted the
schema in Postgres dialect on its own — `INTEGER PRIMARY KEY` became `SERIAL` + a sequence.

What the ORM did **not** absorb, and you have to know anyway:

| | SQLite | Postgres |
|---|---|---|
| Server must be running | no | **yes** |
| Database must pre-exist | no, the file appears | **yes — `CREATE DATABASE` by hand** |
| `avg()` returns | `float` | **`Decimal`** |
| Driver package | none | `psycopg2-binary` |
| Dead idle connections | impossible | real — hence `pool_pre_ping` |

**Concept:** an ORM abstracts *dialect*, not *operations*. Provisioning, drivers, and type
differences still land on you.

---

## Status codes this app produces

| Code | When | Who decided |
|---|---|---|
| 200 | anything that worked, **including DELETE** | FastAPI default |
| 307 | you called `/review` without the trailing slash | Starlette's redirect_slashes |
| 404 | id not found, or no reviews for that play | your handler, via `HTTPException` |
| 422 | body / query / path param failed validation | Pydantic + FastAPI, before your code |

Note what's **missing**: no 201 on create, no 204 on delete. Both are conventional; neither is
wired up. `@router.post("/", status_code=201)` is the one-line fix.

---

## Contrast with `02-pincode-lookup`

That project raised **custom exception classes** and registered handlers that built `JSONResponse`
by hand. This one just raises `HTTPException` and gets `{"detail": "..."}` for free.

Both are correct; they trade off differently:

| | `HTTPException` (here) | Custom class + handler (pincode) |
|---|---|---|
| Lines of code | 1 | ~15 across two files |
| Business code knows about HTTP | **yes** | no |
| Error JSON shape | fixed: `{"detail": ...}` | yours to design |
| Can forget to wire it up | no | **yes — and nothing warns you** |

The pincode project has exactly that bug: a handler registered for the wrong exception class.
This project cannot have it. That's the tradeoff, demonstrated twice.

---

## If someone asks "what did you learn building this?"

> Separating the shape the database stores from the shapes the API accepts and returns. One
> `Review` table model, plus `ReviewCreate` / `ReviewRead` / `ReviewUpate` — so a client can't set
> its own `id`, can't forge `created_at`, can't edit a play's name, and can't see a column I add
> later unless I put it in the read model. Then porting it from SQLite to PostgreSQL: only the
> connection string changed, which showed me what an ORM does buy you — and `avg()` coming back as
> `Decimal` instead of `float`, plus having to `CREATE DATABASE` by hand, showed me what it
> doesn't.

Follow-ups worth rehearsing: why `refresh()` after `commit()`; what `exclude_unset=True` prevents;
why `get_session` is a generator dependency instead of a global session; and why `ge=1, le=5` on
the table model doesn't actually stop anything.
