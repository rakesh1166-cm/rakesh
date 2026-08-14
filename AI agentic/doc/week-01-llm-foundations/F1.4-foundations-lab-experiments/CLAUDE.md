# W1-F1.4 — Foundations Lab: Temperature, Embeddings, Hallucination

> [Week 1](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w01_llm_lab/` (thin app)
**Depends on:** [F1.2](../F1.2-llm-port-and-anthropic-client/CLAUDE.md), [F1.3](../F1.3-token-accounting-and-context-guard/CLAUDE.md)
**Consumed by:** W3 (temperature choice for eval determinism), W5 (embedding intuition)

## Goal

Produce **numbers**, not impressions. Four experiments whose recorded results justify defaults used
for the next eleven weeks: why `temperature=0.0` is the default, what a context window costs in
practice, what embedding similarity actually looks like, and how confidently a model states a
falsehood.

## Contract (schema first)

```python
class ExperimentResult(BaseModel):
    name: str
    params: dict[str, Any]
    runs: int
    observations: list[str]
    metric: float                 # variance, similarity, or hallucination rate
    conclusion: str               # ONE sentence, must cite `metric`

# each experiment: run(llm: LLMPort, runs: int) -> ExperimentResult
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w01_llm_lab/experiments/temperature.py` | NEW | same prompt × N runs × 3 temperatures → output variance |
| `apps/w01_llm_lab/experiments/context_window.py` | NEW | fill the window; find where `check()` fires and what it costs |
| `apps/w01_llm_lab/experiments/hallucination.py` | NEW | probe with unanswerable questions; measure confident-wrong rate |
| `apps/w01_llm_lab/embeddings_demo.py` | NEW | cosine similarity across related/unrelated/negated pairs |
| `apps/w01_llm_lab/README.md` | NEW | **the deliverable** — a results table with real numbers |

## Flow

```
experiment.run(llm=RealClient or MockLLM, runs=N)
      ▼
LLMPort (F1.2)  +  tokens.count (F1.3)
      ▼
ExperimentResult{metric, conclusion}
      ▼
README.md results table  ──► cited by W3 (temperature), W5 (embeddings), W6 (refusal threshold)
```

## Rules

- Every experiment takes `llm: LLMPort` as a **parameter**. None constructs its own client — that
  is what lets the whole lab run against `MockLLM` in CI.
- `runs >= 5` for any variance claim. One sample is an anecdote.
- `conclusion` must reference the measured `metric`. "Temperature 0 is more consistent" is not a
  conclusion; "output variance 0.02 at T=0 vs 0.41 at T=1.0 over 10 runs" is.
- The hallucination probe uses questions with **verifiably no answer** (invented landmarks,
  fabricated dates), so a confident answer is unambiguously wrong.
- This is a lab: no router, no persistence, no frontend. Resist scaffolding either.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Provider unavailable mid-run | Partial `ExperimentResult` written with `runs` = completed count |
| Rate limited | Experiment backs off and reports actual runs — never silently reports N |
| Run against `MockLLM` in CI | Completes and is marked `params={"llm":"mock"}` — not presented as real data |
| Context experiment overflows | `ContextOverflow` is the *expected* result and is recorded, not a crash |

## Tests

- `test_every_experiment_accepts_an_llm_port` — no experiment constructs a client
- `test_experiments_run_offline_against_mock`
- `test_conclusion_references_metric` — string check, cheap and effective
- `test_partial_results_recorded_on_provider_failure`

## Acceptance criteria

- [ ] `README.md` has a results table with **measured numbers** for all four experiments
- [ ] The default `temperature=0.0` in [F1.2](../F1.2-llm-port-and-anthropic-client/CLAUDE.md) is
      justified by the recorded variance figure
- [ ] Embedding similarity numbers exist for related / unrelated / **negated** pairs — the negation
      case is the one that matters for Week 5 retrieval
- [ ] The hallucination rate is a number, and it is cited when W6 sets its refusal threshold
- [ ] The whole lab runs in CI against `MockLLM` with no API key present
