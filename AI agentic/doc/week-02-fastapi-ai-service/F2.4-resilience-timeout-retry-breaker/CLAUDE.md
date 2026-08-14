# W2-F2.4 — Timeout, Backoff Retry, Circuit Breaker

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/resilience/` (kernel)
**Depends on:** [F2.3](../F2.3-typed-error-envelope/CLAUDE.md)
**Consumed by:** LLM calls (W2), every tool (W4), embeddings (W5), MCP client (W9)

## Goal

One resilience utility every external call goes through, so retry policy is a **property of the
kernel** rather than a decision re-made in each of twelve weeks.
([ADR-011](../../../TECH-STACK-DECISIONS.md))

## Contract (schema first)

```python
class RetryPolicy(BaseModel):
    max_attempts: int = 3
    base_delay_s: float = 0.5
    max_delay_s: float = 8.0
    jitter: bool = True
    retry_on: tuple[type[AppError], ...]     # explicit — never "retry everything"

class BreakerPolicy(BaseModel):
    failure_threshold: int = 5        # consecutive failures to open
    recovery_timeout_s: float = 30.0  # open → half-open
    half_open_max_calls: int = 1

class BreakerState(str, Enum):
    CLOSED = "closed"; OPEN = "open"; HALF_OPEN = "half_open"

async def call(fn, *, timeout_s: float, retry: RetryPolicy|None, breaker_key: str|None): ...
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/resilience/timeout.py` | NEW | `asyncio.timeout` wrapper → `UPSTREAM_TIMEOUT` |
| `platform/src/aiplat/resilience/retry.py` | NEW | exponential backoff + full jitter |
| `platform/src/aiplat/resilience/breaker.py` | NEW | per-host breaker, state in Redis (shared across workers) |
| `platform/src/aiplat/llm/anthropic_client.py` | EDIT | route every call through `resilience.call` |

## Flow

```
caller ──► resilience.call(fn, timeout_s, retry, breaker_key)
              │
              ├─ breaker OPEN?  ──► fail fast, UPSTREAM_UNAVAILABLE (no attempt made)
              ├─ attempt 1 ── timeout_s ──► success ──► breaker.record_success()
              │      │ failure & retryable
              │      └─► sleep(base × 2^n, full jitter, capped) ──► attempt 2 …
              └─ attempts exhausted ──► breaker.record_failure() ──► typed AppError
```

## Rules

- `retry_on` is an **explicit tuple of error types**. Retrying `VALIDATION_FAILED` re-sends a
  request that is guaranteed to fail again; retrying `BUDGET_EXCEEDED` amplifies the thing the cap
  exists to prevent.
- **Full jitter**, not fixed backoff — synchronised retries across workers are a self-inflicted DDoS.
- Timeout is **per attempt**; the caller's total budget is separate (and enforced by W7's loop).
- Breaker state lives in **Redis, keyed by host** — with two API workers, in-process state means
  each learns the outage independently and users see double the failures.
- Non-idempotent operations pass `retry=None`. A retried write is a duplicate write.
- The retry counter is logged (`event="retry.attempt"`, `attrs={"n":2}`) — silent retries hide
  degradation until it becomes an outage.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Upstream hangs forever | Timeout fires per attempt; total time ≤ `max_attempts × timeout_s` + backoff |
| Upstream 500s persistently | Retries exhaust, breaker opens, subsequent calls fail fast |
| Breaker open, upstream recovers | Half-open lets exactly one probe through; success closes it |
| Two workers, one dead host | Both see OPEN immediately via shared Redis state |
| Retry on a POST that already succeeded | Blocked — non-idempotent calls carry `retry=None` |
| Redis unavailable | Breaker degrades to closed-with-timeouts; it must not become the outage |

## Tests

- `test_backoff_is_bounded_and_jittered` — 200 samples, assert spread and cap
- `test_validation_errors_are_never_retried`
- `test_breaker_opens_after_threshold_and_fails_fast`
- `test_half_open_admits_exactly_one_probe`
- `test_breaker_state_is_shared_across_processes` — two clients, one Redis
- `test_resilience_degrades_when_redis_is_down`

## Acceptance criteria

- [ ] No `httpx`/SDK call anywhere bypasses `resilience.call`
- [ ] A hung upstream cannot exceed the computed worst-case wall time
- [ ] Breaker state is visible in logs on every transition, with the host key
- [ ] Non-retryable codes are provably never retried
- [ ] Redis being down degrades resilience but never breaks the request path
