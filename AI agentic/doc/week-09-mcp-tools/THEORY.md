# Week 9 — Theory

> Written **before** Week 9's code. Revisited after. · [Week 9](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #24 MCP
> The security concepts below are not on the ladder at all — and they are the hard part of this
> week. Exposing tools outside your process changes the threat model, not just the transport.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 24 | **MCP** | _(fill in)_ | [F9.1](F9.1-mcp-server-from-tool-registry/CLAUDE.md) — a standard protocol for exposing tools to any agent, not just yours |
| — | **MCP's three primitives** | _(fill in)_ | [F9.5](F9.5-mcp-resources-and-prompts/CLAUDE.md) — tools (model-invoked) · resources (app-attached context) · prompts (user-invoked). Most people ship only the first |
| — | **Least privilege / capability scoping** | _(fill in)_ | [F9.2](F9.2-scope-bounds-and-least-privilege/CLAUDE.md) — a new client starts with **zero** scopes; grants are explicit |
| — | **Trust boundaries** | _(fill in)_ | [F9.3](F9.3-mcp-client-as-toolport/CLAUDE.md) — a remote server declaring its own privileges inverts the trust relationship. You set the ceiling |
| — | **Second-order prompt injection** | _(fill in)_ | [F9.3](F9.3-mcp-client-as-toolport/CLAUDE.md) — a hostile *tool description* reaches your model. Nobody is watching that field |

### Study prompts

- Why does a *protocol* for tools matter at all? What would you do without one?
- A third-party MCP server declares `authz_scope: write:external`. Do you grant it? Why is the
  answer structural rather than a judgement call?
- A remote tool is named `weather_forecast`, same as yours. What breaks? ([F9.3](F9.3-mcp-client-as-toolport/CLAUDE.md) namespaces — why is that not paranoid?)
- "Fetch the payments runbook" — tool or resource? What does getting this wrong cost you?
- A denial for an *unauthorised* tool and for a *nonexistent* tool must look identical. Why?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_
**My guess:** how much of `aiplat/tools/ports.py` (written in Week 4) will need changing to serialise
to MCP? _(guess — [F4.3](../week-04-holidaylandmarks/F4.3-tool-port-registry-executor/CLAUDE.md) bet on "none")_ → _(actual)_

| Measurement | My guess | Actual |
|---|---|---|
| Escalation attempts that succeed | _(guess — should be 0)_ | _(after)_ |
| Lines changed in the Week 4 tool port | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 8](../week-08-graph-workflows/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Was the Week 4 tool port design vindicated or not?** This is the clearest test in the whole
twelve weeks of whether an early boundary was drawn right. _(after)_
**New questions:** _(after — carry into [Week 10](../week-10-multi-agent/THEORY.md))_
