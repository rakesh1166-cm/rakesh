# W7-F7.5 — `agent-runner` Worker + Run-Scoped UI

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `services/agent-runner/` + `frontend/src/hooks/useRunStream.js` + `weeks/w07/`
**Depends on:** [F7.2](../F7.2-run-state-in-redis/CLAUDE.md), [F7.3](../F7.3-loop-guards-and-budgets/CLAUDE.md)
**Consumed by:** W8 (resume after approval), W10 (lanes), W12 (incident runs)

## Goal

**The first seam split** ([architecture §11](../../../CLAUDE-12-WEEK.md)). Agent runs take
seconds-to-minutes; holding an HTTP connection open for them is what breaks the API under load.

The frontend consequence is equally structural: **the UI stops being request-scoped.** A run has an
ID, outlives the tab, and is reattachable.

## Contract (schema first)

```python
# POST /api/w07/run           → 202 {run_id}          (returns immediately)
# GET  /api/w07/stream/{id}?from_seq=N → SSE          (replay + live, W7-F7.2)
# GET  /api/w07/runs                   → RunSummary[] (runs outlive the tab)
# POST /api/w07/runs/{id}/cancel       → 202

class RunSummary(BaseModel):
    run_id: str; status: RunStatus; goal: str
    iterations_done: int; max_iterations: int
    spent_usd: float; max_cost_usd: float
    elapsed_s: float; wall_clock_s: float
    started_at: datetime
```

```js
// hooks/useRunStream.js — wraps useSSEStream (W4-F4.7), adds run identity
const { status, iterations, data, error, budget, reattach, cancel } = useRunStream(runId)
// INVARIANT: refresh / tab close / network drop must NOT lose the run.
//            Reattaches with ?from_seq=<last seen>.
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `services/agent-runner/worker.py` | NEW | queue consumer → `agent.loop` → publish events |
| `services/agent-runner/Dockerfile` | NEW | separate image from the API |
| `apps/w07_tool_agent/router.py` | EDIT | `POST /run`, `GET /stream/{id}`, `/runs`, `/cancel` |
| `frontend/src/hooks/useRunStream.js` | NEW | run-scoped stream + reattach |
| `frontend/src/weeks/w07/RunLauncher.jsx` | NEW | submit → `run_id` → navigate |
| `frontend/src/weeks/w07/RunTimeline.jsx` | NEW | one row per iteration |
| `frontend/src/weeks/w07/IterationCard.jsx` | NEW | plan → tools → observe, with budgets |
| `frontend/src/weeks/w07/RunList.jsx` | NEW | recent runs — they outlive the tab now |
| `frontend/src/weeks/registry.js` | EDIT | route param `/w07/run/:runId` |

## Flow

```
RunLauncher ──POST /run──► services/api ── create RunState(QUEUED) ── enqueue ──► 202 {run_id}
      │                                                                    │
      └─ navigate /w07/run/:run_id                          services/agent-runner/worker.py
              │                                                  claim (version, F7.2)
   useRunStream(runId)                                           agent.loop (F7.1) + guards (F7.3)
   GET /stream/{id}?from_seq=lastSeen                            publish per iteration
              │                                                            │
              └──────────── replay stored events, then live ◄── Redis ─────┘
              ▼
   RunTimeline + IterationCard: "iteration 4/10 · $0.12/$1.00 · 18s/120s"
```

## Rules

- **`aiplat/agent/` does not move.** The split is a deployment change, because the dependency rule
  held ([architecture §2](../../../CLAUDE-12-WEEK.md)). If extracting the worker requires editing
  kernel code, the boundary was wrong.
- **`POST /run` returns immediately with a `run_id`.** It never streams. Streaming from a POST is
  what couples run lifetime to connection lifetime.
- **Reattach must be lossless** — `?from_seq=` replay (F7.2). A refresh mid-run losing progress is
  the single most visible failure of a run-scoped UI.
- **Budgets must be visible.** Without "4/10 · $0.12/$1.00 · 18s/120s" on screen, a working run and
  a hung run look identical, and users cancel healthy runs.
- **`RunList` exists because runs outlive the tab.** A run with no discoverable list is a run only
  its originating tab can ever see — the same mistake W8's approval queue exists to avoid.
- **Cancel must actually stop spending.** A cancel that only closes the stream leaves the worker
  burning tokens for an audience of nobody.
- The worker is a **separate image**. Shared code comes from `aiplat`, not from importing
  `services/api`.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Browser refreshed mid-run | Reattaches by `run_id`; every event replayed; nothing lost |
| Worker crashes mid-run | Another worker claims it and resumes from stored iterations |
| Two workers claim one run | `version` mismatch (F7.2); one aborts |
| Client cancels | Worker observes cancellation within one iteration and stops spending |
| Queue backs up | `POST /run` still returns `run_id`; status stays `QUEUED`; UI shows the wait |
| API restarts while a run is live | Run unaffected — it lives in the worker and Redis |
| Stream requested for an unknown run | 404 with a typed envelope |

## Tests

- `test_refresh_midrun_reattaches_with_no_lost_events`
- `test_post_run_returns_within_100ms_regardless_of_run_length`
- `test_cancel_stops_token_spend_within_one_iteration`
- `test_api_restart_does_not_affect_a_running_agent`
- `test_worker_imports_nothing_from_services_api`
- `test_budget_counters_render_in_iteration_card` (frontend)

## Acceptance criteria

- [ ] `POST /run` returns in ~constant time no matter how long the run takes
- [ ] A browser refresh mid-run loses nothing
- [ ] Restarting the API does not disturb an in-flight run
- [ ] Cancel provably stops spend, not just the stream
- [ ] `services/agent-runner` imports only from `aiplat`
- [ ] Iteration, cost and elapsed budgets are all visible during a run
