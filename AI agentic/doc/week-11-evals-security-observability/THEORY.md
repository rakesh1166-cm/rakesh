# Week 11 — Theory

> Written **before** Week 11's code. Revisited after. · [Week 11](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #25 Production Agentic AI — *one box.*
> This week alone is 10 features. That gap is the single biggest weakness of the concept ladder:
> it treats production as an afterthought, and production is where agentic systems actually fail.

---

## The 6 concepts (10–15 min each)

| Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|
| **Evaluation-driven development** | _(fill in)_ | [F11.1](F11.1-eval-harness-and-datasets/CLAUDE.md) — ≥50 cases per service. Mock the **tools**, not the model |
| **LLM-as-judge** | _(fill in)_ | [F11.2](F11.2-scorers/CLAUDE.md) — noisy and expensive, so it votes ≥3× and runs **last**, after deterministic scorers |
| **Regression gating** | _(fill in)_ | [F11.3](F11.3-ci-regression-gate/CLAUDE.md) — quality, cost *and* latency. Zero tolerance on safety tags |
| **Prompt injection** *(all five sources)* | _(fill in)_ | [F11.4](F11.4-prompt-injection-defense/CLAUDE.md) — user input, tool output, retrieved docs, MCP descriptions, MCP results |
| **Exfiltration / output guarding** | _(fill in)_ | [F11.7](F11.7-output-guardrails/CLAUDE.md) — a secret split across token boundaries is invisible per-token |
| **Unit economics** | _(fill in)_ | [F11.10](F11.10-unit-economics-and-cost-forecasting/CLAUDE.md) — cost per *successful* unit, forecast on **p95** not the mean |

### Study prompts

- Why mock the tools but not the model? What would each alternative actually measure?
- Overall pass rate rises 3%; one injection case newly fails. Merge or block? Why is there only
  one right answer?
- Name the **five** untrusted sources in this system. Which did you forget? (Most people name one.)
- An API key appears in the output stream, split across two tokens. What catches it?
- Your bill is $4,200/month. What decision can you make with that number? Now: "$0.31 per itinerary,
  62% reranking." What can you decide now?
- A model that refuses *less* scores better on quality. Is that an improvement?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| Injection corpus cases that escalate | _(guess — should be 0)_ | _(after)_ |
| Baseline eval pass rate, per suite | _(guess)_ | _(after)_ |
| Cost per successful unit, per unit kind | _(guess)_ | _(after)_ |
| **Concurrency at saturation** ([F11.9](F11.9-load-and-capacity-testing/CLAUDE.md)) — the ~40 claim | _(guess)_ | _(after)_ |
| Top cost driver | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 10](../week-10-multi-agent/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Was the ~40-concurrent threadpool claim right?** It has been asserted repeatedly in these docs and
measured nowhere until now. If wrong, correct [CLAUDE-12-WEEK.md §10](../../CLAUDE-12-WEEK.md). _(after)_
**New questions:** _(after — carry into [Week 12](../week-12-ai-ops-assistant/THEORY.md))_
