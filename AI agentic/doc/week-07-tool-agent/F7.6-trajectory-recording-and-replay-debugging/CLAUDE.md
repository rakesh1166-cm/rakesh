# W7-F7.6 — Trajectory Recording + Replay Debugging

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/agent/trajectory.py` (kernel)
**Depends on:** [F7.2](../F7.2-run-state-in-redis/CLAUDE.md)
**Consumed by:** W11-F11.1 (trajectory scoring), W12-F12.5 (incident replay)

## Goal

An agent that produced the right answer after **nine unnecessary tool calls** is a regression, and
output-only evaluation cannot see it. This feature records the full trajectory and makes it
**replayable** — so a failed run can be re-run against new code with the same model responses, and
debugging stops being "run it again and hope it does the same thing".

This is the difference between debugging agents and guessing at them.

## Contract (schema first)

```python
class TrajectoryStep(BaseModel):
    n: int
    prompt_hash: str
    model_response: dict[str, Any]    # the RAW response — the replay fixture
    tool_calls: list[ToolCall]
    tool_results: list[ToolResult]
    guard_checks: list[str]
    usage: Usage; duration_ms: float

class Trajectory(BaseModel):
    run_id: str
    goal: str
    config: AgentConfig
    steps: list[TrajectoryStep]
    termination: TerminationReason
    output: dict[str, Any] | None
    total_cost_usd: float
    recorded_at: datetime
    code_version: str

class TrajectoryMetrics(BaseModel):
    """What output-only scoring cannot see."""
    steps_taken: int
    optimal_steps: int | None         # from a labelled case, when known
    redundant_calls: int              # same tool+args more than once across the whole run
    failed_calls: int
    unused_results: int               # tool results that never influenced the output ⚠
    backtracks: int                   # re-queried something already answered
    efficiency: float                 # optimal / taken

class ReplayMode(str, Enum):
    STRICT   = "strict"     # replay model responses verbatim; tests OUR code only
    TOOLS    = "tools"      # replay tool results, re-run the model
    LIVE     = "live"       # nothing replayed
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/agent/trajectory.py` | NEW | recording, metrics, replay driver |
| `platform/src/aiplat/agent/loop.py` | EDIT | record each step; accept a replay source |
| `apps/w07_tool_agent/trajectories/` | NEW | recorded fixtures, committed |
| `frontend/src/weeks/w07/TrajectoryView.jsx` | NEW | steps + metrics + redundancy highlights |

## Flow

```
RECORD (every run, always on)
  loop step ──► TrajectoryStep{prompt_hash, raw model_response, tools, guards}
        ▼
  Trajectory persisted alongside RunState (F7.2)
        ▼
  TrajectoryMetrics computed: redundant · unused · backtracks · efficiency

REPLAY (debugging + CI)
  Trajectory + ReplayMode.STRICT
        ▼
  loop runs against RECORDED model responses — zero provider calls, zero cost
        ▼
  diff: same tool calls? same output? same termination?
        ▼
  a difference is caused by OUR code, because the model input was held constant
```

## Rules

- **`STRICT` replay costs nothing and is deterministic.** That is what makes it usable in CI on
  every PR — a change to the loop, the guards, or a tool that alters agent behaviour shows up as a
  trajectory diff, not as a mysterious eval score movement three days later.
- **Record the raw model response**, not a parsed summary. The parsed form loses exactly the details
  you need when the bug is in parsing.
- **`unused_results` is the sharpest signal.** A tool result the model never referenced is a call
  that should not have been made — wasted latency, wasted money, and usually a sign the prompt is
  asking for too much.
- **Redundancy is measured across the whole run**, not just consecutively. W7-F7.3's
  `DuplicateActionGuard` catches back-to-back repeats; a call repeated at step 2 and step 8 slips
  past it and is pure waste.
- **`optimal_steps` comes from a labelled case** where it is known. Where it is not, report
  `steps_taken` without pretending to an efficiency figure.
- **Trajectories are committed fixtures** for the cases that matter. A recorded failure is a
  regression test that never needs the provider again.
- Recording is **always on**, not a debug flag. A production failure you cannot replay is a
  production failure you will not fix.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Replay diverges from the recording | Reported as a code-behaviour change — the point of the feature |
| Recorded fixture is stale vs. the schema | Version mismatch detected; fixture re-recorded deliberately |
| Trajectory grows very large | Size cap; oldest steps stored compressed, never dropped |
| Model response is non-deterministic | Irrelevant under `STRICT` — that is why `STRICT` exists |
| Agent takes 3× the optimal steps | `efficiency` drops; W11's gate can block on it |
| Recording adds latency | Async write, off the critical path; measured and bounded |

## Tests

- `test_strict_replay_makes_zero_provider_calls`
- `test_strict_replay_is_bit_identical_for_unchanged_code`
- `test_code_change_shows_up_as_a_trajectory_diff`
- `test_redundant_calls_detected_non_consecutively`
- `test_unused_tool_results_are_counted`
- `test_recording_is_off_the_critical_path`

## Acceptance criteria

- [ ] Every run records a replayable trajectory, in production as well as in tests
- [ ] `STRICT` replay runs in CI with zero provider cost
- [ ] Redundant and unused tool calls are measured, not just termination and output
- [ ] A recorded production failure becomes a permanent regression fixture
- [ ] W11's gate can block on efficiency regressions, not only on output quality
