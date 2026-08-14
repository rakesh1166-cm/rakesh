# Week 10 — Multi-Agent, Aggressively Simplified

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Build supervisor-worker and router patterns — **and delete the ones that aren't justified.**

The blog is explicit about this week: *aggressive simplification*, *replace unnecessary agents with
deterministic code*. So the deliverable is not "a multi-agent system"; it is **a measured answer to
whether multi-agent helped**, and the deletion of every agent that didn't.

This is the smallest kernel delta of any week, on purpose. **Subtraction is the work.**

## Features (4)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F10.1](F10.1-intent-router/CLAUDE.md) | Intent router → one specialist | `aiplat/orchestration/router.py` | W7-F7.1 |
| [F10.2](F10.2-supervisor-fanout-and-merge/CLAUDE.md) | Supervisor fan-out + merge | `aiplat/orchestration/supervisor.py` | F10.1, W7-F7.4 |
| [F10.3](F10.3-deterministic-baseline-harness/CLAUDE.md) | Deterministic baseline + comparison | `apps/w10_multi_agent/baseline.py` | F10.2 |
| [F10.4](F10.4-agent-justification-and-deletion-pass/CLAUDE.md) | Justification log + deletion pass | `aiplat/orchestration/README.md` | F10.3 |

## Architecture flow

```
                    /api/w10/handle
                          ▼
            aiplat.orchestration.router
            classify intent → dispatch to ONE specialist
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   research agent    planning agent    writing agent
   (agent.loop W7)   (graph W8)        (agent.loop W7)
        └─────────────────┼─────────────────┘
                          ▼
            aiplat.orchestration.supervisor
            merge · resolve conflicts · ONE validated output
                          ▼
              schemas.events → data(Result) → AgentLanes.jsx

⚠ For every agent above, orchestration/README.md must answer:
  "what does this agent do that a deterministic function cannot?"
  No answer → delete the agent, write the function.
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/orchestration/
│   ├── router.py · supervisor.py                    ← NEW
│   └── README.md                                     ← NEW  ⚠ the justification log
└── apps/w10_multi_agent/
    ├── agents/            each ≤ ~100 lines          ← NEW  config, not cleverness
    ├── baseline.py        the same task, plain code  ← NEW
    └── router.py · tests/ · README.md                ← NEW  where it WON and where it LOST
```

**Frontend**
```
└── src/weeks/
    ├── registry.js                                   ← EDIT + w10
    └── w10/{RouterDecision, AgentLanes, SupervisorMerge, BaselineCompare}.jsx  ← NEW
```

## Build order

1. **F10.3 first, in outline.** Write the deterministic baseline *before* the agents, so the
   comparison is honest rather than a retrofit built to flatter the agents.
2. **F10.1** router — the cheapest useful pattern.
3. **F10.2** supervisor — only for tasks that genuinely decompose.
4. **F10.4** the justification pass and the deletions.

## Week Definition of Done

- [ ] `orchestration/README.md` has one entry per surviving agent, each answering the question
- [ ] **At least one candidate agent was deleted** in favour of deterministic code, with the
      comparison recorded
- [ ] `BaselineCompare` shows quality, latency and cost for agents vs. plain code
- [ ] Every specialist reuses W7's loop or W8's graph — no third execution model
- [ ] Each agent module is ≤ ~100 lines: configuration, not a new framework
- [ ] The router's decision is visible and explainable in the UI

## What this week unlocks

Week 12 uses the router to pick an investigation specialist. Because this week establishes that
every agent must justify its existence against a plain function, the capstone stays a small number
of justified agents instead of an org chart of them.
