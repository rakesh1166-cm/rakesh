# W10-F10.2 — Supervisor Fan-Out + Merge

> [Week 10](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/orchestration/supervisor.py` (kernel)
**Depends on:** [F10.1](../F10.1-intent-router/CLAUDE.md), [W7-F7.4](../../week-07-tool-agent/F7.4-parallel-tool-execution/CLAUDE.md)
**Consumed by:** [F10.3](../F10.3-deterministic-baseline-harness/CLAUDE.md), W12 (only if justified)

## Goal

Decompose a task, run specialists **concurrently**, and merge their results into one validated
output. This is the expensive pattern — N model calls instead of one — so it must earn its place
against F10.3's baseline, not be adopted because it is the interesting one.

## Contract (schema first)

```python
class SubTask(BaseModel):
    id: str
    specialist: str
    goal: str
    depends_on: list[str] = []        # empty ⇒ parallelisable
    max_cost_usd: float

class SubResult(BaseModel):
    task_id: str
    output: dict[str, Any] | None
    confidence: Confidence
    citations: list[Citation] = []    # W6 — merging needs evidence to arbitrate
    termination: TerminationReason
    usage: Usage

class MergeConflict(BaseModel):
    field: str
    values: list[tuple[str, Any, float]]   # (task_id, value, confidence)
    resolution: Literal["highest_confidence", "most_cited", "escalated", "unresolved"]
    chosen: Any | None

class SupervisorOutcome(BaseModel):
    output: BaseModel | None
    sub_results: list[SubResult]
    conflicts: list[MergeConflict]    # SURFACED, never silently resolved
    total_cost_usd: float
    wall_ms: float; serial_ms_estimate: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/orchestration/supervisor.py` | NEW | decompose, fan out, merge |
| `platform/src/aiplat/prompts/templates/{decompose,merge}/v1.md` | NEW | versioned prompts |
| `apps/w10_multi_agent/agents/` | NEW | specialists, each ≤ ~100 lines |

## Flow

```
goal
  ▼
decompose (deterministic template FIRST; LLM only if the task shape is genuinely open)
  ▼
SubTask[] — dependency-ordered
  ▼
parallel fan-out (asyncio.gather, reusing W7-F7.4's ordering + failure semantics)
   specialist A (agent.loop W7)   specialist B (graph W8)   specialist C
  ▼
SubResult[] (partial failures allowed — one dead specialist must not sink the batch)
  ▼
merge
   ├─ agreeing fields          → take as-is
   ├─ conflicting fields       → MergeConflict, resolved by confidence + citation count
   └─ unresolvable             → surfaced in output, NOT silently picked
  ▼
validate against the output schema
  ▼
SupervisorOutcome{output, conflicts, cost, wall vs serial}
```

## Rules

- **Decompose deterministically when you can.** "Research, then plan, then write" is a fixed
  template — asking a model to invent that decomposition every time is cost and variance for no gain.
- **Conflicts are surfaced, never silently resolved.** Two specialists disagreeing is the most
  valuable signal the pattern produces. Hiding it behind "highest confidence wins" throws away the
  one thing fan-out gives you that a single agent cannot.
- **Partial failure is normal.** One specialist failing yields a partial merge with a warning, not a
  failed request.
- **Cost is the honest headline.** Three specialists at $0.10 is $0.30 plus merge. `SupervisorOutcome`
  reports it next to `wall_ms` vs `serial_ms_estimate`, so both sides of the trade are visible.
- **No new execution model.** Specialists are W7 loops or W8 graphs. A third way to run an agent is
  a third way to have bugs.
- **Specialists are ≤ ~100 lines**: a config (tools, prompt ref, caps) and a goal. If a specialist
  needs real logic, that logic belongs in `aiplat` — or it should not be an agent at all.
- **The supervisor is a deletion candidate.** If F10.3 shows sequential-deterministic matches it on
  quality at a third of the cost, delete it.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| One specialist fails | Partial merge + warning; the request succeeds |
| All specialists fail | Typed error with every sub-failure attached |
| Two specialists contradict | `MergeConflict` surfaced with both values and confidences |
| Merge produces invalid output | One repair (W4-F4.2), then typed failure |
| Specialist exceeds its cost cap | Terminated individually; others unaffected |
| Fan-out swamps the provider | Concurrency capped (W7-F7.4); 429s handled by backoff |
| Circular `depends_on` | Rejected at decomposition, not discovered at runtime |

## Tests

- `test_one_specialist_failure_yields_a_partial_merge`
- `test_conflicts_are_surfaced_not_silently_resolved` ← the point of the feature
- `test_specialists_run_concurrently` — `wall_ms` ≪ `serial_ms_estimate`
- `test_circular_dependency_rejected_at_decomposition`
- `test_no_specialist_module_exceeds_the_line_budget`
- `test_supervisor_cost_is_reported_against_the_baseline` (feeds F10.3)

## Acceptance criteria

- [ ] Conflicts appear in the output and in `SupervisorMerge.jsx`, never hidden
- [ ] Partial failures degrade rather than fail the request
- [ ] Concurrency is real and measured against the serial estimate
- [ ] Every specialist is a W7 loop or W8 graph — no third model
- [ ] The cost multiple vs. the baseline is recorded for F10.4's decision
