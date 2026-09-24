# INTERVIEW — questions this project actually prepares you for

Eighteen questions: the ones a read-only FastAPI service genuinely earns you, answered with this
codebase as the evidence. Depth on the concepts is in [FLOW.md](FLOW.md).

Answer format that works: **state the rule, then point at the code.**

> **No overlap with the other two volumes.** `Depends`, `lifespan`, SQLModel, ORM sessions,
> migrations, CORS and PUT/PATCH are answered in `03-rangmanch-review/INTERVIEW.md`.
> Custom exception classes, exception handlers, `field_validator`, POST bodies and route
> shadowing are answered in `02-pincode-lookup/INTERVIEW.md`. This file covers what only
> *this* repo demonstrates.

---

## How it runs

### 1. What does `uvicorn main:app --reload` actually do, and why can't you just run `python main.py`?

`main:app` is an **import path, not a filename**: import the module `main`, take the variable
called `app`. Nothing in this repo ever calls that object — uvicorn does.

`python main.py` does nothing because there is no `if __name__ == "__main__"` block and no server
in the file. `app` is just an object describing routes; something has to own the socket, parse HTTP
bytes, and call it. That something is uvicorn, an **ASGI** server.

ASGI is the async successor to WSGI. The contract is one async callable:

```python
async def app(scope, receive, send): ...
```

`scope` is the request metadata, `receive` pulls body chunks in, `send` pushes response events out.
Because the connection is a stream of events rather than one call-and-return, ASGI can hold
connections open — websockets, SSE, streaming — which WSGI structurally cannot.

`--reload` starts a **watcher** process (`watchfiles`) that restarts a **child** server process when
a `.py` file changes. Two processes, which is why the startup log prints two PIDs. Development only:
it costs a file watcher and, more importantly, it reloads to a single worker.

### 2. None of your three handlers are `async def`. Is that a mistake?

No — and knowing *why* is the point.

FastAPI inspects each handler. `async def` runs **directly on the event loop**. Plain `def` is
pushed to a **threadpool** (`anyio`'s, 40 threads by default) so it cannot block the loop.

These handlers do no I/O at all — they iterate a Python list in memory:

```python
for item in menu_items:
    if item["id"] == item_id:
```

There is nothing to `await`, so `async def` would buy nothing. Worse, marking it `async` and later
adding a blocking call inside — a sync DB driver, `requests.get`, `time.sleep` — would stall
**every** concurrent request, because one coroutine refusing to yield freezes the whole loop.

The rule: **`async def` only when you have something genuinely awaitable to call.** Sync work in a
`def` handler is the safe default; FastAPI handles the offloading.

The threadpool's limit is the catch at scale: 40 concurrent blocking handlers and request 41 queues.
An async handler over an async driver has no such ceiling.

### 3. Where do `/docs` and `/openapi.json` come from? Nobody wrote them.

They are derived from the type hints. FastAPI walks the route table, reads each signature and each
Pydantic model, and emits an **OpenAPI** document — a JSON description of every path, parameter,
and response schema. `/docs` (Swagger UI) and `/redoc` are two browser renderers pointed at it.

Three vocabulary items interviewers probe:

| Term | What it is |
|---|---|
| OpenAPI | the specification — the JSON at `/openapi.json` |
| Swagger UI | the interactive page at `/docs` |
| ReDoc | an alternative renderer, at `/redoc` |

Everything you pass feeds it: `title` and `description` on `FastAPI()` become the page header, the
`description` in `Query(...)` becomes the parameter's help text, and `MenuResponse` becomes the
documented response schema.

The consequence worth stating: **the docs cannot drift from the code**, because they are generated
from the same annotations that do the validating. That is the real argument for FastAPI over a
framework where docs are a separate hand-maintained artefact.

---

## Structure

### 4. Three files for three endpoints. Justify the split — and when would you add `APIRouter`?

Each file has exactly **one reason to change**:

| File | Changes when | Imports |
|---|---|---|
| `data.py` | the menu changes | **nothing** |
| `models.py` | the API contract changes | pydantic |
| `main.py` | URLs or status codes change | fastapi + both |

`data.py` importing **nothing** is the evidence the separation is real — the menu doesn't know it's
being served over HTTP, so the same module would work in a CLI tool or a receipt printer.

`APIRouter` becomes necessary when `main.py` stops being scannable — roughly at two distinct
resources. It's a mini-app you register onto the parent:

```python
# routers/menu.py
router = APIRouter(prefix="/menu", tags=["menu"])

@router.get("/")
def get_menu(): ...

# main.py
app.include_router(router)
```

The win is the `prefix` and `tags` applying to every route at once, and `main.py` shrinking to
assembly. At three routes it would be ceremony.

The honest weakness: both handlers reach straight into the `menu_items` global, so `main.py` knows
the data is *a list of dicts you iterate*. That's the coupling to fix first — see Q16.

---

## Parameters

### 5. `/menu/{item_id}` vs `/menu?category=chai` — when does each belong, and who produces the 422 on `/menu/abc`?

The semantic rule: **a path segment identifies a resource; a query parameter modifies a
collection.** `/menu/5` names one item and 404s if it doesn't exist. `?category=chai` filters the
collection — drop it and you still have a valid request, which is exactly why it's optional.

A useful test: removing a path parameter gives you a *different resource*; removing a query
parameter gives you the *same resource, less filtered*.

The 422 is **FastAPI's, not yours**, and it happens before your function body runs:

```
GET /menu/abc  ->  422  (FastAPI — item_id: int coercion failed)
GET /menu/99   ->  404  (your code — HTTPException)
```

`item_id: int` is not a hint, it's the validation rule. FastAPI tries to coerce `"abc"`, fails,
raises `RequestValidationError`, and returns 422 with a field-level error report. Your handler is
never entered. 400 would also be defensible, but 422 ("syntactically fine, semantically invalid")
is what FastAPI standardised on.

### 6. Unpack `Query(None, description="Filter by chai, snack or combo")`.

```python
category: str | None = Query(None, description="...")
```

Four separate decisions in one line:

- **`str | None`** — may be absent, so the type must admit `None`.
- **`Query(...)`** — declares explicitly that this binds to the query string. Without it FastAPI
  would still infer "query parameter" (it's not in the path and isn't a Pydantic model), so
  `Query` here exists purely to attach metadata.
- **the first positional `None`** — the **default**, and therefore what makes the parameter
  optional. Swap it for `...` (`Ellipsis`) and the parameter becomes required; omitting it then
  yields 422.
- **`description=`** — documentation only. It lands in `/openapi.json` and shows up under the field
  in `/docs`.

### 7. The filter calls `.lower()`. What does that fix, and what does it not?

```python
if item["category"] == category.lower()
```

It fixes **caller casing** — `?category=CHAI` and `?category=Chai` both work. Verified: `CHAI`
returns 200 with 4 items.

It does **not** fix anything on the data side, and it hides a real defect. The parameter's own
documentation says `"chai, snack or combo"` — singular — while `data.py` stores `snacks` and
`combos`. So:

```
?category=snacks  ->  200, 3 items
?category=snack   ->  404   ← exactly what /docs tells you to send
```

`.lower()` can't help, because the mismatch is plural-vs-singular, not case. Two honest fixes, and
I'd argue for the second: correct the description to the plural forms, or — better — make the set
of valid values a `Literal["chai", "snacks", "combos"]` or an `Enum`. Then the allowed values are
generated into `/docs` from one source, a wrong value is rejected as a 422 before the handler, and
the documentation cannot contradict the data.

---

## Models and responses

### 8. You return plain dicts, not model instances. Why does `response_model` accept that, and what does it do to extra keys?

`get_item` returns a dict straight out of `data.py`, against `response_model=MenuItem`. It works
because `response_model` is a **validation and serialisation
step that runs on whatever you return**, not a type assertion about it. FastAPI constructs a
`MenuItem` from the dict, so coercion and field checks happen exactly as they would for a request.

Same in `get_menu`: `items=filtered` passes a list of **dicts** into `MenuResponse`, and Pydantic
coerces each element, because `items: list[MenuItem]` makes validation recurse.

The part that matters in review: **undeclared fields are dropped.** I verified this by adding
`secret_cost: 9.99` to the rows in `data.py`:

```
data.py row:  {"id": 2, ..., "available": True, "secret_cost": 9.99}
response:     {"id":2,...,"available":true}          ← secret_cost absent
```

That makes `response_model` a **security control, not formatting**. An internal cost, a password
hash, or an audit column added to the data layer cannot leak through an endpoint that doesn't
declare it. It's the same protection as an explicit `SELECT` column list instead of `SELECT *`.

### 9. What breaks if one row in `data.py` is malformed — and which status code?

**500, and the error is yours, not the client's.** I verified it by deleting the `description` key
from row 1:

```
GET /menu/1  ->  500 Internal Server Error
GET /menu    ->  500 Internal Server Error        ← the whole collection, not just that row
```

The server log shows `fastapi.exceptions.ResponseValidationError`, wrapping a pydantic
`ValidationError for MenuResponse`.

The distinction to state out loud, because it's the crisp version of the whole framework:

| When | What failed | Code | Whose fault |
|---|---|---|---|
| before your handler | request validation | 422 | the caller's |
| inside your handler | your `HTTPException` | 404 | the caller's |
| after your handler | **response** validation | 500 | **yours** |

422 and 500 come from the same Pydantic machinery pointed in opposite directions. A 500 here is
correct behaviour — the client sent a perfectly good request and the server couldn't honour its own
contract, so it must not pretend otherwise. Note the blast radius: one bad row takes down `/menu`
entirely, because the list fails as a unit.

### 10. `MenuResponse` has a `status` field. `MenuItem` doesn't. Is that a problem?

It's an inconsistency, and I'd raise it in review.

```python
class MenuResponse(BaseModel):
    status: str = "success"    # defaulted -> not required
    count: int                 # no default -> required
    items: list[MenuItem]
```

(The mechanical point first: a field with a default is optional to supply, which is why
`MenuResponse(count=..., items=...)` is valid and `status` fills itself in.)

The design problem is that the two endpoints return different *envelopes*:

```
GET /menu      ->  {"status":"success","count":10,"items":[...]}
GET /menu/5    ->  {"id":5,"name":"Samosa",...}          ← no status, no envelope
```

A client can't write one response handler. Pick a rule and apply it everywhere — either both
endpoints wrap in `{status, data}`, or neither does and the HTTP status code carries that
information instead.

My preference is **neither**: `status: "success"` is redundant with a 200, it's absent from error
responses anyway (see below), and it's a field every client must skip. The status code is the
status. If you do keep an envelope, it must cover errors too, or it isn't an envelope.

### 11. Does `response_model` apply to your 404 body?

No. `response_model` describes the **success** response only. When `HTTPException` is raised, FastAPI's
built-in handler produces the body, which is always:

```json
{"detail": "Menu item with id 99 not found"}
```

So the shape of your errors is decided entirely elsewhere from the shape of your successes — and
`/docs` will happily document a `MenuItem` for this path while saying nothing about the 404 unless
you declare it:

```python
@app.get("/menu/{item_id}", response_model=MenuItem,
         responses={404: {"description": "Item not found"}})
```

This is the seam where you outgrow `HTTPException` and start defining exception classes with
handlers — which is what `02-pincode-lookup` does.

---

## Errors

### 12. Why `raise HTTPException(...)` rather than `return {"error": "not found"}`?

Because `return` sends **200 OK**. The body would say "error" while every HTTP-aware layer in the
chain — the browser, the HTTP client, the reverse proxy, the monitoring dashboard — reads it as a
success. `response.ok` would be `true`. Retry logic, caches, and error-rate alarms all key off the
status code, not your prose.

`raise` gets the status line right and does it with an exception, which also means the rest of the
function **never runs**:

```python
raise HTTPException(status_code=404, detail=f"Menu item with id {item_id} not found")
```

Control leaves the handler immediately, unwinds to FastAPI's built-in handler, and becomes
`{"detail": "..."}` with a real 404. No `return` needed, no sentinel value to check, no risk of
falling through to a second `return` below.

It's the same reason you raise rather than return in ordinary Python: an error is not a value the
caller should have to remember to inspect.

### 13. `?category=coffee` returns 404. Defend it, then argue against it.

```python
if not filtered:
    raise HTTPException(status_code=404, detail=f"No item found in category: {category}")
```

**For 404:** the caller asked for something that doesn't exist. Silence is worse than an error —
a typo'd `?category=chia` would return an empty list forever and the client would render an empty
menu with no idea why.

**Against, and this is the stronger case:** the resource `/menu` **does** exist — you just found
nothing in it. 404 properly means *this URL addresses nothing*. A filter matching zero rows is a
successful query with an empty result, so `200` with `{"count": 0, "items": []}` is the more
honest answer. It also keeps the response shape stable, which matters: right now a client must
parse two different body shapes depending on how many rows matched.

The rule I'd publish API-wide: **404 for a missing single resource, 200 with an empty collection
for a filter that matched nothing.** That gives `/menu/99` → 404 and `?category=coffee` → 200 with
an empty list, and it makes the client's job trivial.

If you want to catch typos without lying about the status, validate the *input* instead of the
*result* — a `Literal` or `Enum` on the parameter (Q7) turns `?category=chia` into a 422 listing
the legal values, which is strictly more useful than a 404.

---

## Data layer

### 14. `menu_items` is a module-level list. What breaks when you run four workers?

Each worker is a **separate OS process with its own interpreter and its own copy of the list.**
There is no shared memory between them.

Read-only, as here, that's harmless — four identical copies of the same constant. But the moment
anything writes, it silently breaks:

```
POST /menu  ->  worker 2  ->  appends to worker 2's list
GET  /menu  ->  worker 3  ->  item is missing
```

The same request then succeeds or fails depending on which worker the load balancer picked, and the
data vanishes entirely on restart since nothing is persisted.

This is the concrete meaning of "a web app must be **stateless**": state in a module-level variable
is invisible to every other worker and every other machine. Anything mutable has to live somewhere
shared — a database, Redis — which is precisely what `03-rangmanch-review` introduces.

### 15. `get_item` scans the list; the pincode project uses a dict. Does that matter?

```python
for item in menu_items:          # O(n)
    if item["id"] == item_id:
```

versus

```python
pincode_db[code]                 # O(1)
```

At 10 items, **no** — and I'd say so rather than pretend otherwise. A linear scan of 10 dicts is
nanoseconds, and the network round trip dwarfs it by orders of magnitude. Optimising this would be
a pure loss in readability.

It matters at a few thousand rows, or when the lookup happens inside another loop (that's how O(n)
becomes O(n²)). The fix is free — build the index once at import:

```python
menu_by_id = {item["id"]: item for item in menu_items}
```

What interviewers are really checking is whether you can **recognise the complexity and then judge
whether it's worth fixing.** "It's O(n), it's irrelevant at this size, here's the one-line fix if
the data grows" is a better answer than either not noticing or reflexively optimising.

The real lesson is that the right data structure follows the access pattern: pincode lookups are
*always* by key, so a dict is the honest model. This menu is *usually* listed in full and
*occasionally* fetched by id, so a list is reasonable — and an id index alongside it costs nothing.

### 16. How would you swap `data.py` for a real database without rewriting `main.py`?

Today you can't, quite — and that's the honest answer. `main.py` does `item["category"]`, so it
knows the rows are **dicts** and that the store is **iterable**. Change `data.py` to hold objects
and every handler breaks on `item["id"]` → `item.id`. That is tight coupling, provable by the edit
it forces.

The fix is to have `data.py` expose **behaviour instead of its data structure**:

```python
# data.py — the interface main.py is allowed to see
def find_by_id(item_id: int) -> dict | None: ...
def find_by_category(category: str) -> list[dict]: ...
```

Now `main.py` knows two function names, and whether the answer comes from a list, SQLite, or a
cache is invisible to it. Coupling drops from "knows the representation" to "knows the interface."

The next step, which `03-rangmanch-review` demonstrates, is to stop importing the data module at
all and receive it instead — `Depends(get_session)` — so the handler can be handed a real session
in production and a fake in tests without touching the handler.

### 17. Vada Pav has `available: False` and is still returned. Bug or feature?

Feature, and I'd defend it — but it must be deliberate.

A kiosk needs to *show* that Vada Pav exists and is sold out; hiding it makes the menu look shorter
and invites repeated asking. The field exists precisely so the **client** can grey the row out.
Filtering server-side would destroy information the UI needs.

What makes it a defect is only that nothing says so. Two things I'd add: an `?available=true` query
parameter for callers who genuinely want just the orderable set, and a line in the endpoint
description stating that unavailable items are included by design. Then it's a documented contract
rather than something the next developer has to guess at.

---

## Testing and deployment

### 18. How would you test this, and what would you change before deploying it?

**Tests.** `TestClient` wraps the app in-process — no server, no port, no network:

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_filter_by_category():
    r = client.get("/menu?category=chai")
    assert r.status_code == 200
    body = r.json()
    assert body["count"] == 4
    assert {i["category"] for i in body["items"]} == {"chai"}

def test_missing_item_404():
    r = client.get("/menu/99")
    assert r.status_code == 404
    assert r.json()["detail"] == "Menu item with id 99 not found"
```

It calls the ASGI app directly, so tests are fast and need no running process. One practical note I
hit verifying this: `TestClient` needs `httpx` installed — this venv doesn't have it, and the
import fails with a clear message telling you to install it. It belongs in a separate
`requirements-dev.txt`, not in `requirements.txt`, so production images don't ship your test stack.

Assert on **status code and shape**, not on an exact JSON blob — a snapshot of the whole body fails
every time someone adds a field, which trains people to ignore the test.

**Before deploying.** The five that matter:

1. Drop `--reload`; run `gunicorn -k uvicorn.workers.UvicornWorker -w 4` (or `uvicorn --workers 4`)
   behind nginx. `--reload` is a file watcher and a single worker.
2. **Pin versions.** `requirements.txt` says `fastapi` with no constraint, so two builds a month
   apart install different code. Commit a lockfile.
3. Add a `.gitignore` — `.venv/`, `__pycache__/`, `.DS_Store` are all sitting in this folder.
4. Decide about `/docs`. It's public, and it advertises your whole surface; either accept that
   deliberately or pass `docs_url=None` and serve it only internally.
5. Add `GET /health` for the load balancer, returning 200 without touching the data layer.

Then, because the menu is read-heavy and nearly static: a `Cache-Control` header so the CDN and the
kiosk can serve it without reaching you at all. That's the single biggest scaling win available
here, and it's one line.

---

## If they ask "what would you improve?"

Have these ready — knowing your own code's weak points reads better than claiming it has none:

1. Fix the `"chai, snack or combo"` description, or replace the free-text `category` with a
   `Literal`/`Enum` so `/docs` and the data cannot disagree.
2. Return **200 with an empty list** for a filter that matched nothing; keep 404 for `/menu/99`.
3. Make the envelope consistent — `/menu` returns `status`, `/menu/{id}` doesn't.
4. Give `data.py` `find_by_id` / `find_by_category` so `main.py` stops knowing the rows are dicts.
5. Add an `?available=true` filter and document that unavailable items are returned by default.
6. Add `pytest` + `httpx` in `requirements-dev.txt`, and the two tests above.
7. Pin dependency versions and add a `.gitignore`.
8. Fix the comment typo at `main.py:16` — `cateory`
=====================INTERVIEW========================
1. how to get or extract particular data when data stored  in memory or Python list approach
Uses a Python for loop
C:\Users\rakes\PycharmProjects\fastapi\01-chaimenu\main.py
2. how to get or extract particular data when data stored in database
Uses session.get()
C:\Users\rakes\PycharmProjects\fastapi\03-rangmanch-review\routes\reviews.py
def get_review(review_id: int, session: Session = Depends(get_session) ):
    review = session.get(Review, review_id)
3. What happens when the client sends GET /menu?category=chai and the endpoint contains if category:?
filtering code executes    
C:\Users\rakes\PycharmProjects\fastapi\01-chaimenu\main.py
@app.get("/menu", response_model=MenuResponse)
def get_menu(category: str | None = Query(None, description="Filter by chai, snack or combo")):
    if category:
        filtered = [item for item in menu_items if item["category"] == category.lower()]
4. The program should search through a list of menu items and return only those items whose category matches the entered category, ignoring uppercase and lowercase differences.

 filtered = [item for item in menu_items if item["category"] == category.lower()]   

 filtered = []
for item in menu_items:
    if item["category"] == category.lower():
        filtered.append(item)     
5. Why use Pydantic        
with Pydantic, schema validation and serialization are controlled by type annotations;Pydantic’s core validation logic is written in Rust. 
6. Different Pydantic validations
https://www.debug.school/rakeshdevcotocus_468/why-fastapi-uses-pydantic-a-complete-guide-to-request-validation-with-real-world-examples-kpj