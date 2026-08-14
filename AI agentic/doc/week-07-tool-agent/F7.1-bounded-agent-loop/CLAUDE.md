# W7-F7.1 — The Bounded Agent Loop

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/agent/loop.py` (kernel)
**Depends on:** [W4-F4.3](../../week-04-holidaylandmarks/F4.3-tool-port-registry-executor/CLAUDE.md)
**Consumed by:** [F7.5](../F7.5-agent-runner-and-run-scoped-ui/CLAUDE.md), W8 nodes, W10 specialists, W12 `act`

## Goal

A plan → act → observe loop that **cannot fail to terminate**. Hand-rolled, with no framework, so
every cap, every trace point, and every failure path is explicit and testable
([ADR-004](../../../TECH-STACK-DECISIONS.md)).

## Contract (schema first)

```python
class AgentConfig(BaseModel):
    tools: list[str]                  # names resolved against the registry — an allow-list
    system_prompt_ref: tuple[str,str] # (name, version) — pinned, never `latest`
    model_tier: ModelTier
    max_iterations: int = Field(10, ge=1, le=25)
    wall_clock_s: float = Field(120.0, gt=0)
    max_cost_usd: float = Field(1.00, gt=0)
    output_schema: type[BaseModel]    # the loop MUST produce this or fail typed

class Iteration(BaseModel):
    n: int
    thought: str                      # the model's plan text for this step
    tool_calls: list[ToolCall]
    tool_results: list[ToolResult]
    usage: Usage
    duration_ms: float

class TerminationReason(str, Enum):
    COMPLETED = "completed"
    MAX_ITERATIONS = "max_iterations"
    WALL_CLOCK = "wall_clock"
    COST_CAP = "cost_cap"
    DUPLICATE_ACTION = "duplicate_action"
    NO_PROGRESS = "no_progress"
    FATAL = "fatal"

class AgentOutcome(BaseModel):
    output: BaseModel | None          # None only when terminated without a valid result
    iterations: list[Iteration]
    termination: TerminationReason
    partial: bool                     # True ⇒ output is best-effort, warnings apply
    usage: Usage; total_cost_usd: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/agent/ports.py` | NEW | what the loop may know about — the seam |
| `platform/src/aiplat/agent/loop.py` | NEW | the loop itself |
| `platform/src/aiplat/obs/trace.py` | NEW | one span per iteration; the loop must be replayable |
| `apps/w07_tool_agent/agent_config.py` | NEW | this week's tools, caps, tier |

## Flow

```
run(goal, AgentConfig)
  ┌─ for n in 1..max_iterations ─────────────────────────────────────┐
  │  guards.check(state)  →  violated? terminate with its reason     │  (F7.3)
  │  PLAN    llm.complete(system, history, tool_specs)               │
  │  ├─ model returns final answer  → validate vs output_schema      │
  │  │        invalid → ONE repair (W4-F4.2) → still invalid → FATAL │
  │  │        valid   → COMPLETED                                     │
  │  └─ model returns tool calls                                      │
  │     ACT     tools.parallel(calls)          (F7.4)                 │
  │     OBSERVE append results to state        (F7.2)                 │
  │     trace.span(iteration=n, tools=[...], cost=…)                  │
  └───────────────────────────────────────────────────────────────────┘
  loop exhausted → finalise best-effort output, partial=True, MAX_ITERATIONS
```

## Rules

- **Every exit path is a `TerminationReason`.** There is no path out of the loop that is not
  enumerated — that is what makes "it must always terminate" a testable claim rather than a hope.
- **Hitting a cap is not an error.** Return the best partial output with `partial=True` and warnings
  ([feature.md F7](../../feature.md)). A 500 after 9 successful iterations throws away real work.
- **The loop never sees a raw tool implementation.** It goes through the registry and executor
  (W4-F4.3), which is why W9 can swap a local tool for an MCP tool with no loop change.
- **The tool allow-list is per-`AgentConfig`.** Nothing the model or the user says can extend it
  ([ADR-012](../../../TECH-STACK-DECISIONS.md)).
- **One span per iteration.** Without it, a 10-iteration run is one opaque log line and debugging it
  is archaeology.
- The system prompt is a **pinned version** (W3-F3.1). An agent loop is the last place you want an
  unpinned prompt silently changing behaviour.
- `max_iterations` upper bound is 25 in the schema. A config asking for 200 is a bug, and the
  schema should say so rather than trusting the caller.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model never emits a final answer | `MAX_ITERATIONS`, best partial output, `partial=True` |
| Model calls the same tool with identical args repeatedly | `DUPLICATE_ACTION` (F7.3) |
| A tool always fails | Loop observes the failures and adapts, or terminates — never spins |
| Model requests a tool outside the allow-list | Typed `ToolResult` refusal fed back; loop continues |
| Final output fails validation | One repair, then `FATAL` — never prose returned |
| Cost cap hit mid-iteration | Finish the in-flight iteration, then `COST_CAP` |
| Provider dies at iteration 7 | Iterations 1–6 preserved in state; run resumable (F7.2) |

## Tests

- `test_loop_always_terminates` — property test over adversarial mocked model behaviours
- `test_cap_returns_partial_output_not_an_error`
- `test_tool_outside_allowlist_is_refused_and_the_loop_continues`
- `test_every_exit_path_sets_a_termination_reason` — exhaustive over the enum
- `test_one_trace_span_per_iteration`
- `test_invalid_final_output_repairs_once_then_fails_typed`

## Acceptance criteria

- [ ] No input, mocked or real, makes the loop run forever
- [ ] Every termination is attributable to exactly one enumerated reason
- [ ] Cap-terminated runs return usable partial output with warnings
- [ ] The loop imports only from `aiplat.agent.ports` and the tool registry
- [ ] A run is fully reconstructable from its trace spans
