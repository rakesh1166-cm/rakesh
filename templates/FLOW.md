# FLOW — [PROJECT NAME]

<!--
HOW TO USE THIS TEMPLATE
1. Copy this file into the project root as FLOW.md.
2. Replace every [FILL: ...] and every UPPER_SNAKE placeholder in the diagrams.
3. Delete any section that doesn't apply (e.g. "Frontend flow" for a pure API or CLI).
4. Keep it to what a newcomer or interviewer needs. Link to code instead of pasting whole files.
5. Check the diagrams render: VS Code (Markdown Preview Mermaid Support), GitHub or https://mermaid.live
Rule for every section: state the idea in one line, show the diagram, then point at the code.
-->

One page to read before working on this project or talking about it in an interview.

| | |
|---|---|
| **Status** | [FILL: prototype / in development / production] |
| **Owner** | [FILL: name or team] |
| **Last updated** | [FILL: YYYY-MM-DD] |
| **Repo / path** | [FILL: link or folder] |

---

## 1. Project overview

### The app in one line

[FILL: What it does, for whom, in one sentence.
Example: "Tracks tiffin deliveries from kitchen to office desk through four statuses."]

### Problem it solves

[FILL: 2–3 sentences. What was painful before this existed?]

### Core features

- [FILL: feature 1]
- [FILL: feature 2]
- [FILL: feature 3]

### Out of scope (on purpose)

- [FILL: e.g. authentication, payments, multi-tenant]

### Glossary

| Term | Meaning in this project |
|---|---|
| [FILL: term] | [FILL: definition] |

---

## 2. Architecture

### Tech stack

| Layer | Technology | Why this choice |
|---|---|---|
| Frontend | [FILL: React + Vite] | [FILL] |
| API | [FILL: FastAPI] | [FILL] |
| ORM / data access | [FILL: SQLModel / SQLAlchemy] | [FILL] |
| Database | [FILL: PostgreSQL 16] | [FILL] |
| Cache / queue | [FILL: none / Redis / RabbitMQ] | [FILL] |
| Hosting | [FILL: local / Docker / cloud] | [FILL] |

### System diagram

```mermaid
flowchart LR
    user(["User / Browser"])
    subgraph client["Frontend :FRONTEND_PORT"]
        ui["UI components"]
        api_client["API client module"]
    end
    subgraph server["Backend :API_PORT"]
        mw["Middleware: CORS, auth, logging"]
        routes["Routers / controllers"]
        services["Business logic"]
        dal["Data access: ORM session"]
    end
    db[("DATABASE_NAME")]
    ext["EXTERNAL_SERVICE (optional)"]

    user --> ui --> api_client -- "HTTP JSON" --> mw --> routes --> services --> dal --> db
    services -. optional .-> ext
```

### Folder structure

```
[FILL: project-root]/
├── main.py              # [FILL: app entry, startup, middleware, routers]
├── database.py          # [FILL: engine / connection / session]
├── models.py            # [FILL: tables + request/response schemas]
├── routes/
│   └── [FILL].py        # [FILL: endpoints for one resource]
├── services/            # [FILL: business rules, if separated from routes]
├── tests/               # [FILL: unit + integration tests]
├── frontend/            # [FILL: UI app]
├── requirements.txt
└── FLOW.md              # this file
```

### Layer responsibilities

| Layer | Owns | Must NOT do |
|---|---|---|
| Routes | HTTP: params, status codes, response shape | business rules, raw SQL |
| Services | business rules, workflows, validation across fields | know about HTTP |
| Data access | queries, transactions | decide business outcomes |
| Models | shapes of data (DB + wire) | side effects |

### The one idea worth carrying out of this project

[FILL: The single design decision that matters most, and why.
Example: "Separate models for create / read / update, so the client can never set id or status."]

---

## 3. Startup flow (before request #1)

What happens when the app starts, in order.

```mermaid
sequenceDiagram
    autonumber
    participant CLI as Server process
    participant App as App module
    participant DB as Database

    CLI->>App: import entry module
    App->>App: load config / env vars
    App->>App: create engine / connection pool (no connection yet)
    App->>App: register middleware + routers
    CLI->>App: run startup hook (lifespan)
    App->>DB: create tables / run migrations
    DB-->>App: ok
    App-->>CLI: ready — accepting requests
    Note over CLI,App: shutdown hook runs after the last request
```

| Step | Code | Notes |
|---|---|---|
| Config loaded | [FILL: file:line] | [FILL: which env vars, and their defaults] |
| Engine created | [FILL: file:line] | [FILL: pool settings] |
| Tables / migrations | [FILL: file:line] | [FILL: create_all vs Alembic] |

---

## 4. Database flow

### Entity–relationship diagram

```mermaid
erDiagram
    ENTITY_A ||--o{ ENTITY_B : "has many"
    ENTITY_A {
        int id PK
        string name
        string status
        datetime created_at
        datetime updated_at
    }
    ENTITY_B {
        int id PK
        int entity_a_id FK
        string detail
        datetime created_at
    }
```

<!-- Cardinality: ||--|| one-to-one, ||--o{ one-to-many, }o--o{ many-to-many (use a link table) -->

### Tables

| Table | Purpose | Key columns | Indexes | Constraints |
|---|---|---|---|---|
| [FILL] | [FILL] | [FILL] | [FILL] | [FILL: PK, FK, UNIQUE, CHECK] |

### Model shapes (storage vs wire)

| Model | Role | Fields the client can send / see |
|---|---|---|
| `[Entity]` | table: what the DB stores | — |
| `[Entity]Create` | request body for POST | [FILL] |
| `[Entity]Read` | response shape | [FILL] |
| `[Entity]Update` | request body for PATCH (all optional) | [FILL] |

### Session / transaction lifecycle (one per request)

```mermaid
sequenceDiagram
    participant H as Handler
    participant D as get_session dependency
    participant S as Session
    participant P as Connection pool
    participant DB as Database

    D->>S: open Session(engine)
    D-->>H: inject session
    H->>S: add / query
    S->>P: borrow connection (first SQL only)
    P->>DB: BEGIN + SQL
    H->>S: commit()
    S->>DB: COMMIT
    H-->>D: response sent
    D->>S: close (runs even if the handler raised)
    S->>P: return connection
```

### Schema changes

- **How the schema evolves:** [FILL: create_all (never ALTERs) / Alembic / Flyway / Prisma migrate]
- **Command to create a migration:** `[FILL]`
- **Command to apply migrations:** `[FILL]`
- **Seed data:** [FILL: script / fixture / none]

---

## 5. CRUD operations

### Matrix

| Op | Method + path | Request body | Success | Errors | Handler |
|---|---|---|---|---|---|
| Create | `POST /[resource]/` | `[Entity]Create` | 201 + `[Entity]Read` | 422 | [FILL: file:function] |
| Read (list) | `GET /[resource]/?filter=&skip=&limit=` | — | 200 + list | 422 | [FILL] |
| Read (one) | `GET /[resource]/{id}` | — | 200 + `[Entity]Read` | 404 | [FILL] |
| Update | `PATCH /[resource]/{id}` | `[Entity]Update` | 200 + `[Entity]Read` | 404, 409, 422 | [FILL] |
| Delete | `DELETE /[resource]/{id}` | — | 204 | 404 | [FILL] |

### Create

```mermaid
sequenceDiagram
    autonumber
    actor C as Client
    participant R as Router
    participant V as Validation
    participant S as Session
    participant DB as Database

    C->>R: POST /RESOURCE/ JSON body
    R->>V: parse body into EntityCreate
    alt invalid
        V-->>C: 422 + field errors
    else valid
        R->>S: add(Entity from body)
        R->>S: commit()
        S->>DB: INSERT ... RETURNING id
        R->>S: refresh(entity)
        R-->>C: 201 + EntityRead
    end
```

### Read (list with filter + pagination)

```mermaid
sequenceDiagram
    actor C as Client
    participant R as Router
    participant DB as Database

    C->>R: GET /RESOURCE/?filter=x&skip=0&limit=20
    R->>R: build SELECT, add WHERE for each filter given
    R->>DB: SELECT ... WHERE ... ORDER BY id LIMIT 20 OFFSET 0
    DB-->>R: rows
    R-->>C: 200 + list (empty list, never 404)
```

### Update (partial)

```mermaid
sequenceDiagram
    actor C as Client
    participant R as Router
    participant S as Session
    participant DB as Database

    C->>R: PATCH /RESOURCE/ID with changed fields only
    R->>S: get(Entity, id)
    alt not found
        R-->>C: 404
    else found
        R->>R: model_dump(exclude_unset=True)
        R->>R: check business rules (e.g. allowed transition)
        R->>S: setattr each sent field, set updated_at
        R->>S: commit() + refresh()
        S->>DB: UPDATE ... WHERE id = ID
        R-->>C: 200 + EntityRead
    end
```

### Delete

```mermaid
sequenceDiagram
    actor C as Client
    participant R as Router
    participant DB as Database

    C->>R: DELETE /RESOURCE/ID
    R->>DB: SELECT by primary key
    alt not found
        R-->>C: 404
    else found
        R->>DB: delete children first (or rely on ON DELETE CASCADE)
        R->>DB: DELETE FROM entity WHERE id = ID
        R-->>C: 204 No Content
    end
```

**Delete policy:** [FILL: hard delete / soft delete with deleted_at / cascade]

---

## 6. Function flow

How the main functions call each other. One box per function, one arrow per call.

```mermaid
flowchart TD
    main["main.py: app + lifespan"] --> create_tables["database.create_tables()"]
    main --> router["routes.RESOURCE.router"]
    router --> create_fn["create_ENTITY()"]
    router --> list_fn["list_ENTITY()"]
    router --> update_fn["update_ENTITY()"]
    router --> delete_fn["delete_ENTITY()"]
    create_fn --> get_session["database.get_session()"]
    list_fn --> get_session
    update_fn --> get_session
    delete_fn --> get_session
    update_fn --> rule["business rule helper (optional)"]
    get_session --> engine[("engine / pool")]
```

| Function | File | Input | Output | Side effects | Can raise |
|---|---|---|---|---|---|
| [FILL] | [FILL] | [FILL] | [FILL] | [FILL: DB write, log row, email] | [FILL: 404, 409] |

### Business rules

| Rule | Enforced where | What happens if it's broken |
|---|---|---|
| [FILL: e.g. status only moves forward] | [FILL: service / DB constraint / UI only] | [FILL: 409] |

### State machine (delete if the app has no workflow)

```mermaid
stateDiagram-v2
    [*] --> STATE_1: create
    STATE_1 --> STATE_2: action
    STATE_2 --> STATE_3: action
    STATE_3 --> [*]
```

---

## 7. API flow

### Request lifecycle

```mermaid
flowchart TD
    req["HTTP request"] --> cors{"CORS preflight?"}
    cors -- "OPTIONS" --> pre["CORS middleware answers"]
    cors -- "no" --> auth{"Auth required?"}
    auth -- "bad or missing token" --> e401["401 / 403"]
    auth -- "ok or public" --> match{"Route matched?"}
    match -- "no" --> e404["404 / 405"]
    match -- "yes" --> val{"Path, query, body valid?"}
    val -- "no" --> e422["422 validation error"]
    val -- "yes" --> deps["Run dependencies: session, current user"]
    deps --> handler["Handler: business logic + DB"]
    handler -- "HTTPException" --> eapp["404 / 409 ..."]
    handler -- "unhandled error" --> e500["500"]
    handler -- "return value" --> resp["response_model filters + serializes"]
    resp --> ok["2xx JSON"]
```

### Endpoint reference

| Method | Path | Auth | Query / body | Response | Notes |
|---|---|---|---|---|---|
| GET | `/health` | none | — | `{"status": "ok"}` | liveness check |
| [FILL] | [FILL] | [FILL] | [FILL] | [FILL] | [FILL] |

Interactive docs: [FILL: http://127.0.0.1:API_PORT/docs]

### Status codes this API returns

| Code | Meaning here | Raised by |
|---|---|---|
| 200 | OK | handler return |
| 201 | created | `status_code=201` on POST |
| 204 | deleted, no body | `status_code=204` on DELETE |
| 400 | [FILL: business-level bad request] | `HTTPException` |
| 401 / 403 | not logged in / not allowed | auth dependency |
| 404 | resource not found | `HTTPException` |
| 409 | conflicts with current state | `HTTPException` |
| 422 | validation failed before the handler | framework / Pydantic |
| 500 | unhandled bug | — |

### Example request / response

```http
POST /[resource]/ HTTP/1.1
Content-Type: application/json

{ "[FILL]": "[FILL]" }
```

```json
{ "id": 1, "[FILL]": "[FILL]", "created_at": "2026-01-01T10:00:00Z" }
```

---

## 8. Frontend flow (delete if there is no UI)

```mermaid
sequenceDiagram
    actor U as User
    participant UI as Component
    participant St as State (useState / store)
    participant A as api.js
    participant API as Backend

    U->>UI: click / submit form
    UI->>A: createEntity(form)
    A->>API: fetch POST (CORS preflight first for JSON)
    API-->>A: 201 JSON
    A-->>UI: data or thrown Error
    UI->>A: re-read the list
    A->>API: GET /RESOURCE/
    API-->>A: list
    UI->>St: setItems(list)
    St-->>U: re-render
```

| Concern | Where | Notes |
|---|---|---|
| API base URL | [FILL: .env VITE_API_BASE] | read at build/start time |
| All HTTP calls | [FILL: src/api.js] | the only file that calls fetch |
| Error display | [FILL] | [FILL] |
| Allowed CORS origins | [FILL: backend main.py] | must match the UI's exact origin |

---

## 9. Testing

### Strategy

```mermaid
flowchart TB
    e2e["E2E — few: browser drives the real UI + API"]
    integ["Integration — some: HTTP client + real test DB"]
    unit["Unit — many: pure functions, rules, validators"]
    e2e --- integ --- unit
```

| Level | Tool | What it covers | Where |
|---|---|---|---|
| Unit | [FILL: pytest] | business rules, helpers, model validation | `tests/unit/` |
| Integration | [FILL: pytest + TestClient + test DB] | each endpoint against a real database | `tests/integration/` |
| E2E | [FILL: Playwright / Cypress / none] | main user journeys | `tests/e2e/` |
| Manual smoke | curl / Swagger | every endpoint once after a change | this file, below |

### Test cases per endpoint

| Endpoint | Happy path | Edge / error cases |
|---|---|---|
| `POST /[resource]/` | creates, returns 201 + id | missing field → 422; empty string → 422 |
| `GET /[resource]/` | list, filters, paging | no results → `[]`; limit over max → 422 |
| `GET /[resource]/{id}` | returns row | unknown id → 404; non-int id → 422 |
| `PATCH /[resource]/{id}` | only sent fields change | unknown id → 404; illegal change → 409 |
| `DELETE /[resource]/{id}` | 204, then GET → 404 | unknown id → 404 |

### Test database isolation

[FILL: separate test DB / transaction rolled back per test / SQLite in memory — and how it's wired,
e.g. `app.dependency_overrides[get_session] = get_test_session`]

### Example integration test

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_then_read():
    created = client.post("/[resource]/", json={"[FILL]": "[FILL]"})
    assert created.status_code == 201
    item_id = created.json()["id"]

    fetched = client.get(f"/[resource]/{item_id}")
    assert fetched.status_code == 200
```

### Commands

```bash
[FILL: pytest -q]
[FILL: pytest --cov=. --cov-report=term-missing]
```

### Smoke test (manual, after any change)

```bash
B=http://127.0.0.1:[API_PORT]
curl -s $B/health
curl -s -X POST $B/[resource]/ -H "Content-Type: application/json" -d '{"[FILL]":"[FILL]"}'
curl -s $B/[resource]/
```

---

## 10. Deployment

### Environments

| Env | URL | Database | Deployed by |
|---|---|---|---|
| Local | http://127.0.0.1:[API_PORT] | [FILL] | developer |
| Staging | [FILL] | [FILL] | [FILL: CI on merge to main] |
| Production | [FILL] | [FILL] | [FILL: tag / manual approval] |

### Configuration (environment variables)

| Variable | Required | Example | Used by |
|---|---|---|---|
| `DATABASE_URL` | yes | `postgresql+psycopg2://user:pass@host:5432/db` | backend |
| `[FILL]_API_BASE` | yes | `https://api.example.com` | frontend (build time) |
| [FILL] | [FILL] | [FILL] | [FILL] |

Secrets never go in git: [FILL: .env ignored / secrets manager / CI secrets].

### Run locally

```bash
# database
[FILL: CREATE DATABASE ... / docker compose up db]

# backend
python -m venv .venv
.venv/Scripts/pip install -r requirements.txt      # Windows (Linux/macOS: .venv/bin/)
.venv/Scripts/uvicorn main:app --reload --port [API_PORT]

# frontend
cd frontend && npm install && npm run dev
```

### CI/CD pipeline

```mermaid
flowchart LR
    push["git push / PR"] --> lint["Lint + type check"]
    lint --> test["Unit + integration tests"]
    test --> build["Build image / bundle"]
    build --> stage["Deploy to staging"]
    stage --> smoke["Smoke tests"]
    smoke --> approve{"Approve?"}
    approve -- "yes" --> migrate["Run DB migrations"]
    migrate --> prod["Deploy to production"]
    approve -- "no" --> stop(["Stop"])
    prod --> monitor["Monitor: logs, errors, health"]
```

### Production topology

```mermaid
flowchart LR
    users(["Users"]) --> cdn["CDN / static hosting: frontend bundle"]
    users --> lb["Load balancer / reverse proxy (TLS)"]
    lb --> app1["API instance 1"]
    lb --> app2["API instance 2"]
    app1 --> db[("Managed database")]
    app2 --> db
    app1 -.-> logs["Logs + metrics"]
    app2 -.-> logs
```

### Release checklist

- [ ] Tests pass in CI
- [ ] Migrations reviewed and reversible
- [ ] Env vars / secrets set in the target environment
- [ ] CORS origins include the deployed frontend URL
- [ ] `/health` returns 200 after deploy
- [ ] Rollback plan: [FILL: previous image tag / migration downgrade command]

---

## 11. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Port XXXX is already in use` | old server still running | find the process that owns the port and stop it |
| Code changes have no effect | orphaned reload worker still serving old code | kill the stale process, then restart |
| Browser: `Failed to fetch`, curl works | CORS origin missing, or API not running | check `allow_origins` and the API port |
| `relation "x" does not exist` | tables not created / migration not applied | [FILL] |
| Column added but not in DB | `create_all` never ALTERs | write a migration |
| [FILL] | [FILL] | [FILL] |

---

## 12. Known gaps & next improvements

Say these before an interviewer finds them.

1. [FILL: e.g. no auth]
2. [FILL: e.g. business rule only enforced in the UI]
3. [FILL: e.g. no migrations]

---

## 13. "What did you learn building this?" (30-second answer)

[FILL: 3–4 sentences: the problem, the key design decision, one bug you hit and how you found it,
and what you'd change next.]

---

<!--
COMPLETION CHECKLIST (delete when done)
[ ] No [FILL: ...] left:  grep -n "FILL" FLOW.md
[ ] No placeholder names left in diagrams (ENTITY_A, RESOURCE, API_PORT, ...)
[ ] Every diagram renders in preview
[ ] Every table / endpoint / function here exists in the code (and nothing important is missing)
[ ] Sections that don't apply were deleted, not left empty
-->
