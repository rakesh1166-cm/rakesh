# W2-F2.1 — API Skeleton, Health/Ready, `mounts.py`

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `services/api/` (deployable)
**Depends on:** [W1-F1.1](../../week-01-llm-foundations/F1.1-typed-settings-and-model-tiers/CLAUDE.md)
**Consumed by:** every week from here on

## Goal

One ASGI app that every week mounts into. `mounts.py` is the **single place** a week becomes
reachable — so adding Week 9 later means one dict entry, not edits scattered through `main.py`.

## Contract (schema first)

```python
# services/api/mounts.py
class WeekMount(BaseModel):
    key: str                    # "w02"
    prefix: str                 # "/api/w02"
    title: str
    router: APIRouter

WEEK_MOUNTS: list[WeekMount]    # the ONLY registration point

# health contracts — separate liveness from readiness, they answer different questions
class Health(BaseModel):
    status: Literal["ok"]
    version: str

class Ready(BaseModel):
    status: Literal["ready", "degraded"]
    checks: dict[str, Literal["ok", "fail"]]   # {"db": "ok", "redis": "ok", "llm": "ok"}
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `services/api/main.py` | NEW | FastAPI app, CORS, mount loop, lifespan |
| `services/api/mounts.py` | NEW | `WEEK_MOUNTS` — the registration table |
| `services/api/routes/health.py` | NEW | `GET /api/health`, `GET /api/health/db`, `GET /ready` |
| `services/api/Dockerfile` | NEW | deferred to W12 for compose, written now |

## Flow

```
uvicorn services.api.main:app
      ▼
lifespan startup ── get_settings() validates config ── fail fast if misconfigured
      ▼
CORS middleware (origins from settings — never "*" outside local)
      ▼
for m in WEEK_MOUNTS: app.include_router(m.router, prefix=m.prefix)
      ▼
GET /api/health   → liveness  (process is up; no dependency touched)
GET /ready        → readiness (db + redis + llm reachable; used by orchestrators)
```

## Rules

- **No business logic in `main.py`.** It wires and mounts, nothing else ([CLAUDE.md §4](../../../CLAUDE.md)).
- Health endpoints stay **un-prefixed by week** — `/api/health`, not `/api/w02/health`.
- Liveness must not touch the DB. A slow database must not cause a restart loop.
- Readiness *does* touch dependencies and may return `degraded` with a per-check breakdown.
- CORS origins come from settings. `allow_origins=["*"]` is a local-only value, asserted in a test.
- Adding a week = one `WEEK_MOUNTS` entry. If it requires editing `main.py`, the design regressed.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| DB down | `/api/health` still 200; `/ready` returns `degraded` with `{"db": "fail"}` |
| Invalid config at boot | Startup fails immediately with the field name — no half-started app |
| Two weeks claim the same prefix | Startup fails with a collision error, not last-one-wins |
| CORS misconfigured in prod | Test asserts `"*"` is impossible when `env != "local"` |

## Tests

- `test_liveness_does_not_touch_dependencies` (assert DB session factory never called)
- `test_readiness_reports_per_dependency_status`
- `test_duplicate_week_prefix_fails_at_startup`
- `test_wildcard_cors_rejected_when_env_is_prod`
- `test_adding_a_mount_requires_no_main_py_change` — mount a dummy week in-test

## Acceptance criteria

- [ ] `GET /api/health` returns 200 with the database stopped
- [ ] `GET /ready` returns `degraded` and names the failing dependency
- [ ] `main.py` contains zero week-specific strings
- [ ] Startup with a bad `.env` fails before the port is bound
- [ ] Registering a new week is a one-line diff in `mounts.py`
