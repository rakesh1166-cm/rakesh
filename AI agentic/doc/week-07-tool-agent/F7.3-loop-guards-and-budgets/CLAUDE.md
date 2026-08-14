# W7-F7.3 — Loop Guards: Duplicate Action, Cost, Wall Clock

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/agent/guards.py` (kernel)
**Depends on:** [F7.1](../F7.1-bounded-agent-loop/CLAUDE.md)
**Consumed by:** W8 graph nodes, W10 specialists, W12 `act` node

## Goal

`max_iterations` alone is not a budget. An agent can burn a full cost cap in **three** iterations
with large contexts, or loop productively-looking-but-uselessly by calling the same tool with the
same arguments forever. Guards make every failure mode of an autonomous loop **enumerated and
enforced** — before the loop is ever left running unattended.

## Contract (schema first)

```python
class GuardViolation(BaseModel):
    guard: str
    reason: TerminationReason
    detail: str
    at_iteration: int

class Guard(Protocol):
    name: str
    def check(self, state: RunState) -> GuardViolation | None: ...

# The five shipped guards
class IterationGuard(Guard):     ...  # n > max_iterations              → MAX_ITERATIONS
class WallClockGuard(Guard):     ...  # elapsed > wall_clock_s          → WALL_CLOCK
class CostGuard(Guard):          ...  # spent_usd > max_cost_usd        → COST_CAP
class DuplicateActionGuard(Guard):
    """Same (tool, canonicalised args) N times in a row → DUPLICATE_ACTION."""
    repeat_threshold: int = 2
class NoProgressGuard(Guard):
    """K iterations with no new tool result and no output → NO_PROGRESS."""
    window: int = 3
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/agent/guards.py` | NEW | the `Guard` protocol + the five guards |
| `platform/src/aiplat/agent/loop.py` | EDIT | `guards.check()` at the top of every iteration |
| `platform/src/aiplat/obs/logging.py` | EDIT | `event="agent.guard.violation"` |

## Flow

```
top of each iteration
      ▼
for guard in guards:                       ← ordered CHEAPEST first
    IterationGuard      (counter)
    WallClockGuard      (clock)
    CostGuard           (accumulator)
    DuplicateActionGuard(hash of recent calls)
    NoProgressGuard     (window scan)
      ▼
violation? ──► log ──► terminate with guard.reason ──► finalise partial output (F7.1)
      ▼
proceed to PLAN
```

## Rules

- **Guards run *before* the iteration, not after.** Checking afterwards means paying for the
  iteration that broke the budget — which is exactly the iteration you wanted to prevent.
- **Cost is checked before the LLM call**, using the *projected* cost of the request (token count ×
  tier rate, from W1-F1.3). Checking after is how a single large context blows a $1 cap to $3.
- **Canonicalise arguments** before duplicate detection: key order, whitespace, float precision. A
  model re-issuing the same call with keys in a different order is repeating itself, and a naive
  hash will not see it.
- **`NoProgress` catches the subtle case** the other guards miss — a model that keeps *planning*
  without acting or concluding. Iterations advance, cost accrues, nothing happens.
- **Every violation is logged with its detail**, not just its reason. "DUPLICATE_ACTION" is a label;
  "weather_forecast(lat=48.85,lng=2.35) called 3× in a row" is a bug report.
- Guards are **pure functions of `RunState`** — no I/O, no side effects. That is what makes them
  trivially testable and safe to run on every iteration.
- The guard list is per-`AgentConfig` and **cannot be emptied**. A run with no guards must not be
  constructible.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model repeats one tool call forever | `DUPLICATE_ACTION` at the threshold; partial output returned |
| Model plans without acting | `NoProgress` after the window |
| One huge context would exceed the cap | Blocked **before** the call, using projected cost |
| Model varies arg key order to look different | Canonicalisation still detects the repeat |
| Legitimate repeat (retry after a tool failure) | **Not** flagged — failed calls reset the counter |
| Clock skew across workers | Elapsed measured from a stored `started_at`, not local time deltas |
| Guard itself raises | Fail closed: terminate the run. A broken guard is not a licence to continue. |

## Tests

- `test_cost_guard_blocks_before_the_expensive_call`
- `test_duplicate_detection_is_argument_order_insensitive`
- `test_legitimate_retry_after_failure_is_not_flagged`
- `test_no_progress_guard_catches_plan_only_loops`
- `test_guards_are_pure_functions_of_run_state`
- `test_agent_config_with_no_guards_cannot_be_constructed`
- `test_guard_exception_terminates_the_run`

## Acceptance criteria

- [ ] Every guard is checked before each iteration, cheapest first
- [ ] Cost is enforced on projected spend, not on spend after the fact
- [ ] Duplicate detection survives argument reordering and whitespace
- [ ] A run with zero guards is not constructible
- [ ] Every violation logs an actionable detail string, not just a reason code
