# Week 4 — HolidayLandmarks ⭐ (Structured Output + Tools + Streaming)

> [doc index](../CLAUDE.md) · [scope narrative: feature.md](../feature.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

The **current project** and the largest single week. A traveler's free-text request becomes a
strictly-typed `Itinerary`, produced by calling real tools, streamed over SSE, and persisted.

Three kernel contracts are born here and are never rewritten: the **SSE event union**, the **tool
port + authorization matrix**, and the **repair-retry discipline** on structured output.

> **Legacy IDs.** [feature.md](../feature.md) numbers these F1–F15. Each feature below names the
> F-IDs it covers. `feature.md` stays the narrative scope document; these files are the contracts.

## Features (8)

| ID | Feature | Covers | Layer | Depends on |
|---|---|---|---|---|
| [F4.1](F4.1-trip-request-intake/CLAUDE.md) | Trip request intake + injection guard | F1 | `apps/w04/schemas.py` | W3-F3.2 |
| [F4.2](F4.2-itinerary-schema-and-repair/CLAUDE.md) | `Itinerary` schema + repair retry | F2, F10 | `apps/w04/schemas.py` | F4.1 |
| [F4.3](F4.3-tool-port-registry-executor/CLAUDE.md) | Tool port, registry, authorization matrix, executor | F7 (infra) | `aiplat/tools/` | W2-F2.4 |
| [F4.4](F4.4-tools-landmark-weather-geocode/CLAUDE.md) | The three tools + Redis cache | F3, F4, F5 | `aiplat/tools/impl/` | F4.3 |
| [F4.5](F4.5-sse-streaming-contract/CLAUDE.md) | SSE event union + streaming | F6 | `aiplat/schemas/events.py` | F4.2 |
| [F4.6](F4.6-bounded-tool-sequence-and-persistence/CLAUDE.md) | Bounded tool sequence, idempotency, persistence | F7, F12 | `apps/w04/planner.py`, `aiplat/db/` | F4.3–F4.5 |
| [F4.7](F4.7-react-itinerary-ui/CLAUDE.md) | `useSSEStream` + itinerary UI + cost badge | F8, F10, F11 | `frontend/src/` | F4.5, F4.6 |
| [F4.8](F4.8-conversation-memory-and-refinement/CLAUDE.md) | Conversation memory, refinement, compaction | **F9** | `aiplat/memory/` | F4.2, W1-F1.3 |

## Architecture flow

```
PromptComposer.jsx ──POST /api/w04/plan──► services/api ──► apps/w04/router.py (SSE)
                                                                 ▼
                                                        apps/w04/planner.py
        ┌────────────────────────┬───────────────────────────────┴──────────────┐
        ▼                        ▼                                              ▼
 aiplat.prompts (W3)   aiplat.llm.streaming                        aiplat.tools.executor
                        token → SSE event                validate→authorize→timeout→run→validate
                               │                                     │
                               │                          impl/{landmarks,weather,geocode}
                               │                              Redis cache · egress allow-list
                               ▼
        aiplat.schemas.events → token | tool_call | tool_result | data(Itinerary) | error | done
                               ▼
        aiplat.db → PostgreSQL agent_itineraries        (idempotency key on POST)
                               ▼
        hooks/useSSEStream.js → ItineraryView.jsx  (renders `data`, never the token text)
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── schemas/{events.py, errors.py, common.py}          ← NEW (errors.py from W2)
│   ├── tools/{ports.py, registry.py, executor.py, impl/}  ← NEW
│   ├── llm/{streaming.py, caching.py, tiering.py}         ← NEW
│   ├── resilience/idempotency.py                          ← NEW
│   ├── security/egress.py                                 ← NEW
│   └── db/{session.py, base.py, models/landmark.py}       ← NEW
├── apps/w04_holidaylandmarks/{router,schemas,planner}.py  ← NEW  (migrated from backend/)
│   └── prompts/ data/ tests/                              ← NEW
└── infra/docker-compose.yml                               ← NEW  postgres:5433 + redis
```

**Frontend**
```
└── src/
    ├── hooks/useSSEStream.js                              ← NEW ⭐ written once, reused W6–W12
    ├── components/{StreamLog, CostBadge}.jsx              ← NEW
    ├── components/ErrorPanel.jsx                          ← EDIT + retryable → Retry button
    └── weeks/w04/{PromptComposer, ItineraryView, ItinerarySkeleton, validateItinerary}  ← NEW
```

## Build order

1. **F4.1** intake — the input contract and the injection guard.
2. **F4.2** `Itinerary` + repair retry — the output contract. Schema before tools, always.
3. **F4.3** tool infrastructure — port, registry, authorization matrix, executor.
4. **F4.4** the three tools — trivial once F4.3 exists.
5. **F4.5** SSE event union — the streaming contract.
6. **F4.6** planner + persistence — wires 4.2–4.5 into a bounded sequence.
7. **F4.7** the UI — consumes F4.5's contract.

**F4.3 before F4.4** is the load-bearing ordering. Writing the weather tool first produces a tool
shaped around weather; writing the port first produces a port that Week 9 can serialise to MCP.

## Week Definition of Done

- [ ] Every response is a validated `Itinerary` or a typed envelope — never model prose
- [ ] Malformed LLM output triggers exactly one repair retry, then a typed failure
- [ ] Every tool has an authorization-matrix entry; adding one without it fails a test
- [ ] A dead weather API degrades the itinerary (with a `warnings[]` entry) instead of failing it
- [ ] `error` is always followed by `done`; the stream never drops and the UI never hangs
- [ ] The tool sequence is bounded; a runaway cannot exceed the wall-clock budget
- [ ] `POST /plan` is idempotent under a repeated idempotency key
- [ ] `useSSEStream` is week-agnostic — it contains no HolidayLandmarks vocabulary

## What this week unlocks

`schemas/events.py` and `tools/ports.py` are the two contracts the rest of the repo is built on.
Week 6 reuses `useSSEStream` unchanged; Week 7 wraps the tool executor in a loop; Week 9 serialises
the tool port to MCP essentially for free. If either contract is designed loosely here, those weeks
become rewrites.
