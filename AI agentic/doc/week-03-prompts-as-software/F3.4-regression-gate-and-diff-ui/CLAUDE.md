# W3-F3.4 — Regression Gate + Prompt Diff UI

> [Week 3](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `tests/regression/` + `apps/w03_prompt_lab/router.py` + `frontend/src/weeks/w03/`
**Depends on:** [F3.3](../F3.3-golden-suites-and-scoring/CLAUDE.md)
**Consumed by:** W11-F11.3 generalises this into the full CI eval gate

## Goal

Make a prompt regression **impossible to merge and easy to see**. The gate blocks CI on a score
drop; the UI shows the two versions side by side on the same input so a human can judge *why*.

## Contract (schema first)

```python
class ScoreDelta(BaseModel):
    prompt_name: str
    from_version: str
    to_version: str
    pass_rate_delta: float           # negative = worse
    cost_delta_usd: float            # positive = worse
    p95_delta_ms: float
    newly_failing: list[str]         # case ids — the actionable part
    newly_passing: list[str]

class GateVerdict(BaseModel):
    passed: bool
    reasons: list[str]               # empty when passed
    delta: ScoreDelta

GATE = {"max_pass_rate_drop": 0.02, "max_cost_increase_pct": 0.20, "no_new_failures_tagged": ["adversarial"]}
```

```js
// POST /api/w03/compare
{ name, versions: ["v1","v2"], input: {...} }
  → { v1: {output, usage, latency_ms}, v2: {...}, delta: ScoreDelta }
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `tests/regression/test_prompt_gate.py` | NEW | runs every suite, asserts `GateVerdict.passed` |
| `apps/w03_prompt_lab/gate.py` | NEW | `SuiteScore × baseline → GateVerdict` |
| `apps/w03_prompt_lab/router.py` | EDIT | `POST /compare`, `GET /prompts` |
| `frontend/src/weeks/w03/PromptDiffView.jsx` | NEW | v1 vs v2 output, same input |
| `frontend/src/weeks/w03/VersionPicker.jsx` | NEW | versions listed **from the API** |
| `frontend/src/weeks/w03/SuiteScoreTable.jsx` | NEW | pass/fail grid + deltas |

## Flow

```
CI: pytest tests/regression
      ▼
for each prompt: runner (F3.3) ──► SuiteScore ──► gate.compare(baseline)
      ▼
GateVerdict.passed == False  ──► BUILD FAILS with newly_failing case ids
                                  (not just "pass rate dropped")

Human: /w03 → VersionPicker(v1, v2) → POST /compare → PromptDiffView + SuiteScoreTable
```

## Rules

- The gate fails on **three** independent conditions: pass-rate drop beyond tolerance, cost increase
  beyond tolerance, **or any new failure on an `adversarial`-tagged case**. Adversarial cases have
  zero tolerance — they are the safety cases.
- The failure message lists **case IDs**, not a summary statistic. "pass_rate 0.94 → 0.91" is not
  actionable; "newly_failing: [inject-03, empty-input-01]" is.
- `VersionPicker` reads versions from `GET /api/w03/prompts`. The UI never hardcodes `"v2"` — so a
  new version needs no frontend deploy.
- The diff view runs both versions on the **same input in the same request**, so provider variance
  is not mistaken for a prompt difference.
- Improving a baseline is a **deliberate commit** of the new baseline file with a justification in
  the PR — never an automatic overwrite on green.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Pass rate improves, cost doubles | Gate **fails** on the cost condition |
| Adversarial case newly fails, overall rate up | Gate **fails** — zero tolerance on safety cases |
| Baseline missing for a new version | Gate refuses to pass; a new prompt must land with a baseline |
| Provider down in CI | Gate is skipped with a loud `SKIPPED` marker, never a silent pass |
| Compare called with one version | 422 — the endpoint compares, it does not run |

## Tests

- `test_gate_fails_on_cost_increase_even_when_quality_improves`
- `test_gate_fails_on_any_new_adversarial_failure`
- `test_gate_reports_case_ids_not_just_percentages`
- `test_missing_baseline_is_a_failure_not_a_pass`
- `test_version_picker_lists_versions_from_api` (frontend)

## Acceptance criteria

- [ ] Editing a prompt to a worse `v3` fails CI with the specific failing case IDs
- [ ] A cost-doubling "improvement" is blocked
- [ ] `grep -n '"v[0-9]' frontend/src/weeks/w03/` returns nothing — no hardcoded versions
- [ ] `PromptDiffView` shows both outputs for one input, with usage and latency per side
- [ ] Baselines change only via an explicit committed diff
