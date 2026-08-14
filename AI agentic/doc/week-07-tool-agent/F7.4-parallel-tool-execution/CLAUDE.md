# W7-F7.4 — Parallel Tool Execution

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/tools/parallel.py` (kernel)
**Depends on:** [W4-F4.3](../../week-04-holidaylandmarks/F4.3-tool-port-registry-executor/CLAUDE.md)
**Consumed by:** [F7.1](../F7.1-bounded-agent-loop/CLAUDE.md), W10 supervisor fan-out, W12 evidence gathering

## Goal

When a model requests three tools in one turn, run them **concurrently**. Three serial 500ms calls
become one 500ms turn. Across a 10-iteration agent run this is the difference between 15 seconds and
5 — and it must be built into the loop's shape from the start, because retrofitting concurrency into
a sequential loop is painful ([architecture §10](../../../CLAUDE-12-WEEK.md)).

## Contract (schema first)

```python
class ParallelPolicy(BaseModel):
    max_concurrency: int = Field(5, ge=1, le=20)
    fail_fast: bool = False           # default: gather ALL results, even the failures
    per_call_timeout_override_s: float | None = None

class ParallelOutcome(BaseModel):
    results: list[ToolResult]         # SAME ORDER as the input calls — always
    wall_ms: float
    serial_ms_estimate: float         # sum of durations — the speedup receipt
    concurrency_used: int

async def run_calls(calls: list[ToolCall], policy: ParallelPolicy) -> ParallelOutcome
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/tools/parallel.py` | NEW | `run_calls`, semaphore, ordering, aggregation |
| `platform/src/aiplat/agent/loop.py` | EDIT | ACT phase dispatches through `run_calls` |

## Flow

```
ToolCall[3] from one model turn
      ▼
semaphore(max_concurrency)
      ▼
asyncio.gather(
    executor.run(c1),      ← each still gets its own timeout, retry, breaker (W4-F4.3)
    executor.run(c2),
    executor.run(c3),
    return_exceptions=True                     ← one failure must not cancel the siblings
)
      ▼
map back to INPUT ORDER; exceptions → ToolResult{ok:False}
      ▼
ParallelOutcome{results, wall_ms, serial_ms_estimate}
      ▼
all results appended to the iteration ── the model sees successes AND failures
```

## Rules

- **Order is preserved.** Results map back to input positions. `gather` preserves order, but the
  moment a semaphore or partitioning is added it becomes easy to break — and a misattributed tool
  result is a silent correctness bug, not a crash.
- **`return_exceptions=True`.** One failing tool must not cancel two succeeding ones. The model
  needs to see both what worked and what did not.
- **Failures are reported to the model, not hidden.** A tool that failed is information — it lets
  the model try a different approach instead of re-issuing the same call (which F7.3 would then
  flag as a duplicate).
- **The correlation ID must propagate into every task.** This is why W2-F2.2 has an explicit
  `test_correlation_id_propagates_into_gather` — without it, parallel tool calls log under no
  request and W11's `TraceView` shows holes.
- **Non-idempotent tools are never parallelised with themselves.** Two concurrent writes with the
  same key is exactly the race `idempotent=False` (W4-F4.3) exists to prevent.
- **`serial_ms_estimate` is the receipt.** Without it there is no evidence the concurrency is
  helping, and "we made it parallel" becomes an unverified claim.
- `max_concurrency` is bounded. Unbounded fan-out over a rate-limited API converts a latency win
  into a 429 storm.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| One of three tools fails | Other two return normally; the failure is a `ToolResult{ok:False}` |
| One tool hangs | Its own timeout fires; siblings unaffected |
| All tools fail | Three failure results; the loop observes and adapts |
| 20 calls in one turn | Semaphore caps concurrency; all complete |
| Two non-idempotent calls to one tool | Serialised, not parallelised |
| Correlation ID lost in a task | Caught by the W2 propagation test |
| Breaker opens mid-fan-out | Remaining calls to that host fail fast; others proceed |

## Tests

- `test_results_map_to_input_order_under_mixed_success_and_failure`
- `test_one_failure_does_not_cancel_siblings`
- `test_correlation_id_present_in_every_parallel_task_log`
- `test_semaphore_caps_concurrency`
- `test_non_idempotent_calls_are_serialised`
- `test_wall_ms_is_materially_less_than_serial_estimate` — the speedup, asserted

## Acceptance criteria

- [ ] Three 500ms tools complete in ≈500ms, not ≈1500ms — measured, in a test
- [ ] Result ordering holds under every mix of success, failure, and timeout
- [ ] Every parallel task's logs carry the parent correlation ID
- [ ] Non-idempotent tools are never run concurrently with themselves
- [ ] `serial_ms_estimate` is recorded so the benefit is evidenced, not assumed
