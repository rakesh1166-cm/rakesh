# FLOW — theory revision in one page

What this project implements, in the order a request travels through it.
Read this instead of `INTERVIEW.md` when you just need the theory back in your head.

---

## 1. What this project is

A **read-only REST API**: 3 endpoints, 10 hardcoded items, no database, no auth, no tests.
Small on purpose — it demonstrates the FastAPI request/response cycle and nothing else.

---

## 2. Three files, three concerns

| File | Concept it implements | Knows about |
|---|---|---|
| `data.py` | Data layer | nothing — zero imports |
| `models.py` | Schema / contract | pydantic only |
| `main.py` | Presentation (HTTP) layer | fastapi + the other two |

**Concept: separation of concerns.** Each file has one reason to change — menu changes,
contract changes, URL changes. `data.py` importing nothing is the proof it works: the menu
doesn't know it's being served over HTTP.

---

## 3. The request flow

```
CLIENT
  │  GET /menu/5
  ▼
UVICORN                  ASGI server. Owns the socket, parses raw HTTP bytes
  │                      into a scope dict. Not part of FastAPI.
  ▼
STARLETTE                Routing + middleware. Matches the URL to a handler.
  │                      FastAPI subclasses it — this is where `app` gets its HTTP guts.
  ▼
FASTAPI                  Reads your type hints. Extracts + validates parameters.
  │                      ◄── 422 raised HERE if item_id isn't an int (before your code)
  ▼
YOUR HANDLER             get_item(item_id=5). Plain Python. Runs in a threadpool
  │                      because it's `def`, not `async def`.
  │                      ◄── 404 raised HERE by your own HTTPException
  ▼
response_model           Pydantic validates the returned dict against MenuItem
  │                      and DROPS any field the model doesn't declare.
  ▼
JSONResponse             dict → JSON bytes, Content-Type: application/json
  │
  ▼
UVICORN ──► CLIENT       ASGI `send` writes the bytes back
```

**The one thing to remember:** validation happens **twice** — inbound (parameters) and
outbound (`response_model`). 422 is FastAPI rejecting the request before your code runs;
404 is your code rejecting the request after it ran.

---

## 4. Concepts, where each lives

| Concept | Implemented by | One-line takeaway |
|---|---|---|
| **ASGI** | `uvicorn main:app` | Async server interface; WSGI can't do websockets/streaming. `main:app` = variable `app` in `main.py`. |
| **Application object** | `app = FastAPI(...)` | The thing uvicorn imports and calls. `title`/`description` feed the docs. |
| **Decorator routing** | `@app.get("/menu")` | A decorator *factory* — it returns the real decorator, which registers the function in a route table. |
| **Path parameter** | `/menu/{item_id}` + `item_id: int` | Identifies ONE resource. The type hint coerces and validates it. |
| **Query parameter** | `category: str \| None = Query(None)` | Filters a collection. Has a default ⇒ optional. `Query()` adds docs metadata. |
| **Pydantic model** | `class MenuItem(BaseModel)` | A schema, not a class. Validates, coerces, serialises, and generates JSON Schema. |
| **Default field** | `status: str = "success"` | Defaulted ⇒ not required. No default ⇒ required (`count`, `items`). |
| **Nested model** | `items: list[MenuItem]` | Validation recurses into every element. |
| **`response_model`** | on the decorator | Validates the response AND strips undeclared fields. Security feature, not formatting. |
| **Error handling** | `raise HTTPException(404, detail=...)` | `raise`, not `return` — so the status code is right. Returning a dict gives 200 with an error inside, which clients can't detect. |
| **Auto docs** | `/docs`, `/redoc`, `/openapi.json` | Derived from type hints + models. Nobody wrote them. OpenAPI = spec, Swagger UI = the `/docs` page. |
| **Sync handler** | `def`, not `async def` | FastAPI runs `def` in a threadpool so it can't block the event loop. `async def` runs ON the loop — one blocking call there stalls every request. |

---

## 5. Why dicts work where models are declared

```python
return MenuResponse(count=len(filtered), items=filtered)   # filtered = list of DICTS
```

Pydantic coerces dicts into `MenuItem` objects on the way in. And `get_item` returns a bare
dict against `response_model=MenuItem` — FastAPI validates it into the model, then serialises.
So you can hand FastAPI loose dicts and still get a guaranteed response shape.

**Consequence:** add `secret_cost` to every row in `data.py` and it never reaches the client —
`MenuItem` doesn't declare it, so `response_model` drops it.

---

## 6. The three status codes this API produces

| Code | Trigger | Raised by | Where |
|---|---|---|---|
| **200** | valid request | FastAPI | after `response_model` passes |
| **422** | `/menu/abc` | FastAPI | *before* your handler — `RequestValidationError` |
| **404** | `/menu/99`, `?category=coffee` | your code | *inside* your handler — `HTTPException` |
| **500** | a malformed row in `data.py` | Pydantic | *after* your handler — response validation fails |

---

## 7. What this project deliberately does NOT have

Know these — interviewers ask "what's missing?"

| Missing | Why it matters | What you'd add |
|---|---|---|
| Database | A module-level list resets on restart and isn't shared between workers | SQLAlchemy + a repository function |
| `Depends` | FastAPI's signature feature; needed to swap the data source or inject a DB session | dependency functions |
| Auth | Every real API needs it | `OAuth2PasswordBearer` + JWT |
| Tests | No way to catch a regression | pytest + `TestClient` |
| `APIRouter` | 3 routes fit in one file; 50 would not | `routers/menu.py` |
| Write methods | Only GET exists | POST/PUT/PATCH/DELETE + request-body models |
| `async def` | Fine here — no I/O to await | async only when you have an async client to call |

---

## 8. Known defects in the current code

| Where | Problem |
|---|---|
| `main.py:19` | `Query` description says `"chai, snack or combo"` but the data uses `snacks`/`combos` — so `?category=snack` 404s |
| `main.py:16` | comment typo: `cateory` |
| `models.py` + `get_item` | `/menu` returns a `status` field, `/menu/{id}` doesn't — inconsistent envelope |
| repo root | no `.gitignore`, yet `.venv/` and `.DS_Store` are present |
| `data.py` | `available: false` items are still returned; nothing filters them |

---

## 9. Thirty-second recall

1. **uvicorn** owns the socket, **Starlette** routes, **FastAPI** validates, **your function** decides, **Pydantic** shapes the response.
2. Type hints are not documentation here — they are the **validation rules** and the **docs source**.
3. Validation runs **twice**: inbound parameters, outbound `response_model`.
4. **422 = before** your code. **404 = inside** your code. **500 = after** your code.
5. `def` handlers go to a **threadpool**; `async def` runs **on the event loop** and must never block.
6. `response_model` **drops** undeclared fields — that's how secrets stay out of responses.
7. Three files = three reasons to change. `data.py` imports nothing, and that's the point.

---

> Deeper drilling: `INTERVIEW.md` (246 questions, §24 first). Run commands: `README.md`.
