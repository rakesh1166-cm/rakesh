# Week 8 — Theory

> Written **before** Week 8's code. Revisited after. · [Week 8](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #23 LangGraph · #17 Memory *(as durable state, not conversation)*
> **Deliberately skipped: #22 LangChain.** [ADR-004](../../TECH-STACK-DECISIONS.md) — plain Python
> until a requirement forces a framework. That requirement arrives this week, and it is
> *resumability*, not convenience.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 23 | **LangGraph / state graphs** | _(fill in)_ | [F8.1](F8.1-graph-builder-and-node-contracts/CLAUDE.md) — nodes, edges, and one serialisable state object crossing every boundary |
| — | **Checkpointing** | _(fill in)_ | [F8.2](F8.2-postgres-checkpointer/CLAUDE.md) — written **before** each node runs, not after. Why that ordering matters |
| 17 | **Memory as durable state** | _(fill in)_ | [F8.2](F8.2-postgres-checkpointer/CLAUDE.md) — Redis for live runs (W7), Postgres for pauses that last hours. Not redundant |
| — | **Human-in-the-loop / interrupts** | _(fill in)_ | [F8.3](F8.3-human-interrupt-and-approval-gate/CLAUDE.md) — pause, persist, wait for a person, resume |
| — | **Payload binding (approval integrity)** | _(fill in)_ | [F8.3](F8.3-human-interrupt-and-approval-gate/CLAUDE.md) — `payload_hash`. Approving "restart X" must not authorise "restart Y" |

### Study prompts

- **The framework has to earn its place.** Before writing any LangGraph: what can a graph do that
  [W7's loop](../week-07-tool-agent/F7.1-bounded-agent-loop/CLAUDE.md) cannot? One sentence. If you
  can't produce it, you don't need the framework yet.
- Why checkpoint *before* a node runs? What is lost if you checkpoint after?
- A run pauses for approval. The approver arrives 6 hours later, from another machine, having never
  seen it start. What has to be true for that to work?
- The state changed between proposal and approval. What stops the wrong thing executing?
- A node stashes an open DB session in `scratch`. When exactly does that fail?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_
**My one-sentence justification for using a framework at all:** _(fill in — you will be held to it)_

| Measurement | My guess | Actual |
|---|---|---|
| Checkpoint write overhead per node | _(guess)_ | _(after)_ |
| Does a full-stack restart mid-pause actually resume cleanly? | _(guess)_ | _(after)_ |
| How much of `aiplat/graph/` is wrapper vs. LangGraph | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 7](../week-07-tool-agent/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Was the framework worth it?** Honest answer. If the graph is doing what a loop plus a database
row could do, say so. _(after)_
**New questions:** _(after — carry into [Week 9](../week-09-mcp-tools/THEORY.md))_
