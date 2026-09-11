# Rangmanch Reviews API

A FastAPI + SQLModel service for theatre reviews — post a review of a play, list them,
update, delete, and get an average rating per play.
Unlike `02-pincode-lookup`, this one has a **real database**: local PostgreSQL 16.

---

## 1. Project files

| File | Purpose |
|---|---|
| `main.py` | FastAPI app, `lifespan` startup hook, router registration, `/` route |
| `database.py` | `DATABASE_URL`, the engine, `create_tables()`, the `get_session()` dependency |
| `models.py` | SQLModel classes — one table model (`Review`) + three schema models |
| `routes/reviews.py` | All 6 review endpoints, mounted under `/review` |
| `routes/__init__.py` | Makes `routes` a package (empty) |
| `requirements.txt` | Dependencies |
| `rangmanch.db` | **Leftover SQLite file from before the Postgres switch — no longer used.** Safe to delete. |

---

## 2. Requirements

- **Python 3.10 or newer** (the code uses `str | None` and `list[ReviewRead]` syntax).
  Verified working on Python 3.12.10.
- **PostgreSQL 16** running locally on **port 5433**, user `postgres`, password `root`.

Check your versions:

```powershell
python --version
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -c "select version();"
```

> Note the port is **5433**, not the 5432 default — that is what this machine's PostgreSQL 16
> install listens on, and it matches the `fastApiProject` config this project borrows from.

---

## 3. Create the database

The app creates the **table** automatically on startup, but it cannot create the **database**.
Do that once by hand:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -c "CREATE DATABASE rangmanch_db;"
```

Password when prompted: `root`.

Or in **pgAdmin 4**: right-click *Databases* → *Create* → *Database…* → name it `rangmanch_db` → Save.

Verify it exists:

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -l
```

---

## 4. Install dependencies

Run these from the project folder (`03-rangmanch-review`).

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

> If PowerShell blocks the activate script, run this once:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Windows (CMD)

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
```

### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Skip activation (works anywhere)

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## 5. What gets installed

`requirements.txt` lists four direct packages; pip pulls the rest in as dependencies.

**Direct:**

| Package | Installed version | Why |
|---|---|---|
| `fastapi` | 0.141.1 | The web framework |
| `uvicorn[standard]` | 0.52.4 | ASGI server that runs the app |
| `sqlmodel` | 0.0.42 | Models that are Pydantic schema *and* SQLAlchemy table at once |
| `psycopg2-binary` | 2.9.13 | The PostgreSQL driver — **new vs. the SQLite version, which needed no driver** |

**Pulled in automatically:**

| Package | Version | Comes from |
|---|---|---|
| `SQLAlchemy` | 2.0.52 | sqlmodel — the actual ORM underneath |
| `greenlet` | 3.5.5 | SQLAlchemy |
| `pydantic` | 2.13.5 | fastapi / sqlmodel — validates & serializes |
| `pydantic_core` | 2.46.5 | pydantic |
| `starlette` | 1.6.0 | fastapi — HTTP/routing layer |
| `anyio` | 4.15.1 | starlette — async support |
| `idna` | 3.19 | anyio |
| `annotated-types` | 0.8.0 | pydantic |
| `annotated-doc` | 0.0.5 | fastapi |
| `typing_extensions` | 4.16.0 | pydantic |
| `typing-inspection` | 0.4.4 | pydantic |
| `click` | 8.5.0 | uvicorn — CLI parsing |
| `h11` | 0.16.0 | uvicorn — HTTP/1.1 |
| `httptools` | 0.8.0 | uvicorn[standard] — faster HTTP parser |
| `watchfiles` | 1.2.0 | uvicorn[standard] — powers `--reload` |
| `websockets` | 17.1 | uvicorn[standard] |
| `python-dotenv` | 1.2.3 | uvicorn[standard] |
| `PyYAML` | 6.0.3 | uvicorn[standard] |

Verify your install matches:

```powershell
pip freeze
```

---

## 6. Database configuration

`database.py`:

```python
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_db",
)

engine = create_engine(DATABASE_URL, echo=True, pool_pre_ping=True)
```

Reading the URL piece by piece:

| Piece | Value | Meaning |
|---|---|---|
| dialect | `postgresql` | which SQL flavour SQLAlchemy speaks |
| driver | `psycopg2` | which Python library talks to the server |
| user | `postgres` | login role |
| password | `root` | |
| host | `localhost` | |
| port | `5433` | **not** the 5432 default |
| database | `rangmanch_db` | must already exist |

Engine options:

- `echo=True` — prints every SQL statement to the terminal. Great for learning, **noisy in
  production**; set it to `False` when you're done studying the queries.
- `pool_pre_ping=True` — tests a pooled connection before handing it out. Without it, a connection
  that died while idle (Postgres restart, network blip) surfaces as a random
  `OperationalError` on some unlucky request. SQLite never needed this; a networked DB does.

### Overriding without editing code

```powershell
$env:DATABASE_URL = "postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_test"
uvicorn main:app --reload
```

That's the point of `os.getenv` — dev, test, and prod differ by environment variable, not by
edited source.

### What changed from SQLite

| | Before | After |
|---|---|---|
| URL | `sqlite:///rangmanch.db` | `postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_db` |
| Driver package | none (stdlib `sqlite3`) | `psycopg2-binary` |
| Server needed | no — just a file | yes — Postgres must be running |
| DB must pre-exist | no, file is auto-created | **yes**, `CREATE DATABASE` first |
| `id` column | `INTEGER PRIMARY KEY` | `SERIAL` + `review_id_seq` sequence |
| `func.avg()` returns | `float` | `Decimal` (see §9) |
| Config source | hardcoded | `DATABASE_URL` env var with a default |

The **model code did not change at all.** That is the payoff of an ORM.

---

## 7. Run the project

### With the venv activated

```powershell
uvicorn main:app --reload
```

### Without activating

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

### Explicit host and port

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8001
```

Expected output (trimmed — with `echo=True` there is a lot more SQL in between):

```
INFO:     Will watch for changes in these directories: ['...\03-rangmanch-review']
INFO:     Uvicorn running on http://127.0.0.1:8001 (Press CTRL+C to quit)
INFO:     Started reloader process [...] using WatchFiles
INFO:     Started server process [...]
INFO:     Waiting for application startup.
Lifespan started
INFO sqlalchemy.engine.Engine select pg_catalog.version()
INFO sqlalchemy.engine.Engine SELECT pg_catalog.pg_class.relname ...
INFO sqlalchemy.engine.Engine COMMIT
Database tables created
INFO:     Application startup complete.
```

`Lifespan started` / `Database tables created` come from the `lifespan` function in `main.py` —
that's `create_tables()` running before the first request is served.

**Stop the server:** `Ctrl+C` (you'll see `Shutting down the app`).

Notes:

- `main:app` means "the variable `app` inside `main.py`" — run it from the project folder.
- `--reload` restarts on every `.py` save. Development only.
- If Postgres is **not** running, startup fails here with
  `OperationalError: connection to server at "localhost" (::1), port 5433 failed`.

---

## 8. Open in a browser

| URL | What it is |
|---|---|
| http://127.0.0.1:8001/ | Welcome message |
| http://127.0.0.1:8001/docs | **Swagger UI** — click "Try it out" to call endpoints |
| http://127.0.0.1:8001/redoc | ReDoc documentation |
| http://127.0.0.1:8001/openapi.json | Raw OpenAPI schema |

`/docs` is the easiest way to test the POST and PATCH bodies by hand.

---

## 9. Endpoints

All review routes live under the `/review` prefix (set by `APIRouter(prefix="/review")`)
and are tagged `reviews` in `/docs`.

### `GET /`

Health/welcome check.

```powershell
curl.exe http://127.0.0.1:8001/
```

```json
{ "message": "Welcome to rangmanch review API" }
```

---

### `POST /review/`

Creates a review. Body validated by `ReviewCreate`.

| Field | Type | Rule |
|---|---|---|
| `play_name` | str | required |
| `reviewer_name` | str | required |
| `rating` | int | required, **1–5** |
| `comment` | str | required |

`id` and `created_at` are **not** accepted from the client — the DB assigns `id`, and
`created_at` defaults to `datetime.now()`.

```powershell
curl.exe -X POST http://127.0.0.1:8001/review/ -H "Content-Type: application/json" -d "{\"play_name\":\"Ti Phulrani\",\"reviewer_name\":\"Rakesh\",\"rating\":5,\"comment\":\"Brilliant performance\"}"
```

```json
{
  "id": 1,
  "play_name": "Ti Phulrani",
  "reviewer_name": "Rakesh",
  "rating": 5,
  "comment": "Brilliant performance",
  "created_at": "2026-09-11T11:29:17.487415"
}
```

A rating outside 1–5 returns **422** before the handler runs:

```json
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": ["body", "rating"],
      "msg": "Input should be less than or equal to 5",
      "input": 9,
      "ctx": { "le": 5 }
    }
  ]
}
```

> **Note — the trailing slash matters.** The route is `"/"` under prefix `/review`, so the real
> path is `/review/`. Calling `/review` (no slash) gets a **307 redirect** to `/review/`.
> `curl` follows it only with `-L`; some HTTP clients drop the body on redirect. Always include
> the slash.

---

### `GET /review/`

Lists reviews, in whatever order Postgres returns them (no explicit `ORDER BY` — see §12).

| Query param | Default | Rule |
|---|---|---|
| `play_name` | `None` | optional exact-match filter |
| `skip` | `0` | `>= 0` |
| `limit` | `10` | `1–50` |

```powershell
curl.exe "http://127.0.0.1:8001/review/?play_name=Ti%20Phulrani&skip=0&limit=10"
```

```json
[
  {
    "id": 1,
    "play_name": "Ti Phulrani",
    "reviewer_name": "Rakesh",
    "rating": 5,
    "comment": "Brilliant performance",
    "created_at": "2026-09-11T11:29:17.487415"
  }
]
```

No matches returns `[]` with **200** — an empty list is not an error.
`limit=99` returns **422** (`le=50`).

---

### `GET /review/average/{play_name}`

Aggregate rating for one play. Computed **in the database** with
`SELECT avg(rating), count(id) ... WHERE play_name = ...` — the rows never travel to Python.

```powershell
curl.exe "http://127.0.0.1:8001/review/average/Ti%20Phulrani"
```

```json
{ "play_name": "Ti Phulrani", "average_rating": 4.5, "total_reviews": 2 }
```

Unknown play → **404** (`count` came back `0`):

```json
{ "detail": "No review found for Nope" }
```

> **Postgres vs SQLite gotcha.** `func.avg()` on an integer column returns a **`Decimal`** in
> Postgres but a **`float`** in SQLite. `round(Decimal, 2)` works and FastAPI serializes it to
> `4.5`, so this endpoint survived the migration untouched — but anything doing raw float math
> on that value (`avg_rating * 1.5`, `math.sqrt(...)`) would now raise
> `TypeError: unsupported operand type(s) for *: 'decimal.Decimal' and 'float'`.
> This is the classic "it worked on SQLite" surprise.

> **Route order matters here.** `/review/average/{play_name}` is declared **before**
> `/review/{review_id}` in `routes/reviews.py`. FastAPI matches top to bottom, so declaration
> order is what keeps a literal path segment from being swallowed by a parameter route.
> Keep static segments above parameterised ones.

---

### `GET /review/{review_id}`

```powershell
curl.exe http://127.0.0.1:8001/review/1
```

Missing id → **404** `{"detail": "NO review"}`.
Non-integer id (`/review/abc`) → **422** from FastAPI's path-param coercion, before your code runs.

---

### `PATCH /review/{review_id}`

Partial update. Body validated by `ReviewUpate` — **only `rating` and `comment` are editable**;
`play_name` and `reviewer_name` are deliberately not in the model, so sending them changes nothing.

```powershell
curl.exe -X PATCH http://127.0.0.1:8001/review/1 -H "Content-Type: application/json" -d "{\"rating\":3,\"comment\":\"Revised opinion\"}"
```

```json
{
  "id": 1,
  "play_name": "Ti Phulrani",
  "reviewer_name": "Rakesh",
  "rating": 3,
  "comment": "Revised opinion",
  "created_at": "2026-09-11T11:29:17.487415"
}
```

`exclude_unset=True` is the whole trick: send only `{"rating": 3}` and the comment is left alone.
Without it, the omitted field would be read as `None` and wipe the stored value.
Missing id → **404**.

---

### `DELETE /review/{review_id}`

```powershell
curl.exe -X DELETE http://127.0.0.1:8001/review/1
```

```json
{ "message": "Review deleted" }
```

Missing id → **404**. Returns **200 with a body**, not the more conventional 204 No Content.

---

## 10. Manual test checklist

Start the server, then run each of these in a second terminal.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8001/review/ -H "Content-Type: application/json" -d "{\"play_name\":\"Ti Phulrani\",\"reviewer_name\":\"Rakesh\",\"rating\":5,\"comment\":\"Brilliant\"}"
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8001/review/ -H "Content-Type: application/json" -d "{\"play_name\":\"Ti Phulrani\",\"reviewer_name\":\"Anita\",\"rating\":9,\"comment\":\"Bad rating\"}"
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8001/review/ -H "Content-Type: application/json" -d "{\"play_name\":\"Ti Phulrani\"}"
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/review/
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8001/review/?limit=99"
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8001/review/average/Ti%20Phulrani"
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8001/review/average/Nope"
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/review/1
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/review/999
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/review/abc
curl.exe -s -o NUL -w "%{http_code}`n" -X PATCH http://127.0.0.1:8001/review/1 -H "Content-Type: application/json" -d "{\"rating\":3}"
curl.exe -s -o NUL -w "%{http_code}`n" -X DELETE http://127.0.0.1:8001/review/1
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/docs
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8001/openapi.json
```

| # | Request | Expected |
|---|---|---|
| 1 | `GET /` | 200, welcome message |
| 2 | `POST /review/` valid | 200, body echoed back with `id` and `created_at` |
| 3 | `POST /review/` `rating: 9` | 422, "Input should be less than or equal to 5" |
| 4 | `POST /review/` missing fields | 422, one entry per missing field |
| 5 | `GET /review/` | 200, JSON array |
| 6 | `GET /review/?limit=99` | 422, `le=50` |
| 7 | `GET /review/average/Ti Phulrani` | 200, `average_rating` + `total_reviews` |
| 8 | `GET /review/average/Nope` | 404, "No review found for Nope" |
| 9 | `GET /review/1` | 200 (or 404 if you deleted it) |
| 10 | `GET /review/999` | 404, "NO review" |
| 11 | `GET /review/abc` | 422, int parsing failed |
| 12 | `PATCH /review/1` | 200, only `rating` changed |
| 13 | `DELETE /review/1` | 200, "Review deleted" |
| 14 | `GET /docs` | 200 |
| 15 | `GET /openapi.json` | 200 |

### PowerShell alternative to curl

```powershell
Invoke-RestMethod http://127.0.0.1:8001/review/ | ConvertTo-Json -Depth 5
Invoke-RestMethod -Method Post http://127.0.0.1:8001/review/ `
  -ContentType "application/json" `
  -Body '{"play_name":"Ti Phulrani","reviewer_name":"Rakesh","rating":5,"comment":"Brilliant"}' | ConvertTo-Json
```

> In PowerShell, bare `curl` is an alias for `Invoke-WebRequest`, which does not understand
> `-s -o -w`. Use `curl.exe` to force the real binary.

---

## 11. Inspecting the database

### The generated table

`create_tables()` produced exactly this from the `Review` class:

```sql
CREATE TABLE review (
    id            SERIAL       NOT NULL,
    play_name     VARCHAR      NOT NULL,
    reviewer_name VARCHAR      NOT NULL,
    rating        INTEGER      NOT NULL,
    comment       VARCHAR      NOT NULL,
    created_at    TIMESTAMP WITHOUT TIME ZONE NOT NULL,
    PRIMARY KEY (id)
);
CREATE INDEX ix_review_play_name ON review (play_name);
```

The index exists because `models.py` says `play_name: str = Field(index=True)` — which is there
because `list_reviews` and `get_average_rating` both filter on that column.

### psql

```powershell
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -d rangmanch_db
```

```sql
\dt                                  -- list tables
\d review                            -- describe the table
SELECT * FROM review ORDER BY id;
SELECT play_name, round(avg(rating),2), count(*) FROM review GROUP BY play_name;
TRUNCATE TABLE review RESTART IDENTITY;   -- wipe rows and reset id back to 1
\q
```

### pgAdmin 4

*Servers → PostgreSQL 16 → Databases → rangmanch_db → Schemas → public → Tables → review*
→ right-click → *View/Edit Data* → *All Rows*.

If `rangmanch_db` isn't in the list, right-click *Databases* → *Refresh*.

---

## 12. Known rough edges

None of these break the app; they're the honest list of what a reviewer would flag.

| # | Issue | Where | Why it matters |
|---|---|---|---|
| 1 | `ReviewUpate` is a typo for `ReviewUpdate` | `models.py`, `routes/reviews.py` | Cosmetic, but it's a public class name and it shows up in `/docs`. |
| 2 | **`ge=1, le=5` on the `Review` table model is never enforced** | `models.py` | SQLModel skips validation on `table=True` classes, and no `CHECK` constraint reached Postgres. `Review(rating=99)` from a script or a raw `INSERT` is accepted — verified. The API is safe only because `ReviewCreate`/`ReviewUpate` validate first. Add a DB-level `CHECK (rating BETWEEN 1 AND 5)` if the data matters. |
| 3 | `GET /review/` has no `ORDER BY` | `routes/reviews.py` | Postgres makes no ordering promise without one. Paging with `skip`/`limit` over an unordered set can repeat or skip rows. Add `.order_by(Review.id)`. |
| 4 | Pagination returns no total count | `routes/reviews.py` | The client can't tell how many pages exist. |
| 5 | `created_at` uses naive `datetime.now()` | `models.py` | Local machine time, no timezone, stored as `TIMESTAMP WITHOUT TIME ZONE`. Use `datetime.now(timezone.utc)` and a `timestamptz` column for anything real. |
| 6 | No `updated_at` | `models.py` | PATCH leaves no trace. |
| 7 | Credentials hardcoded as the default | `database.py` | Fine for local learning. Real deployments read them from the environment only — never commit a password. |
| 8 | `echo=True` in the engine | `database.py` | Logs every statement, including parameter values. Turn off outside development. |
| 9 | `DELETE` returns 200 + body | `routes/reviews.py` | Convention is `204 No Content`. Not wrong, just unusual. |
| 10 | `create_tables()` on every startup | `main.py` | `create_all` only creates what's missing — it will **never** alter an existing table. Change a column and nothing happens. Real projects use Alembic migrations. |
| 11 | `rangmanch.db` still in the folder | project root | Dead SQLite file from before the migration. Delete it so nobody thinks it's live data. |

---

## 13. Troubleshooting

| Problem | Cause / fix |
|---|---|
| `Error loading ASGI app. Could not import module "main"` | Wrong folder. `cd` into `03-rangmanch-review` first. |
| `'uvicorn' is not recognized` | Venv not activated. Use `.\.venv\Scripts\python.exe -m uvicorn main:app --reload`. |
| `ModuleNotFoundError: No module named 'fastapi'` | Dependencies went into a different interpreter. Re-run `pip install -r requirements.txt` inside the venv. |
| `ModuleNotFoundError: No module named 'psycopg2'` | `pip install psycopg2-binary`. Note the `-binary` suffix — plain `psycopg2` tries to compile C and needs build tools. |
| `OperationalError: connection to server at "localhost", port 5433 failed: Connection refused` | Postgres isn't running. Start the **postgresql-x64-16** service: `Get-Service postgresql*` then `Start-Service postgresql-x64-16`. |
| Same error but on **5432** | You're pointing at the default port. This install listens on **5433**. |
| `FATAL: password authentication failed for user "postgres"` | Password isn't `root`. Fix the password in `DATABASE_URL`. |
| `FATAL: database "rangmanch_db" does not exist` | You skipped §3. `create_all` creates tables, never databases. |
| `[Errno 10048] address already in use` | Port taken. Use `--port 8002`, or find it: `netstat -ano \| findstr :8001` then `taskkill /PID <pid> /F`. |
| `307 Temporary Redirect` on POST | You called `/review` instead of `/review/`. Add the trailing slash. |
| `422` with `{"detail":[...]}` | Body or query params failed validation — check `rating` is 1–5, `limit` is ≤ 50, all four fields present. |
| New column added to `models.py` doesn't appear in Postgres | `create_all` never alters existing tables. Drop the table (`DROP TABLE review;`) and restart, or adopt Alembic. |
| Terminal flooded with SQL | `echo=True` in `database.py`. Set it to `False`. |
| `TypeError: unsupported operand ... 'decimal.Decimal' and 'float'` | Postgres `avg()` returns `Decimal`, SQLite returned `float`. Wrap it: `float(avg_rating)`. |
| `TypeError: unsupported operand type(s) for \|` | Python older than 3.10. Upgrade. |
| `Activate.ps1 cannot be loaded` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |

---

## 14. PyCharm run configuration

1. **Run → Edit Configurations → + → Python**
2. Set:
   - **Module name** (switch from *Script path* using the dropdown): `uvicorn`
   - **Parameters:** `main:app --reload --port 8001`
   - **Working directory:** the `03-rangmanch-review` folder
   - **Python interpreter:** the `.venv` interpreter
     (*Settings → Project → Python Interpreter → Add → Existing → `.venv\Scripts\python.exe`*)
3. *(Optional)* **Environment variables:** `DATABASE_URL=postgresql+psycopg2://postgres:root@localhost:5433/rangmanch_db`
4. Save and hit **Run**.

PyCharm can also browse the DB directly: **View → Tool Windows → Database → + → Data Source →
PostgreSQL**, host `localhost`, port `5433`, database `rangmanch_db`, user `postgres`, password `root`.
