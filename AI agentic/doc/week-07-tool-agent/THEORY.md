# Week 7 — Theory

> Written **before** Week 7's code. Revisited after. · [Week 7](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #18 Planning + Reasoning · #19 ReAct · #20 Agentic AI ·
> #16 AI Agents *(properly, this time)*
> Week 4 called tools in a fixed sequence. This is where the model starts deciding.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 19 | **ReAct** | _(fill in)_ | [F7.1](F7.1-bounded-agent-loop/CLAUDE.md) — reason → act → observe, repeat. Your loop *is* ReAct with hard caps bolted on |
| 18 | **Planning + reasoning** | _(fill in)_ | [F7.1](F7.1-bounded-agent-loop/CLAUDE.md) — the PLAN phase. Also why [F7.3](F7.3-loop-guards-and-budgets/CLAUDE.md)'s `NoProgress` guard exists: a model can plan forever without acting |
| 20 | **Agentic AI** | _(fill in)_ | The distinction from Week 4. Write down the one property that changed |
| 16 | **AI agents** *(properly)* | _(fill in)_ | [F7.1](F7.1-bounded-agent-loop/CLAUDE.md) — autonomy over *tool selection*, bounded by iteration, wall-clock and cost |
| — | **Externalised state / durable execution** | _(fill in)_ | [F7.2](F7.2-run-state-in-redis/CLAUDE.md) — the load-bearing decision. A Python dict means no scale, no restart, no worker split |

### Study prompts

- What exactly does ReAct add over "call these tools in order"? Name the thing.
- `max_iterations=10` is set. Name **three** ways a run can still burn your entire budget.
  (Check against [F7.3](F7.3-loop-guards-and-budgets/CLAUDE.md)'s five guards.)
- Run state lives in a Python dict. List everything that breaks. Be exhaustive — this is the
  decision the next five weeks rest on.
- The model calls the same tool with the same arguments three times. Bug or reasonable? When is it
  each? (See the "legitimate retry after failure" row in F7.3.)
- Hitting `max_iterations` — is that an error or a result?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| Median iterations for a real task | _(guess)_ | _(after)_ |
| How often a guard fires, and which one first | _(guess)_ | _(after)_ |
| Cost per agent run vs the Week 4 fixed sequence | _(guess)_ | _(after)_ |
| Redundant tool calls per run ([F7.6](F7.6-trajectory-recording-and-replay-debugging/CLAUDE.md)) | _(guess)_ | _(after)_ |
| Speedup from parallel tool calls ([F7.4](F7.4-parallel-tool-execution/CLAUDE.md)) | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 6](../week-06-rag-pipeline/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Did the agent actually beat the Week 4 fixed sequence?** On what, and at what cost multiple?
This question returns with force in [Week 10](../week-10-multi-agent/THEORY.md). _(after)_
**New questions:** _(after — carry into [Week 8](../week-08-graph-workflows/THEORY.md))_
