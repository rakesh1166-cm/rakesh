# FLOW — what this project is actually teaching

One page. Read this before an interview instead of the 283 questions in `INTERVIEW.md`.

---

## The app in one line

Given an Indian 6-digit pincode, return its city / state / district — one at a time, or up to
20 at once. No database; `data.py` holds a dict of 15 pincodes.

## The four files

| File | Job | The concept it exists to show |
|---|---|---|
| `main.py` | routes + handler registration | where HTTP lives |
| `models.py` | Pydantic models | validation & response shape |
| `exceptions.py` | error classes + handlers | errors as a separate layer |
| `data.py` | the dict | data kept out of logic |

That split *is* the lesson: **routing, validation, errors, and data are four different jobs.**

---

## Flow 1 — `GET /pincode/110001`

```
browser  →  uvicorn  →  FastAPI router  →  lookup_pincode()  →  response_model  →  JSON
```

1. **uvicorn** accepts the socket, parses HTTP, hands FastAPI an ASGI `scope`.
2. **Router** matches `/pincode/{code}` and pulls `code="110001"` out of the URL. It is always a
   string — a path parameter can never be a dict.
3. **Handler** checks the format, then looks up `pincode_db[code]` — a dict hit, O(1).
4. It returns a **plain dict**. FastAPI runs it through `response_model=LocationResponse`, which
   validates it and drops any field the model doesn't declare.
5. FastAPI serializes to JSON, sets `Content-Type: application/json`, status 200.

**Concept:** you returned a Python object; the framework did the conversion. That automatic step
is the thing to remember, because in step 4 of Flow 3 it doesn't happen.

## Flow 2 — `POST /pincode/bulk`

```
JSON body  →  Pydantic BulkRequest  →  bulk_lookup()  →  BulkResponse  →  JSON
```

1. Body arrives as bytes with `Content-Type: application/json`.
2. **Pydantic parses and validates it *before your function runs*.** `@field_validator` enforces:
   at least 1 pincode, at most 20, each exactly 6 digits. A violation → **422**, and
   `bulk_lookup` is never called.
3. Handler loops: hits go in `results`, misses go in `missing`. **A miss is not an error here** —
   that is the batch-endpoint rule.
4. Returns a `BulkResponse` object. Same serialization as before.

**Concept:** validation at the edge. By the time your code runs, the input is already guaranteed
good, so the handler has no defensive `if`s.

## Flow 3 — `GET /pincode/999999` (the error path)

```
raise PinCodeNotFoundError  →  ✗ handler stops  →  registered handler  →  JSONResponse  →  404
```

1. Handler raises a **custom exception** — a plain `Exception` subclass carrying only `pincode`.
   It knows nothing about HTTP.
2. The rest of the function never runs. The exception unwinds to FastAPI.
3. FastAPI looks up the class in its handler table (registered at `main.py:16`) and calls
   `pincode_not_found_handler`.
4. That handler builds the response **by hand**: `JSONResponse(status_code=404, content={...})`.

**Concept — why manual here?** A route function's return value gets auto-converted because
FastAPI knows the route, its `response_model`, and that 200 is the default. An exception handler
has none of that context, so *you* supply the status code and *you* supply the JSON. That is the
whole reason `JSONResponse` appears in `exceptions.py` and not in `main.py`.

---

## The six concepts, compressed

**1. Custom exception vs `HTTPException`**
`HTTPException` = one line, works instantly, gives you `{"detail": "..."}`.
Custom class = your business code stays free of HTTP, one place controls the error shape, the
exception can carry data. Cost: you must register a handler, and nothing warns you if you don't.

**2. Errors are a layer, not a return value**
`raise` beats `return None` because it can't be ignored, it unwinds past intermediate callers,
and it carries structured data. The exception says *what happened*; the handler says *what to
tell HTTP*. Keep those two apart.

**3. Manual JSON conversion**
Serialization = in-memory object → bytes on the wire. JSON has only objects, arrays, strings,
numbers, booleans, null — so `datetime`, `Decimal`, `UUID`, `set` all need help
(`jsonable_encoder`). Returning a **value** lets the framework decide; returning a **Response
object** means you decide status, headers, and body yourself.

**4. Path parameter vs request body**
Path = *which* resource. Small, visible in logs and history, cacheable, identifies the thing.
Body = *the payload*. Any size, nested structures, not logged, not cacheable.
One pincode → path. Twenty pincodes → body. That's the whole rule.

**5. Validation in the model, not the handler**
A Pydantic model is a schema: it validates, coerces, documents itself in `/docs`, and produces
one consistent error shape. The same rule written as an `if` inside a handler does none of that.
Note this repo gets it **both ways** — bulk validates in the model (422), single validates with
an `if` (custom error) — which is exactly why its two endpoints disagree on error format.

**6. A clean error contract**
```json
{ "error": "pincode_not_found", "message": "No location for pincode: 999999", "pincode": "999999" }
```
`error` = stable code for code to branch on. `message` = English for humans. `pincode` = the
offending input echoed back. Never return an error as `200 OK` with `"success": false` — clients,
proxies, caches, and your own monitoring all read the status code, not the body.

---

## Status codes this app produces

| Code | When | Who decided |
|---|---|---|
| 200 | found | FastAPI default |
| 404 | pincode not in `data.py` | your handler |
| 422 | bulk body broke a validator | Pydantic, before your code |
| 400 | *should* be malformed pincode | your handler — **currently broken** |

## The one bug

`main.py:17` registers `pincode_not_found_handler` for `InvalidPinCodeError`. Wrong handler.
A malformed pincode returns **404 `pincode_not_found`** instead of **400 `invalid_pincode`**, and
`invalid_pincode_handler` is imported but never used. Nothing warns you — that is the tax you pay
for wiring errors up by hand.

```python
app.add_exception_handler(InvalidPinCodeError, invalid_pincode_handler)  # the fix
```

---

## If someone asks "what did you learn building this?"

> Separating *what went wrong* from *what to tell the client*. The exception classes carry domain
> data and nothing about HTTP; the handlers translate them into status codes and a consistent JSON
> envelope. Doing it by hand also taught me why FastAPI can auto-convert a route's return value but
> not an exception handler's — the framework has no `response_model` or default status to work
> from there, so you build the `JSONResponse` yourself.

Then: `INTERVIEW.md` §15 for the ten questions worth rehearsing.
