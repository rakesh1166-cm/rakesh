# W10-F10.3 — Deterministic Baseline + Comparison Harness

> [Week 10](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w10_multi_agent/baseline.py` + `eval/`
**Depends on:** [F10.2](../F10.2-supervisor-fanout-and-merge/CLAUDE.md)
**Consumed by:** [F10.4](../F10.4-agent-justification-and-deletion-pass/CLAUDE.md)

## Goal

**Write the plain-code version of the same task and measure both.** Without a baseline, "the
multi-agent system works" is unfalsifiable — it produces output, so it looks successful.

Build the baseline **first**, before tuning the agents. A baseline written afterwards is
unconsciously shaped to lose.

## Contract (schema first)

```python
class Approach(str, Enum):
    DETERMINISTIC = "deterministic"   # plain functions, fixed sequence, no model decisions
    SINGLE_AGENT  = "single_agent"    # one W7 loop with all the tools
    ROUTER        = "router"          # F10.1
    SUPERVISOR    = "supervisor"      # F10.2

class ApproachResult(BaseModel):
    approach: Approach
    quality_score: float              # scored by the SAME rubric for every approach
    cost_usd: float
    p50_latency_ms: float; p95_latency_ms: float
    failure_rate: float
    determinism: float                # same input → same output, over N runs

class Comparison(BaseModel):
    task_set: str; runs_per_task: int
    results: list[ApproachResult]
    winner: Approach
    cost_multiple_vs_deterministic: dict[Approach, float]
    verdict: str                      # one sentence, must cite numbers
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w10_multi_agent/baseline.py` | NEW | the deterministic implementation |
| `apps/w10_multi_agent/eval/tasks.yaml` | NEW | ≥20 tasks with scoring rubrics |
| `apps/w10_multi_agent/eval/compare.py` | NEW | run all four approaches → `Comparison` |
| `apps/w10_multi_agent/README.md` | NEW | **the results table** — where it won and lost |

## Flow

```
tasks.yaml (≥20 tasks, ≥3 runs each)
      ▼
for each approach in {deterministic, single_agent, router, supervisor}:
      run every task ──► score with ONE shared rubric ──► ApproachResult
      ▼
Comparison{winner, cost_multiple, verdict}
      ▼
README table  +  BaselineCompare.jsx  →  F10.4 deletion decisions
```

## Rules

- **The baseline is real, not a straw man.** It gets the same effort, the same tools, and the same
  prompts where it uses a model at all. A deliberately weak baseline invalidates the whole exercise
  and is the easiest self-deception available here.
- **One rubric, all approaches.** Scoring the agent output with an agent-friendly rubric is the
  second-easiest self-deception.
- **Report `determinism`.** For many real tasks, "same input → same output" is worth more than a few
  points of quality — and it is where deterministic code wins outright.
- **Cost multiple is the headline.** "Supervisor scores 4% higher at 3.2× cost and 2.1× latency" is
  a decision; "supervisor is better" is not.
- **Include `SINGLE_AGENT`.** Often the honest answer is that one W7 loop with all the tools beats
  both the plain code and the multi-agent orchestration — and that is a Week 7 win, not a Week 10 one.
- **`verdict` must cite numbers.** A sentence with no figures in it is an opinion.
- Run ≥3 times per task even at `temperature=0`; tool ordering and timing still vary.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Baseline written after agent tuning | Ordering enforced in the build order; the README says which came first |
| Rubric favours verbose output | Rubric reviewed and versioned; scored blind where possible |
| One approach fails a task | Counted in `failure_rate`, not silently excluded |
| Cost measured for one approach only | Comparison invalid — all four or none |
| Deterministic approach wins | Recorded plainly. **This is a passing result.** |
| Task set too small | ≥20 tasks enforced; fewer is anecdote |

## Tests

- `test_all_four_approaches_run_the_same_task_set`
- `test_one_rubric_scores_every_approach`
- `test_failures_count_toward_failure_rate`
- `test_verdict_cites_numeric_values`
- `test_determinism_is_measured_over_multiple_runs`

## Acceptance criteria

- [ ] `README.md` has a four-row comparison table with real, measured numbers
- [ ] The deterministic baseline is a genuine implementation, not a straw man
- [ ] Cost multiples relative to the baseline are recorded for every approach
- [ ] `determinism` is measured, not assumed
- [ ] The verdict cites figures and directly feeds F10.4's deletion decisions
