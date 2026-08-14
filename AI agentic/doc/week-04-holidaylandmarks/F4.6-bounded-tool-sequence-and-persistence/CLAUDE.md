# W4-F4.6 — Bounded Tool Sequence, Idempotency, Persistence

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F7, F12](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F7** (bounded loop), **F12** (save/share itinerary)
**Layer:** `apps/w04_holidaylandmarks/planner.py` + `aiplat/db/` + `aiplat/resilience/idempotency.py`
**Depends on:** [F4.3](../F4.3-tool-port-registry-executor/CLAUDE.md), [F4.4](../F4.4-tools-landmark-weather-geocode/CLAUDE.md), [F4.5](../F4.5-sse-streaming-contract/CLAUDE.md)
**Consumed by:** W7 replaces the fixed sequence with a real agent loop

## Goal

Wire everything into a **bounded, deterministic sequence** that always terminates, and persist the
result so it can be fetched and shared.

Deliberately **not an agent yet**. The master prompt's rule is *determinism first, autonomy later* —
Week 7 introduces the loop, after this fixed pipeline has proven the tool layer works.

## Contract (schema first)

```python
class PlanBudget(BaseModel):
    max_tool_calls: int = 8          # not iterations — there is no loop yet
    wall_clock_s: float = 60.0
    max_cost_usd: float = 0.50

class PlanOutcome(BaseModel):
    itinerary: Itinerary
    tool_results: list[ToolResult]
    budget_hit: Literal["none","tool_calls","wall_clock","cost"]
    usage: Usage

# aiplat/db/models/itinerary.py  → table agent_itineraries
#   id (uuid) · correlation_id · idempotency_key (unique, nullable)
#   request_json · itinerary_json · created_at · share_token (unique, nullable)
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w04_holidaylandmarks/planner.py` | NEW | the fixed sequence + budget enforcement |
| `platform/src/aiplat/resilience/idempotency.py` | NEW | Redis key store for `POST` replay safety |
| `platform/src/aiplat/db/{session.py,base.py}` | NEW | SQLAlchemy 2.x engine + session factory |
| `platform/src/aiplat/db/models/itinerary.py` | NEW | `agent_itineraries` |
| `apps/w04_holidaylandmarks/router.py` | EDIT | `GET /itinerary/{id}`, `GET /shared/{token}` |

## Flow

```
TripRequestNormalized (F4.1) + Idempotency-Key header
      ▼
idempotency.check(key) ── seen? ──► replay the stored PlanOutcome, spend nothing
      ▼
1. geocode(city)                    → resolve, or ask for clarification and stop
2. landmark_search(city, theme)     → candidates from the curated dataset
3. weather_forecast(lat,lng,dates)  → may degrade to stale/absent + warnings[]
4. distance(...) × pairs            → order stops, minimise backtracking
      │   after EVERY step: budget check → exceeded? finalise with warnings[]
      ▼
5. llm.complete(prompt=trip_plan/v1, context=tool results)   ← model ARRANGES, does not invent
      ▼
6. Itinerary.model_validate → repair once (F4.2)
      ▼
7. persist (session opened AFTER the LLM call — see rules) → DataEvent → DoneEvent
```

## Rules

- **Never hold a DB session across an `await` on the LLM**
  ([architecture §10](../../../CLAUDE-12-WEEK.md)). Sync SQLAlchemy runs in FastAPI's threadpool
  (~40 threads); a session held across a 4s model call caps concurrency at ~40 regardless of
  hardware. Read → close → call the model → open → write.
- **Budget exhaustion is a `warnings[]` entry, not an error.** A partial itinerary with
  "couldn't check weather for day 3" beats a 500 ([feature.md F7](../../feature.md)).
- **The sequence is fixed and deterministic.** The model arranges tool output; it does not decide
  which tools to call. That decision arrives in W7 — with iteration caps and guards attached.
- Idempotency key is **required** on `POST /plan`. Two clicks must not equal two model runs
  ([ADR-011](../../../TECH-STACK-DECISIONS.md)).
- `share_token` is a random 128-bit token, not the row ID. Sequential IDs make every saved itinerary
  enumerable.
- Tables carry the `agent_` prefix — the `holidaylandmark` database holds an unrelated CMS schema
  ([ADR-009](../../../TECH-STACK-DECISIONS.md)).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Geocode returns nothing | Stop early, ask for clarification — do not plan for a guessed city |
| Weather down | Continue; `warnings[]`; itinerary still produced |
| Wall-clock exceeded mid-sequence | Finalise with what exists + `budget_hit="wall_clock"` |
| Same idempotency key twice | Second request replays the stored outcome; zero tokens spent |
| DB down at persist time | Itinerary still streamed to the client; `warnings[]` notes it wasn't saved |
| Session held across the LLM await | Load test caps at ~40 concurrent — this is the regression to catch |

## Tests

- `test_no_db_session_is_open_during_an_llm_call` — instrument the session factory
- `test_duplicate_idempotency_key_spends_zero_tokens`
- `test_budget_exhaustion_returns_partial_itinerary_with_warnings`
- `test_db_failure_still_streams_the_itinerary`
- `test_share_token_is_not_derivable_from_the_id`
- `test_sequence_is_deterministic_with_mocked_tools` — same input → same tool call order

## Acceptance criteria

- [ ] The sequence always terminates within the wall-clock budget
- [ ] No DB session is ever open across an `await` on the model
- [ ] A repeated idempotency key returns the stored result and spends nothing
- [ ] Every degradation appears in `warnings[]`; degradation never becomes an error
- [ ] Saved itineraries are fetchable by ID and shareable by unguessable token
- [ ] W7 can replace the sequence with a loop without touching `aiplat/tools/`
