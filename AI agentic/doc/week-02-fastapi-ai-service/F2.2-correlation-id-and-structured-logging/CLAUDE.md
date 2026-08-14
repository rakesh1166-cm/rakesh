# W2-F2.2 — Correlation ID + Structured Logging + Cost

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/obs/` (kernel)
**Depends on:** [F2.1](../F2.1-api-skeleton-and-week-mounts/CLAUDE.md)
**Consumed by:** every module, every week. Directly paid off by [W11-F11.6](../../week-11-evals-security-observability/F11.6-redaction-audit-log-and-traceview/CLAUDE.md)

## Goal

One ID that answers, months later, **"what did this request actually do and what did it cost?"** —
threaded request → agent → tool → LLM → logs without being passed as a function argument through
every layer. ([ADR-010](../../../TECH-STACK-DECISIONS.md))

## Contract (schema first)

```python
# aiplat/obs/correlation.py
_correlation_id: ContextVar[str]
def new_correlation_id() -> str            # uuid4 hex
def get_correlation_id() -> str            # raises if unset — never returns "unknown"
def bind(cid: str) -> AbstractContextManager

# aiplat/obs/logging.py  — every log line is this shape, no exceptions
class LogRecord(BaseModel):
    ts: datetime
    level: Literal["debug", "info", "warn", "error"]
    event: str                  # machine-readable: "tool.call", "llm.complete", "http.request"
    correlation_id: str
    duration_ms: float | None = None
    attrs: dict[str, Any] = {}  # redacted before emission from W11

# aiplat/obs/cost.py
class CostEntry(BaseModel):
    correlation_id: str
    model_id: str
    input_tokens: int
    output_tokens: int
    cache_read_tokens: int = 0
    cost_usd: float
    component: str              # "w02.summarize" | "w07.agent.plan" | "w06.rerank"

def record(entry: CostEntry) -> None
def total_for(correlation_id: str) -> float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/obs/correlation.py` | NEW | the contextvar and its accessors |
| `platform/src/aiplat/obs/logging.py` | NEW | JSON formatter + `get_logger()` — the only entrypoint |
| `platform/src/aiplat/obs/cost.py` | NEW | per-request token/cost accumulation |
| `services/api/middleware/correlation.py` | NEW | read `X-Correlation-ID` or mint one; echo it back |
| `platform/src/aiplat/llm/anthropic_client.py` | EDIT | emit a `CostEntry` on every completion |

## Flow

```
inbound request
   ├─ has X-Correlation-ID?  → bind it     (client-supplied, so the UI can quote it)
   └─ no                     → mint uuid4
        ▼
   contextvar set for the whole request scope
        ▼
   every get_logger().info(event=..., ...)  reads it implicitly — NOT passed as an argument
        ▼
   llm.complete()  → cost.record(CostEntry(correlation_id=..., component=...))
        ▼
   response header X-Correlation-ID echoed  → api/client.js surfaces it in the UI
```

## Rules

- **`get_logger()` is the only way to log.** No `print`, no bare `logging.getLogger`, no
  `console.log` in shipped frontend code ([ADR-010](../../../TECH-STACK-DECISIONS.md)).
- The ID travels in a **contextvar**, never as a parameter. Threading it manually breaks the moment
  Week 7 moves work to a background worker.
- `get_correlation_id()` **raises** when unbound. A log line with `"unknown"` is worse than a crash
  in tests — it hides the bug until production.
- `event` is a machine-readable dotted name; human prose belongs in `attrs`, not in `event`.
- `component` on `CostEntry` is mandatory. Without it, Week 11 cannot answer "which week costs most".
- Contextvars propagate into `asyncio.gather` — verify this in a test, because Week 7 depends on it.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Client sends no header | ID is minted; response still carries one |
| Client sends a garbage/oversized header | Rejected and replaced; never logged raw (injection vector) |
| Background task started with `asyncio.create_task` | ID must propagate — explicit test |
| `asyncio.gather` over N tools | All N log lines share the parent ID (needed by W7-F7.4) |
| Log record fails to serialise | Falls back to a minimal record; logging never raises into the app |

## Tests

- `test_correlation_id_propagates_into_gather` — the W7 prerequisite
- `test_correlation_id_propagates_into_create_task`
- `test_client_supplied_id_is_validated_not_trusted_verbatim`
- `test_get_correlation_id_raises_when_unbound`
- `test_cost_total_for_request_sums_all_components`
- `test_no_print_or_bare_logger_in_repo` — AST scan over `platform/`, `apps/`, `services/`

## Acceptance criteria

- [ ] Every log line in a request contains the same correlation ID
- [ ] The response header carries the ID and the UI displays it
- [ ] `cost.total_for(cid)` sums every LLM call made during that request
- [ ] `grep -rn "print(" platform/ apps/ services/` returns nothing in shipped code
- [ ] The propagation tests for `gather` and `create_task` pass — Weeks 7 and 10 depend on them
