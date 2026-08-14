# W11-F11.5 — Rate Limits + Per-User Cost Caps

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/security/limits.py` (kernel)
**Depends on:** [W2-F2.2](../../week-02-fastapi-ai-service/F2.2-correlation-id-and-structured-logging/CLAUDE.md)
**Consumed by:** every endpoint; W12 (an ops assistant that can spend real money)

## Goal

Cost control that binds. W7's guards cap a *single run*; this caps a **principal across runs** —
because ten runs each within their $1 cap is still $10, and by Week 10 a supervisor fan-out
multiplies that again.

## Contract (schema first)

```python
class Principal(BaseModel):
    kind: Literal["user", "api_client", "mcp_client", "anonymous"]
    id: str

class LimitPolicy(BaseModel):
    requests_per_min: int = 30
    concurrent_runs: int = 3          # W7 runs are long — concurrency IS a cost lever
    cost_usd_per_hour: float = 2.0
    cost_usd_per_day: float = 10.0
    tokens_per_day: int = 2_000_000
    burst_allowance: int = 10

class LimitVerdict(BaseModel):
    allowed: bool
    limit_hit: Literal["rate","concurrency","hourly_cost","daily_cost","tokens"] | None
    retry_after_s: float | None
    remaining: dict[str, float]       # surfaced to the UI — users must SEE the budget

class GlobalKillSwitch(BaseModel):
    enabled: bool
    reason: str
    monthly_budget_usd: float
    spent_this_month_usd: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/security/limits.py` | NEW | limiter, counters, kill switch |
| `services/api/middleware/limits.py` | NEW | enforcement on every request |
| `platform/src/aiplat/obs/cost.py` | EDIT | feed per-principal accumulators |
| `frontend/src/components/CostBadge.jsx` | EDIT | show remaining budget |

## Flow

```
inbound request → resolve Principal
      ▼
GlobalKillSwitch enabled? ──► 503 with the reason. Everything stops. ← the last line of defense
      ▼
sliding-window rate check (Redis)      → RATE_LIMITED + retry_after_s
concurrent-run check (W7 RunStore)     → too many in flight
hourly / daily cost check              → BUDGET_EXCEEDED (NOT retryable)
      ▼
proceed; on completion cost.record() updates the principal's accumulators
      ▼
LimitVerdict.remaining → response headers → CostBadge
```

## Rules

- **`BUDGET_EXCEEDED` is not retryable** (W2-F2.3). A retryable cost cap is a cost amplifier — the
  client retries, which is exactly what the cap exists to stop.
- **Concurrency is a cost lever, not just a load lever.** Three concurrent agent runs at $1 each is
  $3 in flight before any daily counter notices. W7 runs are long enough that this matters.
- **Limits are per-principal, in Redis.** Per-process counters mean N workers grant N× the budget —
  the same reasoning as the W2-F2.4 circuit breaker.
- **Remaining budget is surfaced to the UI.** A user who cannot see their budget cannot ration it,
  and will experience the cap as an outage.
- **The global kill switch is the last line of defense.** Per-principal caps do not stop a thousand
  principals; the monthly budget with an alert threshold does.
- **Cost is checked *before* the expensive call**, using projected cost (W7-F7.3), not after.
- **Anonymous principals get the tightest limits.** Unauthenticated is the cheapest identity to
  acquire and therefore the one to constrain hardest.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Client retries on `BUDGET_EXCEEDED` | Still refused; retry cannot amplify spend |
| Two workers, one principal | Shared Redis counters; the budget is not doubled |
| Long run started under budget, ends over | Run completes (W7 caps it); next request refused |
| Redis down | **Fail closed** on cost, fail open on rate. Losing cost control is unrecoverable. |
| Monthly budget hit | Kill switch trips; all requests 503 with a reason; alert fires |
| Clock skew across workers | Server-side timestamps only |
| Burst of legitimate traffic | `burst_allowance` absorbs it; sustained excess is limited |

## Tests

- `test_budget_exceeded_is_not_retryable`
- `test_counters_are_shared_across_processes`
- `test_cost_is_checked_before_the_expensive_call`
- `test_redis_down_fails_closed_on_cost`
- `test_kill_switch_stops_everything_with_a_reason`
- `test_remaining_budget_is_returned_in_headers`
- `test_anonymous_principals_get_the_tightest_limits`

## Acceptance criteria

- [ ] A principal cannot exceed its daily cost cap by any sequence of requests
- [ ] Concurrency limits apply to long-running agent runs, not just HTTP requests
- [ ] Counters are shared across workers
- [ ] Remaining budget is visible in the UI
- [ ] A monthly budget breach trips a global kill switch with an alert
- [ ] Losing Redis fails closed on cost
