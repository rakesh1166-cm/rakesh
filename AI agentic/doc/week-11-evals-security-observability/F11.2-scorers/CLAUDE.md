# W11-F11.2 — Scorers: Exact, Schema, Judge, Citation

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/evals/scorers/` (kernel)
**Depends on:** [F11.1](../F11.1-eval-harness-and-datasets/CLAUDE.md)
**Consumed by:** [F11.3](../F11.3-ci-regression-gate/CLAUDE.md)

## Goal

Turn an output into a **number that means something**. Four scorers ordered by cost and reliability:
deterministic checks first, the LLM judge last and least trusted.

## Contract (schema first)

```python
class ScorerKind(str, Enum):
    EXACT        = "exact"          # free, deterministic
    SCHEMA_VALID = "schema_valid"   # free, deterministic — the highest-value scorer here
    PROPERTY     = "property"       # free — contains, field_in, length_between…
    CITATION     = "citation"       # cheap — reuses W6-F6.3
    LLM_JUDGE    = "llm_judge"      # expensive, non-deterministic, LAST resort

class ScoreDetail(BaseModel):
    scorer: ScorerKind
    passed: bool
    score: float = Field(ge=0, le=1)
    explanation: str
    cost_usd: float = 0.0
    deterministic: bool

class ScorerPort(Protocol):
    kind: ScorerKind
    async def score(self, case: EvalCase, output: Any) -> ScoreDetail

# LLM judge only
class JudgeConfig(BaseModel):
    rubric_ref: tuple[str, str]       # versioned prompt (W3-F3.1)
    model_tier: ModelTier = ModelTier.DEFAULT
    runs: int = 3                     # majority vote — one judge run is noise
    require_agreement: float = 0.66
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/evals/scorers/{exact,schema_valid,property}.py` | NEW | deterministic scorers |
| `platform/src/aiplat/evals/scorers/citation.py` | NEW | wraps W6-F6.3's verifier |
| `platform/src/aiplat/evals/scorers/llm_judge.py` | NEW | rubric-based, voted |
| `platform/src/aiplat/prompts/templates/judge_rubric/v1.md` | NEW | versioned rubric |

## Flow

```
CaseResult.output
      ▼
run scorers CHEAPEST FIRST
   1. SCHEMA_VALID  → invalid? FAIL IMMEDIATELY, skip the rest      ← saves judge cost
   2. EXACT / PROPERTY
   3. CITATION      (W6-F6.3 verifier)
   4. LLM_JUDGE     → N runs → majority vote → agreement ratio
      ▼
ScoreDetail[] → aggregated per case → EvalRun (F11.1)
```

## Rules

- **Schema validity short-circuits.** If the output does not parse into the expected model, nothing
  downstream matters — and paying a judge to evaluate malformed JSON is pure waste.
- **The LLM judge votes.** A single judge run is noise; `runs=3` with a 2/3 agreement threshold is
  the minimum for a number worth gating on. Disagreement itself is a signal — record it.
- **The judge rubric is a versioned prompt** (W3-F3.1). An unversioned rubric silently changes what
  "quality" means, which quietly invalidates every historical score.
- **Prefer deterministic scorers.** Every assertion that can be a `PROPERTY` check should be. Judge
  cost and variance both compound across 50 cases × 12 weeks.
- **`deterministic` is recorded per scorer.** The gate (F11.3) treats deterministic regressions as
  hard failures and judge-only regressions as warnings — because only one of them is trustworthy.
- **Never judge with the model under test using its own output as context.** Self-evaluation
  inflates scores; use a separate call with the rubric and the output only.
- Judge cost is recorded under its own `component` — eval spend must be visible, not hidden inside
  a CI bill.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Output is malformed | `SCHEMA_VALID` fails; judge never runs |
| Judge returns an unparseable score | That run discarded; if <2 valid runs remain, case is inconclusive |
| Judges disagree 1/1/1 | Below `require_agreement` → inconclusive, not a silent average |
| Judge unavailable | Deterministic scores still reported; judge marked skipped |
| Rubric edited without a version bump | Frozen-template check (W3-F3.1) fails at startup |
| Judge cost exceeds the suite budget | Suite halts and says so; it does not silently truncate |

## Tests

- `test_schema_failure_short_circuits_before_the_judge`
- `test_judge_uses_majority_vote_not_a_single_run`
- `test_judge_disagreement_yields_inconclusive_not_an_average`
- `test_rubric_is_a_pinned_prompt_version`
- `test_judge_does_not_receive_its_own_prior_output`
- `test_scorer_cost_is_recorded_under_its_own_component`

## Acceptance criteria

- [ ] Deterministic scorers run first and can short-circuit
- [ ] The judge votes ≥3 times with an explicit agreement threshold
- [ ] Inconclusive is a distinct outcome from pass and fail
- [ ] The rubric is versioned and frozen
- [ ] Eval spend is attributable and bounded
