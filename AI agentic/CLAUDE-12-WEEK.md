# CLAUDE-12-WEEK.md — AI Agentic Developer Monorepo

Architecture + folder structure for delivering **all 12 weeks** of
[The Ultimate Reusable Master Prompt to Become an AI Agentic Developer](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
inside **one repository**.

> **Status:** Proposal. The repo today is Week-4 only (`backend/` + `frontend/`, HolidayLandmarks).
> This document describes the target layout and the migration path. It does **not** replace
> [CLAUDE.md](CLAUDE.md) until promoted — see §10.

---

## 1. The Core Idea

The 12 weeks are **cumulative, not parallel**. Week 6 needs Week 5's vector store. Week 8 needs
Week 7's tools. Week 12 needs all of it. So the repo must NOT be 12 sibling projects that
copy-paste each other.

**One shared kernel, twelve thin apps.**

```
Each week ADDS a capability to the shared kernel (aiplat/).
Each week's "project" is a THIN app that composes kernel capabilities.
An app folder holds only what is unique to that week.
```

| Anti-pattern | Why it fails here |
|---|---|
| 12 standalone projects | Week 12 becomes a rewrite; retry/timeout/logging code duplicated 12× |
| One flat `backend/` with everything | No boundaries; Week 10's multi-agent code tangles with Week 2's endpoints |
| 12 microservices | Distributed tracing + 12 deployments for a solo learning repo. See [ADR-014](#adr-014) |
| **Kernel + thin apps** ✅ | Each week is additive, testable alone, and Week 12 is composition not construction |

This matches the blog's own principles: *schema-first*, *determinism first*, *aggressive
simplification*, *replace unnecessary agents with deterministic code*.

---

## 2. Runtime Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│  frontend/  React + Vite (JS)                                    │
│  one SPA · route per week · shared useSSEStream hook             │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTP + SSE
┌───────────────────────────▼──────────────────────────────────────┐
│  services/api/            FastAPI (single ASGI process)          │
│  · CORS, correlation-ID middleware, auth, rate limit             │
│  · mounts each week's router:  /api/w04/…  /api/w07/…            │
│  · NO business logic — delegates to apps/ → aiplat/              │
└───────────────────────────┬──────────────────────────────────────┘
                            │ in-process calls (today)
                            │ HTTP/queue (after a seam splits)
┌───────────────────────────▼──────────────────────────────────────┐
│  apps/wNN-*/              Week deliverables (THIN)               │
│  schemas · prompts · router · week-specific glue · tests         │
└───────────────────────────┬──────────────────────────────────────┘
                            │ imports (one direction only)
┌───────────────────────────▼──────────────────────────────────────┐
│  platform/src/aiplat/     THE SHARED KERNEL                      │
│  obs · llm · prompts · tools · retrieval · agent · graph · mcp   │
│  orchestration · evals · security · resilience                   │
└──────┬──────────────┬──────────────┬───────────────┬─────────────┘
       │              │              │               │
   ┌───▼───┐   ┌──────▼──────┐  ┌────▼────┐   ┌──────▼──────┐
   │ Claude│   │ PostgreSQL  │  │  Redis  │   │ External    │
   │  API  │   │ + pgvector  │  │ cache/  │   │ HTTP tools  │
   │       │   │  :5433      │  │ runstate│   │ weather/geo │
   └───────┘   └─────────────┘  └─────────┘   └─────────────┘
```

**Dependency rule (enforced, non-negotiable):**

```
services/  →  apps/  →  aiplat/  →  (stdlib, third-party)

aiplat/ NEVER imports apps/ or services/.
apps/wNN NEVER imports apps/wMM.  (need shared code? it belongs in aiplat/)
aiplat submodules talk through ports/, not to each other's internals.
```

That single rule is what keeps this extractable into microservices later at near-zero cost.

---

## 3. Folder Structure (target)

```
AI agentic/
├── CLAUDE.md                     # working rules (root instructions for agents)
├── CLAUDE-12-WEEK.md             # this file — architecture + week map
├── TECH-STACK-DECISIONS.md       # ADR log
├── RUN.md                        # how to run everything
├── pyproject.toml                # workspace root; one venv for the monorepo
├── .env.example
│
├── doc/
│   ├── feature.md                # HolidayLandmarks scope (Week 4)
│   ├── curriculum.md             # week-by-week goals + acceptance criteria
│   └── adr/                      # long-form ADRs if the log outgrows one file
│
├── platform/                     # ── THE SHARED KERNEL ──────────────────
│   ├── pyproject.toml            # installable:  pip install -e ./platform
│   └── src/aiplat/               # package name is `aiplat`, NOT `platform`
│       │                         #   (`platform` shadows a Python stdlib module)
│       ├── config/
│       │   ├── settings.py       # pydantic-settings; env-driven, typed
│       │   └── models.py         # model-tier registry (default/escalate/fallback)
│       │
│       ├── obs/                  # W11 capability, wired from W2 onward
│       │   ├── correlation.py    # contextvar; request → agent → tool → LLM
│       │   ├── logging.py        # structured JSON; the ONLY log entrypoint
│       │   ├── cost.py           # tokens + $ per request, per model
│       │   ├── trace.py          # span helpers (OTel-shaped, no collector yet)
│       │   └── redact.py         # PII / secret / retrieved-doc redaction
│       │
│       ├── resilience/
│       │   ├── timeout.py        # per-call budget
│       │   ├── retry.py          # exponential backoff + jitter
│       │   ├── breaker.py        # circuit breaker per external host
│       │   └── idempotency.py    # key store (Redis) for POST replay safety
│       │
│       ├── llm/                  # W1–W2
│       │   ├── ports.py          # LLMPort protocol — the seam
│       │   ├── anthropic_client.py
│       │   ├── streaming.py      # token stream → typed SSE events
│       │   ├── tiering.py        # route turn → default/escalate/fallback model
│       │   ├── caching.py        # prompt caching for system prompt + tool defs
│       │   └── tokens.py         # counting, context-window guards
│       │
│       ├── prompts/              # W3 — prompts as versioned software
│       │   ├── registry.py       # load by (name, version); immutable once shipped
│       │   ├── render.py         # template render + variable validation
│       │   └── templates/
│       │       └── <name>/v1.md, v2.md …
│       │
│       ├── schemas/              # W4 — shared Pydantic contracts
│       │   ├── events.py         # SSE event union: token|tool_call|tool_result|
│       │   │                     #   itinerary|error|done
│       │   ├── errors.py         # typed, user-safe error envelope
│       │   └── common.py         # Money, GeoPoint, DateRange, Citation, Confidence
│       │
│       ├── tools/                # W4 → W7 → W9
│       │   ├── ports.py          # ToolPort: name, input_schema, output_schema, run()
│       │   ├── registry.py       # allow-list + AUTHORIZATION MATRIX (single source)
│       │   ├── executor.py       # validate → authorize → timeout → retry → validate
│       │   ├── parallel.py       # asyncio.gather fan-out for multi-tool turns
│       │   └── impl/
│       │       ├── weather.py  geocode.py  landmarks.py  http_get.py …
│       │       └── mock/         # deterministic offline doubles for tests
│       │
│       ├── retrieval/            # W5 → W6
│       │   ├── embeddings.py     # embed + batch + cache
│       │   ├── store_pgvector.py # upsert / ANN query / index mgmt
│       │   ├── chunking.py
│       │   ├── rerank.py         # W6
│       │   └── citations.py      # W6 — source + confidence on every claim
│       │
│       ├── agent/                # W7 — the bounded loop
│       │   ├── ports.py          # what the loop is allowed to know about
│       │   ├── loop.py           # plan → act → observe; max_iterations, wall clock
│       │   ├── state.py          # run state → Redis/Postgres, NEVER in-process
│       │   ├── guards.py         # duplicate-action detect, budget kill-switch
│       │   └── approval.py       # human-in-the-loop interrupt gate
│       │
│       ├── graph/                # W8 — LangGraph, only where it earns its place
│       │   ├── builder.py        # StateGraph construction helpers
│       │   ├── checkpointer.py   # Postgres-backed checkpoints (resume after crash)
│       │   └── interrupts.py     # human interrupt nodes
│       │
│       ├── mcp/                  # W9
│       │   ├── server.py         # expose aiplat.tools over MCP
│       │   ├── client.py         # consume third-party MCP servers
│       │   └── bounds.py         # scope/permission wrapper — no arbitrary SQL/shell
│       │
│       ├── orchestration/        # W10 — multi-agent, aggressively simplified
│       │   ├── supervisor.py     # supervisor → worker
│       │   ├── router.py         # classify → dispatch to one specialist
│       │   └── README.md         # ⚠ justify every agent; deterministic code wins
│       │
│       ├── evals/                # W11
│       │   ├── harness.py        # run suite → scores → regression diff
│       │   ├── scorers/          # exact, schema-valid, LLM-judge, citation-check
│       │   └── datasets/         # ≥50 cases/service, versioned with prompts
│       │
│       ├── security/             # W11
│       │   ├── injection.py      # user text = DATA, never authority
│       │   ├── authz.py          # tool authorization matrix enforcement
│       │   ├── egress.py         # outbound host allow-list (SSRF defense)
│       │   └── limits.py         # rate limit, per-user cost cap
│       │
│       └── db/
│           ├── session.py        # SQLAlchemy 2.x engine + session factory
│           ├── base.py
│           └── models/           # ORM tables, `agent_` prefixed
│
├── services/                     # ── DEPLOYABLE PROCESSES ───────────────
│   ├── api/
│   │   ├── main.py               # FastAPI app; CORS; middleware; mounts routers
│   │   ├── middleware/           # correlation-id, cost, rate-limit, error-envelope
│   │   ├── mounts.py             # WEEK_ROUTERS = {...} → /api/wNN/*
│   │   └── Dockerfile
│   ├── agent-runner/             # from W7 — long agent runs off the request path
│   │   ├── worker.py             # consumes queue; writes run state; publishes events
│   │   └── Dockerfile
│   └── mcp-server/               # from W9 — standalone MCP process
│       └── main.py
│
├── apps/                         # ── WEEK DELIVERABLES (THIN) ───────────
│   ├── w01_llm_lab/              # tokenization, context, temperature, embeddings
│   │   ├── notebooks/  experiments/  README.md
│   │   └── (no router — it's a lab)
│   │
│   ├── w02_ai_service/           # /summarize /classify /extract /chat
│   │   ├── router.py  schemas.py  prompts/  service.py  tests/  README.md
│   │
│   ├── w03_prompt_lab/           # prompt versioning + regression detection
│   │   ├── router.py  suites/  README.md
│   │
│   ├── w04_holidaylandmarks/     # ⭐ CURRENT PROJECT MOVES HERE
│   │   ├── router.py             # POST /plan (SSE), GET /itinerary/{id}
│   │   ├── schemas.py            # Itinerary, Day, Stop, TripRequest
│   │   ├── planner.py            # composes aiplat.agent + aiplat.tools
│   │   ├── prompts/  data/       # curated landmark seed dataset
│   │   ├── tests/                # unit · contract · agent-loop · failure-injection
│   │   └── README.md             # ← acceptance criteria (from doc/feature.md F1–F15)
│   │
│   ├── w05_vector_search/        # pgvector semantic search over docs
│   ├── w06_rag_pipeline/         # retrieve → rerank → answer + citations
│   ├── w07_tool_agent/           # plain-Python bounded tool agent
│   ├── w08_graph_workflows/      # LangGraph, checkpoints, human interrupt
│   ├── w09_mcp_tools/            # MCP server with bounded tools
│   ├── w10_multi_agent/          # supervisor-worker / router
│   ├── w11_eval_guardrails/      # eval suite + security + observability dashboard
│   └── w12_ai_ops_assistant/     # 🏁 CAPSTONE — pure composition, ~no new kernel code
│       ├── router.py  workflows/  approvals/  README.md
│
├── frontend/                     # ONE React app
│   ├── src/
│   │   ├── api/client.js         # fetch wrapper + correlation-id passthrough
│   │   ├── hooks/
│   │   │   ├── useSSEStream.js   # shared event state machine (all weeks)
│   │   │   └── useBackendStatus.js
│   │   ├── components/           # shared: StreamLog, ErrorPanel, CostBadge
│   │   ├── weeks/
│   │   │   ├── w02/  w03/  w04/ … w12/     # one folder per week's UI
│   │   │   └── registry.js       # week → {route, title, component}
│   │   ├── App.jsx               # nav built from registry.js
│   │   └── main.jsx
│   └── package.json
│
├── infra/
│   ├── docker-compose.yml        # postgres:5433 (pgvector) + redis + api + frontend
│   ├── alembic/                  # migrations — add BEFORE the first destructive change
│   └── ci/                       # GitHub Actions: lint, test, eval-regression gate
│
└── tests/
    ├── contract/                 # cross-week API contract tests
    ├── integration/              # real DB + mock LLM + mock tools
    └── conftest.py               # shared fixtures: mock LLM, frozen clock, test DB
```

---

## 4. Week → Kernel → App Map

Read this as: *"Week N contributes X to the kernel, and ships app Y."*

| Wk | Topic | Adds to `aiplat/` | App folder | New deployable |
|----|-------|-------------------|------------|----------------|
| 1 | LLM foundations | `llm/tokens.py`, `llm/ports.py` | `w01_llm_lab` | — |
| 2 | FastAPI AI service | `llm/anthropic_client.py`, `obs/*`, `resilience/*` | `w02_ai_service` | `services/api` |
| 3 | Prompts as software | `prompts/` (registry, versions) | `w03_prompt_lab` | — |
| 4 | **Structured output + tools** | `schemas/`, `tools/`, `llm/streaming.py` | `w04_holidaylandmarks` | — |
| 5 | pgvector search | `retrieval/embeddings.py`, `store_pgvector.py` | `w05_vector_search` | pgvector ext |
| 6 | Full RAG | `retrieval/rerank.py`, `citations.py` | `w06_rag_pipeline` | — |
| 7 | Tool-using agent | `agent/loop.py`, `state.py`, `guards.py` | `w07_tool_agent` | `agent-runner` |
| 8 | LangGraph | `graph/` (+ Postgres checkpointer) | `w08_graph_workflows` | — |
| 9 | MCP | `mcp/server.py`, `client.py`, `bounds.py` | `w09_mcp_tools` | `mcp-server` |
| 10 | Multi-agent | `orchestration/` | `w10_multi_agent` | — |
| 11 | Evals + security + obs | `evals/`, `security/` | `w11_eval_guardrails` | CI eval gate |
| 12 | 🏁 AI Ops Assistant | *nothing new* — composition only | `w12_ai_ops_assistant` | — |

**Week 12 adding no kernel code is the success criterion for this architecture.** If the capstone
needs new `aiplat/` modules, a boundary was drawn wrong somewhere in Weeks 1–11.

---

## 5. What Goes Where — the judgment call

When writing any line of code, ask: *"Would another week need this?"*

| Signal | Goes in |
|---|---|
| Retry, timeout, logging, cost, auth, redaction | `aiplat/` — always, no exceptions |
| A tool any agent could call (weather, search, HTTP GET) | `aiplat/tools/impl/` |
| A Pydantic type crossing a module boundary | `aiplat/schemas/` |
| Domain vocabulary of one week (`Itinerary`, `Stop`) | `apps/wNN/schemas.py` |
| A prompt template | `aiplat/prompts/templates/` (versioned) |
| Wiring: "call these 3 kernel pieces in this order" | `apps/wNN/service.py` |
| HTTP shape, status codes, SSE endpoint | `apps/wNN/router.py` |

**Second-use rule:** the first week to need something writes it in `apps/`. The **second** week to
need it promotes it to `aiplat/` in the same PR. Do not speculatively generalize on first use.

---

## 6. Shared Kernel Contracts

These four contracts are the spine. Every week honors them.

### 6.1 SSE event union (`aiplat/schemas/events.py`)
Every streaming endpoint in every week emits the same envelope — so `useSSEStream.js` is written once:
```
token | tool_call | tool_result | data | error | done
```
`data` carries the week-specific validated payload (`Itinerary` in W4, `Answer` in W6, `Plan` in W12).

### 6.2 Typed error envelope (`aiplat/schemas/errors.py`)
`{code, message, correlation_id, retryable}`. Never a stack trace, never a raw provider error.
A failed stream emits `error` then `done` — it does not drop the connection.

### 6.3 Tool port (`aiplat/tools/ports.py`)
```
name · description · input_schema · output_schema · timeout_s · authz_scope · async run()
```
Adding a tool requires an **authorization-matrix entry**, not just registry wiring.

### 6.4 Correlation ID (`aiplat/obs/correlation.py`)
A `contextvar` set by middleware, read by every log line, LLM call, tool call, and DB query.
One ID answers "what did this request actually do, and what did it cost?"

---

## 7. Performance Rules (apply from Week 2)

The budget is roughly **LLM 85% / tools 10% / your code 5%**. Optimize accordingly.

1. **Cache tool results in Redis.** Weather-per-city-day, geocode-per-place. Highest ROI in the repo.
2. **Parallel tool calls.** `aiplat/tools/parallel.py` — 3 serial 500ms calls become one 500ms turn.
   Write the loop for this on day one; retrofitting is painful.
3. **Prompt caching** on system prompt + tool definitions (`aiplat/llm/caching.py`). They're stable
   across turns; caching cuts multi-turn latency and cost substantially.
4. **Model tiering** (`aiplat/llm/tiering.py`). Cheap turns → Haiku. Verify live model IDs against
   the Anthropic API before shipping; never hardcode from a doc.
5. **Never hold a DB session across an `await` on the LLM.** Sync SQLAlchemy runs in FastAPI's
   threadpool (~40 threads). A session held across a 4s model call caps you at ~40 concurrent runs
   regardless of hardware. Read → close → then call the model.
6. **Run state in Redis, never a Python dict.** Otherwise: no horizontal scale, no restart without
   dropping streams, no seam extraction, and reconnecting `EventSource` hits the wrong worker.

Not your bottleneck, skip: gRPC between modules, connection-pool micro-tuning, leaving Python.

---

## 8. Scaling Path — when a seam splits <a id="adr-014"></a>

This stays **one process** until a trigger fires. Then extraction is a config change, because the
dependency rule in §2 was enforced from day one.

| Module | Split trigger | Becomes |
|---|---|---|
| `services/api` | never | API gateway / BFF |
| `aiplat/agent` | runs exceed ~30s, or need crash-resume | **`agent-runner`** ← split this first |
| `aiplat/tools` | rate limits, >8 tools, or another app wants them | **`mcp-server`** (W9 gives it for free) |
| `aiplat/retrieval` | reindexing competes with query latency | retrieval service |
| `aiplat/llm` | never — it's a client library | stays a package |
| `aiplat/db` | only *after* the above split | per-service schemas |

Record each split as an ADR in [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md) when it happens.

---

## 9. Commands

```powershell
# one-time
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .\platform            # installs the aiplat kernel, editable
pip install -r requirements-dev.txt
copy .env.example .env

# run the whole API (all mounted weeks)
uvicorn services.api.main:app --reload      # http://localhost:8000/docs

# frontend (all weeks, one SPA)
cd frontend; npm install; npm run dev       # http://localhost:5173

# tests
pytest platform                             # kernel
pytest apps/w04_holidaylandmarks            # one week
pytest                                      # everything

# evals (W11 onward — also the CI regression gate)
python -m aiplat.evals.harness --suite apps/w04_holidaylandmarks

# database (PostgreSQL 16, port 5433, db holidaylandmark)
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -d holidaylandmark
```

---

## 10. Migration From Today's Repo

The repo is currently `backend/` + `frontend/` (Week 4 only). Six steps, do them in order:

1. **Create `platform/src/aiplat/` and install it** (`pip install -e ./platform`). Empty packages
   with `__init__.py` are fine — the import path must work first.
2. **Move `backend/app/core/` → `aiplat/config/` + `aiplat/obs/` + `aiplat/resilience/`.**
   Split by responsibility while it's small; `core/` is a name that rots.
3. **Move `backend/app/db/` and `backend/app/models/` → `aiplat/db/`.** Keep the `agent_` table
   prefix ([ADR-009](TECH-STACK-DECISIONS.md)).
4. **Move `backend/app/main.py` → `services/api/main.py`**; convert `routes/api.py` into
   `services/api/mounts.py` mounting `/api/w04/*`. Keep `/api/health` and `/api/health/db`
   un-prefixed.
5. **Move the rest of `backend/app/` → `apps/w04_holidaylandmarks/`.** Delete `backend/`.
6. **Reshape `frontend/src/`** into `weeks/w04/` + `hooks/useSSEStream.js` + `weeks/registry.js`.

Then write the Week 4 kernel pieces that don't exist yet — `aiplat/llm/`, `aiplat/tools/`,
`aiplat/agent/`, `aiplat/schemas/` — per [doc/feature.md](doc/feature.md) F1–F15.

**Do steps 1–6 as one commit.** A half-migrated tree with two import roots is worse than either end
state.

---

## 11. Definition of Done — per week

- [ ] Acceptance criteria in `apps/wNN/README.md` are met and checked off
- [ ] Pydantic validation on **every** boundary the week touches
- [ ] Kernel additions live in `aiplat/`; the app folder is thin (wiring + week vocabulary only)
- [ ] Dependency rule holds: `aiplat/` imports nothing from `apps/` or `services/`
- [ ] External calls: timeout + backoff retry + breaker; agent paths respect `max_iterations`
- [ ] Typed error envelope; stream emits `error` then `done` — never a raw traceback
- [ ] Tests: unit + contract + failure-injection; mock LLM and mock tools, offline-deterministic
- [ ] Correlation ID present in every log line; tokens + cost recorded per request
- [ ] Prompts versioned in `aiplat/prompts/templates/<name>/vN.md`; eval suite green (W11+)
- [ ] ADR added or updated if an architectural decision changed

---

## 12. Non-Goals

Real bookings/payments, live flight/hotel inventory, native mobile, Kubernetes, and any
microservice split before its §8 trigger fires. Multi-agent orchestration is a **Week 10**
capability — not an excuse to use agents where deterministic code is correct.

---

## 13. Reference

- Methodology: [Master Prompt for AI Agentic Developers](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
- Week-4 scope: [doc/feature.md](doc/feature.md)
- Decisions: [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md)
- Working rules: [CLAUDE.md](CLAUDE.md)
- Run instructions: [RUN.md](RUN.md)
