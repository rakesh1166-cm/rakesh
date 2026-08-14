# Week 2 — Theory

> Written **before** Week 2's code. Revisited after. · [Week 2](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** *none.* This week is engineering, not AI — and that is worth
> noticing. A large share of "AI engineering" is ordinary distributed-systems work, and the ladder
> has no entry for any of it.

---

## The 5 concepts (10–15 min each)

| Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|
| **ASGI / async I/O** | _(fill in)_ | [F2.1](F2.1-api-skeleton-and-week-mounts/CLAUDE.md) — why FastAPI, and why one blocking call poisons the whole event loop |
| **`contextvars`** | _(fill in)_ | [F2.2](F2.2-correlation-id-and-structured-logging/CLAUDE.md) — the correlation ID travels here, not as a parameter. Must survive `gather` and `create_task`, or Week 7 breaks |
| **Correlation IDs / structured logging** | _(fill in)_ | [F2.2](F2.2-correlation-id-and-structured-logging/CLAUDE.md) — one ID answers "what did this request do and what did it cost?" Paid off in [W11-F11.6](../week-11-evals-security-observability/F11.6-redaction-audit-log-and-traceview/CLAUDE.md) |
| **Exponential backoff + jitter** | _(fill in)_ | [F2.4](F2.4-resilience-timeout-retry-breaker/CLAUDE.md) — why *fixed* backoff across N workers is a self-inflicted DDoS |
| **Circuit breakers** | _(fill in)_ | [F2.4](F2.4-resilience-timeout-retry-breaker/CLAUDE.md) — closed/open/half-open, and why the state must live in Redis rather than in-process |

### Study prompts

- **Async:** what actually happens when synchronous code runs inside an `async def`? How would you
  detect it in production? (Answer becomes [W11-F11.9](../week-11-evals-security-observability/F11.9-load-and-capacity-testing/CLAUDE.md)'s event-loop lag gauge.)
- **contextvars:** why does a thread-local not work here?
- **Backoff:** three workers all retry a dead host. Without jitter, when do they collide?
- **Breaker:** two API workers, one dead upstream. With in-process breaker state, how many failures
  does a user see before it opens? Now with shared state?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_
**My guess:** how many places will I be tempted to `print()` or pass the correlation ID as an
argument? _(guess)_ → _(actual)_

---

## Open questions

- _(fill in)_
- _(carried from [Week 1](../week-01-llm-foundations/THEORY.md), still unanswered: …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Open questions now answered:** _(after)_
**New questions:** _(after — carry into [Week 3](../week-03-prompts-as-software/THEORY.md))_
