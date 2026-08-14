# Week 4 — Theory ⭐

> Written **before** Week 4's code. Revisited after. · [Week 4](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #15 Tool / Function Calling · #16 AI Agents *(definition only)* ·
> #17 Memory
> The heaviest week. Three kernel contracts are born here and never rewritten.

---

## The 6 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 15 | **Tool / function calling** | _(fill in)_ | [F4.3](F4.3-tool-port-registry-executor/CLAUDE.md) — the model *requests*; your code *decides and executes*. That gap is the whole security model |
| 16 | **AI agent** *(definition)* | _(fill in)_ | Week 4 is **not** an agent — it's a fixed sequence ([F4.6](F4.6-bounded-tool-sequence-and-persistence/CLAUDE.md)). Be able to say exactly what's missing. Week 7 adds it |
| 17 | **Memory** | _(fill in)_ | [F4.8](F4.8-conversation-memory-and-refinement/CLAUDE.md) — the API is stateless, so "memory" = what you choose to resend, and what you compact away |
| — | **Structured output & JSON Schema** | _(fill in)_ | [F4.2](F4.2-itinerary-schema-and-repair/CLAUDE.md) — validate → **one** repair retry → typed failure. Never prose to the client |
| — | **Server-Sent Events** | _(fill in)_ | [F4.5](F4.5-sse-streaming-contract/CLAUDE.md) — one-directional, proxy-friendly, and why `done` must *always* be last |
| — | **Prompt caching** | _(fill in)_ | [F4.5](F4.5-sse-streaming-contract/CLAUDE.md) — system prompt + tool defs are stable across turns, so they shouldn't be re-billed |

### Study prompts

- Tool calling: what does the model actually return? Who runs the function? What stops it calling
  a tool it wasn't given? (If your answer mentions the prompt, re-read [ADR-012](../../TECH-STACK-DECISIONS.md).)
- **Week 4 is a fixed sequence, not an agent.** Write down the one property that makes something an
  agent. Check your answer against [W7-F7.1](../week-07-tool-agent/F7.1-bounded-agent-loop/CLAUDE.md).
- The model returns malformed JSON. Why exactly **one** repair retry — not zero, not three?
- A user closes the tab mid-stream. Who stops paying for tokens?
- Turn 1 says "I'm vegetarian." At turn 12, where does that live?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| Repair-retry rate — how often is the first output invalid? | _(guess)_ | _(after)_ |
| Weather/geocode cache hit rate after 50 requests | _(guess)_ | _(after)_ |
| Time to first streamed token | _(guess)_ | _(after)_ |
| Cost per itinerary | _(guess)_ | _(after — feeds [W11-F11.10](../week-11-evals-security-observability/F11.10-unit-economics-and-cost-forecasting/CLAUDE.md))_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 3](../week-03-prompts-as-software/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Did the SSE event contract survive?** Week 6 reuses `useSSEStream` unchanged — did it? _(after)_
**New questions:** _(after — carry into [Week 5](../week-05-pgvector-search/THEORY.md))_
