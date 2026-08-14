# Week 8 — LangGraph: Stateful Workflows, Checkpoints, Human Interrupts

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Workflows that **pause, persist, and resume** — including pausing for a human. Week 7's loop is
short and stateless; this week adds durability and an approval gate that a real write path can
depend on.

**The framework must earn its place.** [ADR-004](../../TECH-STACK-DECISIONS.md) deliberately avoided
LangGraph until a requirement demanded it. That requirement is resumability: a run that survives a
process restart and waits hours for a human. Nothing less justifies it.

> **Decision rule for every later week:** short and stateless → `aiplat/agent/loop.py` (W7).
> Must pause, persist, resume → `aiplat/graph/` (W8). Nothing else.

## Features (4)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F8.1](F8.1-graph-builder-and-node-contracts/CLAUDE.md) | Graph builder + node contracts | `aiplat/graph/builder.py` | W7-F7.1 |
| [F8.2](F8.2-postgres-checkpointer/CLAUDE.md) | Postgres checkpointer | `aiplat/graph/checkpointer.py` | F8.1, W7-F7.2 |
| [F8.3](F8.3-human-interrupt-and-approval-gate/CLAUDE.md) | Interrupts + approval gate | `aiplat/graph/interrupts.py`, `agent/approval.py` | F8.2 |
| [F8.4](F8.4-approval-queue-ui-and-resume/CLAUDE.md) | Approval queue UI + resume | `components/ApprovalPanel.jsx`, `weeks/w08/` | F8.3 |

## Architecture flow

```
aiplat.graph.builder ── StateGraph ──┐
                                      ▼
   ┌─────────────────────────────────────────────────────────────┐
   │  node: plan  →  node: act  →  node: review                  │
   │                                  │                          │
   │                         aiplat.graph.interrupts             │
   │                         "needs human approval?"             │
   │                             yes │        │ no               │
   │                                 ▼        └──► node: commit  │
   │                         PAUSE + checkpoint                  │
   └─────────────────────────────────┬───────────────────────────┘
                                     ▼
             aiplat.graph.checkpointer ──► PostgreSQL agent_checkpoints
                                     ▲
   POST /api/w08/approve/{run_id} ───┘   resumes at the exact paused node,
        ▲                                 hours later, after a full restart
        │
   PendingApprovals.jsx → components/ApprovalPanel.jsx   (a QUEUE, not a live tab)
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── graph/{builder.py, checkpointer.py, interrupts.py}   ← NEW
│   ├── agent/approval.py                                     ← NEW  shared by loop AND graph
│   └── db/models/checkpoint.py                               ← NEW  agent_checkpoints
├── apps/w08_graph_workflows/{graphs/, router.py, tests/}     ← NEW
└── infra/alembic/versions/0002_checkpoints.py                ← NEW
```

**Frontend**
```
└── src/
    ├── components/ApprovalPanel.jsx                          ← NEW  shared — reused in W12
    └── weeks/w08/{GraphView, CheckpointTimeline, PendingApprovals}.jsx  ← NEW
```

## Build order

1. **F8.1** builder + node contracts — a node must be a pure, checkpointable step.
2. **F8.2** checkpointer — durability before interrupts, because an interrupt without a durable
   checkpoint is just a crash.
3. **F8.3** interrupts + approval gate.
4. **F8.4** the queue UI + resume.

## Week Definition of Done

- [ ] A run pauses for approval, the **whole stack restarts**, approval arrives, the run completes
- [ ] Checkpoints are replayable and diffable — you can see what state a node received
- [ ] A paused run is discoverable from a **queue**, not only from the tab that started it
- [ ] The approval gate is the same object W12 will use for its only write path
- [ ] Each graph is justified against the W7 loop — resumability is the stated reason or it uses W7
- [ ] `ApprovalPanel` is in `components/`, not `weeks/w08/`

## What this week unlocks

Week 12's capstone is a graph with a mandatory approval interrupt before any external write. Every
guarantee it needs — durable pause, hours-later resume, an auditable approval record — is built and
tested here, on a workflow with lower stakes.
