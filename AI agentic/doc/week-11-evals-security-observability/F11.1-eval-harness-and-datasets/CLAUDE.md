# W11-F11.1 — Eval Harness + Datasets

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/evals/` (kernel)
**Depends on:** [W3-F3.3](../../week-03-prompts-as-software/F3.3-golden-suites-and-scoring/CLAUDE.md)
**Consumed by:** [F11.2](../F11.2-scorers/CLAUDE.md), [F11.3](../F11.3-ci-regression-gate/CLAUDE.md)

## Goal

Generalise Week 3's per-prompt golden suites into a **repo-wide harness**: ≥50 cases per service,
run against any app, producing a comparable score. Week 3 proved the idea on four prompts; this
scales it to a system with agents, RAG, and tools.

## Contract (schema first)

```python
class EvalCase(BaseModel):
    id: str
    suite: str                        # "w04.plan", "w06.ask", "w07.agent"
    inputs: dict[str, Any]
    expect: list[Assertion]           # W3-F3.3, extended
    tags: list[str] = []              # "adversarial" · "edge" · "injection" · "cost"
    max_cost_usd: float | None = None # per-case cost ceiling
    timeout_s: float = 120.0

class EvalRun(BaseModel):
    suite: str
    commit: str                       # what code produced this
    prompt_versions: dict[str, str]   # {"trip_plan": "v2"} — pinned, recorded
    started_at: datetime
    results: list[CaseResult]
    pass_rate: float
    total_cost_usd: float
    p50_ms: float; p95_ms: float
    by_tag: dict[str, float]          # per-tag pass rate — adversarial tracked separately

class HarnessConfig(BaseModel):
    runs_per_case: int = 1            # >1 when temperature > 0
    concurrency: int = 4
    fail_fast: bool = False
    use_mocks: Literal["none","tools","all"] = "tools"   # deterministic tools, real model
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/evals/harness.py` | NEW | run a suite → `EvalRun` |
| `platform/src/aiplat/evals/datasets/` | NEW | ≥50 cases per service, versioned with prompts |
| `apps/w11_eval_guardrails/suites/` | NEW | suite definitions per week |
| `apps/w11_eval_guardrails/router.py` | NEW | `/evals`, `/evals/{run_id}` |

## Flow

```
suite + HarnessConfig
      ▼
load cases ── validate assertions are satisfiable AT LOAD, not case by case
      ▼
run with bounded concurrency
   ├─ use_mocks="tools" → deterministic tools, real model    ← the DEFAULT
   ├─ use_mocks="all"   → fully offline smoke run
   └─ use_mocks="none"  → full integration, expensive, run rarely
      ▼
CaseResult per case ──► scorers (F11.2)
      ▼
EvalRun{pass_rate, by_tag, cost, p95, commit, prompt_versions}
      ▼
persisted → compared against baseline (F11.3) → ScoreDiff.jsx
```

## Rules

- **Mock the tools, not the model, by default.** Real tools make eval results depend on the weather
  in Paris today; mocking the model makes the eval measure nothing. `use_mocks="tools"` is the only
  setting that isolates the thing under test.
- **`prompt_versions` and `commit` are recorded on every run.** A score without knowing which prompt
  version and which code produced it cannot be compared to anything.
- **`by_tag` matters more than the headline.** Overall pass rate can rise while adversarial cases
  regress — and adversarial regressions are the ones that matter.
- **Assertions are validated at suite load.** An unsatisfiable assertion becomes a permanently red
  case that everyone learns to ignore, which is worse than no case.
- **Per-case cost ceilings.** One pathological case burning $5 in a 50-case suite makes the whole
  suite too expensive to run, so it stops being run.
- **Datasets live in the kernel**, versioned alongside prompts (W3-F3.1). A dataset reachable from
  only one app cannot regression-test the kernel.
- Agent suites (W07/W12) assert on **`TerminationReason` and budgets**, not only on output — an
  agent that produced the right answer after 9 unnecessary iterations is a regression.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Provider down mid-suite | Partial `EvalRun`, marked incomplete; never reported as a pass rate |
| One case hangs | Its `timeout_s` fires; the suite completes |
| Case exceeds its cost ceiling | Marked failed-on-cost, distinct from failed-on-quality |
| Flaky case | Detected across `runs_per_case`; flagged unstable, excluded from the gate |
| Suite with no adversarial tag | Load-time warning; F11.3 requires them |
| Dataset and prompt version drift apart | Recorded mismatch surfaces in the run header |

## Tests

- `test_partial_run_is_marked_incomplete`
- `test_by_tag_pass_rates_are_computed`
- `test_unsatisfiable_assertion_fails_at_suite_load`
- `test_cost_ceiling_failure_is_distinct_from_quality_failure`
- `test_agent_suites_assert_on_termination_reason`
- `test_run_records_commit_and_prompt_versions`

## Acceptance criteria

- [ ] ≥50 cases per service, each tagged
- [ ] Every run records commit + prompt versions
- [ ] Adversarial pass rate is reported separately from the headline
- [ ] Suites run deterministically with mocked tools
- [ ] Per-case cost ceilings keep a full suite affordable enough to actually run
