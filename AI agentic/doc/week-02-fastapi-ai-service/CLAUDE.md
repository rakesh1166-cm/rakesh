# Week 2 — FastAPI AI Microservice

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

The first deployable process and the first UI. Four endpoints — `/summarize` `/classify`
`/extract` `/chat` — behind a request path that already carries a **correlation ID**, a **typed
error envelope**, and **timeout/retry/breaker** on every external call.

Those three cross-cutting concerns are the whole point. Endpoints are the excuse to build them.

## Features (6)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F2.1](F2.1-api-skeleton-and-week-mounts/CLAUDE.md) | API skeleton, health/ready, `mounts.py` | `services/api/` | W1-F1.1 |
| [F2.2](F2.2-correlation-id-and-structured-logging/CLAUDE.md) | Correlation ID + structured JSON logging + cost | `aiplat/obs/` | F2.1 |
| [F2.3](F2.3-typed-error-envelope/CLAUDE.md) | Typed error envelope + exception handlers | `aiplat/schemas/errors.py` | F2.2 |
| [F2.4](F2.4-resilience-timeout-retry-breaker/CLAUDE.md) | Timeout, backoff retry, circuit breaker | `aiplat/resilience/` | F2.3 |
| [F2.5](F2.5-four-nlp-endpoints/CLAUDE.md) | `/summarize` `/classify` `/extract` `/chat` | `apps/w02_ai_service/` | F2.1–F2.4 |
| [F2.6](F2.6-frontend-shell-and-week-registry/CLAUDE.md) | SPA shell, `registry.js`, `client.js`, `ErrorPanel` | `frontend/src/` | F2.3, F2.5 |

## Architecture flow

```
weeks/w02/AiServicePanel.jsx  ── api/client.js (generates X-Correlation-ID)
      ▼
services/api/main.py
  ├─ middleware/correlation.py  → contextvar, echoed in the response header
  ├─ middleware/errors.py       → typed envelope, never a traceback
  └─ mounts.py                  → /api/w02/*
      ▼
apps/w02_ai_service/router.py   (HTTP shape only — no business logic)
      ▼
apps/w02_ai_service/service.py  (wiring only)
      ▼
aiplat.resilience.retry( aiplat.llm.complete )  ──► Claude API
      ▼
aiplat.obs.cost  → tokens + $ per request, tagged with the correlation ID
      ▼
{data | error envelope}  →  components/ErrorPanel.jsx
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── obs/{correlation.py, logging.py, cost.py}          ← NEW
│   ├── resilience/{timeout.py, retry.py, breaker.py}      ← NEW
│   └── llm/anthropic_client.py                            ← EDIT wrap + emit cost
├── services/api/{main.py, middleware/, mounts.py}         ← NEW
└── apps/w02_ai_service/{router,schemas,service}.py tests/ ← NEW
```

**Frontend** — *the SPA is created this week*
```
frontend/{index.html, vite.config.js, package.json, .env.example}   ← NEW
frontend/src/
├── main.jsx · App.jsx                     ← NEW  nav built FROM registry.js
├── api/client.js                          ← NEW  the ONE fetch wrapper
├── weeks/registry.js                      ← NEW  mirror of services/api/mounts.py
├── weeks/w02/{AiServicePanel.jsx, index.js}  ← NEW
├── components/ErrorPanel.jsx              ← NEW  renders the typed envelope
└── hooks/useBackendStatus.js              ← NEW
```

## Build order

1. **F2.1** skeleton — you need something to attach middleware to.
2. **F2.2** correlation + logging — before endpoints, so no endpoint is ever written unlogged.
3. **F2.3** error envelope — before endpoints, so no endpoint ever returns an untyped error.
4. **F2.4** resilience — before the first real external call.
5. **F2.5** endpoints — now trivial, because everything they need already exists.
6. **F2.6** frontend shell — last, consuming the contracts from F2.3 and F2.5.

Steps 2–4 before step 5 is the whole discipline of this week. Endpoints first means retrofitting
observability into four handlers instead of building it once.

## Week Definition of Done

- [ ] Every log line carries a correlation ID; no `print()` anywhere in shipped code
- [ ] Every error response matches the envelope schema; a forced provider 500 leaks no traceback
- [ ] Every external call has a timeout; none can hang the event loop
- [ ] Tokens and cost recorded per request and attributable to a correlation ID
- [ ] `mounts.py` and `registry.js` both list exactly `w02`
- [ ] `App.jsx` contains no hardcoded week — adding a week touches `registry.js` only
- [ ] A CI import check enforces both dependency rules ([architecture §2](../../CLAUDE-12-WEEK.md))

## What this week unlocks

Every later week inherits the request path for free. Week 11's `TraceView` is only possible because
the correlation ID was threaded here, and Week 4's SSE error path reuses the F2.3 envelope verbatim.
