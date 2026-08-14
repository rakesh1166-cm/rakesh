# W4-F4.5 — SSE Event Union + Streaming

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F6](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F6** (streaming responses)
**Layer:** `platform/src/aiplat/schemas/events.py` + `aiplat/llm/streaming.py` (kernel)
**Depends on:** [F4.2](../F4.2-itinerary-schema-and-repair/CLAUDE.md)
**Consumed by:** **every streaming week** — W6, W7, W8, W10, W12, and `useSSEStream` in F4.7

## Goal

**One event contract for the whole repo.** Written once here so `useSSEStream.js` is also written
once. Every later streaming feature emits this union; if a week needs to change it, the contract was
wrong and the contract gets fixed — not forked.
([ADR-005](../../../TECH-STACK-DECISIONS.md))

## Contract (schema first)

```python
class EventType(str, Enum):
    TOKEN = "token"; TOOL_CALL = "tool_call"; TOOL_RESULT = "tool_result"
    DATA = "data"; ERROR = "error"; DONE = "done"

class TokenEvent(BaseModel):
    type: Literal[EventType.TOKEN] = EventType.TOKEN
    text: str
class ToolCallEvent(BaseModel):
    type: Literal[EventType.TOOL_CALL] = EventType.TOOL_CALL
    call_id: str; name: str; args_summary: str      # SUMMARY — args may contain user content
class ToolResultEvent(BaseModel):
    type: Literal[EventType.TOOL_RESULT] = EventType.TOOL_RESULT
    call_id: str; name: str; ok: bool
    summary: str; duration_ms: float; cached: bool
class DataEvent(BaseModel):
    """The week's validated payload. W4 → Itinerary, W6 → Answer, W12 → Fix."""
    type: Literal[EventType.DATA] = EventType.DATA
    payload: dict[str, Any]
    schema_name: str                 # "Itinerary" — lets the client pick its validator
class ErrorEvent(BaseModel):
    type: Literal[EventType.ERROR] = EventType.ERROR
    error: ErrorEnvelope             # W2-F2.3, reused verbatim — NOT a second error shape
class DoneEvent(BaseModel):
    type: Literal[EventType.DONE] = EventType.DONE
    usage: Usage; total_cost_usd: float; correlation_id: str

StreamEvent = Annotated[Union[...], Field(discriminator="type")]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/schemas/events.py` | NEW | the union above |
| `platform/src/aiplat/llm/streaming.py` | NEW | provider stream → typed events |
| `platform/src/aiplat/llm/caching.py` | NEW | prompt caching on system prompt + tool defs |
| `apps/w04_holidaylandmarks/router.py` | EDIT | `StreamingResponse` with `text/event-stream` |

## Flow

```
provider stream chunks
      ▼
llm/streaming.py  ──► TokenEvent per text delta
                  ──► ToolCallEvent when the model requests a tool
      ▼
executor (F4.3)   ──► ToolResultEvent
      ▼
Itinerary validated (F4.2) ──► DataEvent{payload, schema_name:"Itinerary"}
      ▼
DoneEvent{usage, cost, correlation_id}        ← ALWAYS the last event, on every path

failure at ANY point ──► ErrorEvent ──► DoneEvent      (never a dropped connection)
```

## Rules

- **`done` is always last, on every path.** Success, error, cap-reached, client-abort — all end with
  `done`. A client that never receives `done` hangs in `streaming` forever, and that is the single
  most common streaming bug.
- **`error` is followed by `done`.** Never close the connection on error
  ([CLAUDE.md §1](../../../CLAUDE.md)).
- **`data` replaces the token text; it does not merge with it.** Tokens are a progress indicator.
  The validated payload is the answer.
- `args_summary`, not raw args. Tool arguments can contain user content; the stream is not a log.
- `schema_name` lets the client pick its validator — how one hook serves `Itinerary`, `Answer`,
  and `Fix` without knowing any of them.
- **The union is week-agnostic.** No HolidayLandmarks vocabulary in `events.py`. If "itinerary"
  appears there, the contract is already broken for W6.
- Client disconnect must **cancel** the work, not orphan it. Otherwise a user closing a tab keeps
  paying for tokens.
- SSE frames: `event: <type>\ndata: <json>\n\n`, plus a heartbeat comment every 15s so proxies
  don't reap an idle stream.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| LLM fails mid-stream | `error` then `done`; connection closes cleanly |
| Tool fails mid-stream | `tool_result{ok:false}`, stream continues, `warnings[]` in the payload |
| Validation fails after streaming | Repair once (F4.2); then `error` + `done` |
| Client disconnects | Work is cancelled; the cancellation is logged; no orphan LLM call |
| Proxy idles the connection out | Heartbeat comments keep it alive |
| Payload for an unknown `schema_name` | Client ignores it gracefully; unknown events are not fatal |

## Tests

- `test_done_is_always_the_final_event` — parametrised over success, error, cap, abort
- `test_error_is_followed_by_done_not_a_disconnect`
- `test_client_disconnect_cancels_the_llm_call`
- `test_events_py_contains_no_week_specific_vocabulary` — string scan
- `test_tool_args_are_summarised_not_raw`
- `test_unknown_event_type_is_ignored_by_the_client` (frontend)

## Acceptance criteria

- [ ] Every stream terminates with exactly one `done`, on every path
- [ ] `error` never terminates the connection by itself
- [ ] `events.py` mentions no week-specific type — greppable proof
- [ ] Closing the browser tab stops token spend within one iteration
- [ ] W6 will reuse this union with zero changes (asserted again in W6-F6.5)
