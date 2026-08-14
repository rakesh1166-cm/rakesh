# W11-F11.9 — Load, Concurrency + Capacity Testing

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w11_eval_guardrails/load/`
**Depends on:** [F11.5](../F11.5-rate-limits-and-cost-caps/CLAUDE.md)
**Consumed by:** [F12.6](../../week-12-ai-ops-assistant/F12.6-deployment-docker-ci-and-rollback/CLAUDE.md)

## Goal

Several load-bearing performance claims are asserted across this repo and **measured nowhere**.
The sharpest one: *"a DB session held across an LLM `await` caps you at ~40 concurrent runs
regardless of hardware"* ([architecture §10](../../../CLAUDE-12-WEEK.md), [W4-F4.6](../../week-04-holidaylandmarks/F4.6-bounded-tool-sequence-and-persistence/CLAUDE.md)).

An unmeasured performance claim is folklore. This feature turns each one into a number, and into a
regression test.

## Contract (schema first)

```python
class LoadProfile(BaseModel):
    name: str
    concurrent_users: int
    ramp_s: float
    duration_s: float
    scenario: Literal["w02_summarize","w04_plan_sse","w06_ask","w07_agent_run","mixed"]
    use_mock_provider: bool = True    # measure OUR limits, not the provider's rate limit

class CapacityResult(BaseModel):
    profile: str
    completed: int; failed: int
    p50_ms: float; p95_ms: float; p99_ms: float
    max_concurrent_achieved: int
    saturation_point: int | None      # concurrency where p95 knees ⚠ the number that matters
    bottleneck: Literal["threadpool","db_pool","redis","event_loop",
                        "provider","memory","none"]
    sse_connections_held: int
    errors_by_code: dict[str, int]

class CapacityBaseline(BaseModel):
    """Committed. Regressions here fail CI like quality regressions do."""
    scenario: str
    min_saturation_point: int
    max_p95_ms: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w11_eval_guardrails/load/profiles.py` | NEW | the load profiles |
| `apps/w11_eval_guardrails/load/runner.py` | NEW | driver + saturation detection |
| `apps/w11_eval_guardrails/load/baselines/` | NEW | committed capacity baselines |
| `platform/src/aiplat/obs/runtime.py` | NEW | threadpool / pool / loop-lag gauges |
| `infra/ci/load-test.yml` | NEW | nightly, not per-PR |

## Flow

```
LoadProfile (mock provider — fixed 800ms latency, so OUR limits are what move)
      ▼
ramp concurrency 1 → N
      ▼
sample every second:
   ├─ threadpool: active / max        ← the ~40-thread claim lives or dies here
   ├─ db pool:    checked out / max
   ├─ redis:      latency, pool
   ├─ event loop: lag (>50ms = something is blocking async code)
   └─ SSE:        connections held open
      ▼
detect the knee: concurrency where p95 exceeds 2× the p95 at concurrency 1
      ▼
attribute the bottleneck from whichever gauge saturated FIRST
      ▼
CapacityResult vs committed baseline → CI fails on regression
```

## Rules

- **Mock the provider.** With a real provider you measure their rate limit, not your architecture.
  A fixed-latency mock makes *your* saturation point visible — which is the thing you can fix.
- **Test the SSE path specifically.** Long-lived connections (W4, W7) behave nothing like
  request/response under load, and every "it was fine in staging" story starts here.
- **Attribute the bottleneck, don't just report the number.** "Saturates at 38 concurrent" is a
  fact; "saturates at 38, threadpool exhausted" is the fix — and it confirms or kills the
  DB-session-across-await hypothesis directly.
- **Baselines are committed and gated**, exactly like quality baselines (F11.3). A change that
  halves throughput should fail CI as loudly as one that lowers accuracy.
- **Event-loop lag is the async smoking gun.** Sustained lag above ~50ms means blocking code is
  running in async context — the single most common FastAPI performance defect.
- **Run nightly, not per-PR.** Load tests are slow; per-PR they get disabled within a fortnight.
- **Test W7 agent runs at concurrency**, not just HTTP. Long runs hold resources for minutes, and
  their concurrency limit (F11.5) is a cost lever as much as a capacity one.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| DB session held across an LLM await | Saturation ~40 with `bottleneck="threadpool"` ← **the hypothesis, tested** |
| Blocking call in async code | Event-loop lag spikes; reported |
| SSE connections leak | `sse_connections_held` grows without bound after clients disconnect |
| Redis saturates first | `bottleneck="redis"`; pool sizing addressed |
| Memory grows per request | Reported; a leak, not a capacity limit |
| Throughput halves after a change | Baseline gate fails the nightly build |
| Load test hits the real provider | Profile validation rejects it in CI |

## Tests

- `test_session_held_across_await_reproduces_the_threadpool_cap` ← proves or kills the claim
- `test_event_loop_lag_detected_when_blocking_code_runs`
- `test_sse_connections_are_released_on_client_disconnect`
- `test_saturation_point_regression_fails_the_nightly_gate`
- `test_load_profiles_cannot_target_the_real_provider`
- `test_bottleneck_attribution_matches_the_injected_cause`

## Acceptance criteria

- [ ] The ~40-concurrent threadpool claim is **measured** — confirmed or corrected in the docs
- [ ] Every scenario has a committed capacity baseline, gated nightly
- [ ] Bottlenecks are attributed to a subsystem, not just reported as latency
- [ ] SSE connection lifecycle is proven correct under load
- [ ] Event-loop lag is monitored in production, not only in tests
- [ ] W7 agent-run concurrency is load-tested, not just HTTP endpoints
