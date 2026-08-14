# Week 7 — Plain-Python Tool-Using Agent

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Real autonomy — **plan → act → observe** — with hard bounds and **no framework**
([ADR-004](../../TECH-STACK-DECISIONS.md)). Week 4 called tools in a fixed sequence; this week the
model decides which tools to call and when, and the loop's job is to make sure that can never run
away.

Two structural changes land together, and they are the same change: run state moves to **Redis**,
and agent work moves off the request path into **`services/agent-runner`**. This is the first seam
split ([architecture §11](../../CLAUDE-12-WEEK.md)) — and the point at which the frontend stops
being request-scoped.

## Features (6)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F7.1](F7.1-bounded-agent-loop/CLAUDE.md) | The bounded loop | `aiplat/agent/loop.py` | W4-F4.3 |
| [F7.6](F7.6-trajectory-recording-and-replay-debugging/CLAUDE.md) | Trajectory recording + replay debugging | `aiplat/agent/trajectory.py` | F7.2 |
| [F7.2](F7.2-run-state-in-redis/CLAUDE.md) | Run state + lifecycle in Redis | `aiplat/agent/state.py` | F7.1 |
| [F7.3](F7.3-loop-guards-and-budgets/CLAUDE.md) | Guards: duplicate-action, cost, wall-clock | `aiplat/agent/guards.py` | F7.1 |
| [F7.4](F7.4-parallel-tool-execution/CLAUDE.md) | Parallel tool execution | `aiplat/tools/parallel.py` | W4-F4.3 |
| [F7.5](F7.5-agent-runner-and-run-scoped-ui/CLAUDE.md) | Worker + `run_id` stream + reconnect UI | `services/agent-runner/`, `frontend/` | F7.2, F7.3 |

## Architecture flow

```
RunLauncher.jsx ──POST /api/w07/run──► services/api ──enqueue──► Redis queue
      │                 returns {run_id}                            │
      └─ navigate to /w07/run/:run_id                               ▼
                  │                            services/agent-runner/worker.py
   useRunStream ──┤ GET /api/w07/stream/{run_id}          ┌── aiplat.agent.loop ─────────┐
                  │                                       │ iteration ≤ max_iterations   │
   RunTimeline ◄──┤                                       │  plan   → aiplat.llm         │
   IterationCard  │                                       │  act    → tools.parallel     │
   "4/10 · $0.12" │                                       │  observe→ append to state    │
                  │                                       │  guards → dup / clock / cost │
                  └──── events ◄── Redis pub/sub ◄────────┴──────────────┬───────────────┘
                                                          aiplat.agent.state (REDIS)
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── agent/{ports.py, loop.py, state.py, guards.py}    ← NEW
│   ├── tools/parallel.py                                  ← NEW
│   └── obs/trace.py                                       ← NEW  span per iteration
├── services/agent-runner/{worker.py, Dockerfile}          ← NEW  ⚑ FIRST SEAM SPLIT
└── apps/w07_tool_agent/{router.py, agent_config.py, tests/}  ← NEW
```

**Frontend**
```
└── src/
    ├── hooks/useRunStream.js                              ← NEW  wraps useSSEStream + run_id
    ├── weeks/registry.js                                  ← EDIT route param /w07/run/:runId
    └── weeks/w07/{RunLauncher, RunTimeline, IterationCard, RunList}.jsx  ← NEW
```

## Build order

1. **F7.1** the loop, in-process, synchronous, bounded.
2. **F7.3** guards — before the loop ever runs unattended. An unguarded loop with a real API key is
   a cost incident.
3. **F7.2** state to Redis — the prerequisite for splitting the worker.
4. **F7.4** parallel execution — a latency win the loop shape must allow for from the start.
5. **F7.5** worker split + run-scoped UI.

F7.3 before F7.2 is deliberate: bound it before you let it run somewhere you are not watching.

## Week Definition of Done

- [ ] The loop **always** terminates — proven for cap, timeout, cost, and duplicate-action paths
- [ ] Run state lives in Redis; no run state in a Python dict anywhere
- [ ] Killing the worker mid-run and restarting resumes from stored state
- [ ] Refreshing the browser mid-run reattaches to the same run and loses nothing
- [ ] Multi-tool turns execute concurrently, with the correlation ID propagated into each
- [ ] Budgets are **visible** in the UI: iteration N/max, $spent/$cap, elapsed/limit
- [ ] `aiplat/agent/` did not need to move to be extracted into a worker

## What this week unlocks

Week 8 makes the loop durable and interruptible; Week 10 runs several of these as specialists;
Week 12 uses one for the `act` node of its investigation graph. All three depend on run state being
external, which is why F7.2 is the load-bearing feature of the week.
