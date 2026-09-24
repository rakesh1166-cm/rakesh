# INTERVIEW — questions this project actually prepares you for

Twenty questions: the ones this codebase is genuinely evidence for, answered with the code.
Background theory is in [FLOW.md](FLOW.md).

These **don't repeat** the other two repos. `01-chaimenu` covers FastAPI basics, routing, query
parameters, deployment. `03-rangmanch-review` covers SQLModel, `Depends`, sessions, migrations,
CORS. **This repo's subject is errors, validation, and request bodies** — so that's all that's here.

Answer format that works: **state the rule, then point at the code.**

---

## Custom exceptions & handlers

### 1. Why write custom exception classes instead of just using `HTTPException`?

Because `HTTPException` drags HTTP into code that shouldn't know about it. `PinCodeNotFoundError`
inherits from plain `Exception` and carries only domain data:

```python
class PinCodeNotFoundError(Exception):
    def __init__(self, pincode: str):
        self.pincode = pincode
```

So `raise PinCodeNotFoundError(code)` in `main.py:31` says *"this pincode isn't in our data"* and
nothing about 404 or JSON. That same line would work unchanged in a CLI script or a nightly import
job — neither of which has an HTTP response to send. The handler in `exceptions.py` is the only
place that decides "not found means 404".

You also get a **stable error shape in one place** (change the envelope once, every endpoint
follows) and an exception that **carries data** — `exc.pincode` is a real attribute, not a string
you have to parse back out of `detail`.

The honest cost: `HTTPException` works the instant you raise it; yours needs registering, and
nothing warns you if you get that wrong. See Q4 — this repo gets it wrong.

### 2. How does FastAPI decide which handler to call, and what happens if you forget to register one?

Registration is a dict keyed by exception class:

```python
app.add_exception_handler(PinCodeNotFoundError, pincode_not_found_handler)
```

On an exception, Starlette walks `type(exc).__mro__` — the class, then its parents, in order — and
uses the **first registered match**. So the most specific handler wins: register one for a base
`PincodeAPIError` and one for `PinCodeNotFoundError`, and the subclass handler takes priority.

Forget to register, and the exception isn't caught by anything: it propagates to
`ServerErrorMiddleware`, the client gets a bare **500 Internal Server Error**, and the traceback
goes to your console. Worse than the 404 you wanted, and it fails at runtime rather than at import.

`add_exception_handler(...)` and the `@app.exception_handler(...)` decorator are the same
mechanism. This project uses the function-call form because the handlers live in a different module
from `app` — the decorator form would mean importing `app` into `exceptions.py` and inviting a
circular import.

### 3. Why can't an exception handler just return a dict, when a route function can?

Because the auto-conversion you're used to is a **route** feature, not a framework-wide one. For a
route, FastAPI knows the declared `response_model` and that 200 is the default status, so it can
validate, serialize, and build the response for you. An exception handler has none of that context,
so it must hand back a finished `Response` object:

```python
return JSONResponse(status_code=404, content={...})
```

Return a dict instead and Starlette tries to call it as an ASGI app — `TypeError: 'dict' object is
not callable`, and the client gets a 500. (Worth trying once so you've seen it.)

That's why `JSONResponse` appears in `exceptions.py` and nowhere else in this project: it's the
one place *you* supply the status code and *you* supply the body.

The follow-up: **you've skipped `response_model`, so nothing validates that body.** If you want the
error shape guaranteed, build it from a Pydantic `ErrorResponse` model and pass
`jsonable_encoder(model)` — not `model.model_dump_json()`, which would give `JSONResponse` a
string and get it encoded a second time.

### 4. There's a bug in `main.py`. Find it.

Line 17 registers the **wrong handler**:

```python
app.add_exception_handler(PinCodeNotFoundError, pincode_not_found_handler)
app.add_exception_handler(InvalidPinCodeError,  pincode_not_found_handler)  # ← should be invalid_pincode_handler
```

Consequence: `GET /pincode/11000` (five digits) returns **404 `pincode_not_found`** instead of
**400 `invalid_pincode`**, and the reason `"Must be exactly 6 digit"` — passed in at line 28 —
never reaches the client. `invalid_pincode_handler` is imported on line 6 and never called.

What makes it a good interview answer is the diagnosis: **no tool catches this.** It's not a syntax
error, not a type error, and the import *is* used (on line 6) as far as a linter can tell. Only a
test that asserts the status code would have caught it:

```python
r = client.get("/pincode/11000")
assert r.status_code == 400
assert r.json()["error"] == "invalid_pincode"
```

That's the tax for hand-wiring errors, and the strongest argument for the base-class approach in Q1.

### 5. `PinCodeNotFoundError.__init__` never calls `super().__init__()`. What does `str(exc)` print?

It prints `110001` — and if you expected an empty string, that's the interesting part.
`BaseException.__new__` stores the constructor's positional arguments in `.args` before
`__init__` ever runs, so `args == ('110001',)` and `str()` renders it:

```python
str(PinCodeNotFoundError("110001"))                      # '110001'
str(InvalidPinCodeError("11000", "Must be exactly 6 digit"))
# "('11000', 'Must be exactly 6 digit')"   ← a tuple, once there's more than one arg
```

So logs won't be empty, but they'll be uninformative — a bare `110001` with no indication of what
went wrong. The fix is to call `super().__init__()` with a real message:

```python
super().__init__(f"Pincode not found: {pincode}")
```

Now `str(exc)` and any traceback read properly, while `self.pincode` stays available for the
handler to put in the JSON.

---

## Validation

### 6. What is `@field_validator`, when does it run, and why the `@classmethod` under it?

It's a Pydantic hook that validates one field, and it runs **while the request body is being
parsed — before your handler is called at all**:

```python
@field_validator("pincodes")
@classmethod
def validate_pincodes(cls, values):
    if len(values) == 0:
        raise ValueError("At least one pincode is required")
    ...
```

Send `{"pincodes": []}` and `bulk_lookup` never executes; FastAPI returns 422 straight from the
parsing step. That's why the handler body has no defensive `if`s — by the time it runs, the input
is already guaranteed.

On `@classmethod`: Pydantic v2 wraps the function for you if you leave it off, so it still works.
It's there for **type checkers and IDEs**, which otherwise read `cls` as `self` and flag the
signature. Decorator order matters — `@field_validator` on top, `@classmethod` underneath.

### 7. Why raise `ValueError` inside a validator instead of `HTTPException`?

Because a Pydantic model isn't HTTP-aware — the same model might validate a CSV import or a config
file. `ValueError` is the protocol: Pydantic catches it, collects it with any other field errors,
and FastAPI turns the batch into one 422:

```json
{"detail":[{"type":"value_error","loc":["body","pincodes"],
            "msg":"Value error, Each Pincode must be exactly 6 digit","input":["11000"]}]}
```

Raise `HTTPException` there and you break that collection — it escapes the validation machinery as
an unrelated exception rather than being gathered into `detail`. Keep validators in the language of
values; let the framework translate.

### 8. Your two endpoints disagree about what a bad pincode is. Why?

Because they validate in two different places, and it's the sharpest design lesson in the repo:

| Request | Validated by | Result |
|---|---|---|
| `POST /pincode/bulk` with `["11000"]` | `BulkRequest` validator | **422**, Pydantic's `detail` array |
| `GET /pincode/11000` | an `if` inside the handler | **404** (should be 400), custom envelope |

Same bad input, two status codes and two incompatible body shapes. A client has to write two error
parsers for one API.

Validating **in the model** gives you the schema in `/docs`, one consistent shape, and no code in
the handler — at the cost of accepting the framework's 422 format. Validating **in the handler**
gives you your own status and body — at the cost of writing and maintaining it. Pick one per API,
not one per endpoint. Here, the path parameter can be validated declaratively too:

```python
def lookup_pincode(code: str = Path(..., pattern=r"^\d{6}$")):
```

### 9. The 6-digit rule is written three times. Fix it.

It's in `PincodeRequest.validate_pincode`, in `BulkRequest.validate_pincodes`, and again as a bare
`if` at `main.py:27`. Three copies means the day the rule changes, two of them are wrong and
nothing tells you which.

Hoist it into one function and reuse it:

```python
PINCODE_RE = re.compile(r"^\d{6}$")

def check_pincode(value: str) -> str:
    if not PINCODE_RE.match(value):
        raise ValueError("Pincode must be exactly 6 digits")
    return value
```

Then `Annotated[str, AfterValidator(check_pincode)]` as a reusable type for both models, and
`Path(..., pattern=...)` for the route. One definition, three call sites.

### 10. How would you make Pydantic's 422 match your own error envelope?

Override the built-in handler for `RequestValidationError`:

```python
from fastapi.exceptions import RequestValidationError

async def validation_handler(request, exc: RequestValidationError):
    first = exc.errors()[0]
    return JSONResponse(status_code=400, content={
        "error": "invalid_pincode",
        "message": first["msg"],
        "pincode": first.get("input"),
    })

app.add_exception_handler(RequestValidationError, validation_handler)
```

Now every endpoint speaks one error dialect. Two things to say while doing it: flattening to
`errors()[0]` **throws away the other failures**, so for a 20-item batch you'd map the whole list;
and `loc` tells the client *which* field failed — dropping it makes a form unable to highlight the
right input.

---

## Request input

### 11. Why is `code` typed `str` and not `int`?

Because Indian pincodes are **digit strings, not numbers** — and `int` breaks them two ways:

- **Leading zeros vanish.** There's no pincode `012345` once it's an `int` — it's `12345`, which is
  five digits and fails your own length check.
- **Arithmetic is meaningless.** You never add two pincodes. That's the tell: if you don't do maths
  on it, it isn't a number. Same reasoning as phone numbers, and why money isn't a `float`.

There's a behavioural difference too. With `code: int`, `/pincode/abcdef` returns **422** from
FastAPI's path conversion before your handler runs. With `code: str` it reaches your code, which
raises `InvalidPinCodeError` — your error, your envelope. Which you want is a real design choice.

### 12. Why does one endpoint take a path parameter and the other a JSON body?

Path identifies **which resource**; body carries **the payload**.

One pincode is the thing being looked up, so it belongs in the URL: `/pincode/110001` is
bookmarkable, cacheable by a CDN, and readable in a log. Twenty pincodes aren't an identity — they
won't fit comfortably in a URL (which has a practical ~2 KB ceiling), so they go in a body.

The trade you're accepting: the body is **not cacheable and not in the URL**, which is also why
that endpoint has to be POST even though it only reads. If it were `GET /pincode?codes=a,b,c` you'd
get caching back and lose the size headroom and the nested-structure option.

### 13. `GET /pincode/bulk` returns a strange 404. Why?

```json
{"error":"pincode_not_found","message":"No location for pincode: bulk","pincode":"bulk"}
```

Routes are matched on **method + path**. `POST /pincode/bulk` and `GET /pincode/{code}` don't
collide because the methods differ — but a *GET* to `/pincode/bulk` has only one candidate, the
dynamic route, so `code` binds to the literal string `"bulk"`. It's four characters, so the length
check fails and you get an error about a pincode named "bulk".

It's not a bug, but it is a smell: a static segment sharing a prefix with a catch-all parameter.
Fixes, in increasing order of goodness: declare `GET /pincode/bulk` explicitly **before** the
dynamic route (for a first-match router, order decides); constrain the parameter with
`Path(..., pattern=r"^\d{6}$")` so `"bulk"` can never match it; or move the batch endpoint off the
collision entirely, as `POST /pincode-batch`.

---

## Bulk endpoint design

### 14. Why doesn't a missing pincode 404 in the bulk endpoint?

Because one status code has to describe twenty outcomes. If 19 succeed and one is missing, the
request as a whole **succeeded** — so it's 200, and the per-item result goes in the body:

```python
return BulkResponse(found=len(results), not_found=len(missing),
                    results=results, missing=missing)
```

The general rule: **transport-level status for the request, payload-level detail for the items.**
404 would be a lie about the 19 that worked, and would force the client to re-request them.

This is also why the two endpoints legitimately differ — for a single lookup, "not found" *is* the
whole outcome, so 404 is right there. Same data, different question asked.

### 15. What's wrong with the bulk response shape?

`results` and `missing` are two separate lists, so **the client can't line results up with what it
sent.** Send 20 pincodes to fill 20 form rows and you get back "here are 17 results, in order, and
3 that failed" — you have to match on the `pincode` field to work out which row is which.

Return one entry per input instead, in input order:

```json
[{"pincode": "110001", "found": true,  "city": "New Delhi", ...},
 {"pincode": "999999", "found": false, "city": null, ...}]
```

Now index *i* of the response is index *i* of the request. Related gap: duplicates in the request
are looked up and returned twice today, and nothing deduplicates them.

### 16. Why cap the batch at 20?

```python
if len(values) > 20:
    raise ValueError("Maximum 20 pincodes allowed per request")
```

Because an uncapped batch is an amplification vector: one cheap request becomes unbounded server
work, and a bulk endpoint counted as "one request" by a rate limiter lets an attacker multiply
their budget by the batch size. The cap bounds worst-case cost per request so you can reason about
capacity at all.

Whether **20** is right is the follow-up, and the honest answer is that it was picked by feel. You'd
set it from the real p99 payload size a client needs and the latency budget for the slowest
backing query — and you'd rate-limit by *items*, not requests, so a batch of 20 costs 20.

---

## Responses & data

### 17. What makes a good error body? Justify yours field by field.

```json
{"error": "pincode_not_found", "message": "No location for pincode: 999999", "pincode": "999999"}
```

- **`error`** — a stable machine-readable code. Code branches on this. It must survive rewording,
  which is exactly what `message` can't promise.
- **`message`** — for a human reading logs or a dev console. Never parsed.
- **`pincode`** — the offending input echoed back, so an async client can match the failure to the
  request that caused it without bookkeeping.

Compare FastAPI's default `{"detail": "..."}`: one English string, nothing stable to branch on.

Two rules to state alongside it: **never return an error as `200 OK` with `"success": false`** —
clients, proxies, caches and your own alerting all read the status code, not the body. And
**`message` must not leak internals** — once `data.py` becomes a database, a raw exception string
in that field is a SQL fragment or a file path handed to an attacker.

### 18. Does `response_model` apply to the error responses?

No, and it's a useful thing to have straight. `response_model=LocationResponse` on line 25 governs
what `lookup_pincode` **returns**. The moment you `raise`, the function is abandoned and the
response is built by the handler instead — that path never touches the route's `response_model`.

Two consequences worth naming:

- Your error bodies are **unvalidated**. A typo in a handler's dict ships silently.
- `/docs` shows only the 200 shape. Consumers can't see the 404 body unless you declare it:
  `@app.get(..., responses={404: {"model": ErrorResponse}})`.

### 19. Why a dict keyed by pincode, and what does `return pincode_db[code]` actually hand back?

A dict because the access pattern is lookup-by-key: `code in pincode_db` is an **O(1)** hash lookup,
where scanning a list is O(n). Pincodes are unique and immutable — a textbook key.

The second half is the part people miss: it returns a **reference to the stored dict**, not a copy.
Mutate the returned object anywhere downstream and you've edited your data source for every
subsequent request in that process. Nothing does that today, and `response_model` happens to
shield the client by building a fresh `LocationResponse`, but that's luck, not design.

Also worth flagging: lines 30 and 32 hash the key twice.

```python
location = pincode_db.get(code)
if location is None:
    raise PinCodeNotFoundError(code)
```

Irrelevant at 15 rows; the habit matters when the lookup is a network call.

### 20. `PincodeRequest` is defined in `models.py` and imported nowhere. What do you do?

Delete it, or use it — but don't leave it. Dead code still has to be read, still gets refactored,
still shows up in search results, and quietly implies a single-pincode POST endpoint that doesn't
exist. It also drifts: it holds a **third** copy of the 6-digit rule (Q9) that no test touches.

The case for using it is that it's already the right model for `POST /pincode/validate` —
a format check with no lookup. Either way the rule is: **decide now.** "Might need it later" is
what git history is for.

---

## If they ask "what would you improve?"

Knowing your own code's weak points reads better than claiming it has none:

1. **Fix the handler registration** on `main.py:17` — `InvalidPinCodeError` must map to
   `invalid_pincode_handler`, or malformed input keeps returning 404.
2. **Give both endpoints one error shape** — override `RequestValidationError` so the bulk 422
   matches the custom envelope.
3. **Write the 6-digit rule once** and reuse it in both models and the path parameter.
4. **Return the bulk result in input order**, one entry per requested pincode, with a `found` flag.
5. **Add a base `PincodeAPIError`** so new error types are covered by one registration instead of
   needing a new line each time.
6. **Declare the error responses** in the decorator so `/docs` documents the 404 and 400.
7. **Add tests** — `TestClient`, six cases: hit, miss, malformed, empty batch, 21-item batch, mixed
   batch. The first of them catches bug #1.
8. **Call `super().__init__()`** in both exception classes so tracebacks carry a real message.
================================================================
1. when json respone is used
Converts the content dictionary into JSON.
Creates the HTTP response with the given status code.
2. how to register your custom exception handler
app.add_exception_handler()
3. why _init and self is used
__init__ is called automatically when creating an object.
self refers to the current object.self must be the first parameter of normal instance methods.
__init__ gives a new object its starting values, while self identifies the particular object whose data is being stored or accessed.

Real-life analogy

Think of a class as a blank registration form:

Class = form template
Object = one completed form
__init__ = process of filling the form
self = the particular form currently being filled
self.name = name written on that form

__init__ initializes a new exception object when you raise the exception

4. why exc is used 
exc refers to the actual exception object that was raised.
5. What is BaseModel in Pydantic?
BaseModel is the parent class used to create data-validation models.
class PincodeRequest(BaseModel):
    pincode: str
It tells Pydantic to validate pincode as a string when creating the object or receiving API data.
6. What is the purpose of field_validator()?
field_validator() defines custom validation rules for a particular field.
@field_validator("pincode")
It tells Pydantic to run validate_pincode() when validating the pincode field.
7. why is @classmethod used with a field validator?
@classmethod binds the validator to the model class instead of an individual object.
@classmethod
def validate_pincode(cls, value):
cls represents the model class.
value contains the value being validated.
8. What does value.isdigit() check?
isdigit() checks whether every character in the string is a digit.
value.isdigit()
Examples:
"560001".isdigit()   # True
"560A01".isdigit()   # False
"560 01".isdigit()   # False
9. What happens when validation fails?
the validator raises ValueError:
raise ValueError("Pincode must be exactly 6 digit")
Pydantic catches this error and generates a structured validation error. In FastAPI request validation, this normally results in an HTTP 422 Unprocessable Entity response.
10. Why must the validator return value?
The returned value becomes the final value stored in the model field.
return value
If you modify the value inside the validator, you can return the modified version.
return value.strip()
11. What does pincodes: list[str] mean?
It means pincodes must be a list whose items are strings.
pincodes: list[str]
Valid input:
{
  "pincodes": ["560001", "826001"]
}

Invalid input:
{
  "pincodes": "560001"
}
12. How does BulkRequest validate the list?
It checks three conditions: checks more than one condition
13. What is a nested Pydantic model?
A nested model is one Pydantic model used as a field type inside another model.
results: list[LocationResponse]
This means every item in results must match:
