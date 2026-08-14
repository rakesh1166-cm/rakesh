# W6-F6.4 — Confidence Scoring + Refusal Threshold

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w06_rag_pipeline/confidence.py`
**Depends on:** [F6.3](../F6.3-citation-extraction-and-verification/CLAUDE.md)
**Consumed by:** [F6.5](../F6.5-answer-ui-with-citations/CLAUDE.md), **W12** (an ops assistant must refuse)

## Goal

Decide, from **measured signals rather than the model's self-report**, whether an answer is
trustworthy — and refuse when it is not. A system that always answers is a system that hallucinates
on the questions its corpus cannot support.

## Contract (schema first)

```python
class ConfidenceSignals(BaseModel):
    citation_coverage: float          # F6.3 — the dominant signal
    top_retrieval_score: float        # W5 — was anything relevant even found?
    mean_rerank_score: float          # F6.1
    fabricated_refs: int              # F6.3 — any > 0 is disqualifying
    context_dropped: int              # F6.2 — did the answer chunk get truncated away?
    claims_total: int

class ConfidencePolicy(BaseModel):
    refuse_below: float = 0.45
    hedge_below: float = 0.70
    hard_refuse_on_fabrication: bool = True    # non-negotiable
    min_top_score: float = 0.30                # nothing relevant ⇒ refuse before generating

class ConfidenceVerdict(BaseModel):
    score: Confidence
    band: Literal["high", "medium", "refuse"]
    reasons: list[str]                # WHY — shown to the user, not just logged
    signals: ConfidenceSignals
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w06_rag_pipeline/confidence.py` | NEW | signal aggregation + policy |
| `apps/w06_rag_pipeline/eval/refusal.py` | NEW | calibration set: answerable vs unanswerable |
| `apps/w06_rag_pipeline/pipeline.py` | EDIT | refuse pre-generation when `min_top_score` fails |

## Flow

```
PRE-GENERATION gate
   top_retrieval_score < min_top_score  ──► REFUSE, skip the LLM entirely
        (cheapest refusal: costs nothing and cannot hallucinate)
                    ▼
POST-GENERATION scoring
   ConfidenceSignals ──► weighted score
        fabricated_refs > 0 ──► score = 0.0, band = "refuse"   (hard override)
                    ▼
   band = refuse  → Answer{refused: true, refusal_reason, text: ""}
   band = medium  → answer + visible hedge
   band = high    → answer
                    ▼
   ConfidenceVerdict.reasons ──► rendered in the UI (F6.5)
```

## Rules

- **The model's self-reported confidence is never a signal.** Models are confidently wrong; that is
  precisely the failure being defended against. Every input is measured externally.
- **Refuse before generating when nothing relevant was retrieved.** The cheapest refusal costs zero
  tokens and cannot hallucinate. Generating first and refusing after is strictly worse.
- **Fabricated references hard-fail.** Not a penalty term — a zero. A model inventing sources has
  demonstrated it is generating rather than retrieving.
- **`reasons[]` is user-facing.** "I don't have documentation covering this" is useful; a bare
  confidence number is not.
- The threshold is **calibrated**, not guessed: run the answerable/unanswerable set and pick the
  value that minimises both false refusals and confident-wrong answers. Record it.
- `context_dropped > 0` lowers confidence — the answer may have been truncated away (F6.2).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Question with no supporting doc | Pre-generation refusal; zero tokens spent |
| Model cites a nonexistent chunk | Hard refuse regardless of every other signal |
| Answer well-cited but from one weak chunk | `medium` band with a visible hedge |
| Threshold too aggressive | Calibration set shows the false-refusal rate; tune with the number |
| All signals missing (pipeline bug) | Refuse. Absent signals are never treated as good ones. |
| Answer is a legitimate "not covered" | `refused=true` with a reason is the **correct** output |

## Tests

- `test_no_relevant_chunks_refuses_before_the_llm_call`
- `test_fabricated_reference_forces_refusal`
- `test_missing_signals_default_to_refuse_not_pass`
- `test_refusal_reasons_are_human_readable`
- `test_calibration_set_reports_false_refusal_and_confident_wrong_rates`

## Acceptance criteria

- [ ] An unanswerable question refuses **without** an LLM call
- [ ] Fabricated citations always refuse, whatever the other signals say
- [ ] Thresholds are justified by a recorded calibration run, not chosen by feel
- [ ] `reasons[]` are shown to the user (F6.5), not only logged
- [ ] Absent signals fail closed
