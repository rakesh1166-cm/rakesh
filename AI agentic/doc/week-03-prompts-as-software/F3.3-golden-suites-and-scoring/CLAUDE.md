# W3-F3.3 — Golden Suites + Scoring

> [Week 3](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w03_prompt_lab/suites/`
**Depends on:** [F3.2](../F3.2-template-render-and-variable-validation/CLAUDE.md)
**Consumed by:** [F3.4](../F3.4-regression-gate-and-diff-ui/CLAUDE.md); scaled up by W11-F11.1/F11.2

## Goal

A prompt change must produce a **number that moved**, not a feeling that it reads better. Each
prompt gets a golden suite of cases with assertable properties and a recorded baseline.

## Contract (schema first)

```python
class GoldenCase(BaseModel):
    id: str
    inputs: dict[str, Any]
    expect: list[Assertion]          # properties, not exact strings
    tags: list[str] = []             # "edge", "adversarial", "short-input"

class Assertion(BaseModel):
    kind: Literal["schema_valid", "contains", "not_contains",
                  "field_equals", "field_in", "length_between", "json_parses"]
    args: dict[str, Any]

class CaseResult(BaseModel):
    case_id: str
    passed: bool
    failed_assertions: list[str]
    output: Any
    usage: Usage

class SuiteScore(BaseModel):
    prompt_name: str
    version: str
    pass_rate: float                 # 0..1
    total_cost_usd: float
    p95_latency_ms: float
    results: list[CaseResult]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w03_prompt_lab/suites/summarize.yaml` | NEW | ≥10 golden cases |
| `apps/w03_prompt_lab/suites/{classify,extract,chat}.yaml` | NEW | ≥10 cases each |
| `apps/w03_prompt_lab/runner.py` | NEW | run a suite against `(name, version)` → `SuiteScore` |
| `apps/w03_prompt_lab/baselines/` | NEW | committed `SuiteScore` per shipped version |

## Flow

```
suite.yaml + (name, version)
      ▼
runner: for each GoldenCase
    render (F3.2) ──► llm.complete ──► parse
      ▼
  evaluate assertions ──► CaseResult
      ▼
SuiteScore{pass_rate, cost, p95}
      ▼
compare vs baselines/<name>/<version>.json  ──► F3.4 gate
```

## Rules

- **Assert properties, not exact strings.** `contains("Rome")` survives a harmless rewording;
  `equals("<exact paragraph>")` fails on every regeneration and gets deleted within a week.
- Every suite carries **adversarial cases**: empty input, input in another language, input
  containing instructions ("ignore the above"), input that is only whitespace.
- **Cost and latency are part of the score.** A prompt edit that lifts pass rate 2% while doubling
  cost is a regression, and only a scored comparison reveals that.
- Baselines are **committed files**. A baseline that lives only on the machine that generated it is
  not a baseline.
- Suites run against a **pinned version**, never `latest()`.
- `runs >= 3` per case when `temperature > 0`. At `temperature=0` (the default from W1-F1.4), one
  run is defensible — record which regime was used.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Provider fails mid-suite | Partial `SuiteScore` with completed count; not reported as a pass rate |
| A case is flaky across runs | Flagged as unstable and excluded from the gate until fixed |
| Baseline file missing | Runner refuses to gate and says so — never treats "no baseline" as a pass |
| Suite passes but cost tripled | Gate fails on the cost delta (F3.4) |
| Assertion is unsatisfiable | Detected at suite load, not as a permanent red case |

## Tests

- `test_partial_suite_is_not_reported_as_a_pass_rate`
- `test_missing_baseline_blocks_gating`
- `test_flaky_case_is_flagged_not_averaged_away`
- `test_every_suite_has_adversarial_cases` — enforce the `adversarial` tag exists

## Acceptance criteria

- [ ] Each of the four W2 prompts has ≥10 golden cases including adversarial ones
- [ ] `SuiteScore` records pass rate, cost, **and** p95 latency
- [ ] Baselines are committed per shipped prompt version
- [ ] Running a suite twice at `temperature=0` produces the same pass rate
- [ ] No assertion depends on exact model wording
