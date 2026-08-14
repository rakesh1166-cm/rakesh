# Week 10 — Theory

> Written **before** Week 10's code. Revisited after. · [Week 10](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #21 Multi-Agent Systems
> The most important concept this week is **not** on the ladder: knowing when *not* to use an agent.
> The blog calls it aggressive simplification, and it is the actual deliverable.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 21 | **Multi-agent systems** | _(fill in)_ | [F10.2](F10.2-supervisor-fanout-and-merge/CLAUDE.md) — decompose, fan out, merge. N model calls instead of one |
| — | **Router pattern** | _(fill in)_ | [F10.1](F10.1-intent-router/CLAUDE.md) — classify → one specialist. The cheapest pattern, and usually the only one that pays |
| — | **Supervisor-worker** | _(fill in)_ | [F10.2](F10.2-supervisor-fanout-and-merge/CLAUDE.md) — and why *surfacing* conflicts beats resolving them silently |
| — | **When NOT to use an agent** | _(fill in)_ | [F10.4](F10.4-agent-justification-and-deletion-pass/CLAUDE.md) — "what does this do that a deterministic function cannot?" |
| — | **Baselines & honest comparison** | _(fill in)_ | [F10.3](F10.3-deterministic-baseline-harness/CLAUDE.md) — without a real baseline, "it works" is unfalsifiable |

### Study prompts

- Multi-agent costs 3× and is harder to debug. Name a task where it still wins, and say *why*.
- Two specialists return contradicting answers. Pick the higher-confidence one — what did you just
  throw away? (This is the strongest argument for fan-out, and the easiest to discard.)
- **Write the deterministic baseline first.** Why does building it *after* the agents invalidate the
  comparison? Be honest about the mechanism.
- "It's more flexible" — why is that not a justification for an agent?
- If routing rules handle 95% of traffic, what should happen to the LLM classifier?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_
**My prediction, before measuring:** which of the four approaches wins? _(deterministic /
single agent / router / supervisor)_ → _(actual)_

| Measurement | My guess | Actual |
|---|---|---|
| Quality: deterministic vs single-agent vs router vs supervisor | _(guess)_ | _(after)_ |
| Cost multiple vs the deterministic baseline | _(guess)_ | _(after)_ |
| Share of routing handled by rules alone | _(guess)_ | _(after)_ |
| **Agents I expect to delete** | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 9](../week-09-mcp-tools/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**What did I delete, and what replaced it?** If the answer is "nothing", the task set was too easy —
say that instead of declaring victory. _(after)_
**New questions:** _(after — carry into [Week 11](../week-11-evals-security-observability/THEORY.md))_
