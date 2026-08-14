# W11-F11.3 — CI Regression Gate

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `infra/ci/eval-gate.yml` + `aiplat/evals/gate.py`
**Depends on:** [F11.2](../F11.2-scorers/CLAUDE.md)
**Consumed by:** every subsequent change to the repo

## Goal

**Make a quality regression unmergeable.** Week 3 gated four prompts; this gates the whole system —
prompts, code, agent configs, tool changes. The gate must be strict enough to catch real
regressions and stable enough that people do not learn to bypass it.

## Contract (schema first)

```python
class GatePolicy(BaseModel):
    max_pass_rate_drop: float = 0.02
    max_cost_increase_pct: float = 0.20
    max_p95_increase_pct: float = 0.30
    zero_tolerance_tags: list[str] = ["adversarial", "injection", "safety"]
    judge_only_regressions: Literal["block","warn"] = "warn"   # judge scores are noisier
    min_cases_run: int = 50

class GateVerdict(BaseModel):
    passed: bool
    blocking: list[str]               # each names case IDs
    warnings: list[str]
    delta: ScoreDelta
    baseline_commit: str
    candidate_commit: str
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/evals/gate.py` | NEW | `EvalRun × baseline → GateVerdict` |
| `platform/src/aiplat/evals/baselines/` | NEW | committed baseline per suite |
| `infra/ci/eval-gate.yml` | NEW | the CI job |
| `frontend/src/weeks/w11/ScoreDiff.jsx` | NEW | the human-readable diff |

## Flow

```
PR opened
   ▼
CI: harness runs every suite (F11.1) with mocked tools, real model
   ▼
gate.compare(run, baseline)
   ├─ pass-rate drop > tolerance             → BLOCK, list newly-failing case IDs
   ├─ ANY new failure on a zero-tolerance tag → BLOCK (no tolerance at all)
   ├─ cost increase > 20%                    → BLOCK
   ├─ p95 increase > 30%                     → BLOCK
   ├─ judge-only regression                  → WARN (noisier signal)
   └─ fewer than min_cases_run               → BLOCK (a truncated suite is not a pass)
   ▼
GateVerdict → PR comment with case IDs → ScoreDiff.jsx
```

## Rules

- **Zero tolerance on safety tags.** Adversarial, injection and safety cases have no allowance. An
  overall pass-rate improvement never buys a new injection failure.
- **Cost and latency are gated, not just quality.** A 3% quality gain at 2× cost is a regression;
  without gating cost, this is the change that always slips through.
- **Report case IDs, never just percentages.** "pass_rate 0.94 → 0.91" is not actionable;
  "newly_failing: [inject-07, w07-loop-cap-02]" is.
- **A truncated suite is a failure, not a pass.** Provider outage means the gate reports SKIPPED
  loudly; it never reports green on 12 of 50 cases.
- **Judge-only regressions warn by default.** Judges are noisy (F11.2); blocking on them alone
  produces flaky CI, and flaky CI produces bypass habits — which loses the gate entirely.
- **Baselines are updated by an explicit commit** with a justification, never auto-updated on green.
  Auto-update means the baseline drifts to whatever was last merged and the gate measures nothing.
- The gate runs on **PRs**, not only on main. A gate that fires after merge is a report, not a gate.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Quality up, cost doubled | BLOCK on cost |
| One new injection failure, overall up | BLOCK — zero tolerance |
| Provider outage in CI | SKIPPED, loudly; never a silent pass |
| Judge noise flips two cases | WARN, not BLOCK |
| New suite added with no baseline | BLOCK until a baseline lands with it |
| Someone edits the baseline in the same PR | Flagged for explicit review — the diff is visible |
| Gate too strict, blocks everything | Tolerances tuned with data; **never** disabled |

## Tests

- `test_zero_tolerance_tag_blocks_despite_overall_improvement`
- `test_cost_regression_blocks_despite_quality_gain`
- `test_partial_run_is_skipped_not_passed`
- `test_judge_only_regression_warns_by_default`
- `test_missing_baseline_blocks`
- `test_verdict_lists_case_ids`

## Acceptance criteria

- [ ] A worse prompt version fails CI naming the specific cases
- [ ] A cost-doubling change is blocked even if quality improves
- [ ] New injection failures block unconditionally
- [ ] Baselines change only by explicit, reviewed commit
- [ ] The gate runs on every PR and its verdict is visible in the PR
