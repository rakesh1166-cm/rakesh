# CLAUDE-12-WEEK.md — AI Agentic Developer Monorepo

Architecture + **week-by-week folder structure (backend *and* frontend)** for delivering all 12
weeks of [The Ultimate Reusable Master Prompt to Become an AI Agentic Developer](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
inside **one repository**.

> **Status:** Proposal. The repo today is Week-4 only (`backend/` + `frontend/`, HolidayLandmarks).
> §16 is the migration path. This does **not** replace [CLAUDE.md](CLAUDE.md) until promoted.
>
> **How to read this file:** §1–§4 are the invariants. **§5 is the main body** — twelve sections,
> one per week, each with the *architecture flow at that point*, the *backend folder delta*, and
> the *frontend folder delta*. §7 is the final tree. Everything after is reference.

---

## 1. The Core Idea

The 12 weeks are **cumulative, not parallel**. Week 6 needs Week 5's vector store. Week 8 needs
Week 7's tools. Week 12 needs all of it.

**One shared kernel, twelve thin apps — on both sides of the wire.**

```
Backend :  each week ADDS a capability to  platform/src/aiplat/
           each week's project is a THIN app in  apps/wNN_*/

Frontend:  each week ADDS a shared primitive to  frontend/src/{hooks,components}/
           each week's UI is a THIN folder in    frontend/src/weeks/wNN/
```

| Approach | Verdict |
|---|---|
| 12 standalone projects (12 React apps) | ✗ Week 12 is a rewrite; SSE handling duplicated 12× |
| One flat `backend/` + one flat `src/` | ✗ No boundaries; Week 10's UI tangles with Week 2's |
| 12 microservices / 12 micro-frontends | ✗ Distributed tracing + 12 deploys for a solo repo — §12 |
| **Kernel + thin apps** | ✅ Additive, testable alone; Week 12 is composition not construction |

This mirrors the blog's own principles: *schema-first*, *determinism first*, *aggressive
simplification*, *replace unnecessary agents with deterministic code*.

---

## 2. The Dependency Rule (non-negotiable)

**Backend**
```
services/  →  apps/  →  aiplat/  →  (stdlib, third-party)

aiplat/  NEVER imports apps/ or services/
apps/wNN NEVER imports apps/wMM      (need shared code? it belongs in aiplat/)
aiplat submodules talk through ports.py, not each other's internals
```

**Frontend — the exact mirror**
```
App.jsx  →  weeks/registry.js  →  weeks/wNN/  →  hooks/ + components/ + api/

hooks/ and components/ NEVER import from weeks/
weeks/wNN NEVER imports weeks/wMM    (need shared code? it belongs in components/ or hooks/)
```

Two rules, same shape. They are what make §12's microservice extraction a config change instead of
a rewrite. Enforce both in CI from Week 2 (`import-linter` for Python, an ESLint
`no-restricted-imports` rule for JS).

**Note on the blog's Laravel tier:** the blog puts Laravel in front (auth, users, queues) with
FastAPI behind it. This repo has no PHP tier, so Laravel's responsibilities fold into
`services/api` (middleware) and `services/agent-runner` (queues). If Laravel is ever added it sits
above `services/api` and nothing below changes.

---

## 3. Final Runtime Architecture (where Week 12 lands)

```
┌──────────────────────────────────────────────────────────────────┐
│  frontend/   React + Vite (JS) · ONE SPA · route per week        │
│  App.jsx → weeks/registry.js → weeks/wNN/                        │
│  shared: hooks/useSSEStream · useRunStream · components/         │
│          StreamLog · CostBadge · ErrorPanel · ApprovalPanel      │
└───────────────────────────┬──────────────────────────────────────┘
                            │ HTTP + SSE  (X-Correlation-ID both ways)
┌───────────────────────────▼──────────────────────────────────────┐
│  services/api/     FastAPI · CORS · correlation-ID · rate limit  │
│                    mounts.py:  /api/w02/… /api/w12/…             │
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

Weeks 1–12 build this up one layer at a time. **Nothing in the diagram exists on day one.**

---

## 4. Frontend Architecture (the invariants)

The frontend is **one Vite SPA**, never twelve. Three ideas carry all twelve weeks:

1. **`weeks/registry.js` is the mirror of `services/api/mounts.py`.** A week becomes reachable by
   adding one entry — `{ route, title, component }`. `App.jsx` builds nav from it and never
   hardcodes a week. Adding Week 9 touches two files: `registry.js` and `weeks/w09/index.js`.

2. **`hooks/useSSEStream.js` is written once, in Week 4, and never rewritten.** It consumes the
   `aiplat/schemas/events.py` union (`token · tool_call · tool_result · data · error · done`) as a
   state machine. Every later streaming week (6, 7, 8, 10, 12) reuses it. If a week needs to change
   it, the event contract was wrong — fix the contract, not the hook.

3. **The UI never parses prose.** Streamed `token` events are a *progress indicator*. The validated
   object in the `data` event is what actually renders. This is [ADR-002](TECH-STACK-DECISIONS.md)
   made concrete: type safety lives in Pydantic, and the frontend defensively shape-checks `data`
   at the boundary.

```
frontend/src/
├── api/client.js          # ONE fetch wrapper. Sends + surfaces X-Correlation-ID.
├── hooks/                 # cross-week behaviour        ← grows in W2·W4·W7
├── components/            # cross-week UI primitives    ← grows in W2·W4·W6·W8
└── weeks/
    ├── registry.js        # the mount table
    └── wNN/               # thin: this week's screens only
```

---

## 5. Week-by-Week Build-Up

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

**Backend folder structure after Week 1**
```
AI agentic/
├── CLAUDE.md · CLAUDE-12-WEEK.md
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

**Frontend folder delta**
```
(none — deliberately)

There is no HTTP surface yet, so there is nothing to render. Do NOT scaffold React now:
the SSE event contract that shapes the entire frontend is not defined until Week 4, and a
frontend built before it will be rewritten. Week 1's output is a README with numbers in it.
```

**Why this shape:** `ports.py` exists before the client so the seam is real from line one. The
mock-LLM fixture on day one is what keeps all twelve weeks of tests offline and deterministic.

**Done:** token counts match the API's; a deliberate context overflow is caught by `tokens.py`
before the request goes out; every experiment runs against the mock without network.

---

### Week 2 — FastAPI AI Microservice

**Goal:** `POST /summarize · /classify · /extract · /chat`. First deployable process, first UI.
**Adds:** backend `obs/` + `resilience/`; frontend **exists from this week on**.

**Architecture flow** — the full request path exists for the first time
```
frontend/src/weeks/w02/AiServicePanel.jsx
      │  api/client.js  (generates X-Correlation-ID)
      ▼
services/api/main.py
  └─ middleware/correlation.py   sets contextvar  ← every log line downstream carries it
  └─ middleware/errors.py        typed envelope, never a traceback
  └─ mounts.py  →  /api/w02/*
       ▼
apps/w02_ai_service/router.py   (HTTP shape only)
       ▼
apps/w02_ai_service/service.py  (wiring only)
       ▼
aiplat.resilience.retry( aiplat.llm.anthropic_client ) ──→ Claude API
       ▼
aiplat.obs.cost  →  tokens + $ per request
       ▼
response {data | error envelope}  →  components/ErrorPanel.jsx renders the TYPED error
```

**Backend folder delta**
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
│   └── llm/anthropic_client.py       ← EDIT wrap in timeout+retry, emit cost
├── services/                         ← NEW
│   └── api/                          ← NEW
│       ├── main.py                   ← NEW  FastAPI app, CORS
│       ├── middleware/               ← NEW  correlation · errors · rate-limit
│       └── mounts.py                 ← NEW  WEEK_ROUTERS = {"w02": ...}
└── apps/w02_ai_service/              ← NEW
    ├── router.py  schemas.py  service.py  tests/  README.md   ← NEW
```

**Frontend folder delta**
```
frontend/                             ← NEW
├── index.html · vite.config.js · package.json   ← NEW
├── .env.example                      ← NEW  VITE_API_BASE
└── src/
    ├── main.jsx                      ← NEW
    ├── App.jsx                       ← NEW  builds nav FROM registry.js — never hardcodes a week
    ├── api/client.js                 ← NEW  the ONE fetch wrapper; generates + surfaces
    │                                 │      X-Correlation-ID so a user can quote it in a bug report
    ├── weeks/
    │   ├── registry.js               ← NEW  ⭐ the frontend mirror of services/api/mounts.py
    │   │                             │      [{ route:'/w02', title:'AI Service', component }]
    │   └── w02/
    │       ├── AiServicePanel.jsx    ← NEW  four endpoints behind one form + mode selector
    │       └── index.js              ← NEW  the only file registry.js imports
    ├── components/
    │   └── ErrorPanel.jsx            ← NEW  renders {code, message, correlation_id, retryable}
    │                                 │      — a typed envelope, NOT a generic toast
    └── hooks/
        └── useBackendStatus.js       ← NEW  /api/health poll → offline banner
```

**New concepts — backend:** middleware chain · correlation ID · typed error envelope · `mounts.py`
as the single place a week becomes reachable.
**New concepts — frontend:** `registry.js` as `mounts.py`'s mirror · errors rendered from a
*schema*, not sniffed from a string · the correlation ID visible in the UI.

**Done:** all four endpoints validated in and out; a forced provider 500 renders in `ErrorPanel`
with a correlation ID and no traceback; cost logged per request.

---

### Week 3 — Prompts as Versioned Software

**Goal:** prompt templates with versions, tests, regression detection. No new runtime layer —
this changes *where prompts live*.

**Architecture flow** — one node inserted before the LLM call
```
weeks/w03/VersionPicker.jsx  ──GET /api/w03/prompts──►  available (name, version) pairs
      │
      └─ POST /api/w03/compare {name, versions:[v1,v2], input}
             ▼
      apps/w03_prompt_lab/service.py
             └─→ aiplat.prompts.registry.get(name, version)     ← NEW node
                   └─→ aiplat.prompts.render(template, vars)    ← validates every variable
                         └─→ aiplat.llm.anthropic_client
             ▼
      {v1: output, v2: output, scores}  →  PromptDiffView.jsx
```

**Backend folder delta**
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
│       ├── router.py                 ← NEW  /prompts (list) · /compare (run v1 vs v2)
│       ├── suites/                   ← NEW  golden cases per prompt
│       └── README.md                 ← NEW
└── tests/regression/                 ← NEW  fails the build when a prompt edit moves scores
```

**Frontend folder delta**
```
└── src/
    ├── weeks/registry.js             ← EDIT  + w03
    └── weeks/w03/                    ← NEW
        ├── VersionPicker.jsx         ← NEW  lists versions FROM the API — the UI never
        │                             │      hardcodes "v2", so a new version needs no deploy
        ├── PromptDiffView.jsx        ← NEW  v1 vs v2 output, side by side, same input
        ├── SuiteScoreTable.jsx       ← NEW  golden-case pass/fail grid
        └── index.js                  ← NEW
```

**Why here:** prompts must be versioned *before* Week 4 ties them to structured output. Editing a
prompt after schemas depend on it, without version history, is how silent regressions ship.

**Done:** zero inline prompt strings in `apps/`; editing `v2.md` and re-running the suite produces
a scored diff visible in `SuiteScoreTable`.

---

### Week 4 — Structured Output + Tools + Streaming ⭐ (HolidayLandmarks — current project)

**Goal:** nested Pydantic schemas, tool calling, conversation history, SSE streaming, persistence.
**The biggest single week on both sides.** Backend gains `schemas/` `tools/` streaming + Postgres +
Redis. Frontend gains the streaming hook every later week reuses.

**Architecture flow** — first tool loop, first stream
```
weeks/w04/PromptComposer.jsx  ──POST /api/w04/plan──►  services/api
                                       ▼
                          apps/w04_holidaylandmarks/router.py   (SSE endpoint)
                                       ▼
                          apps/w04_holidaylandmarks/planner.py
                                       │
        ┌──────────────────────────────┼───────────────────────────────┐
        ▼                              ▼                               ▼
 aiplat.prompts              aiplat.llm.streaming            aiplat.tools.executor
  (versioned, W3)             token → SSE event                     │
                                       │              validate in → authorize → timeout
                                       │              → run → validate out
                                       │                     │
                                       │              tools.impl/{weather,geocode,landmarks}
                                       │                     │         │
                                       │                  Redis      External HTTP
                                       │                  cache      (egress allow-list)
                                       ▼
                          aiplat.schemas.events  →  token | tool_call | tool_result
                                                    | data(Itinerary) | error | done
                                       ▼
                          aiplat.db  →  PostgreSQL  agent_itineraries
                                       ▼
     ┌─────────────────────────────────────────────────────────────────────┐
     │ hooks/useSSEStream.js   idle → streaming → done|error               │
     │   token       → append to skeleton text (PROGRESS ONLY)             │
     │   tool_call   → StreamLog row "calling weather(Paris)…"             │
     │   tool_result → StreamLog row resolves                              │
     │   data        → shape-check → ItineraryView RENDERS THIS, not text  │
     │   error       → ErrorPanel; done always follows                     │
     └─────────────────────────────────────────────────────────────────────┘
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   ├── schemas/                      ← NEW  shared contracts
│   │   ├── events.py                 ← NEW  ⭐ SSE union — used by EVERY later streaming week
│   │   ├── errors.py                 ← NEW  {code, message, correlation_id, retryable}
│   │   └── common.py                 ← NEW  Money, GeoPoint, DateRange, Citation, Confidence
│   ├── tools/                        ← NEW
│   │   ├── ports.py                  ← NEW  name·input_schema·output_schema·timeout·authz_scope
│   │   ├── registry.py               ← NEW  allow-list + AUTHORIZATION MATRIX
│   │   ├── executor.py               ← NEW  validate→authorize→timeout→retry→validate
│   │   └── impl/{weather,geocode,landmarks}.py + impl/mock/   ← NEW
│   ├── llm/
│   │   ├── streaming.py              ← NEW  provider stream → typed SSE events
│   │   ├── caching.py                ← NEW  prompt cache: system prompt + tool defs
│   │   └── tiering.py                ← NEW  route turn → default/escalate/fallback
│   ├── resilience/idempotency.py     ← NEW  Redis key store — POST replay safety
│   ├── security/egress.py            ← NEW  outbound host allow-list (SSRF defense)
│   └── db/                           ← NEW
│       ├── session.py  base.py       ← NEW
│       └── models/landmark.py        ← NEW  `agent_` table prefix
├── apps/w04_holidaylandmarks/        ← NEW  (migrated from backend/ — see §14)
│   ├── router.py  schemas.py         ← NEW  Itinerary · Day · Stop · TripRequest
│   ├── planner.py  prompts/  data/   ← NEW  curated landmark seed dataset
│   ├── tests/                        ← NEW  unit · contract · tool-loop · failure-injection
│   └── README.md                     ← NEW  F1–F15 acceptance criteria
└── infra/docker-compose.yml          ← NEW  postgres:5433 + redis
```

**Frontend folder delta**
```
└── src/
    ├── hooks/
    │   └── useSSEStream.js           ← NEW ⭐ WRITTEN ONCE HERE. Reused by W6·W7·W8·W10·W12.
    │                                 │   state machine over aiplat/schemas/events.py
    │                                 │   guarantees: `data` REPLACES streamed text;
    │                                 │   `error` is always followed by `done`;
    │                                 │   unknown event types are ignored, not fatal
    ├── components/
    │   ├── StreamLog.jsx             ← NEW  tool_call → tool_result timeline, live
    │   ├── CostBadge.jsx             ← NEW  tokens + $ read off the `done` event
    │   └── ErrorPanel.jsx            ← EDIT + `retryable` → renders a Retry button
    ├── weeks/registry.js             ← EDIT + w04
    └── weeks/w04/                    ← NEW
        ├── PromptComposer.jsx        ← NEW  form → TripRequest (mirrors the Pydantic schema)
        ├── ItinerarySkeleton.jsx     ← NEW  shown WHILE tokens stream
        ├── ItineraryView.jsx         ← NEW  renders the validated Itinerary object:
        │                             │      day cards → stop cards → source + confidence
        ├── validateItinerary.js      ← NEW  defensive shape check on `data` (ADR-002:
        │                             │      type safety is server-side; trust but verify)
        └── index.js                  ← NEW
```

**New concepts — backend:** the tool port · the authorization matrix (adding a tool requires a
matrix entry, not just wiring) · the SSE event union · prompt caching · idempotency · persistence.
Tool calling here is a **fixed sequence, not an agent** — autonomy waits for Week 7.
**New concepts — frontend:** the streaming state machine · **the UI never parses prose** · a
skeleton that is *replaced by*, not *merged with*, the validated payload.

**Done:** malformed LLM output triggers exactly one repair retry, then a typed failure; a killed
weather API degrades the itinerary instead of failing it; `error` is always followed by `done` —
the stream never drops and the UI never hangs in `streaming`.

---

### Week 5 — pgvector Semantic Search

**Goal:** embed a corpus, store in Postgres, ANN query it.
**Adds:** `retrieval/`. First schema migration. **No streaming this week** — retrieval only.

**Architecture flow** — an ingest path appears alongside the query path
```
INGEST (offline CLI)                      QUERY (online)
  docs/                                     weeks/w05/SearchBox.jsx
    ▼                                            │ POST /api/w05/search  (plain JSON)
aiplat.retrieval.chunking                        ▼
    ▼                                     aiplat.retrieval.embeddings.embed(q)
aiplat.retrieval.embeddings                      ▼
  (batched + cached)                      aiplat.retrieval.store_pgvector.query()
    ▼                                            ▼
store_pgvector.upsert()                   top-k chunks + SCORES  (no LLM in this path)
    ▼                                            ▼
PostgreSQL + pgvector                     ResultList.jsx + ScoreBar.jsx
agent_doc_chunks(embedding vector(N))
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   ├── retrieval/                    ← NEW
│   │   ├── embeddings.py             ← NEW  batch + cache (embedding calls are the cost driver)
│   │   ├── chunking.py               ← NEW  boundary strategy is a tunable, not a constant
│   │   └── store_pgvector.py         ← NEW  upsert · ANN query · index management
│   └── db/models/doc_chunk.py        ← NEW  agent_doc_chunks + vector column + ivfflat index
├── apps/w05_vector_search/           ← NEW
│   ├── ingest.py                     ← NEW  CLI: corpus → chunks → embeddings → pgvector
│   ├── router.py                     ← NEW  /api/w05/search (retrieval only, no generation)
│   ├── tests/                        ← NEW  recall@k on a fixed corpus
│   └── README.md
└── infra/alembic/                    ← NEW  ⚠ REQUIRED from here — create_all cannot add a
    └── versions/0001_pgvector.py     │      vector index to a table already holding data
                                      └─ CREATE EXTENSION vector
```

**Frontend folder delta**
```
└── src/
    ├── weeks/registry.js             ← EDIT + w05
    └── weeks/w05/                    ← NEW
        ├── SearchBox.jsx             ← NEW  plain request/response — deliberately NOT streaming
        │                             │      (nothing generates here; SSE would be theatre)
        ├── ResultList.jsx            ← NEW  chunk text + source doc + rank
        ├── ScoreBar.jsx              ← NEW  similarity score made VISIBLE, not hidden —
        │                             │      it is how you debug bad recall by eye
        ├── IngestStatus.jsx          ← NEW  chunk count, last ingest, cache hit-rate
        └── index.js                  ← NEW
```

**Why Alembic lands here:** [ADR-009](TECH-STACK-DECISIONS.md) says add it *before the first schema
change that must survive existing data*. Adding a vector column to a populated database is that
change.

**Done:** recall@k measured on a fixed corpus and recorded in the README; re-ingest is idempotent
(same doc twice ≠ duplicate chunks); embedding cache hit-rate visible in `IngestStatus`.

---

### Week 6 — Full RAG Pipeline

**Goal:** retrieve → rerank → generate with **citations and confidence**. No claim without a source.
**Adds:** `retrieval/rerank.py` + `citations.py`. First reuse of `useSSEStream`.

**Architecture flow** — first time retrieval and generation compose
```
weeks/w06/AskView.jsx  ── useSSEStream (W4, unchanged) ──► POST /api/w06/ask
                                       ▼
                          apps/w06_rag_pipeline/pipeline.py
   ├─1─ retrieval.store_pgvector.query()        top-50 candidates
   ├─2─ retrieval.rerank                        top-50 → top-5   ← precision comes from here
   ├─3─ prompts.registry.get("rag_answer", v1)
   ├─4─ llm.streaming  ──→ Claude               context = top-5 chunks ONLY
   └─5─ retrieval.citations.verify()            claim → chunk map; unsourced claim lowers score
                                       ▼
   token… → data(Answer{text, citations[], confidence}) → done
                                       ▼
   AnswerView.jsx + CitationChip.jsx + ConfidenceMeter.jsx
   (low confidence renders a REFUSAL, not a hedged answer)
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   ├── retrieval/
│   │   ├── rerank.py                 ← NEW  cross-encoder or LLM reranker behind one port
│   │   └── citations.py              ← NEW  claim → chunk mapping
│   ├── schemas/common.py             ← EDIT Citation/Confidence confirmed as kernel
│   │                                 │      (second-use rule in action — born W4, proven W6)
│   └── prompts/templates/rag_answer/v1.md    ← NEW
└── apps/w06_rag_pipeline/            ← NEW
    ├── pipeline.py  router.py  schemas.py    ← NEW  Answer{text, citations[], confidence}
    ├── tests/                        ← NEW  + adversarial: question with NO supporting doc
    └── README.md
```

**Frontend folder delta**
```
└── src/
    ├── components/
    │   ├── CitationChip.jsx          ← NEW  inline [n]; hover → chunk text + source doc
    │   └── ConfidenceMeter.jsx       ← NEW  ⚠ below threshold renders a REFUSAL state,
    │                                 │      not a small grey caption under an answer
    ├── weeks/registry.js             ← EDIT + w06
    └── weeks/w06/                    ← NEW
        ├── AskView.jsx               ← NEW  reuses hooks/useSSEStream — ZERO changes to it
        ├── AnswerView.jsx            ← NEW  every claim links to its CitationChip
        ├── RetrievedContext.jsx      ← NEW  collapsible: the 5 chunks actually sent to the model
        └── index.js                  ← NEW
```

**Two proofs this week:** `useSSEStream` being reused without modification proves the Week 4 event
contract was right. `Citation` moving to `schemas/common.py` on its second consumer is the
second-use rule (§8) working as intended.

**Done:** a question with no supporting document returns low confidence and the UI **refuses** —
it does not hallucinate; every sentence of a high-confidence answer resolves to a chunk ID
reachable from `RetrievedContext`.

---

### Week 7 — Plain-Python Tool-Using Agent

**Goal:** real autonomy — plan → act → observe — with hard bounds. **No framework.**
**Adds:** `agent/`, `tools/parallel.py`, the **first process split** (`services/agent-runner`), and
the frontend's first *run-scoped* (not request-scoped) screen.

**Architecture flow** — the loop, and work leaving the request path
```
weeks/w07/RunLauncher.jsx ──POST /api/w07/run──► services/api ──enqueue──► Redis queue
        │                       returns {run_id}                              │
        └─ navigate to /w07/run/:run_id                                       ▼
                    │                                    services/agent-runner/worker.py
   hooks/useRunStream.js                                            ▼
   GET /api/w07/stream/{run_id}  ◄──┐          ┌── aiplat.agent.loop ──────────────┐
        ▲                           │          │  iteration ≤ max_iterations       │
        │                           │          │  ┌─ plan   → aiplat.llm           │
   RunTimeline.jsx                  │          │  ├─ act    → tools.parallel       │ asyncio.gather
   IterationCard.jsx                │          │  │           → tools.executor ×N  │
   "4/10 iterations · $0.12/$1.00"  │          │  ├─ observe → append to state     │
                                    │          │  └─ guards: duplicate-action,     │
                                    │          │             wall-clock, cost cap  │
                                    │          └───────────┬───────────────────────┘
                                    └── Redis pub/sub ◄────┘  aiplat.agent.state
                                                              (run state in REDIS, never in-process)
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   ├── agent/                        ← NEW
│   │   ├── ports.py                  ← NEW  what the loop is allowed to know about
│   │   ├── loop.py                   ← NEW  max_iterations · per-tool timeout · wall-clock budget
│   │   ├── state.py                  ← NEW  run state → Redis. NEVER a Python dict. See §11.6
│   │   └── guards.py                 ← NEW  duplicate-action detect · cost kill-switch
│   ├── tools/parallel.py             ← NEW  asyncio.gather — 3×500ms serial becomes 500ms
│   └── obs/trace.py                  ← NEW  span per iteration; the loop must be replayable
├── services/agent-runner/            ← NEW  ⚑ FIRST SEAM SPLIT (see §12)
│   └── worker.py  Dockerfile         ← NEW
├── apps/w07_tool_agent/              ← NEW
│   ├── router.py                     ← NEW  POST /run → run_id · GET /stream/{run_id}
│   ├── agent_config.py               ← NEW  which tools · which caps · which model tier
│   ├── tests/                        ← NEW  loop-bound tests · infinite-loop injection
│   └── README.md
└── apps/w04_holidaylandmarks/planner.py  ← EDIT optionally: fixed sequence → bounded loop
```

**Frontend folder delta**
```
└── src/
    ├── hooks/
    │   └── useRunStream.js           ← NEW  wraps useSSEStream + a run_id
    │                                 │  ⚑ THE SHIFT: POST returns a run_id, the stream is a
    │                                 │    SEPARATE GET. Page refresh, tab close, or a dropped
    │                                 │    connection must NOT lose the run — reconnect by id.
    │                                 │    (This is why agent/state.py lives in Redis, §11.6)
    ├── weeks/registry.js             ← EDIT + w07  (route now has a param: /w07/run/:runId)
    └── weeks/w07/                    ← NEW
        ├── RunLauncher.jsx           ← NEW  submit → run_id → navigate
        ├── RunTimeline.jsx           ← NEW  one row per loop iteration: plan → tools → observe
        ├── IterationCard.jsx         ← NEW  the guards MADE VISIBLE: iteration 4/10,
        │                             │      $0.12 / $1.00, elapsed 18s / 120s.
        │                             │      Without this, "hung" and "working" look identical.
        ├── RunList.jsx               ← NEW  recent runs + status — runs outlive the tab now
        └── index.js                  ← NEW
```

**Why the split happens here:** an agent run is seconds-to-minutes; holding an HTTP connection open
for it breaks the API under load. Because §2's dependency rule held, extracting the runner is a
deployment change — `aiplat/agent` did not move. The frontend consequence is equally structural:
**this is where the UI stops being request-scoped.**

**Done:** a tool stuck in a loop is killed by `guards.py`, not by the request timing out; killing
the worker mid-run and restarting resumes from Redis state; refreshing the browser mid-run
reattaches to the same run and loses nothing.

---

### Week 8 — LangGraph: Stateful Workflows, Checkpoints, Human Interrupts

**Goal:** durable, resumable workflows with a human approval gate.
**Adds:** `graph/`, `agent/approval.py`, and the frontend's first *queue* — a paused run must be
findable by someone who did not start it.

**Architecture flow** — the loop becomes a graph that can pause
```
aiplat.graph.builder ── StateGraph ──┐
                                      ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  node: plan  →  node: act  →  node: review                  │
   │                                  │                          │
   │                         aiplat.graph.interrupts             │
   │                         "needs human approval?"             │
   │                             yes │        │ no               │
   │                                 ▼        └──► node: commit  │
   │                         PAUSE + checkpoint                  │
   └─────────────────────────────────┬───────────────────────────┘
                                     ▼
             aiplat.graph.checkpointer ──► PostgreSQL agent_checkpoints
                                     ▲
   POST /api/w08/approve/{run_id} ───┘   resumes from the exact paused node, hours later,
        ▲                                 after a full process restart
        │
   components/ApprovalPanel.jsx  ◄── weeks/w08/PendingApprovals.jsx (a QUEUE, not a dead tab)
```

**Backend folder delta**
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
└── infra/alembic/versions/0002_checkpoints.py   ← NEW
```

**Frontend folder delta**
```
└── src/
    ├── components/
    │   └── ApprovalPanel.jsx         ← NEW  shared primitive — reused VERBATIM in W12.
    │                                 │      shows: what will happen · why · confidence ·
    │                                 │      Approve / Reject / Reject-with-note
    ├── weeks/registry.js             ← EDIT + w08
    └── weeks/w08/                    ← NEW
        ├── GraphView.jsx             ← NEW  nodes + edges + current position highlighted
        ├── CheckpointTimeline.jsx    ← NEW  every resume point, replayable
        ├── PendingApprovals.jsx      ← NEW  ⚑ a paused run is a QUEUE ITEM.
        │                             │      The approver may not be the person who started it,
        │                             │      and may arrive hours later — so it must be
        │                             │      discoverable from a list, not only from a live tab.
        └── index.js                  ← NEW
```

**Decision rule for later weeks:** use `aiplat/agent/loop.py` (W7) when a run is short and
stateless. Use `aiplat/graph/` (W8) when it must **pause, persist, and resume** — that is the only
thing that justifies the framework.

**Done:** a run pauses for approval, the whole stack restarts, approval arrives via
`PendingApprovals`, the run completes correctly; checkpoints are replayable and diffable.

---

### Week 9 — MCP Server with Bounded Tools

**Goal:** expose the tool layer over a standard protocol; consume third-party MCP servers.
**Adds:** `mcp/` and the **second process split** (`services/mcp-server`). Smallest frontend week —
MCP's real consumers are other agents, not this SPA.

**Architecture flow** — the tool layer becomes addressable from outside
```
   aiplat.agent.loop / aiplat.graph
              │
     ┌────────┴─────────┐
     ▼                  ▼
 aiplat.tools      aiplat.mcp.client ──► third-party MCP servers (wrapped by mcp/bounds.py)
 .registry
     │
     └──exposed by──► services/mcp-server ──MCP──► Claude Desktop · other agents · other apps
                            │
                     aiplat.mcp.bounds
                     scope + permission wrapper
                     ⚠ NO arbitrary SQL · NO shell · NO unbounded HTTP
                            │
                     weeks/w09/ToolCatalog.jsx  (read-only inspector)
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   ├── mcp/                          ← NEW
│   │   ├── server.py                 ← NEW  aiplat.tools.registry → MCP tool definitions
│   │   ├── client.py                 ← NEW  consume external MCP servers AS a ToolPort
│   │   └── bounds.py                 ← NEW  scope/permission wrapper — least privilege
│   └── security/authz.py             ← NEW  authorization matrix, now enforced cross-process
├── services/mcp-server/              ← NEW  ⚑ SECOND SEAM SPLIT
│   └── main.py  Dockerfile           ← NEW
└── apps/w09_mcp_tools/               ← NEW
    ├── tools/                        ← NEW  week-specific tools exposed via MCP
    ├── manifest.json                 ← NEW  declared scopes per tool
    ├── tests/                        ← NEW  privilege-escalation attempts must FAIL
    └── README.md
```

**Frontend folder delta**
```
└── src/
    ├── weeks/registry.js             ← EDIT + w09
    └── weeks/w09/                    ← NEW  (deliberately small — a dev inspector, not a product)
        ├── ToolCatalog.jsx           ← NEW  every registered tool + its declared scope,
        │                             │      rendered FROM manifest.json — never hand-listed
        ├── ScopeInspector.jsx        ← NEW  "given this client, what may it call?"
        ├── ToolTryIt.jsx             ← NEW  invoke one tool with validated input, see raw output
        └── index.js                  ← NEW
```

**Why this is nearly free:** `aiplat/tools/ports.py` was designed in Week 4 with
`input_schema`/`output_schema`/`authz_scope`. MCP is a serialization of exactly that. Had Week 4
used loose dicts, this week would be a rewrite — and `ToolCatalog.jsx` would have nothing to render.

**Done:** an external MCP client can call the tools and **cannot** exceed its declared scope; a
third-party MCP server is consumed through `client.py` as an ordinary `ToolPort`.

---

### Week 10 — Multi-Agent, Aggressively Simplified

**Goal:** supervisor-worker and router patterns — **and deleting the ones that aren't justified**.
**Adds:** `orchestration/`. Smallest kernel delta of any week, on purpose. The frontend's job this
week is to make the "did agents actually help?" question answerable **on screen**.

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
   (agent.loop W7)   (graph W8)        (agent.loop W7)
        └─────────────────┼─────────────────┘
                          ▼
            aiplat.orchestration.supervisor
            merge · resolve conflicts · ONE validated output
                          ▼
              schemas.events → data(Result)  →  AgentLanes.jsx (one lane per agent)

⚠ For every agent above, orchestration/README.md must answer:
  "what does this agent do that a deterministic function cannot?"
  No answer → delete the agent, write the function.
```

**Backend folder delta**
```
├── platform/src/aiplat/
│   └── orchestration/                ← NEW
│       ├── router.py                 ← NEW  classify → dispatch to one specialist
│       ├── supervisor.py             ← NEW  fan-out → merge → single validated result
│       └── README.md                 ← NEW  ⚠ justification log — one entry per agent
└── apps/w10_multi_agent/             ← NEW
    ├── agents/                       ← NEW  each ≤ ~100 lines; config, not cleverness
    ├── baseline.py                   ← NEW  the same task as plain deterministic code
    ├── router.py  tests/  README.md  ← NEW  where multi-agent WON and where it LOST
```

**Frontend folder delta**
```
└── src/
    ├── weeks/registry.js             ← EDIT + w10
    └── weeks/w10/                    ← NEW
        ├── RouterDecision.jsx        ← NEW  which specialist was picked, and on what signal
        ├── AgentLanes.jsx            ← NEW  parallel agents → parallel lanes, one timeline each;
        │                             │      reuses RunTimeline (W7) per lane
        ├── SupervisorMerge.jsx       ← NEW  what each agent returned vs. what was merged,
        │                             │      including conflicts and how they resolved
        ├── BaselineCompare.jsx       ← NEW  ⚑ multi-agent vs deterministic baseline:
        │                             │      quality · latency · cost, side by side.
        │                             │      This screen exists so the honest answer is
        │                             │      unavoidable rather than buried in a doc.
        └── index.js                  ← NEW
```

**The point of this week is subtraction.** The blog is explicit: *replace unnecessary agents with
deterministic code*. `BaselineCompare` showing the plain function winning is a **passing** result.

**Done:** the justification log has one entry per surviving agent; at least one candidate agent was
deleted in favor of deterministic code, with the comparison visible in `BaselineCompare`.

---

### Week 11 — Evaluation, Security, Observability

**Goal:** ≥50 test cases per service, security controls, full-stack tracing. **Nothing new ships to
users — everything already built gets provable.**
**Adds:** `evals/`, `security/` completed, `obs/redact.py`, CI gates, and the dashboard that closes
the correlation-ID loop opened in Week 2.

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
        ▼                                 obs.redact         PII · secrets · retrieved docs
  weeks/w11/ScoreDiff.jsx                   ▼
                                          obs.logging (operational) + audit log (separate)
                                            ▼
                                          weeks/w11/TraceView.jsx  ← one correlation ID,
                                                                     full span tree
```

**Backend folder delta**
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
│   ├── router.py                     ← NEW  /metrics · /evals · /traces/{correlation_id}
│   └── README.md
└── infra/ci/eval-gate.yml            ← NEW  ⚑ merge blocked on score regression
```

**Frontend folder delta**
```
└── src/
    ├── components/
    │   └── CostBadge.jsx             ← EDIT + per-user budget remaining, from security.limits
    ├── weeks/registry.js             ← EDIT + w11
    └── weeks/w11/                    ← NEW
        ├── ObservabilityDashboard.jsx ← NEW  cost · p95 latency · failure rate, BY WEEK
        ├── EvalRunView.jsx           ← NEW  suite results, per case, pass/fail/score
        ├── ScoreDiff.jsx             ← NEW  this run vs baseline — red = regression = blocked
        ├── TraceView.jsx             ← NEW  ⚑ paste a correlation ID → the full span tree:
        │                             │      request → agent iterations → tool calls → LLM calls,
        │                             │      with tokens and $ per span. This is the payoff of
        │                             │      the contextvar written in Week 2.
        └── index.js                  ← NEW
```

**Audit vs. operational logs:** the blog separates them. Operational logs are redacted and rotate;
audit logs record every tool call, approval, and external write, and are retained.

**Done:** a prompt edit that lowers scores blocks the merge; a prompt-injection corpus fails to make
any tool execute out of scope; no user PII appears in operational logs; any support question is
answerable by pasting a correlation ID into `TraceView`.

---

### Week 12 — 🏁 Capstone: Enterprise AI Operations Assistant

**Goal:** investigate errors → propose PRs → **require human approval** before any write.
**Kernel delta: none. Shared frontend delta: none.** That is the success criterion, on both sides.

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
        ├─ node: gather    → aiplat.retrieval (W5/W6)  logs, runbooks, incidents + CITATIONS
        ├─ node: diagnose  → aiplat.orchestration.router (W10) → specialist agent
        ├─ node: act       → aiplat.agent.loop (W7) → aiplat.tools (W4) / aiplat.mcp (W9)
        │                     ⚠ read-only tools ONLY at this stage
        ├─ node: propose   → Fix{diff, rationale, confidence, citations}   (W4 schemas)
        │        ▼
        │   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        │   ┃  interrupts (W8) → PAUSE + checkpoint        ┃
        │   ┃  HUMAN APPROVAL REQUIRED before ANY write    ┃
        │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        │        ▼ approved
        └─ node: commit    → write tool (idempotent, W4) → audit log (W11)
        ▼
  SSE (W4 event union) → useRunStream (W7) → weeks/w12/
        ▼
  evals (W11) score the whole pipeline in CI
```

**Backend folder delta — apps and infra only**
```
├── apps/w12_ai_ops_assistant/        ← NEW
│   ├── workflows/investigate.py      ← NEW  the graph definition
│   ├── approvals/policy.py           ← NEW  what requires a human, and from whom
│   ├── router.py                     ← NEW  /investigate · /approve/{id} · /stream/{id}
│   ├── tests/                        ← NEW  incident replay corpus
│   └── README.md
├── infra/docker-compose.yml          ← EDIT api + agent-runner + mcp-server + pg + redis
├── infra/ci/deploy.yml               ← NEW
└── platform/src/aiplat/              ← UNCHANGED  ⭐ the backend architecture's exam result
```

**Frontend folder delta — weeks/ only**
```
└── src/
    ├── weeks/registry.js             ← EDIT + w12
    ├── weeks/w12/                    ← NEW
    │   ├── IncidentView.jsx          ← NEW  gather → diagnose → act → propose, live
    │   │                             │      (useRunStream from W7, unchanged)
    │   ├── DiffReview.jsx            ← NEW  proposed patch + rationale + citations (W6 chips)
    │   │                             │      + ConfidenceMeter (W6)
    │   ├── ApprovalGate.jsx          ← NEW  thin wrapper over components/ApprovalPanel (W8)
    │   │                             │      ⚠ the ONLY path to an external write
    │   ├── AuditTrail.jsx            ← NEW  who approved what, when, and what was written
    │   └── index.js                  ← NEW
    ├── hooks/                        ← UNCHANGED  ⭐ the frontend architecture's exam result
    └── components/                   ← UNCHANGED  ⭐
```

**If Week 12 requires new `aiplat/` modules, or new shared `hooks/`/`components/`, a boundary was
drawn wrong somewhere in Weeks 1–11.** That is a falsifiable test of this design, not a vibe.

**Done:** no external write occurs without a recorded human approval; every proposed fix carries
citations and confidence; the full incident replay corpus passes in CI.

---

## 6. Cumulative Growth

| Wk | Topic | Kernel added | App folder | Frontend added | New deployable |
|----|-------|--------------|------------|----------------|----------------|
| 1 | LLM foundations | `config/` `llm/{ports,client,tokens}` | `w01_llm_lab` | *(none — no HTTP yet)* | — |
| 2 | FastAPI service | `obs/` `resilience/` | `w02_ai_service` | **whole SPA** · `registry.js` `client.js` `ErrorPanel` | **`services/api`** |
| 3 | Prompts as software | `prompts/` | `w03_prompt_lab` | `weeks/w03/` (diff, versions) | — |
| 4 | **Structured output + tools** | `schemas/` `tools/` `llm/streaming` `db/` | `w04_holidaylandmarks` | **`useSSEStream`** · `StreamLog` `CostBadge` | pg + redis |
| 5 | pgvector search | `retrieval/{embeddings,chunking,store}` | `w05_vector_search` | `weeks/w05/` (no streaming) | alembic |
| 6 | Full RAG | `retrieval/{rerank,citations}` | `w06_rag_pipeline` | `CitationChip` `ConfidenceMeter` | — |
| 7 | Tool agent | `agent/` `tools/parallel` | `w07_tool_agent` | **`useRunStream`** · `RunTimeline` `RunList` | **`agent-runner`** |
| 8 | LangGraph | `graph/` `agent/approval` | `w08_graph_workflows` | **`ApprovalPanel`** · `GraphView` | — |
| 9 | MCP | `mcp/` `security/authz` | `w09_mcp_tools` | `weeks/w09/` (inspector only) | **`mcp-server`** |
| 10 | Multi-agent | `orchestration/` | `w10_multi_agent` | `AgentLanes` `BaselineCompare` | — |
| 11 | Evals + security + obs | `evals/` `security/` `obs/redact` | `w11_eval_guardrails` | `TraceView` `ScoreDiff` dashboard | CI eval gate |
| 12 | 🏁 AI Ops Assistant | **nothing** | `w12_ai_ops_assistant` | **`weeks/w12/` only** | full compose |

Shared frontend primitives are created in exactly **four** weeks — 2, 4, 7, 8. Weeks 3, 5, 6, 9,
10, 11, 12 add screens only. If a late week needs a new shared hook, that is the same warning sign
as a late week needing a new kernel module.

---

## 7. Final Folder Structure (Week 12)

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
├── frontend/
│   ├── index.html · vite.config.js · package.json · .env.example
│   └── src/
│       ├── main.jsx · App.jsx                                     W2
│       ├── api/client.js                                          W2
│       ├── hooks/
│       │   ├── useBackendStatus.js                                W2
│       │   ├── useSSEStream.js       ⭐ the streaming contract     W4
│       │   └── useRunStream.js       ⭐ run-scoped, reconnectable  W7
│       ├── components/
│       │   ├── ErrorPanel.jsx                                     W2
│       │   ├── StreamLog.jsx · CostBadge.jsx                      W4
│       │   ├── CitationChip.jsx · ConfidenceMeter.jsx             W6
│       │   └── ApprovalPanel.jsx                                  W8
│       └── weeks/
│           ├── registry.js           ⭐ mirror of mounts.py        W2
│           └── w02/ w03/ w04/ w05/ w06/ w07/ w08/ w09/ w10/ w11/ w12/
│
├── infra/{docker-compose.yml, alembic/, ci/}
└── tests/{contract/, integration/, regression/, conftest.py}
```

---

## 8. What Goes Where

**Backend**

| Signal | Goes in |
|---|---|
| Retry, timeout, logging, cost, auth, redaction | `aiplat/` — always |
| A tool any agent could call | `aiplat/tools/impl/` |
| A Pydantic type crossing a module boundary | `aiplat/schemas/` |
| Domain vocabulary of one week (`Itinerary`, `Stop`) | `apps/wNN/schemas.py` |
| A prompt template | `aiplat/prompts/templates/` (versioned) |
| "Call these 3 kernel pieces in this order" | `apps/wNN/service.py` |
| HTTP shape, status codes, SSE endpoint | `apps/wNN/router.py` |

**Frontend**

| Signal | Goes in |
|---|---|
| Consumes the SSE event union in any way | `hooks/` — always |
| Renders a kernel schema (`errors`, `Citation`, cost) | `components/` |
| Used by two or more weeks | `components/` or `hooks/` |
| Renders this week's domain object (`Itinerary`) | `weeks/wNN/` |
| Form whose shape mirrors one week's request schema | `weeks/wNN/` |
| Makes a week reachable | one entry in `weeks/registry.js` |

**Second-use rule (both sides):** the first week to need something writes it locally. The **second**
week to need it promotes it to `aiplat/` or `components/` **in the same PR**. Never speculatively
generalize on first use. Worked examples: `Citation` (W4 → W6), `ApprovalPanel` (W8 → W12).

---

## 9. Kernel Contracts

Four contracts are the spine. Every week honors them; the frontend consumes all four.

1. **SSE event union** (`schemas/events.py`, W4) — `token · tool_call · tool_result · data · error
   · done`. `data` carries the week's validated payload. Written once, so `useSSEStream.js` is too.
2. **Typed error envelope** (`schemas/errors.py`, W4) — `{code, message, correlation_id,
   retryable}`. Never a traceback. A failed stream emits `error` then `done`; it never drops.
   `ErrorPanel.jsx` renders this shape and nothing else.
3. **Tool port** (`tools/ports.py`, W4) — `name · description · input_schema · output_schema ·
   timeout_s · authz_scope · async run()`. Adding a tool requires an authorization-matrix entry.
   `ToolCatalog.jsx` (W9) renders straight from it.
4. **Correlation ID** (`obs/correlation.py`, W2) — one contextvar, read by every log line, LLM call,
   tool call, and query; issued by `api/client.js` and resolvable in `TraceView.jsx` (W11).

---

## 10. Performance Rules (apply from Week 2)

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
   without dropping streams, no seam extraction — and a reconnecting `EventSource` lands on the
   wrong worker, which is exactly what `useRunStream` assumes cannot happen.
7. **Frontend:** never re-render the whole stream on every `token`. Buffer tokens and flush on a
   frame; `StreamLog` and `ItineraryView` subscribe to different slices of the hook's state.

Not your bottleneck — skip: gRPC between modules, pool micro-tuning, leaving Python.

---

## 11. Scaling Path — when a seam splits

| Module | Trigger | Becomes | Week |
|---|---|---|---|
| `services/api` | never | API gateway / BFF | W2 |
| `aiplat/agent` | runs exceed ~30s, or need crash-resume | **`agent-runner`** | **W7** |
| `aiplat/tools` | rate limits, >8 tools, or another app wants them | **`mcp-server`** | **W9** |
| `aiplat/retrieval` | reindexing competes with query latency | retrieval service | post-W12 |
| `aiplat/llm` | never — it's a client library | stays a package | — |
| `aiplat/db` | only *after* the above split | per-service schemas | post-W12 |
| `frontend/` | never — micro-frontends buy nothing here | one SPA | — |

Each split gets an ADR in [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md) when it happens.

---

## 12. Commands

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
cd frontend; npm install; npm run dev           # :5173 — every week in one SPA

pytest platform                                 # kernel
pytest apps/w04_holidaylandmarks                # one week
pytest                                          # everything
cd frontend; npm test                           # component tests
python -m aiplat.evals.harness --suite apps/w04_holidaylandmarks   # W11+

& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -d holidaylandmark
```

---

## 13. Migration From Today's Repo

The repo is `backend/` + `frontend/` (Week 4 only). Seven steps, **one commit** — a half-migrated
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
6. **Frontend:** `src/components/Home.jsx` → `src/weeks/w02/`; create `src/weeks/registry.js` and
   rewrite `App.jsx` to build nav from it; keep `hooks/useBackendStatus.js` and `api/client.js`
   where they are — they are already correctly placed as shared.
7. Create empty `src/weeks/w04/` and `src/hooks/useSSEStream.js` — Week 4's frontend work lands
   there next.

Then backfill Weeks 1–3 (`aiplat/llm/`, `aiplat/prompts/`) and finish Week 4's kernel
(`aiplat/schemas/`, `aiplat/tools/`) per [doc/feature.md](doc/feature.md) F1–F15.

---

## 14. Definition of Done — per week

- [ ] Acceptance criteria in `apps/wNN/README.md` met and checked off
- [ ] Pydantic validation on **every** backend boundary the week touches
- [ ] Kernel additions in `aiplat/`; app folder thin (wiring + week vocabulary only)
- [ ] Shared frontend additions in `hooks/`/`components/`; `weeks/wNN/` holds screens only
- [ ] Both dependency rules hold — Python and JS import checks pass in CI
- [ ] `weeks/registry.js` updated; the week is reachable without touching `App.jsx`
- [ ] External calls: timeout + backoff + breaker; agent paths respect `max_iterations`
- [ ] Typed error envelope; stream emits `error` then `done`; UI never hangs in `streaming`
- [ ] Tests: unit + contract + failure-injection; mock LLM and mock tools, offline-deterministic
- [ ] Correlation ID in every log line and surfaced in the UI; tokens + cost per request
- [ ] Prompts versioned at `aiplat/prompts/templates/<name>/vN.md`; eval suite green (W11+)
- [ ] ADR added or updated if an architectural decision changed
- [ ] This file's week section updated if the actual folder delta differed from the plan

---

## 15. Non-Goals

Real bookings/payments, live inventory, native mobile, Kubernetes, micro-frontends, and any
microservice split before its §11 trigger fires. Multi-agent orchestration is a **Week 10**
capability — never an excuse to use agents where deterministic code is correct.

---

## 16. Reference

- Methodology: [Master Prompt for AI Agentic Developers](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
- Week-4 scope: [doc/feature.md](doc/feature.md) · Decisions: [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md)
- Working rules: [CLAUDE.md](CLAUDE.md) · Run instructions: [RUN.md](RUN.md)
