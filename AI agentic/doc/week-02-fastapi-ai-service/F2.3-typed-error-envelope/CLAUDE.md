# W2-F2.3 — Typed Error Envelope

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `aiplat/schemas/errors.py` (kernel) + `services/api/middleware/errors.py`
**Depends on:** [F2.2](../F2.2-correlation-id-and-structured-logging/CLAUDE.md)
**Consumed by:** every endpoint, every week — and the SSE `error` event in W4

## Goal

**Fail typed, not raw** ([CLAUDE.md §1](../../../CLAUDE.md)). One envelope shape for every failure
in the system, so the frontend renders errors from a *schema* instead of sniffing strings, and no
stack trace ever reaches a user.

## Contract (schema first)

```python
class ErrorCode(str, Enum):
    VALIDATION_FAILED   = "validation_failed"      # 422
    UPSTREAM_TIMEOUT    = "upstream_timeout"       # 504  retryable
    UPSTREAM_UNAVAILABLE= "upstream_unavailable"   # 503  retryable
    RATE_LIMITED        = "rate_limited"           # 429  retryable
    BUDGET_EXCEEDED     = "budget_exceeded"        # 402  NOT retryable
    NOT_AUTHORIZED      = "not_authorized"         # 403
    NOT_FOUND           = "not_found"              # 404
    AGENT_CAP_REACHED   = "agent_cap_reached"      # 200 + warnings (W7)
    INTERNAL            = "internal"               # 500

class ErrorEnvelope(BaseModel):
    code: ErrorCode
    message: str                  # user-safe. Never an exception string.
    correlation_id: str
    retryable: bool
    retry_after_s: float | None = None
    details: dict[str, Any] = {}  # field-level validation info ONLY

class AppError(Exception):
    code: ErrorCode
    http_status: int
    message: str
    retryable: bool
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/schemas/errors.py` | NEW | `ErrorCode`, `ErrorEnvelope`, `AppError` hierarchy |
| `services/api/middleware/errors.py` | NEW | handlers for `AppError`, `RequestValidationError`, `Exception` |
| `platform/src/aiplat/llm/anthropic_client.py` | EDIT | provider exceptions → `AppError` subclasses |

## Flow

```
raise LLMRateLimited(...)          any layer
        ▼
services/api/middleware/errors.py
        ├─ AppError               → envelope with its code + status
        ├─ RequestValidationError → VALIDATION_FAILED 422, details = field errors
        └─ bare Exception         → INTERNAL 500, message="Something went wrong",
                                     full traceback logged with the correlation ID,
                                     NOTHING of it in the response
        ▼
{code, message, correlation_id, retryable, retry_after_s}
        ▼
components/ErrorPanel.jsx  → retryable ? show Retry : show correlation ID to quote
```

## Rules

- **The catch-all handler never echoes the exception.** The traceback goes to logs; the response
  gets a fixed safe message plus the correlation ID. This is the one rule with a security impact.
- `retryable` is set by the **error type**, never by the caller. `BUDGET_EXCEEDED` retryable would
  turn a cost cap into a cost amplifier.
- `details` carries structured field errors only — never free text, never upstream response bodies.
- W4 reuses this exact model as the SSE `error` event payload. Do not fork a second shape.
- Every `AppError` subclass declares its HTTP status once, next to its code.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Unhandled `ZeroDivisionError` in a handler | 500 + `INTERNAL` envelope; traceback in logs only |
| Provider 429 with `Retry-After` | `RATE_LIMITED`, `retryable=true`, `retry_after_s` populated |
| Pydantic validation failure | 422 + per-field `details`; no internal type names leaked |
| Error raised *mid-SSE-stream* (W4) | `error` event then `done` — the connection is never dropped |
| Secret appears in an exception message | Redaction (W11) applies before logging; message is fixed text |

## Tests

- `test_unhandled_exception_leaks_no_traceback` — assert the response body against a fixture
- `test_every_error_code_maps_to_exactly_one_http_status`
- `test_budget_exceeded_is_not_retryable`
- `test_validation_details_contain_no_internal_type_names`
- `test_envelope_always_carries_the_request_correlation_id`

## Acceptance criteria

- [ ] No endpoint can return an error that is not an `ErrorEnvelope`
- [ ] A forced 500 returns a fixed safe message and a correlation ID resolvable in logs
- [ ] `retryable` is derived from the error type, unsettable by callers
- [ ] `ErrorPanel.jsx` renders from the schema — zero string matching on `message`
- [ ] W4's SSE `error` event reuses this model without modification
