# TECH-STACK-DECISIONS.md — HolidayLandmarks

Architecture Decision Record (ADR) for the HolidayLandmarks agentic trip assistant.
Format: each decision has **Context → Decision → Rationale → Alternatives → Consequences**.

> Scope source of truth: [doc/feature.md](doc/feature.md). Working rules: [CLAUDE.md](CLAUDE.md).
> Reference methodology: [Master Prompt for AI Agentic Developers](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf) (Week 4).
> Status legend: ✅ Accepted · 🔶 Proposed · ⏸ Deferred.

---

## ADR-001 — Backend framework: FastAPI (Python) ✅
- **Context:** Need async I/O, first-class validation, easy SSE streaming, strong typing.
- **Decision:** FastAPI on Python 3.11+ with Uvicorn (ASGI).
- **Rationale:** Native async, Pydantic-integrated request/response validation, built-in OpenAPI, `StreamingResponse` for SSE. Matches the master-prompt's FastAPI track.
- **Alternatives:** Flask (sync, weaker validation), Django (heavy), Node/Express (JS, but we want Python for the LLM/agent layer).
- **Consequences:** Async discipline required throughout; use `httpx.AsyncClient` for external calls.

## ADR-002 — Frontend: React (JavaScript) + Vite ✅
- **Context:** Interactive UI that renders structured itineraries and consumes a live token/tool stream.
- **Decision:** React with plain JavaScript, bundled by Vite.
- **Rationale:** Component model fits itinerary cards/timeline; Vite = fast dev + simple SSE consumption via `EventSource`/`fetch`. JS (not TS) per project brief.
- **Alternatives:** Next.js (SSR unnecessary here), plain vanilla JS (poor for streaming state), TypeScript (deferred to keep the brief's JS scope).
- **Consequences:** Type safety lives on the backend (Pydantic); frontend validates the `itinerary` event shape defensively.

## ADR-003 — Validation everywhere: Pydantic v2 ✅
- **Context:** Agentic output must be structured and safe; LLMs can produce malformed data.
- **Decision:** Pydantic v2 models at every boundary — request, tool input, tool output, LLM output.
- **Rationale:** One validation system; strict schemas; one repair retry on invalid LLM output then typed failure (feature.md F2).
- **Consequences:** `schemas/` package is the contract hub; changes there ripple to tests and frontend render code.

## ADR-004 — Agent pattern: bounded tool-calling loop (no heavy framework yet) 🔶
- **Context:** Need plan→act→observe with real tools, but must stay debuggable and cheap.
- **Decision:** Hand-rolled bounded agent loop with an explicit tool-dispatch table. Hard `max_iterations`, per-tool timeout, total wall-clock budget.
- **Rationale:** The master prompt favors "plain-Python safe tool-calling" before reaching for LangGraph. Full control over caps, tracing, and failure handling; easier to test.
- **Alternatives:** LangGraph/LangChain (more magic, harder to bound/observe early), fully autonomous multi-agent (unjustified for this scope — see feature.md §3.4).
- **Consequences:** We own retry/timeout/cap logic explicitly. Revisit LangGraph only if resumable/checkpointed workflows become a requirement.

## ADR-005 — Streaming: Server-Sent Events (SSE) ✅
- **Context:** Stream tokens + tool-call events to the UI (feature.md F6).
- **Decision:** SSE via FastAPI `StreamingResponse`; typed events (`token`, `tool_call`, `tool_result`, `itinerary`, `error`, `done`).
- **Rationale:** One-directional server→client fits streaming responses; simpler than WebSockets; native `EventSource` on the frontend; proxy-friendly.
- **Alternatives:** WebSockets (bidirectional overkill), polling (poor UX), gRPC-web (heavy).
- **Consequences:** Final structured `itinerary` event replaces streamed text in the UI; frontend implements an event state machine.

## ADR-006 — LLM provider: Anthropic Claude 🔶
- **Context:** Need strong tool-use, structured output, and streaming.
- **Decision:** Anthropic Claude via the official SDK. **Default model:** `claude-sonnet-5` for planning/tool-use (balance of quality/cost); **escalation:** `claude-opus-4-8` for hard multi-step planning; **fallback:** `claude-haiku-4-5-20251001` for cheap/simple turns and cost control.
- **Rationale:** Native tool-use + streaming + strong instruction-following for structured output. Model tiering gives a cost/quality lever per request.
- **Alternatives:** Other providers — deferred; keep an `llm/` abstraction so the provider is swappable.
- **Consequences:** Keep an LLM client abstraction (no provider details leaking into `agent/`). Verify current model IDs/pricing against the provider before shipping (do not hardcode assumptions in business logic).

## ADR-007 — External data tools: weather + geocoding 🔶
- **Context:** Weather and geocoding/distance tools (feature.md F4, F5).
- **Decision:** Real HTTP APIs behind a tool interface, each with timeout (~5s), exponential-backoff retry, and a circuit breaker; a **mock adapter** for local dev/tests. Specific vendors TBD.
- **Rationale:** Tool interface isolates vendor choice; mocks keep tests deterministic and offline.
- **Consequences:** Vendor selection is a later decision; allow-list external hosts (SSRF/injection defense).

## ADR-008 — Landmark data: curated seed dataset ✅
- **Context:** Reliable landmark knowledge with citations + confidence (feature.md F3, F10).
- **Decision:** Curated JSON/DB seed dataset shipped in `backend/app/data/`, each record carrying `source` + `confidence`.
- **Rationale:** Deterministic, citable, offline-safe; avoids hallucinated landmarks. Can grow into RAG later (master-prompt Week 5/6).
- **Consequences:** Coverage limited to curated cities initially; expansion is a data task, not a code change.

## ADR-009 — Persistence: PostgreSQL from day one ✅ (supersedes the staged SQLite plan)
- **Context:** Save/share itineraries (feature.md F12); future accounts (F15). The original plan
  was SQLite for MVP → Postgres later.
- **Decision (revised 2026-08-07):** Use local **PostgreSQL 16** directly — `localhost:5433`,
  database `holidaylandmark`, reusing the connection already configured for
  `PycharmProjects/fastApiProject`. Access via **SQLAlchemy 2.x ORM (sync)** with `psycopg2-binary`.
- **Rationale:** The developer already runs this Postgres instance, so "zero-ops SQLite" bought
  nothing and the eventual migration cost was real. Sync SQLAlchemy is chosen over async because
  DB access here is short, indexed lookups — the async story matters for *external HTTP* calls
  (`httpx.AsyncClient`, ADR-007/011), not for these queries. FastAPI runs sync dependencies in a
  threadpool, so the event loop is not blocked.
- **Consequences:**
  - `pgvector` is available immediately for the future RAG path.
  - The `holidaylandmark` database already contains an unrelated CMS schema, so our tables carry an
    `agent_` prefix (`agent_landmarks`) to avoid collisions.
  - Schema is created with `Base.metadata.create_all` for now; **add Alembic before the first
    schema change that must survive existing data.**
  - If a workload ever justifies async DB I/O, the migration path is `asyncpg` + `AsyncSession`.

## ADR-010 — Observability & cost: correlation IDs + token/cost tracking ✅
- **Context:** Agentic systems need tracing and cost control (feature.md §6, F11).
- **Decision:** Structured JSON logging with a correlation ID propagated request → agent → tool → LLM; per-request token & cost accounting; PII redaction.
- **Rationale:** Debuggability and budget safety are core to "production-ready AI engineering" in the master prompt.
- **Consequences:** All logging goes through a `core/` helper; no ad-hoc `print`/`console.log` in shipped code.

## ADR-011 — Reliability: timeouts, retries, circuit breaker, idempotency ✅
- **Context:** External calls fail; agents can retry and blow budgets.
- **Decision:** Every external call gets a timeout + exponential-backoff retry; circuit breaker on weather/geocode; idempotency key on `POST /api/trip/plan`.
- **Rationale:** Matches the master-prompt production checklist; prevents cascades and duplicate work.
- **Consequences:** A shared resilience utility in `core/` used by all tools.

## ADR-012 — Security & prompt-injection defense ✅
- **Context:** User text reaches an agent with tool access.
- **Decision:** System-prompt isolation; user text treated as **data, never authority**; explicit tool allow-list + authorization matrix; input normalization; secrets via env only.
- **Rationale:** Prompt injection is the top agentic threat (feature.md §8).
- **Consequences:** Adding a tool requires an authorization-matrix entry, not just wiring.

## ADR-013 — Packaging & deployment: Docker + health/ready ⏸
- **Context:** Production upgrade phase (master-prompt phase 6).
- **Decision (proposed):** Separate API and (future) worker containers; `/health` + `/ready` endpoints; secrets via env/secret manager; CI/CD later.
- **Status:** Deferred until after MVP; documented now so structure anticipates it.

---

## Decision Index

| ADR | Topic | Status |
|---|---|---|
| 001 | FastAPI backend | ✅ |
| 002 | React (JS) + Vite frontend | ✅ |
| 003 | Pydantic v2 validation | ✅ |
| 004 | Bounded hand-rolled agent loop | 🔶 |
| 005 | SSE streaming | ✅ |
| 006 | Anthropic Claude LLM + tiering | 🔶 |
| 007 | Weather + geocode tools | 🔶 |
| 008 | Curated landmark dataset | ✅ |
| 009 | PostgreSQL from day one (was SQLite → Postgres) | ✅ |
| 010 | Correlation IDs + cost tracking | ✅ |
| 011 | Timeouts/retries/circuit breaker | ✅ |
| 012 | Security + prompt-injection defense | ✅ |
| 013 | Docker + health/ready | ⏸ |

> Update this file whenever a decision changes. Proposed (🔶) items must be resolved to ✅/⏸ before the feature that depends on them ships.
