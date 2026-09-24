# INTERVIEW — questions this project actually prepares you for

Twenty-six questions a FastAPI/Python backend interview is likely to ask, answered with the
Dabbawala code as the evidence. The basics (`Depends`, `yield`, `lifespan`, `add`/`commit`/`refresh`)
are covered in `03-rangmanch-review/INTERVIEW.md`. This file covers what this project adds: **enums,
status workflows, an audit table, foreign keys, time zones, date filters and aggregate stats.**

Answer format that works: **state the rule, then point at the code.**

---

## Modelling a workflow

### 1. Why is `status` an `Enum` and not a plain `str`?

Because the set of legal values is closed, and the type should say so:

```python
class OrderStatus(str, Enum):
    PREPARING = "preparing"
    PICKED_UP = "picked_up"
    IN_TRANSIT = "in_transit"
    DELIVERED = "delivered"
```

What the enum does for you:

- **Validation:** `PATCH {"status": "lost"}` gets a 422 before your handler runs.
- **Docs:** Swagger shows a dropdown with the four values.
- **Filtering:** `status: OrderStatus | None = Query(None)` on `GET /orders/` is validated in the same way.

With a `str`, any typo would be saved and would quietly never match a filter.

### 2. Why does it inherit from both `str` and `Enum`?

Mixing in `str` makes each member **a real string**: `OrderStatus.DELIVERED == "delivered"` is
`True`, and it serializes to JSON as `"delivered"` with no custom encoder. A bare `Enum` member is
only an object, so you'd have to call `.value` everywhere. (Python 3.11+ also has `StrEnum` for
this.)

### 3. What does Postgres actually store in the `status` column? (the trap)

SQLAlchemy creates a native Postgres `ENUM` type called `orderstatus`. It stores the enum member
**names**, not the values:

```
 id |   status          ← psql
  1 | IN_TRANSIT
```

The API speaks `"in_transit"`, but the database holds `IN_TRANSIT`. The ORM converts between them,
so the app never notices. A report written in raw SQL does notice:
`WHERE status = 'in_transit'` is an error, not an empty result.

Two follow-ups:

- **Changing the enum later:** adding a member (e.g. `cancelled`) needs `ALTER TYPE orderstatus ADD
  VALUE ...`. `create_all()` won't run that, so this is a migration job (Alembic).
- **Avoiding it:** pass `values_callable=lambda e: [m.value for m in e]` to SQLAlchemy's `Enum`, or
  store a `VARCHAR` with a `CHECK` constraint.

### 4. The status only moves one way. Does the API enforce that?

**No**, and it's good to say this before they find it. `PATCH {"status": "preparing"}` on a
delivered order succeeds. The UI's "Mark picked up →" button only ever offers the next step, but
the UI is not a security boundary. curl can send anything.

The fix is a transition table on the server:

```python
ALLOWED = {
    OrderStatus.PREPARING:  {OrderStatus.PICKED_UP},
    OrderStatus.PICKED_UP:  {OrderStatus.IN_TRANSIT},
    OrderStatus.IN_TRANSIT: {OrderStatus.DELIVERED},
    OrderStatus.DELIVERED:  set(),
}
if new_status not in ALLOWED[order.status]:
    raise HTTPException(409, f"Cannot go from {order.status.value} to {new_status.value}")
```

**409 Conflict** is the right code: the request is well-formed, but it conflicts with the current
state of the resource.

### 5. Why is there a separate `OrderCreate` with no `status` field?

So a client **cannot create an order that is already delivered**. `OrderCreate` has only
`customer_name`, `delivery_address` and `items`. `status`, `id`, `created_at` and `updated_at` all
come from server defaults. The rule "every order starts as preparing" is part of the model, not an
`if` in the handler.

`OrderUpdate` works the same way: only `status` and `delivery_address` can change. The customer
name and items can't be edited, because those fields aren't in the model.

---

## The audit table

### 6. What is `StatusLog` and why is it a separate table?

It is an **append-only history**: one row per status change.

```python
class StatusLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="order.id", index=True)
    old_status: str
    new_status: str
    changed_at: datetime = Field(default_factory=now)
```

`order.status` only holds the **current** state, and each update overwrites it. To answer "when was
it picked up?" or "how long was it in transit?", you need the past states, and those only exist if
you write them down when the change happens. This is the audit-log pattern. Event sourcing is the
extreme version, where the log *is* the data.

(In the original code `StatusLog` had no `table=True`, so it was only a schema and no history was
ever saved.)

### 7. Walk through `update_order`. Why is the log written inside the same commit?

```python
update_data = update.model_dump(exclude_unset=True)

new_status = update_data.get("status")
if new_status and new_status != order.status:          # only real changes
    session.add(StatusLog(order_id=order.id,
                          old_status=order.status.value,  # read BEFORE setattr
                          new_status=new_status.value))

for key, value in update_data.items():
    setattr(order, key, value)
order.updated_at = now()

session.add(order)
session.commit()                                        # both rows, one transaction
```

Three details:

1. **Read `old_status` before `setattr`.** After the loop runs, the old value is gone.
2. **Skip no-op changes.** PATCHing `preparing` → `preparing`, or sending only an address change,
   writes no log row.
3. **One commit covers both writes.** The order change and its log row are saved together or not
   at all. If they were committed separately, a crash between the two commits would leave a status
   change with no history.

### 8. Two dabbawalas press "Mark picked up" at the same moment. What happens?

Both requests read `status = preparing` and both write a log row `preparing → picked_up`, so you get
**a duplicate history entry**. This is a lost-update race: read, decide, then write, with no lock.

The fix is to lock the row while you read it:

```python
order = session.exec(
    select(Order).where(Order.id == order_id).with_for_update()
).first()
```

`SELECT ... FOR UPDATE` makes the second transaction wait until the first commits. It then sees
`picked_up`, finds nothing to change, and writes no log row. The other option is optimistic
locking: add a `version` column and use `UPDATE ... WHERE version = :seen`.

### 9. `foreign_key="order.id"` — what does it do, and why does delete loop over logs first?

The foreign key is a **database constraint**: Postgres refuses a `statuslog` row whose `order_id`
doesn't exist, and it refuses to delete an order that still has log rows. So `delete_order` removes
the children first:

```python
for log in session.exec(select(StatusLog).where(StatusLog.order_id == order_id)).all():
    session.delete(log)
session.delete(order)
session.commit()
```

Better options, in order:

- **`ON DELETE CASCADE`** on the foreign key, so the database removes the children in the same statement.
- A single bulk `delete(StatusLog).where(...)` instead of loading every row into Python.
- **Soft delete**: a `deleted_at` column. For delivery records you usually want to keep the
  history, not destroy it.

### 10. Why `index=True` on `order_id` and `status`?

Postgres automatically indexes the **primary key** side of a foreign key, but **not the referencing
column**. Without the index on `statuslog.order_id`, both `GET /orders/{id}/history` and the delete
check scan the whole log table.

`status` is indexed because both `GET /orders/?status=` and `/stats/daily` filter on it. The cost
(see the rangmanch file) is extra work on every write.

### 11. The table is called `order`. Is that a problem?

`ORDER` is a **reserved word in SQL** (`ORDER BY`). SQLAlchemy quotes it for you, which you can see
in the log: `INSERT INTO "order" (...)`. Raw SQL has to quote it too, e.g.
`SELECT * FROM "order"`; without the quotes it's a syntax error. Most teams avoid this by naming
tables in the plural (`orders`) with `__tablename__ = "orders"`.

---

## Time

### 12. Why did creating an order crash with "Datetime values must have timezone information"?

This project uses **SQLModel 0.0.46**, which maps `datetime` fields to `TIMESTAMP WITH TIME ZONE`
and **rejects naive datetimes** when binding them to SQL. `datetime.now()` is naive: it has no
offset, so it doesn't say which time zone it is in.

The fix is one helper, used everywhere:

```python
def now() -> datetime:
    return datetime.now().astimezone()      # local time, WITH its +05:30 offset
```

Postgres stores the time as an absolute instant, and the API returns it in UTC (`...Z`). The
browser then shows it in the user's own time zone with `toLocaleString()`.

**The rule: store instants as timezone-aware (or UTC), and convert only for display.** Naive
datetimes break as soon as a server, database or user is in a different time zone.

### 13. `default_factory=now` vs `default=now()`?

It's the same trap as in rangmanch. `default=now()` is evaluated **once, at import**, so every
order would get the server's start time. `default_factory=now` is called for each new row.
`updated_at` has the same problem in another form: the default only fires on INSERT. That's why
`update_order` sets `order.updated_at = now()` itself.

### 14. How does the `created_date` filter turn a date into a range?

```python
start = datetime.combine(created_date, datetime.min.time()).astimezone()   # 00:00:00
end   = datetime.combine(created_date, datetime.max.time()).astimezone()   # 23:59:59.999999
query = query.where(Order.created_at >= start, Order.created_at <= end)
```

Three points:

- **Why not `func.date(Order.created_at) == created_date`?** Wrapping the column in a function
  means Postgres can't use an index on `created_at`. A range comparison can use one.
- **The better shape is half-open:** `>= start AND < next_day_start`. It has no
  `.999999` edge case and works at any timestamp precision.
- **Whose "day"?** `.astimezone()` uses the **server's** time zone. If the API ran in a UTC
  container, "orders on 23 Sept" would mean 05:30 → 05:30 IST. A real system takes the time zone
  from the client or from the business location.

(The original code typed `created_date` as `str` and passed it to `datetime.combine`, which crashes
on the first request. Typing it as `date` means FastAPI parses and validates it, and a bad value
gets a 422.)

---

## Queries & stats

### 15. How does `/stats/daily` work, and what's wrong with it?

It runs a `COUNT` **once for each status**, so four queries per request:

```python
for status in OrderStatus:
    count = session.exec(select(func.count(Order.id)).where(..., Order.status == status)).one()
```

One `GROUP BY` returns the same data in a single query:

```python
rows = session.exec(
    select(Order.status, func.count(Order.id))
    .where(Order.created_at >= start, Order.created_at <= end)
    .group_by(Order.status)
).all()
summary = {s.value: 0 for s in OrderStatus} | {s.value: n for s, n in rows}
```

The `{... : 0}` part matters. `GROUP BY` only returns groups that have rows, so a status with zero
orders would be missing from the result, and the UI expects all four keys.

### 16. `.one()` vs `.first()` vs `.all()`?

- **`.all()`**: a list, which may be empty.
- **`.first()`**: the first row, or `None`.
- **`.one()`**: exactly one row. Zero or more than one raises an error.

`COUNT(*)` always returns exactly one row, so `.one()` is the honest choice. It also turns a bad
query into a loud error instead of a quiet `None`.

### 17. Why add `order_by(Order.id.desc())` to the list?

Without `ORDER BY`, SQL doesn't guarantee any row order, so `OFFSET` pagination can repeat or skip
rows between pages. Ordering by a unique column makes pages stable. Descending order puts the
newest orders first, which is what a dispatcher wants. (The rangmanch file lists this as a gap;
here it's fixed.)

On a very large table, `OFFSET 100000` still reads and throws away 100k rows. **Keyset pagination**
(`WHERE id < :last_seen ORDER BY id DESC LIMIT 20`) avoids that.

---

## REST & HTTP

### 18. Why is "mark as delivered" a `PATCH` and not `POST /orders/{id}/deliver`?

Both are valid designs:

- **`PATCH /orders/{id} {"status": "delivered"}`** treats status as a field of the resource. It
  gives you one generic endpoint, which is simple.
- **`POST /orders/{id}/transitions`** or **`/deliver`** treats the change as an **action**. That
  suits a workflow where each step has its own rules and side effects (notify the customer, record
  who did it, charge a fee).

As the rules grow (see Q4 and Q8), the action style scales better: each transition gets its own
validation, and the endpoint name says what happened.

### 19. Is the PATCH idempotent here?

**Mostly.** Sending `{"status": "delivered"}` twice leaves the same final state, and the second
request writes no log row because of the `new_status != order.status` check. But `updated_at`
changes on every call, even when nothing else did. Strictly speaking, it's "idempotent in the data
that matters".

The "Mark next →" button is **not** idempotent in intent. A double-click sends two PATCHes computed
from the same stale status. That's another reason for server-side transition checks.

### 20. What status codes does this API return, and what's missing?

| Code | When |
|---|---|
| 200 | every success, **including create and delete** |
| 404 | order not found (`HTTPException`) |
| 422 | bad enum value, bad date, empty `customer_name` (`min_length=1`) |
| 500 | anything unhandled (you saw this while the time zone bug existed) |

Missing: **201** on create, **204** on delete, and **409** for illegal status transitions.

### 21. `response_model=Order` returns the table model directly. Is that OK?

It works, but it's the shortcut the rangmanch file warns about. Every column added to `Order`
appears in the API automatically, including internal ones such as `assigned_rider_phone`. A
separate `OrderRead` makes the public shape explicit. The same goes for `list[StatusLog]` on the
history endpoint.

### 22. The original `main.py` had `app.get("/health")` with no `@`. What happened?

The route **silently didn't exist**. `app.get(...)` returns a decorator; without the `@`, nothing
is applied to `health_check`, so the function stays an ordinary Python function. There's no error,
no warning, and `/health` returns 404. Python can't know you meant to decorate it.

This is why a **smoke test of every endpoint** is worth running after any refactor.

---

## Frontend & running it

### 23. The UI and API run on different ports. Why is CORS needed, and what exactly is allowed?

The page is served from `http://localhost:5174` and calls `http://127.0.0.1:8002`. Those are
**different origins** (scheme + host + port), so the browser hides the response from JavaScript
unless the API opts in:

```python
allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"]
```

Both host spellings are listed because `localhost` and `127.0.0.1` are **different origins** to
the browser, even though they're the same machine.

### 24. Why do the order cards use `key={`${o.id}-${o.updated_at}`}`?

A React `key` identifies a component instance. Each `OrderCard` keeps local state (edit mode, the
draft address, the open history panel). After a PATCH, `updated_at` changes, so the key changes and
React **remounts** the card with fresh state from the new data. With `key={o.id}` alone, the card
would keep showing the old draft and a stale history.

### 25. "Port 5174 is already in use" / the API kept serving old code. What was going on?

Both had the same cause: **an orphaned process**.

- `uvicorn --reload` runs a watcher process plus a worker process. If the parent is killed but the
  worker survives, the worker keeps the socket open and keeps serving the **code it loaded at
  start**. That's why edits seemed to have no effect.
- A dev server started in another terminal or session keeps its port until it is stopped.

How to diagnose it on Windows:

```powershell
Get-NetTCPConnection -LocalPort 8002 -State Listen      # who owns the port?
Get-CimInstance Win32_Process -Filter "ProcessId=<pid>" # what command is it?
Stop-Process -Id <pid> -Force
```

The skill to show here: **find out what process owns the port** before you change code.

### 26. How is config kept out of the code?

- `DATABASE_URL = os.getenv("DATABASE_URL", "<local default>")`. The same code runs against a
  different database with just an environment variable.
- The frontend reads `VITE_API_BASE` from `frontend/.env`. Only variables prefixed `VITE_` are
  exposed to the browser bundle, and they're **baked in at build/start time**, so changing them
  means restarting `npm run dev`.

The follow-up: the default URL contains `postgres:root`. **Credentials in source code** are fine
for a local learning project, but in production they must come from the environment or a secrets
manager.

---

## If they ask "what would you improve?"

1. **Enforce status transitions** on the server and return **409** for illegal ones (Q4).
2. **Lock the row** with `with_for_update()` so concurrent PATCHes can't duplicate history (Q8).
3. Replace the four-query stats loop with **one `GROUP BY`** (Q15).
4. **`ON DELETE CASCADE`** or soft delete instead of deleting log rows in a Python loop (Q9).
5. Add **`OrderRead`** / **`StatusLogRead`** response models (Q21).
6. **201** on create, **204** on delete.
7. **Alembic**: `create_all()` can't add a column or an enum value (Q3).
8. Rename the table to `orders` to avoid the reserved word (Q11), and use a half-open date range (Q14).

---

## Quick revision

- **Enum** = closed set of values; wrong value → 422 before the handler.
- **`str, Enum`** = members are real strings, so they serialize as plain JSON.
- **Postgres ENUM** stores the member **names** (`IN_TRANSIT`), not the values (`in_transit`).
- **OrderCreate has no status** → every order must start as `preparing`.
- **StatusLog** = append-only history; `order.status` is only the current state.
- **Same commit** for the change and its log row → both are saved or neither is.
- **Foreign key** = the database refuses orphans; delete the children first, or use CASCADE.
- **Postgres doesn't index the FK column for you** → add `index=True` on `order_id`.
- **Timezone-aware datetimes**: store instants, convert only for display.
- **`default_factory`** runs per row; **`updated_at`** must be set by hand on update.
- **Date filter** = range on the raw column, so an index can be used.
- **`GROUP BY`** beats one query per group; fill in missing groups with 0.
- **`ORDER BY` a unique column** or pagination isn't stable.
- **`.one()`** when exactly one row must come back (COUNT).
- **409** = the request conflicts with the resource's current state.
- **React `key`** change = remount = fresh local state.
- **Port in use / stale code** → find the process that owns the port.
