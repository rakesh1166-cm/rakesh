# CLAUDE-12-WEEK.md — AI Agentic Developer Monorepo

Architecture + **week-by-week folder structure** for delivering all 12 weeks of
[The Ultimate Reusable Master Prompt to Become an AI Agentic Developer](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
inside **one repository**.

> **Status:** Proposal. The repo today is Week-4 only (`backend/` + `frontend/`, HolidayLandmarks).
> §16 is the migration path. This does **not** replace [CLAUDE.md](CLAUDE.md) until promoted.
>
> **How to read this file:** §1–§3 are the invariants. **§4 is the main body** — twelve sections,
> one per week, each showing the *architecture flow at that point* and the *exact folder delta*.
> §5 is the final tree. Everything after is reference.

---

## 1. The Core Idea

The 12 weeks are **cumulative, not parallel**. Week 6 needs Week 5's vector store. Week 8 needs
Week 7's tools. Week 12 needs all of it.

**One shared kernel, twelve thin apps.**

```
Each week ADDS a capability to the shared kernel  →  platform/src/aiplat/
Each week's "project" is a THIN app that composes kernel capabilities  →  apps/wNN_*/
An app folder holds only what is unique to that week.
```

| Approach | Verdict |
|---|---|
| 12 standalone projects | ✗ Week 12 becomes a rewrite; retry/timeout/logging duplicated 12× |
| One flat `backend/` | ✗ No boundaries; Week 10's multi-agent code tangles with Week 2's endpoints |
| 12 microservices | ✗ Distributed tracing + 12 deploys for a solo repo — see §14 |
| **Kernel + thin apps** | ✅ Additive, independently testable, Week 12 is composition not construction |

This mirrors the blog's own principles: *schema-first*, *determinism first*, *aggressive
simplification*, *replace unnecessary agents with deterministic code*.

---

## 2. The Dependency Rule (non-negotiable)

```
services/  →  apps/  →  aiplat/  →  (stdlib, third-party)

aiplat/  NEVER imports apps/ or services/
apps/wNN NEVER imports apps/wMM      (need shared code? it belongs in aiplat/)
aiplat submodules talk through ports.py, not each other's internals
```

One rule. It is what makes §14's microservice extraction a config change instead of a rewrite.
Enforce it in CI from Week 2 (`import-linter` or a 20-line AST test).

**Note on the blog's Laravel tier:** the blog puts Laravel in front (auth, users, queues) and
FastAPI behind it. This repo has no PHP tier, so Laravel's responsibilities fold into
`services/api` (middleware) and `services/agent-runner` (queues). If a Laravel front-end is ever
added, it sits above `services/api` and nothing below changes.

---

## 3. Final Runtime Architecture (where Week 12 lands)

```
┌──────────────────────────────────────────────────────────────────┐
│  frontend/   React + Vite (JS) · one SPA · route per week        │
│              shared useSSEStream hook · CostBadge · ErrorPanel   │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTP + SSE
┌───────────────────────────▼──────────────────────────────────────┐
│  services/api/     FastAPI · CORS · correlation-ID · rate limit  │
│                    mounts each week:  /api/w02/… /api/w12/…      │
└───────────────────────────┬──────────────────────────────────────┘
┌───────────────────────────▼──────────────────────────────────────┐
│  apps/wNN_*/       THIN: schemas · router · wiring · tests        │
└───────────────────────────┬──────────────────────────────────────┘
┌───────────────────────────▼──────────────────────────────────────┐
│  platform/src/aiplat/     THE SHARED KERNEL                      │
│  config obs resilience llm prompts schemas tools retrieval       │
│  agent graph mcp orchestration evals security db                 │
└──┬──────────────┬──────────────┬───────────────┬─────────────────┘
   │              │              │               │
┌──▼───┐  ┌───────▼──────┐  ┌────▼────┐  ┌───────▼───────┐  ┌──────────────┐
│Claude│  │ PostgreSQL   │  │  Redis  │  │ External HTTP │  │ MCP servers  │
│ API  │  │ + pgvector   │  │ cache · │  │ weather/geo   │  │ (W9)         │
│      │  │  :5433       │  │ runstate│  │               │  │              │
└──────┘  └──────────────┘  └─────────┘  └───────────────┘  └──────────────┘
                                              ▲
                        services/agent-runner ┘  (W7 — long runs off the request path)
```

Weeks 1–12 below build this up one layer at a time. **Nothing in the diagram exists on day one.**

---

## 4. Week-by-Week Build-Up

Legend: `← NEW` = created this week · `← EDIT` = existing file changed this week ·
unmarked lines = already there, shown for context.

---

### Week 1 — LLM Foundations

**Goal:** tokenization, context windows, temperature, embeddings, hallucination — measured, not read about.
**Ships:** a lab, not a service. No HTTP yet. Determinism first.

**Architecture flow**
```
python script / notebook
      │
      └─→ aiplat.llm.ports.LLMPort          (the seam — defined BEFORE any client)
            └─→ aiplat.llm.anthropic_client ──→ Claude API
            └─→ aiplat.llm.tokens           (count, context-window guard)
            └─→ aiplat.config.settings      (env-driven, typed)
```

**Folder structure after Week 1**
```
AI agentic/
├── CLAUDE.md
├── CLAUDE-12-WEEK.md
├── pyproject.toml                    ← NEW  workspace root, one venv
├── .env.example                      ← NEW  ANTHROPIC_API_KEY, DATABASE_URL
├── platform/                         ← NEW
│   ├── pyproject.toml                ← NEW  pip install -e ./platform
│   └── src/aiplat/
│       ├── __init__.py               ← NEW
│       ├── config/
│       │   ├── settings.py           ← NEW  pydantic-settings
│       │   └── models.py             ← NEW  model tier registry (default/escalate/fallback)
│       └── llm/
│           ├── ports.py              ← NEW  LLMPort protocol
│           ├── anthropic_client.py   ← NEW  the only place the SDK is imported
│           └── tokens.py             ← NEW  counting + window guards
├── apps/
│   └── w01_llm_lab/                  ← NEW
│       ├── experiments/              ← NEW  temperature sweep, context overflow, hallucination probe
│       ├── embeddings_demo.py        ← NEW
│       └── README.md                 ← NEW  findings + acceptance criteria
└── tests/
    └── conftest.py                   ← NEW  mock LLM fixture, frozen clock
```

**Why this shape:** `ports.py` exists before the client so the seam is real from line one. The
mock-LLM fixture on day one is what keeps all twelve weeks of tests offline and deterministic.

**Done:** token counts match the API's; a deliberate context overflow is caught by `tokens.py`
before the request goes out; every experiment runs against the mock without network.

---

### Week 2 — FastAPI AI Microservice

**Goal:** `POST /summarize · /classify · /extract · /chat`. First deployable process.
**Adds to kernel:** `obs/` (correlation, logging, cost), `resilience/` (timeout, retry, breaker).

**Architecture flow** — the request path exists for the first time
```
Browser
  │ HTTP
  ▼
services/api/main.py
  └─ middleware/correlation.py   sets contextvar  ← every log line downstream carries it
  └─ middleware/errors.py        typed envelope, never a traceback
  └─ mounts.py  →  /api/w02/*
       ▼
apps/w02_ai_service/router.py  (HTTP shape only)
       ▼
apps/w02_ai_service/service.py (wiring only)
       ▼
aiplat.resilience.retry( aiplat.llm.anthropic_client ) ──→ Claude API
       ▼
aiplat.obs.cost  →  tokens + $ recorded per request
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── obs/                          ← NEW  W11 capability, wired from here on
│   │   ├── correlation.py            ← NEW  contextvar; request→agent→tool→LLM
│   │   ├── logging.py                ← NEW  structured JSON — the ONLY log entrypoint
│   │   └── cost.py                   ← NEW  tokens + $ per request, per model
│   ├── resilience/                   ← NEW
│   │   ├── timeout.py                ← NEW
│   │   ├── retry.py                  ← NEW  exponential backoff + jitter
│   │   └── breaker.py                ← NEW  circuit breaker per external host
│   └── llm/anthropic_client.py       ← EDIT wrap calls in timeout+retry, emit cost
├── services/                         ← NEW
│   └── api/                          ← NEW
│       ├── main.py                   ← NEW  FastAPI app, CORS
│       ├── middleware/               ← NEW  correlation · errors · rate-limit
│       └── mounts.py                 ← NEW  WEEK_ROUTERS = {"w02": ...}
├── apps/
│   └── w02_ai_service/               ← NEW
│       ├── router.py  schemas.py  service.py  tests/  README.md   ← NEW
└── frontend/                         ← NEW  Vite + React skeleton
    └── src/{api/client.js, weeks/w02/, weeks/registry.js, App.jsx}  ← NEW
```

**New architectural concepts:** middleware chain · correlation ID · typed error envelope ·
`mounts.py` as the single place a week becomes reachable · `registry.js` as its frontend mirror.

**Done:** all four endpoints validated in and out; a forced 500 from the provider returns a typed
envelope with the correlation ID and no traceback; cost logged per request.

---

### Week 3 — Prompts as Versioned Software

**Goal:** prompt templates with versions, tests, and regression detection. No new runtime layer —
this changes *where prompts live*.

**Architecture flow** — one node inserted before the LLM call
```
apps/wNN/service.py
   └─→ aiplat.prompts.registry.get("summarize", version="v2")   ← NEW node
         └─→ aiplat.prompts.render(template, vars)  ← validates every variable is supplied
               └─→ aiplat.llm.anthropic_client
```

**Folder delta**
```
├── platform/src/aiplat/
│   └── prompts/                      ← NEW
│       ├── registry.py               ← NEW  load by (name, version); immutable once shipped
│       ├── render.py                 ← NEW  render + variable validation
│       └── templates/                ← NEW
│           ├── summarize/v1.md  v2.md
│           ├── classify/v1.md
│           └── extract/v1.md
├── apps/
│   ├── w02_ai_service/service.py     ← EDIT inline strings → registry.get(name, version)
│   └── w03_prompt_lab/               ← NEW
│       ├── router.py                 ← NEW  /api/w03/compare — run v1 vs v2 side by side
│       ├── suites/                   ← NEW  golden cases per prompt
│       └── README.md                 ← NEW
└── tests/regression/                 ← NEW  fails the build when a prompt edit moves scores
```

**Why here:** prompts must be versioned *before* Week 4 ties them to structured output. Editing a
prompt after schemas depend on it, without version history, is how silent regressions ship.

**Done:** every prompt loaded by `(name, version)` — zero inline prompt strings in `apps/`;
editing `v2.md` and re-running the suite produces a scored diff.

---

### Week 4 — Structured Output + Tools + Streaming ⭐ (HolidayLandmarks — current project)

**Goal:** nested Pydantic schemas, tool calling, conversation history, SSE streaming, persistence.
**The biggest single week.** Adds `schemas/`, `tools/`, streaming, Postgres, Redis.

**Architecture flow** — first tool loop, first stream
```
Browser  ──POST /api/w04/plan──►  services/api
                                       ▼
                          apps/w04_holidaylandmarks/router.py  (SSE endpoint)
                                       ▼
                          apps/w04_holidaylandmarks/planner.py
                                       │
        ┌──────────────────────────────┼───────────────────────────────┐
        ▼                              ▼                               ▼
 aiplat.prompts              aiplat.llm.streaming            aiplat.tools.executor
  (versioned)                 token → SSE event                     │
                                       │              validate in → authorize → timeout
                                       │              → run → validate out
                                       │                     │
                                       │              aiplat.tools.impl/{weather,geocode,landmarks}
                                       │                     │         │
                                       │                  Redis      External HTTP
                                       │                  cache       (egress allow-list)
                                       ▼
                          aiplat.schemas.events  →  token | tool_call | tool_result
                                                    | data(Itinerary) | error | done
                                       ▼
                          aiplat.db  →  PostgreSQL  agent_itineraries
                                       ▼
                          frontend/src/hooks/useSSEStream.js  (event state machine)
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── schemas/                      ← NEW  shared contracts
│   │   ├── events.py                 ← NEW  SSE union — written ONCE, used by every later week
│   │   ├── errors.py                 ← NEW  {code, message, correlation_id, retryable}
│   │   └── common.py                 ← NEW  Money, GeoPoint, DateRange, Citation, Confidence
│   ├── tools/                        ← NEW
│   │   ├── ports.py                  ← NEW  name·input_schema·output_schema·timeout·authz_scope
│   │   ├── registry.py               ← NEW  allow-list + AUTHORIZATION MATRIX
│   │   ├── executor.py               ← NEW  validate→authorize→timeout→retry→validate
│   │   └── impl/
│   │       ├── weather.py  geocode.py  landmarks.py     ← NEW
│   │       └── mock/                 ← NEW  deterministic offline doubles
│   ├── llm/
│   │   ├── streaming.py              ← NEW  provider stream → typed SSE events
│   │   ├── caching.py                ← NEW  prompt cache: system prompt + tool defs
│   │   └── tiering.py                ← NEW  route turn → default/escalate/fallback
│   ├── resilience/idempotency.py     ← NEW  Redis key store — POST replay safety
│   ├── security/egress.py            ← NEW  outbound host allow-list (SSRF defense)
│   └── db/                           ← NEW
│       ├── session.py  base.py       ← NEW
│       └── models/landmark.py        ← NEW  `agent_` table prefix
├── apps/w04_holidaylandmarks/        ← NEW  (migrated from backend/ — see §16)
│   ├── router.py  schemas.py         ← NEW  Itinerary · Day · Stop · TripRequest
│   ├── planner.py  prompts/  data/   ← NEW  curated landmark seed dataset
│   ├── tests/                        ← NEW  unit · contract · tool-loop · failure-injection
│   └── README.md                     ← NEW  F1–F15 acceptance criteria
├── frontend/src/hooks/useSSEStream.js ← NEW  written once, reused W6/W7/W8/W10/W12
├── frontend/src/weeks/w04/           ← NEW  ItineraryView, PromptComposer, StreamLog
└── infra/docker-compose.yml          ← NEW  postgres:5433 + redis
```

**New architectural concepts:** the tool port · the authorization matrix (adding a tool requires a
matrix entry, not just wiring) · the SSE event union · prompt caching · idempotency keys ·
persistence. **Tool calling here is a fixed sequence, not an agent** — autonomy waits for Week 7.

**Done:** malformed LLM output triggers exactly one repair retry, then a typed failure; a killed
weather API degrades the itinerary instead of failing it; `error` is followed by `done` — the
stream never drops.

---

### Week 5 — pgvector Semantic Search

**Goal:** embed a document corpus, store in Postgres, ANN query it.
**Adds:** `retrieval/` (embeddings, chunking, vector store). First schema migration.

**Architecture flow** — an ingest path appears alongside the query path
```
INGEST (offline)                          QUERY (online)
  docs/                                     /api/w05/search
    ▼                                            ▼
aiplat.retrieval.chunking                  aiplat.retrieval.embeddings.embed(q)
    ▼                                            ▼
aiplat.retrieval.embeddings (batched+cached)  aiplat.retrieval.store_pgvector.query()
    ▼                                            ▼
aiplat.retrieval.store_pgvector.upsert()      top-k chunks + scores  (no LLM in this path yet)
    ▼
PostgreSQL + pgvector  ── agent_doc_chunks(embedding vector(N))
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── retrieval/                    ← NEW
│   │   ├── embeddings.py             ← NEW  batch + cache (embedding calls are the cost driver)
│   │   ├── chunking.py               ← NEW  boundary strategy is a tunable, not a constant
│   │   └── store_pgvector.py         ← NEW  upsert · ANN query · index management
│   └── db/models/doc_chunk.py        ← NEW  agent_doc_chunks + vector column + ivfflat index
├── apps/w05_vector_search/           ← NEW
│   ├── ingest.py                     ← NEW  CLI: corpus → chunks → embeddings → pgvector
│   ├── router.py                     ← NEW  /api/w05/search  (retrieval only, no generation)
│   ├── tests/                        ← NEW  recall@k on a fixed corpus
│   └── README.md
└── infra/alembic/                    ← NEW  ⚠ REQUIRED from here — create_all can't add a
                                      │      vector index to a table holding real data
    └── versions/0001_pgvector.py     ← NEW  CREATE EXTENSION vector
```

**Why Alembic lands here:** [ADR-009](TECH-STACK-DECISIONS.md) says add it *before the first schema
change that must survive existing data*. Adding a vector column to a populated database is that
change.

**Done:** recall@k measured on a fixed corpus and recorded in the README; re-ingest is idempotent
(same doc twice ≠ duplicate chunks); embedding cache hit-rate logged.

---

### Week 6 — Full RAG Pipeline

**Goal:** retrieve → rerank → generate with **citations and confidence**. No claim without a source.
**Adds:** `retrieval/rerank.py`, `retrieval/citations.py`.

**Architecture flow** — first time retrieval and generation compose
```
/api/w06/ask
   ▼
apps/w06_rag_pipeline/pipeline.py
   │
   ├─1─ aiplat.retrieval.store_pgvector.query()      top-50 candidates
   ├─2─ aiplat.retrieval.rerank                      top-50 → top-5   ← precision comes from here
   ├─3─ aiplat.prompts.registry.get("rag_answer",v1)
   ├─4─ aiplat.llm.streaming  ──→ Claude            (context = top-5 chunks ONLY)
   └─5─ aiplat.retrieval.citations.verify()          every claim maps to a chunk, else confidence↓
   ▼
aiplat.schemas.events: token… → data(Answer{text, citations[], confidence}) → done
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── retrieval/
│   │   ├── rerank.py                 ← NEW  cross-encoder or LLM reranker behind one port
│   │   └── citations.py              ← NEW  claim → chunk mapping; unsourced claim lowers score
│   ├── schemas/common.py             ← EDIT Citation/Confidence promoted here (2nd use → kernel)
│   └── prompts/templates/rag_answer/v1.md   ← NEW
├── apps/w06_rag_pipeline/            ← NEW
│   ├── pipeline.py  router.py  schemas.py   ← NEW  Answer{text, citations[], confidence}
│   ├── tests/                        ← NEW  + adversarial: question with NO supporting doc
│   └── README.md
└── frontend/src/weeks/w06/           ← NEW  AnswerView with inline citation chips
```

**New architectural concept — the second-use rule in action:** `Citation` was born in W4 as
`aiplat/schemas/common.py`. W6 is its second consumer, which is the moment it's confirmed as kernel
rather than app vocabulary.

**Done:** a question with no supporting document returns low confidence and refuses to answer —
it does not hallucinate; every sentence in a high-confidence answer resolves to a chunk ID.

---

### Week 7 — Plain-Python Tool-Using Agent

**Goal:** real autonomy — plan → act → observe — with hard bounds. **No framework.**
**Adds:** `agent/`, `tools/parallel.py`, and the **first process split**: `services/agent-runner`.

**Architecture flow** — the loop, and work leaving the request path
```
POST /api/w07/run  ──►  services/api  ──enqueue──►  Redis queue
      │                                                  │
      └──GET /api/w07/stream/{run_id}  (SSE)             ▼
                    ▲                          services/agent-runner/worker.py
                    │                                    ▼
                    │                          ┌── aiplat.agent.loop ──────────────┐
                    │                          │  iteration ≤ max_iterations       │
                    │                          │  ┌─ plan   → aiplat.llm           │
                    │                          │  ├─ act    → aiplat.tools.parallel│  asyncio.gather
                    │                          │  │           → tools.executor ×N  │
                    │                          │  ├─ observe → append to state     │
                    │                          │  └─ guards: duplicate-action,     │
                    │                          │             wall-clock, cost cap  │
                    │                          └───────────┬───────────────────────┘
                    │                                      ▼
                    └──── events ◄──── Redis pub/sub ◄─ aiplat.agent.state
                                                       (run state in REDIS, never in-process)
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── agent/                        ← NEW
│   │   ├── ports.py                  ← NEW  what the loop is allowed to know about
│   │   ├── loop.py                   ← NEW  max_iterations · per-tool timeout · wall-clock budget
│   │   ├── state.py                  ← NEW  run state → Redis. NEVER a Python dict. See §13.6
│   │   └── guards.py                 ← NEW  duplicate-action detect · cost kill-switch
│   ├── tools/parallel.py             ← NEW  asyncio.gather — 3×500ms serial becomes 500ms
│   └── obs/trace.py                  ← NEW  span per iteration; the loop must be replayable
├── services/agent-runner/            ← NEW  ⚑ FIRST SEAM SPLIT (see §14)
│   ├── worker.py  Dockerfile         ← NEW
├── apps/w07_tool_agent/              ← NEW
│   ├── router.py                     ← NEW  POST /run (returns run_id) + GET /stream/{run_id}
│   ├── agent_config.py               ← NEW  which tools · which caps · which model tier
│   ├── tests/                        ← NEW  loop-bound tests · infinite-loop injection
│   └── README.md
└── apps/w04_holidaylandmarks/planner.py  ← EDIT optionally swap fixed sequence → bounded loop
```

**Why the split happens here and not earlier:** an agent run is seconds-to-minutes. Holding an HTTP
connection open for it is what breaks the API under load. Because §2's dependency rule held,
extracting the runner is a deployment change — `aiplat/agent` didn't move.

**Done:** a tool stuck in a loop is killed by `guards.py`, not by the request timing out; killing
the worker mid-run and restarting resumes from Redis state; cost cap halts a runaway run.

---

### Week 8 — LangGraph: Stateful Workflows, Checkpoints, Human Interrupts

**Goal:** durable, resumable workflows with a human approval gate.
**Adds:** `graph/`, `agent/approval.py`. LangGraph earns its place *only* where Week 7's loop can't.

**Architecture flow** — the loop becomes a graph that can pause
```
aiplat.graph.builder  ── StateGraph ──┐
                                       ▼
   ┌──────────────────────────────────────────────────────────────┐
   │  node: plan  →  node: act  →  node: review                   │
   │                                   │                          │
   │                          aiplat.graph.interrupts             │
   │                          "needs human approval?"             │
   │                              yes │        │ no               │
   │                                  ▼        └──► node: commit  │
   │                          PAUSE + checkpoint                  │
   └──────────────────────────────────┬───────────────────────────┘
                                      ▼
              aiplat.graph.checkpointer  ──►  PostgreSQL agent_checkpoints
                                      ▲
   POST /api/w08/approve/{run_id} ────┘  resumes from the exact paused node,
                                          hours later, after a process restart
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── graph/                        ← NEW
│   │   ├── builder.py                ← NEW  StateGraph construction helpers
│   │   ├── checkpointer.py           ← NEW  Postgres-backed — survives process death
│   │   └── interrupts.py             ← NEW  human interrupt nodes
│   ├── agent/approval.py             ← NEW  approval gate shared by loop AND graph
│   └── db/models/checkpoint.py       ← NEW  agent_checkpoints
├── apps/w08_graph_workflows/         ← NEW
│   ├── graphs/                       ← NEW  one module per workflow definition
│   ├── router.py                     ← NEW  /run · /approve/{run_id} · /stream/{run_id}
│   ├── tests/                        ← NEW  kill mid-run → resume → identical outcome
│   └── README.md
├── infra/alembic/versions/0002_checkpoints.py   ← NEW
└── frontend/src/weeks/w08/ApprovalPanel.jsx     ← NEW  pending-approval queue UI
```

**Decision rule for later weeks:** use `aiplat/agent/loop.py` (W7) when a run is short and
stateless. Use `aiplat/graph/` (W8) when it must **pause, persist, and resume** — that is the only
thing that justifies the framework.

**Done:** a run pauses for approval, the whole stack restarts, approval arrives, the run completes
correctly; checkpoints are replayable and diffable.

---

### Week 9 — MCP Server with Bounded Tools

**Goal:** expose the tool layer over a standard protocol; consume third-party MCP servers.
**Adds:** `mcp/`, and the **second process split**: `services/mcp-server`.

**Architecture flow** — the tool layer becomes addressable from outside
```
   aiplat.agent.loop / aiplat.graph
              │
     ┌────────┴─────────┐
     ▼                  ▼
 aiplat.tools      aiplat.mcp.client ──► third-party MCP servers (bounded by mcp/bounds.py)
 .registry
     │
     └──exposed by──► services/mcp-server  ──MCP──►  Claude Desktop · other agents · other apps
                            │
                     aiplat.mcp.bounds
                     scope + permission wrapper
                     ⚠ NO arbitrary SQL · NO shell · NO unbounded HTTP
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── mcp/                          ← NEW
│   │   ├── server.py                 ← NEW  aiplat.tools.registry → MCP tool definitions
│   │   ├── client.py                 ← NEW  consume external MCP servers as ToolPort
│   │   └── bounds.py                 ← NEW  scope/permission wrapper — least privilege
│   └── security/authz.py             ← NEW  authorization matrix enforcement, now cross-process
├── services/mcp-server/              ← NEW  ⚑ SECOND SEAM SPLIT
│   ├── main.py  Dockerfile           ← NEW
├── apps/w09_mcp_tools/               ← NEW
│   ├── tools/                        ← NEW  week-specific tools exposed via MCP
│   ├── manifest.json                 ← NEW  declared scopes per tool
│   ├── tests/                        ← NEW  privilege-escalation attempts must FAIL
│   └── README.md
```

**Why this is nearly free:** `aiplat/tools/ports.py` was designed in Week 4 with
`input_schema`/`output_schema`/`authz_scope`. MCP is a serialization of exactly that. If W4 had
used loose dicts, this week would be a rewrite.

**Done:** an external MCP client can call the tools and **cannot** exceed its declared scope;
a third-party MCP server is consumed through `client.py` as an ordinary `ToolPort`.

---

### Week 10 — Multi-Agent, Aggressively Simplified

**Goal:** supervisor-worker and router patterns — **and deleting the ones that aren't justified**.
**Adds:** `orchestration/`. Smallest kernel delta of any week, on purpose.

**Architecture flow**
```
                    /api/w10/handle
                          ▼
            aiplat.orchestration.router
            classify intent → dispatch to ONE specialist
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   research agent    planning agent    writing agent
   (agent.loop)      (graph)           (agent.loop)
        └─────────────────┼─────────────────┘
                          ▼
            aiplat.orchestration.supervisor
            merge · resolve conflicts · one validated output
                          ▼
              aiplat.schemas.events → data(Result)

⚠ For every agent above, orchestration/README.md must answer:
  "what does this agent do that a deterministic function cannot?"
  No answer → delete the agent, write the function.
```

**Folder delta**
```
├── platform/src/aiplat/
│   └── orchestration/                ← NEW
│       ├── router.py                 ← NEW  classify → dispatch to one specialist
│       ├── supervisor.py             ← NEW  fan-out → merge → single validated result
│       └── README.md                 ← NEW  ⚠ justification log — one entry per agent
├── apps/w10_multi_agent/             ← NEW
│   ├── agents/                       ← NEW  each ≤ ~100 lines; config, not cleverness
│   ├── router.py                     ← NEW
│   ├── tests/                        ← NEW  + a baseline: same task, deterministic code, compared
│   └── README.md                     ← NEW  where multi-agent WON and where it LOST
```

**The point of this week is subtraction.** The blog is explicit: *replace unnecessary agents with
deterministic code*. Measuring a multi-agent path against a plain-function baseline and finding the
function wins is a **passing** result, not a failure.

**Done:** the justification log has one entry per surviving agent; at least one candidate agent was
deleted in favor of deterministic code, with the comparison recorded.

---

### Week 11 — Evaluation, Security, Observability

**Goal:** ≥50 test cases per service, security controls, full-stack tracing. **Nothing new ships to
users — everything gets provable.**
**Adds:** `evals/`, `security/` completed, `obs/redact.py`, CI gates.

**Architecture flow** — two paths that wrap everything built so far
```
EVAL PATH (CI + on demand)              GUARD PATH (every request, W11 onward)
  aiplat.evals.datasets                   inbound
        ▼                                   ▼
  aiplat.evals.harness                  security.injection   user text = DATA, never authority
        ▼                                   ▼
  run suite vs. app under test          security.limits      rate + per-user cost cap
        ▼                                   ▼
  scorers/ {exact, schema_valid,        security.authz       tool authorization matrix
            llm_judge, citation}            ▼
        ▼                                 [ the week's app ]
  score diff vs. baseline                   ▼
        ▼                                 security.egress    outbound host allow-list
  infra/ci → BLOCK MERGE on regression      ▼
                                          obs.redact         PII/secrets/retrieved docs
                                            ▼
                                          obs.logging (operational)  +  audit log (separate)
```

**Folder delta**
```
├── platform/src/aiplat/
│   ├── evals/                        ← NEW
│   │   ├── harness.py                ← NEW  run suite → scores → regression diff
│   │   ├── scorers/                  ← NEW  exact · schema_valid · llm_judge · citation_check
│   │   └── datasets/                 ← NEW  ≥50 cases/service, versioned WITH the prompts
│   ├── security/
│   │   ├── injection.py              ← NEW  system-prompt isolation; user text is data
│   │   └── limits.py                 ← NEW  rate limit · per-user cost cap
│   │   (authz.py W9 · egress.py W4 already present)
│   └── obs/redact.py                 ← NEW  PII · credentials · retrieved confidential docs
├── apps/w11_eval_guardrails/         ← NEW
│   ├── suites/                       ← NEW  eval suites for W02·W04·W06·W07·W12
│   ├── router.py                     ← NEW  /api/w11/metrics — cost, latency, failure rates
│   └── README.md
├── infra/ci/eval-gate.yml            ← NEW  ⚑ merge blocked on score regression
└── frontend/src/weeks/w11/           ← NEW  ObservabilityDashboard: cost · p95 · failures
```

**Note on audit vs. operational logs:** the blog separates them. Operational logs are redacted and
rotate; audit logs record every tool call, approval, and external write, and are retained.

**Done:** a prompt edit that lowers scores blocks the merge; a prompt-injection corpus fails to
make any tool execute out of scope; no user PII appears in operational logs.

---

### Week 12 — 🏁 Capstone: Enterprise AI Operations Assistant

**Goal:** investigate errors → propose PRs → **require human approval** before any write.
**Kernel delta: none.** That is the success criterion.

**Architecture flow — every prior week, composed**
```
  Alert / error report
        ▼
  services/api  ── security.injection · limits (W11) · correlation (W2)
        ▼
  apps/w12_ai_ops_assistant/workflows/investigate.py
        ▼
  aiplat.graph (W8)  ── durable, resumable, interruptible
        │
        ├─ node: gather    → aiplat.retrieval (W5/W6)   logs, runbooks, past incidents + CITATIONS
        ├─ node: diagnose  → aiplat.orchestration.router (W10) → specialist agent
        ├─ node: act       → aiplat.agent.loop (W7) → aiplat.tools (W4) / aiplat.mcp (W9)
        │                     read-only tools ONLY at this stage
        ├─ node: propose   → structured Fix{diff, rationale, confidence, citations}  (W4 schemas)
        │        ▼
        │   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        │   ┃  interrupts (W8) → PAUSE + checkpoint        ┃
        │   ┃  HUMAN APPROVAL REQUIRED before ANY write    ┃
        │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        │        ▼ approved
        └─ node: commit    → write tool (idempotent, W4) → audit log (W11)
        ▼
  SSE (W4 events) → frontend/src/weeks/w12 (useSSEStream, written in W4)
        ▼
  evals (W11) score the whole pipeline in CI
```

**Folder delta — apps and infra only**
```
├── apps/w12_ai_ops_assistant/        ← NEW
│   ├── workflows/investigate.py      ← NEW  the graph definition
│   ├── approvals/policy.py           ← NEW  what requires a human, and from whom
│   ├── router.py                     ← NEW  /investigate · /approve/{id} · /stream/{id}
│   ├── tests/                        ← NEW  incident replay corpus
│   └── README.md
├── infra/docker-compose.yml          ← EDIT api + agent-runner + mcp-server + pg + redis
├── infra/ci/deploy.yml               ← NEW
└── frontend/src/weeks/w12/           ← NEW  IncidentView · DiffReview · ApprovalPanel
    (platform/src/aiplat/ — UNCHANGED)     ← ⭐ the architecture's exam result
```

**If Week 12 requires new `aiplat/` modules, a boundary was drawn wrong somewhere in Weeks 1–11.**
That is a falsifiable test of this whole design, not a vibe.

**Done:** no external write occurs without a recorded human approval; every proposed fix carries
citations and confidence; the full incident replay corpus passes in CI.

---

## 5. Cumulative Kernel Growth

| Wk | Topic | Kernel added | App folder | New deployable |
|----|-------|--------------|------------|----------------|
| 1 | LLM foundations | `config/` `llm/{ports,client,tokens}` | `w01_llm_lab` | — |
| 2 | FastAPI service | `obs/` `resilience/` | `w02_ai_service` | **`services/api`** |
| 3 | Prompts as software | `prompts/` | `w03_prompt_lab` | — |
| 4 | **Structured output + tools** | `schemas/` `tools/` `llm/streaming` `db/` | `w04_holidaylandmarks` | pg + redis |
| 5 | pgvector search | `retrieval/{embeddings,chunking,store}` | `w05_vector_search` | alembic |
| 6 | Full RAG | `retrieval/{rerank,citations}` | `w06_rag_pipeline` | — |
| 7 | Tool agent | `agent/` `tools/parallel` | `w07_tool_agent` | **`agent-runner`** |
| 8 | LangGraph | `graph/` `agent/approval` | `w08_graph_workflows` | — |
| 9 | MCP | `mcp/` `security/authz` | `w09_mcp_tools` | **`mcp-server`** |
| 10 | Multi-agent | `orchestration/` | `w10_multi_agent` | — |
| 11 | Evals + security + obs | `evals/` `security/` `obs/redact` | `w11_eval_guardrails` | CI eval gate |
| 12 | 🏁 AI Ops Assistant | **nothing** | `w12_ai_ops_assistant` | full compose |

---

## 6. Final Folder Structure (Week 12)

```
AI agentic/
├── CLAUDE.md · CLAUDE-12-WEEK.md · TECH-STACK-DECISIONS.md · RUN.md
├── pyproject.toml · .env.example
├── doc/{feature.md, curriculum.md, adr/}
│
├── platform/src/aiplat/           # THE KERNEL — grew W1→W11, frozen at W12
│   ├── config/    {settings, models}                              W1
│   ├── obs/       {correlation, logging, cost, trace, redact}     W2·W7·W11
│   ├── resilience/{timeout, retry, breaker, idempotency}          W2·W4
│   ├── llm/       {ports, anthropic_client, tokens, streaming,    W1·W2·W4
│   │               caching, tiering}
│   ├── prompts/   {registry, render, templates/}                  W3
│   ├── schemas/   {events, errors, common}                        W4
│   ├── tools/     {ports, registry, executor, parallel, impl/}    W4·W7
│   ├── retrieval/ {embeddings, chunking, store_pgvector,          W5·W6
│   │               rerank, citations}
│   ├── agent/     {ports, loop, state, guards, approval}          W7·W8
│   ├── graph/     {builder, checkpointer, interrupts}             W8
│   ├── mcp/       {server, client, bounds}                        W9
│   ├── orchestration/{router, supervisor}                         W10
│   ├── evals/     {harness, scorers/, datasets/}                  W11
│   ├── security/  {injection, authz, egress, limits}              W4·W9·W11
│   └── db/        {session, base, models/}                        W4
│
├── services/
│   ├── api/           main.py · middleware/ · mounts.py           W2
│   ├── agent-runner/  worker.py                                   W7
│   └── mcp-server/    main.py                                     W9
│
├── apps/
│   ├── w01_llm_lab/          w02_ai_service/       w03_prompt_lab/
│   ├── w04_holidaylandmarks/ w05_vector_search/    w06_rag_pipeline/
│   ├── w07_tool_agent/       w08_graph_workflows/  w09_mcp_tools/
│   └── w10_multi_agent/      w11_eval_guardrails/  w12_ai_ops_assistant/
│
├── frontend/src/
│   ├── api/client.js · hooks/{useSSEStream, useBackendStatus}
│   ├── components/{StreamLog, ErrorPanel, CostBadge}
│   └── weeks/{w02…w12}/ · weeks/registry.js · App.jsx
│
├── infra/{docker-compose.yml, alembic/, ci/}
└── tests/{contract/, integration/, regression/, conftest.py}
```

---

## 7. What Goes Where

| Signal | Goes in |
|---|---|
| Retry, timeout, logging, cost, auth, redaction | `aiplat/` — always |
| A tool any agent could call | `aiplat/tools/impl/` |
| A Pydantic type crossing a module boundary | `aiplat/schemas/` |
| Domain vocabulary of one week (`Itinerary`, `Stop`) | `apps/wNN/schemas.py` |
| A prompt template | `aiplat/prompts/templates/` (versioned) |
| "Call these 3 kernel pieces in this order" | `apps/wNN/service.py` |
| HTTP shape, status codes, SSE endpoint | `apps/wNN/router.py` |

**Second-use rule:** the first week to need something writes it in `apps/`. The **second** week to
need it promotes it to `aiplat/` in the same PR. Never speculatively generalize on first use.
(Worked example: `Citation`, W4 → W6, §Week 6.)

---

## 8. Kernel Contracts

Four contracts are the spine. Every week honors them.

1. **SSE event union** (`schemas/events.py`, W4) — `token · tool_call · tool_result · data · error
   · done`. `data` carries the week's validated payload. Written once, so `useSSEStream.js` is too.
2. **Typed error envelope** (`schemas/errors.py`, W4) — `{code, message, correlation_id,
   retryable}`. Never a traceback. A failed stream emits `error` then `done`; it never drops.
3. **Tool port** (`tools/ports.py`, W4) — `name · description · input_schema · output_schema ·
   timeout_s · authz_scope · async run()`. Adding a tool requires an authorization-matrix entry.
4. **Correlation ID** (`obs/correlation.py`, W2) — one contextvar, read by every log line, LLM
   call, tool call, and query. One ID answers "what did this request do, and what did it cost?"

---

## 9. Performance Rules (apply from Week 2)

Budget is roughly **LLM 85% / tools 10% / your code 5%**.

1. **Cache tool results in Redis** — weather-per-city-day, geocode-per-place. Highest ROI in the repo.
2. **Parallel tool calls** (`tools/parallel.py`) — 3 serial 500ms calls become one 500ms turn.
   Write the loop for this in W7; retrofitting is painful.
3. **Prompt caching** (`llm/caching.py`) — system prompt + tool defs are stable across turns.
4. **Model tiering** (`llm/tiering.py`) — cheap turns → Haiku. Verify live model IDs against the
   Anthropic API before shipping; never hardcode from a doc.
5. **Never hold a DB session across an `await` on the LLM.** Sync SQLAlchemy runs in FastAPI's
   threadpool (~40 threads); a session held across a 4s model call caps you at ~40 concurrent runs
   regardless of hardware. Read → close → then call the model.
6. **Run state in Redis, never a Python dict** (W7). Otherwise: no horizontal scale, no restart
   without dropping streams, no seam extraction, and a reconnecting `EventSource` hits the wrong worker.

Not your bottleneck — skip: gRPC between modules, pool micro-tuning, leaving Python.

---

## 10. Scaling Path — when a seam splits

| Module | Trigger | Becomes | Week |
|---|---|---|---|
| `services/api` | never | API gateway / BFF | W2 |
| `aiplat/agent` | runs exceed ~30s, or need crash-resume | **`agent-runner`** | **W7** |
| `aiplat/tools` | rate limits, >8 tools, or another app wants them | **`mcp-server`** | **W9** |
| `aiplat/retrieval` | reindexing competes with query latency | retrieval service | post-W12 |
| `aiplat/llm` | never — it's a client library | stays a package | — |
| `aiplat/db` | only *after* the above split | per-service schemas | post-W12 |

Each split gets an ADR in [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md) when it happens.

---

## 11. Commands

```powershell
# one-time
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -e .\platform            # the aiplat kernel, editable
pip install -r requirements-dev.txt
copy .env.example .env

uvicorn services.api.main:app --reload          # all mounted weeks → :8000/docs
python -m services.agent_runner.worker          # W7+
python -m services.mcp_server.main              # W9+
cd frontend; npm install; npm run dev           # :5173

pytest platform                                 # kernel
pytest apps/w04_holidaylandmarks                # one week
pytest                                          # everything
python -m aiplat.evals.harness --suite apps/w04_holidaylandmarks   # W11+

& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -d holidaylandmark
```

---

## 12. Migration From Today's Repo

The repo is `backend/` + `frontend/` (Week 4 only). Six steps, **one commit** — a half-migrated
tree with two import roots is worse than either end state.

1. Create `platform/src/aiplat/` and `pip install -e ./platform`. Empty `__init__.py` files are
   fine; the import path must work first.
2. `backend/app/core/` → split into `aiplat/config/` + `aiplat/obs/` + `aiplat/resilience/`.
   Do it now while it's three files — `core/` is a name that rots.
3. `backend/app/db/` + `backend/app/models/` → `aiplat/db/`. Keep the `agent_` table prefix
   ([ADR-009](TECH-STACK-DECISIONS.md)).
4. `backend/app/main.py` → `services/api/main.py`; `routes/api.py` → `services/api/mounts.py`
   mounting `/api/w04/*`. Keep `/api/health` and `/api/health/db` un-prefixed.
5. Remainder of `backend/app/` → `apps/w04_holidaylandmarks/`. Delete `backend/`.
6. Reshape `frontend/src/` → `weeks/w04/` + `hooks/useSSEStream.js` + `weeks/registry.js`.

Then backfill Weeks 1–3 (`aiplat/llm/`, `aiplat/prompts/`) and finish Week 4's kernel
(`aiplat/schemas/`, `aiplat/tools/`) per [doc/feature.md](doc/feature.md) F1–F15.

---

## 13. Definition of Done — per week

- [ ] Acceptance criteria in `apps/wNN/README.md` met and checked off
- [ ] Pydantic validation on **every** boundary the week touches
- [ ] Kernel additions in `aiplat/`; app folder thin (wiring + week vocabulary only)
- [ ] Dependency rule holds — CI import check passes
- [ ] External calls: timeout + backoff + breaker; agent paths respect `max_iterations`
- [ ] Typed error envelope; stream emits `error` then `done` — never a raw traceback
- [ ] Tests: unit + contract + failure-injection; mock LLM and mock tools, offline-deterministic
- [ ] Correlation ID in every log line; tokens + cost per request
- [ ] Prompts versioned at `aiplat/prompts/templates/<name>/vN.md`; eval suite green (W11+)
- [ ] ADR added or updated if an architectural decision changed
- [ ] This file's week section updated if the actual folder delta differed from the plan

---

## 14. Non-Goals

Real bookings/payments, live inventory, native mobile, Kubernetes, and any microservice split
before its §10 trigger fires. Multi-agent orchestration is a **Week 10** capability — never an
excuse to use agents where deterministic code is correct.

---

## 15. Reference

- Methodology: [Master Prompt for AI Agentic Developers](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
- Week-4 scope: [doc/feature.md](doc/feature.md) · Decisions: [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md)
- Working rules: [CLAUDE.md](CLAUDE.md) · Run instructions: [RUN.md](RUN.md)
