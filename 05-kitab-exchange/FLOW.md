# FLOW — Kitab Exchange

One page to read before working on this project or talking about it in an interview.

| | |
|---|---|
| **Status** | [FILL: prototype / in development / production] |
| **Owner** | [FILL: name or team] |
| **Last updated** | 2026-09-25 |
| **Repo / path** | `fastapi/05-kitab-exchange` |

---

## 1. Project overview

### What this project is for

**A second-hand book marketplace for college students: a student registers, lists a used book
with a price, other students browse and search the shelf, and the seller marks it sold.**

Every semester, students buy textbooks they only need for a few months, then leave them on a
shelf. Seniors want to sell them and juniors want them cheap, but there's no easy place to match
the two. This app is that place. A student registers once (name, email, college), then lists books
under their name. Anyone can browse unsold books, search by title or author, or see everything one
student has listed. When a book changes hands, the seller marks it sold and it drops off the shelf.
A summary screen shows how many students there are and how many rupees' worth of books are on the
shelf versus sold. Behind it is a FastAPI backend that stores users and books in PostgreSQL, with a
React UI on top. It is the fifth project in this FastAPI series. It builds on the dabbawala
project's CRUD pattern and adds **two related resources** (a user has many books, linked by a
foreign key), **API-key protection on every write**, and search with `ILIKE`.

### Problem it solves

Students selling used books had no shared list: sales happened through WhatsApp groups and notice
boards, so books were hard to find and nobody knew what was already sold. This gives one searchable
shelf where sold books disappear automatically.

### Core features

- Register students (unique email, stored lower-case)
- List a book under a student, with price in rupees
- Browse unsold books, search by title / author (case-insensitive, partial match), page through results
- See every book one student has listed, sold or not
- Edit price / title / author, mark sold, delete
- Marketplace summary: user count, books available vs sold, and their total value
- Writes (POST / PATCH / DELETE) need an `X-API-Key` header; reads are public

### Out of scope (on purpose)

- Per-user login (one shared API key, not user accounts)
- Payments, chat between buyer and seller, delivery
- Editing or deleting users
- Checking that the caller owns the book they edit

### Glossary

| Term | Meaning in this project |
|---|---|
| User / student | a seller, row in `users` |
| Book / listing | one used copy for sale, row in `books`, owned by one user |
| Sold | `is_sold = true`; hidden from `GET /books/` unless `include_sold=true` |
| API key | shared secret sent as the `X-API-Key` header; env var `KITAB_API_KEY` |
| Shelf | all books where `is_sold = false` |

---

## 2. Architecture

### Tech stack

| Layer | Technology | Why this choice |
|---|---|---|
| Frontend | React 18 + Vite 5 (`:5175`) | fast dev server, small UI, one file (`api.js`) owns every HTTP call |
| API | FastAPI + uvicorn (`:8003`) | typed request/response models, auto `/docs`, dependency injection for session + API key |
| ORM / data access | SQLModel (SQLAlchemy + Pydantic) | one class is both the table and the validation model |
| Database | PostgreSQL (`:5433`, db `kitab_db`) | real foreign keys, `ILIKE`, timezone-aware timestamps |
| Auth | shared API key in a header (`auth.py`) | simplest protection for writes without building login |
| Cache / queue | none | not needed at this size |
| Hosting | local | learning project |

### System diagram

Who uses it, what they click, and where each click ends up. There's no login, so buyers and
sellers use the same UI.

```mermaid
flowchart LR
    subgraph people["People"]
        seller(["Senior student<br/>sells a book"])
        buyer(["Junior student<br/>looks for a book"])
    end

    subgraph ui["React UI · Vite :5175 · frontend/src"]
        users["Students<br/>UsersView.jsx"]
        sell["Sell a book<br/>SellForm.jsx"]
        browse["Browse books<br/>BooksView.jsx + BookCard.jsx"]
        find["Find by ID<br/>FindBook.jsx"]
        stats["Marketplace<br/>StatsView.jsx"]
        apijs["api.js<br/>the only file that calls fetch()<br/>adds X-API-Key on non-GET"]
        reqlog["Request log<br/>RequestLog.jsx"]
    end

    subgraph api["FastAPI · uvicorn :8003"]
        cors["CORSMiddleware<br/>allows origin :5175"]
        val["Validation<br/>UserCreate · BookCreate · BookUpdate<br/>bad input = 422"]
        key["verify_api_key()<br/>auth.py · writes only"]
        subgraph routes["routes/"]
            ru["users.py<br/>POST / · GET / · GET /id · GET /id/books"]
            rb["books.py<br/>GET / · GET /id · POST /<br/>PATCH /id · PATCH /id/sold · DELETE /id"]
            rs["stats.py<br/>GET /stats/summary"]
        end
        sess["get_session()<br/>one Session per request"]
        eng["engine + connection pool<br/>database.py"]
    end

    subgraph pg["PostgreSQL :5433 · kitab_db"]
        tusers[("users<br/>email UNIQUE")]
        tbooks[("books<br/>user_id FK")]
    end

    seller --> users & sell & browse
    buyer --> browse & find & stats

    users & sell & browse & find & stats --> apijs
    apijs -. "logs every call" .-> reqlog
    apijs -- "HTTP + JSON" --> cors --> val
    val --> key
    key --> ru & rb
    val --> rs
    ru & rb & rs --> sess --> eng
    eng --> tusers & tbooks
    tbooks -- "FK user_id" --> tusers
```

### Request gate: API key → routers → database

The short version of the diagram above: every write passes the API-key check first, then FastAPI
hands it to the user router or the book router, and both routers read and write the same
PostgreSQL database, which holds the `users` table and the `books` table.

```mermaid
flowchart TD
    client(["Client<br/>React UI / curl / Swagger"])
    client -- "request + X-API-Key header" --> check{"X-API-Key valid?<br/>auth.verify_api_key()"}
    check -- "no: wrong key" --> reject["401 Invalid API Key<br/>request stops here"]
    check -- "no: header missing" --> e422["422 header required"]
    check -- "yes" --> fastapi["FastAPI server<br/>uvicorn :8003 · main.py"]

    fastapi --> urouter["User router<br/>routes/users.py · /users"]
    fastapi --> brouter["Book router<br/>routes/books.py · /books"]

    urouter --> db[("PostgreSQL<br/>kitab_db :5433")]
    brouter --> db

    db --> tusers[("users table")]
    db --> tbooks[("books table")]
    tbooks -- "user_id FK → users.id" --> tusers
```

> **What the picture simplifies:**
> - The key is checked **only on writes** (`POST`, `PATCH`, `DELETE`). `GET` requests skip the
>   check and go straight to the router.
> - A wrong key returns **401**, not 403 ([auth.py:12](auth.py#L12)). To return 403 Forbidden
>   instead, change `status_code=401` to `403` there.
> - `routes/stats.py` (`/stats/summary`) is a third, read-only router that also reads both tables.

### One book, end to end

Asha (user #3) sells a used *Operating System Concepts*; Ravi finds it and buys it offline.

```mermaid
sequenceDiagram
    autonumber
    actor A as Asha (seller)
    actor R as Ravi (buyer)
    participant UI as React UI :5175
    participant API as FastAPI :8003
    participant DB as PostgreSQL

    A->>UI: fill Students form
    UI->>API: POST /users/ + X-API-Key
    API->>API: verify_api_key, validate UserCreate (bad email = 422)
    API->>DB: SELECT users WHERE email = lower(email)
    alt email taken
        API-->>UI: 400 Email already registered
    else new
        API->>DB: INSERT INTO users
        API-->>UI: 201 user 3
    end

    A->>UI: fill Sell a book form
    UI->>API: POST /books/ {title, author, price, user_id 3} + X-API-Key
    API->>DB: SELECT users WHERE id = 3 (404 if missing)
    API->>DB: INSERT INTO books (is_sold false)
    API-->>UI: 201 book 12

    R->>UI: search title "operating"
    UI->>API: GET /books/?title=operating
    API->>DB: SELECT books WHERE is_sold = false AND title ILIKE '%operating%'
    API-->>UI: [book 12]

    Note over A,R: they meet on campus, cash changes hands
    A->>UI: click "Mark sold"
    UI->>API: PATCH /books/12/sold + X-API-Key
    API->>DB: UPDATE books SET is_sold = true WHERE id = 12
    API-->>UI: 200 book 12, is_sold true
    Note over UI: book 12 disappears from the default shelf
```

### Book lifecycle

```mermaid
stateDiagram-v2
    [*] --> available: POST /books/
    available --> available: PATCH /books/{id} (edit price, title)
    available --> sold: PATCH /books/{id}/sold
    sold --> sold: PATCH /books/{id}/sold = 400 already sold
    available --> [*]: DELETE /books/{id}
    sold --> [*]: DELETE /books/{id}
    note right of sold
        PATCH /books/{id} with is_sold=false
        can still move it back to available.
    end note
```

### Folder structure

```
05-kitab-exchange/
├── main.py              # app, lifespan (create tables), CORS, includes 3 routers, /health
├── auth.py              # verify_api_key(): X-API-Key header vs KITAB_API_KEY
├── database.py          # engine (DATABASE_URL), create_tables(), get_session()
├── models/
│   ├── user.py          # User table + UserCreate / UserRead
│   └── book.py          # Book table + BookCreate / BookRead / BookUpdate, now()
├── routes/
│   ├── users.py         # /users endpoints
│   ├── books.py         # /books endpoints
│   └── stats.py         # /stats/summary
├── frontend/            # React + Vite UI (:5175)
│   └── src/api.js       # every fetch() lives here
├── requirements.txt
└── FLOW.md              # this file
```

### Layer responsibilities

| Layer | Owns | Must NOT do |
|---|---|---|
| Routes | HTTP: params, status codes, response shape, simple rules (duplicate email, already sold) | raw SQL |
| Auth dependency | accept or reject the API key | know about users or books |
| Data access (`database.py`) | engine, sessions, table creation | decide business outcomes |
| Models | shapes of data (DB + wire), field validation | side effects |

### The one idea worth carrying out of this project

**Protect writes with a dependency, not with code inside each handler.** `verify_api_key` is added
as `Depends(...)` on every write endpoint, so FastAPI rejects a bad key before the handler runs
and before any database work happens. Reads stay public simply by not declaring it.

---

## 3. Startup flow (before request #1)

```mermaid
sequenceDiagram
    autonumber
    participant CLI as uvicorn
    participant App as main.py
    participant DB as PostgreSQL

    CLI->>App: import main
    App->>App: import database.py: read DATABASE_URL, create engine (no connection yet)
    App->>App: import auth.py: read KITAB_API_KEY
    App->>App: add CORSMiddleware, include users / books / stats routers
    CLI->>App: run lifespan startup
    App->>App: import models (registers users + books on metadata)
    App->>DB: CREATE TABLE IF NOT EXISTS users, books
    DB-->>App: ok
    App-->>CLI: ready, accepting requests
    Note over CLI,App: "Application shutdown." printed after the last request
```

| Step | Code | Notes |
|---|---|---|
| Config loaded | [database.py:5](database.py#L5), [auth.py:6](auth.py#L6) | `DATABASE_URL` defaults to `postgresql+psycopg2://postgres:root@localhost:5433/kitab_db`; `KITAB_API_KEY` defaults to `my_secret_api_key` |
| Engine created | [database.py:10](database.py#L10) | `echo=True` (SQL printed), `pool_pre_ping=True` |
| Tables | [database.py:13](database.py#L13) | `SQLModel.metadata.create_all` — creates missing tables, never ALTERs |

---

## 4. Database flow

### Entity–relationship diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKS : "lists"
    USERS {
        int id PK
        string name "indexed"
        string email "UNIQUE, stored lower-case"
        string college
    }
    BOOKS {
        int id PK
        string title "indexed"
        string author "indexed"
        int price "rupees, > 0"
        bool is_sold "indexed, default false"
        datetime listed_at "timestamptz"
        int user_id FK "indexed"
    }
```

### Tables

| Table | Purpose | Key columns | Indexes | Constraints |
|---|---|---|---|---|
| `users` | students who sell books (`user` is reserved in Postgres) | `id`, `email` | `name` | PK `id`, UNIQUE `email` |
| `books` | one row per listed copy | `id`, `user_id`, `is_sold` | `title`, `author`, `is_sold`, `user_id` | PK `id`, FK `user_id → users.id` |

### Model shapes (storage vs wire)

| Model | Role | Fields the client can send / see |
|---|---|---|
| `User` | table | — |
| `UserCreate` | POST body | `name`, `email` (EmailStr), `college` |
| `UserRead` | response | `id`, `name`, `email`, `college` |
| `Book` | table | — |
| `BookCreate` | POST body | `title`, `author`, `price` (> 0), `user_id` |
| `BookRead` | response | `id`, `title`, `author`, `price`, `is_sold`, `listed_at`, `user_id` |
| `BookUpdate` | PATCH body, all optional | `title`, `author`, `price`, `is_sold` |

The client can never set `id` or `listed_at`, and `BookUpdate` has no `user_id`, so a book can't
be moved to another owner.

### Session / transaction lifecycle (one per request)

```mermaid
sequenceDiagram
    participant H as Handler
    participant D as get_session dependency
    participant S as Session
    participant P as Connection pool
    participant DB as PostgreSQL

    D->>S: open Session(engine)
    D-->>H: inject session
    H->>S: add / exec(select ...)
    S->>P: borrow connection (first SQL only)
    P->>DB: BEGIN + SQL
    H->>S: commit()
    S->>DB: COMMIT
    H-->>D: response sent
    D->>S: close (runs even if the handler raised)
    S->>P: return connection
```

### Schema changes

- **How the schema evolves:** `create_all` only — it never ALTERs an existing table
- **Adding a column today:** `ALTER TABLE` by hand, or drop and recreate the table in dev
- **Seed data:** none; register users through the UI or `/docs`

---

## 5. CRUD operations

### Matrix

| Op | Method + path | Key? | Request body | Success | Errors | Handler |
|---|---|---|---|---|---|---|
| Create user | `POST /users/` | yes | `UserCreate` | 201 + `UserRead` | 400 dup email, 401, 422 | `users.register_user` |
| List users | `GET /users/` | no | — | 200 + list | — | `users.list_users` |
| Read user | `GET /users/{id}` | no | — | 200 + `UserRead` | 404 | `users.get_user` |
| User's books | `GET /users/{id}/books` | no | — | 200 + list | 404 | `users.user_books` |
| Create book | `POST /books/` | yes | `BookCreate` | 201 + `BookRead` | 401, 404 user, 422 | `books.create_book` |
| List books | `GET /books/?title=&author=&user_id=&include_sold=&skip=&limit=` | no | — | 200 + list | 422 | `books.list_books` |
| Read book | `GET /books/{id}` | no | — | 200 + `BookRead` | 404 | `books.get_book` |
| Update book | `PATCH /books/{id}` | yes | `BookUpdate` | 200 + `BookRead` | 401, 404, 422 | `books.update_book` |
| Mark sold | `PATCH /books/{id}/sold` | yes | — | 200 + `BookRead` | 400 already sold, 401, 404 | `books.mark_book_sold` |
| Delete book | `DELETE /books/{id}` | yes | — | 200 + message | 401, 404 | `books.delete_book` |

### Create (book)

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant K as verify_api_key
    participant R as books router
    participant S as Session
    participant DB as PostgreSQL

    C->>R: POST /books/ JSON body + X-API-Key
    R->>K: check header
    alt missing header
        K-->>C: 422
    else wrong key
        K-->>C: 401 Invalid API Key
    else ok
        R->>R: parse body into BookCreate (bad = 422)
        R->>S: get(User, user_id)
        alt no such user
            R-->>C: 404 User not found
        else found
            R->>S: add(Book) + commit()
            S->>DB: INSERT INTO books ... RETURNING id
            R->>S: refresh(book)
            R-->>C: 201 + BookRead
        end
    end
```

### Read (list with filter + pagination)

```mermaid
sequenceDiagram
    actor C as Client
    participant R as books router
    participant DB as PostgreSQL

    C->>R: GET /books/?title=os&skip=0&limit=20
    R->>R: start SELECT books
    R->>R: WHERE is_sold = false (unless include_sold)
    R->>R: add ILIKE for title / author, = for user_id
    R->>DB: ... ORDER BY id DESC LIMIT 20 OFFSET 0
    DB-->>R: rows
    R-->>C: 200 + list (empty list, never 404)
```

### Update (partial)

```mermaid
sequenceDiagram
    actor C as Client
    participant R as books router
    participant S as Session
    participant DB as PostgreSQL

    C->>R: PATCH /books/ID {price: 250} + X-API-Key
    R->>S: get_book_or_404(ID)
    alt not found
        R-->>C: 404
    else found
        R->>R: model_dump(exclude_unset=True)
        R->>S: setattr each sent field
        R->>S: commit() + refresh()
        S->>DB: UPDATE books SET price = 250 WHERE id = ID
        R-->>C: 200 + BookRead
    end
```

### Delete

```mermaid
sequenceDiagram
    actor C as Client
    participant R as books router
    participant DB as PostgreSQL

    C->>R: DELETE /books/ID + X-API-Key
    R->>DB: SELECT by primary key
    alt not found
        R-->>C: 404
    else found
        R->>DB: DELETE FROM books WHERE id = ID
        R-->>C: 200 {"message": "Book ID deleted"}
    end
```

**Delete policy:** hard delete of books. Users can't be deleted (no endpoint), so a book's owner
always exists.

---

## 6. Function flow

```mermaid
flowchart TD
    main["main.py: app + lifespan"] --> create_tables["database.create_tables()"]
    main --> ur["routes.users.router"]
    main --> br["routes.books.router"]
    main --> sr["routes.stats.router"]

    ur --> register["register_user()"]
    ur --> lu["list_users() / get_user() / user_books()"]
    br --> cb["create_book()"]
    br --> lb["list_books() / get_book()"]
    br --> ub["update_book()"]
    br --> ms["mark_book_sold()"]
    br --> db_["delete_book()"]
    sr --> sum["summary()"]

    register & cb & ub & ms & db_ --> key["auth.verify_api_key()"]
    lb & ub & ms & db_ --> g404["get_book_or_404()"]
    register & lu & cb & lb & ub & ms & db_ & sum --> sess["database.get_session()"]
    sess --> engine[("engine / pool")]
```

| Function | File | Input | Output | Side effects | Can raise |
|---|---|---|---|---|---|
| `verify_api_key` | auth.py | `X-API-Key` header | the key | — | 401, 422 (missing) |
| `register_user` | routes/users.py | `UserCreate` | `UserRead` | INSERT users | 400, 422 |
| `user_books` | routes/users.py | `user_id` | list of `BookRead` | — | 404 |
| `get_book_or_404` | routes/books.py | `book_id`, session | `Book` | — | 404 |
| `list_books` | routes/books.py | filters, skip, limit | list of `BookRead` | — | 422 |
| `create_book` | routes/books.py | `BookCreate` | `BookRead` | INSERT books | 404, 422 |
| `update_book` | routes/books.py | `book_id`, `BookUpdate` | `BookRead` | UPDATE books | 404, 422 |
| `mark_book_sold` | routes/books.py | `book_id` | `BookRead` | UPDATE is_sold | 400, 404 |
| `delete_book` | routes/books.py | `book_id` | message | DELETE books | 404 |
| `summary` | routes/stats.py | — | counts + rupee totals | — | — |

### Business rules

| Rule | Enforced where | What happens if it's broken |
|---|---|---|
| Writes need the API key | `Depends(verify_api_key)` on each write | 401 (wrong) / 422 (missing) |
| Email is unique (case-insensitive) | `register_user` lower-cases + checks; DB UNIQUE as backstop | 400 Email already registered |
| A book's owner must exist | `create_book` checks first; DB FK as backstop | 404 User not found |
| Price is a positive integer | `BookCreate` / `BookUpdate` (`gt=0`) | 422 |
| Can't mark a sold book sold again | `mark_book_sold` | 400 already sold |
| Sold books hidden from the shelf | `list_books` default filter | only shown with `include_sold=true` |

---

## 7. API flow

### Request lifecycle

```mermaid
flowchart TD
    req["HTTP request"] --> cors{"CORS preflight?"}
    cors -- "OPTIONS" --> pre["CORS middleware answers"]
    cors -- "no" --> match{"Route matched?"}
    match -- "no" --> e404["404 / 405"]
    match -- "yes" --> val{"Path, query, body, header valid?"}
    val -- "no (incl. missing X-API-Key)" --> e422["422 validation error"]
    val -- "yes" --> deps["Run dependencies: get_session, verify_api_key (writes)"]
    deps -- "wrong key" --> e401["401 Invalid API Key"]
    deps --> handler["Handler: rules + DB"]
    handler -- "HTTPException" --> eapp["400 / 404"]
    handler -- "unhandled error" --> e500["500"]
    handler -- "return value" --> resp["response_model filters + serializes"]
    resp --> ok["2xx JSON"]
```

### Endpoint reference

| Method | Path | Auth | Query / body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/` | none | — | welcome message | |
| GET | `/health` | none | — | `{"status": "ok"}` | liveness check |
| POST | `/users/` | key | `UserCreate` | 201 `UserRead` | email lower-cased |
| GET | `/users/` | none | — | `UserRead[]` | ordered by id |
| GET | `/users/{id}` | none | — | `UserRead` | |
| GET | `/users/{id}/books` | none | — | `BookRead[]` | sold + unsold, newest first |
| GET | `/books/` | none | `title`, `author`, `user_id`, `include_sold`, `skip`, `limit≤100` | `BookRead[]` | newest first |
| GET | `/books/{id}` | none | — | `BookRead` | sold ones too |
| POST | `/books/` | key | `BookCreate` | 201 `BookRead` | |
| PATCH | `/books/{id}` | key | `BookUpdate` | `BookRead` | partial |
| PATCH | `/books/{id}/sold` | key | — | `BookRead` | 400 if already sold |
| DELETE | `/books/{id}` | key | — | `{"message": ...}` | |
| GET | `/stats/summary` | none | — | `{users, available{count,value}, sold{count,value}}` | |

Interactive docs: http://127.0.0.1:8003/docs

### Status codes this API returns

| Code | Meaning here | Raised by |
|---|---|---|
| 200 | OK | handler return |
| 201 | created | `status_code=201` on POST |
| 400 | duplicate email / book already sold | `HTTPException` |
| 401 | wrong API key | `verify_api_key` |
| 404 | user or book not found | `HTTPException` |
| 422 | validation failed, or `X-API-Key` header missing | FastAPI / Pydantic |
| 500 | unhandled bug | — |

### Example request / response

```http
POST /books/ HTTP/1.1
Content-Type: application/json
X-API-Key: my_secret_api_key

{ "title": "Operating System Concepts", "author": "Silberschatz", "price": 300, "user_id": 3 }
```

```json
{ "id": 12, "title": "Operating System Concepts", "author": "Silberschatz", "price": 300,
  "is_sold": false, "listed_at": "2026-09-25T10:00:00+05:30", "user_id": 3 }
```

---

## 8. Frontend flow

```mermaid
sequenceDiagram
    actor U as Student
    participant UI as SellForm.jsx
    participant St as App.jsx state
    participant A as api.js
    participant API as FastAPI :8003

    U->>UI: submit Sell a book
    UI->>A: createBook(form)
    A->>API: fetch POST /books/ + X-API-Key (CORS preflight first)
    API-->>A: 201 JSON
    A-->>UI: data, or thrown Error with readable detail
    UI->>A: listBooks(query)
    A->>API: GET /books/
    API-->>A: list
    UI->>St: setBooks(list)
    St-->>U: re-render
```

| Concern | Where | Notes |
|---|---|---|
| API base URL | `frontend/.env` → `VITE_API_BASE` | read when `npm run dev` starts |
| API key | `frontend/.env` → `VITE_API_KEY` | must equal `KITAB_API_KEY`; ships in the JS bundle, so it's not a real secret |
| All HTTP calls | `frontend/src/api.js` | adds `X-API-Key` on every non-GET |
| Error display | `App.jsx` `error` state + Request log | 422 lists shown as `field: msg` |
| Allowed CORS origins | `main.py` | `localhost:5175`, `127.0.0.1:5175` |

---

## 9. Testing

No automated tests yet. Plan:

| Level | Tool | What it covers | Where |
|---|---|---|---|
| Unit | pytest | model validation (price > 0, EmailStr) | `tests/unit/` |
| Integration | pytest + TestClient + test DB | each endpoint, with and without the key | `tests/integration/` |
| Manual smoke | curl / Swagger | every endpoint once after a change | below |

### Test cases per endpoint

| Endpoint | Happy path | Edge / error cases |
|---|---|---|
| `POST /users/` | 201 + id | no key → 422; wrong key → 401; same email different case → 400; bad email → 422 |
| `POST /books/` | 201 + id | unknown `user_id` → 404; `price: 0` → 422; wrong key → 401 |
| `GET /books/` | filters, paging | sold hidden by default; `limit=101` → 422 |
| `PATCH /books/{id}` | only sent fields change | unknown id → 404 |
| `PATCH /books/{id}/sold` | 200, `is_sold` true | second call → 400 |
| `DELETE /books/{id}` | 200, then GET → 404 | unknown id → 404 |

### Test database isolation

Point `DATABASE_URL` at a separate `kitab_test` database, or override the session:
`app.dependency_overrides[get_session] = get_test_session`.

### Smoke test (manual, after any change)

```bash
B=http://127.0.0.1:8003
K="X-API-Key: my_secret_api_key"
curl -s $B/health
curl -s -X POST $B/users/ -H "$K" -H "Content-Type: application/json" \
  -d '{"name":"Asha","email":"asha@college.edu","college":"VJTI"}'
curl -s -X POST $B/books/ -H "$K" -H "Content-Type: application/json" \
  -d '{"title":"OS Concepts","author":"Silberschatz","price":300,"user_id":1}'
curl -s "$B/books/?title=os"
curl -s -X POST $B/books/ -H "X-API-Key: wrong" -H "Content-Type: application/json" -d '{}'   # 401
curl -s $B/stats/summary
```

---

## 10. Deployment

### Configuration (environment variables)

| Variable | Required | Default | Used by |
|---|---|---|---|
| `DATABASE_URL` | no | `postgresql+psycopg2://postgres:root@localhost:5433/kitab_db` | backend |
| `KITAB_API_KEY` | no (yes beyond dev) | `my_secret_api_key` | backend |
| `VITE_API_BASE` | no | `http://127.0.0.1:8003` | frontend |
| `VITE_API_KEY` | no | `my_secret_api_key` | frontend |

### Run locally

```bash
# database (psql on :5433)
CREATE DATABASE kitab_db;

# backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt      # Windows (Linux/macOS: .venv/bin/)
.venv/Scripts/uvicorn main:app --reload --port 8003

# frontend
cd frontend && npm install && npm run dev          # http://localhost:5175
```

---

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Port 8003 is already in use` | old server still running | stop the process that owns the port |
| Every write returns 401 | `VITE_API_KEY` ≠ `KITAB_API_KEY` | make them equal, restart both |
| Write returns 422 `x-api-key: Field required` | header not sent | add `X-API-Key` (Swagger: fill the header field) |
| Browser: `Failed to fetch`, curl works | CORS origin or API not running | check `allow_origins` in `main.py` and port 8003 |
| `.env` change ignored | Vite reads env only at startup | restart `npm run dev` |
| `relation "users" does not exist` | server started against a different DB | check `DATABASE_URL`, restart so lifespan runs `create_all` |
| Column added but not in DB | `create_all` never ALTERs | `ALTER TABLE` by hand or add Alembic |

---

## 12. Known gaps & next improvements

1. One shared API key, and it's shipped in the frontend bundle: anyone with the UI can write. Next step is per-user login (JWT) and ownership checks.
2. Anyone with the key can edit or delete any user's book.
3. Wrong key returns 401 where 403 would say "known client, not allowed" more precisely.
4. No migrations (Alembic) and no automated tests.
5. `DELETE /books/{id}` returns 200 + message instead of 204.

---

## 13. "What did you learn building this?" (30-second answer)

I built a used-book marketplace with two related tables, users and books, linked by a foreign key.
The key design choice was protecting writes with a FastAPI dependency, `verify_api_key`, so bad
requests are rejected before any database work and reads stay public. I learned that Postgres
enforces the foreign key, but checking the owner first gives the client a clean 404 instead of a
500. Next I'd replace the shared key with real user login so sellers can only edit their own books.
