# W7-F7.2 — Run State + Lifecycle in Redis

> [Week 7](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/agent/state.py` (kernel)
**Depends on:** [F7.1](../F7.1-bounded-agent-loop/CLAUDE.md)
**Consumed by:** [F7.5](../F7.5-agent-runner-and-run-scoped-ui/CLAUDE.md), W8 checkpointer, W12

## Goal

**The load-bearing feature of Week 7.** Run state in a Python dict means: no horizontal scale, no
restart without dropping every in-flight stream, no worker split, and a reconnecting `EventSource`
landing on a worker that has never heard of the run.

Everything Weeks 8, 10 and 12 do rests on this one decision
([architecture §10](../../../CLAUDE-12-WEEK.md)).

## Contract (schema first)

```python
class RunStatus(str, Enum):
    QUEUED = "queued"; RUNNING = "running"; PAUSED = "paused"      # PAUSED used from W8
    COMPLETED = "completed"; FAILED = "failed"; CANCELLED = "cancelled"

class RunState(BaseModel):
    run_id: str
    correlation_id: str
    status: RunStatus
    config: AgentConfig
    goal: str
    iterations: list[Iteration] = []
    spent_usd: float = 0.0
    started_at: datetime | None
    updated_at: datetime
    termination: TerminationReason | None
    output: dict[str, Any] | None
    version: int                      # optimistic concurrency — two workers must not both advance

class RunStore(Protocol):
    async def create(self, s: RunState) -> None
    async def get(self, run_id: str) -> RunState
    async def append_iteration(self, run_id: str, it: Iteration, expected_version: int) -> RunState
    async def set_status(self, run_id: str, st: RunStatus) -> None
    async def publish(self, run_id: str, ev: StreamEvent) -> None     # Redis pub/sub
    async def subscribe(self, run_id: str, from_seq: int) -> AsyncIterator[StreamEvent]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/agent/state.py` | NEW | `RunState`, `RunStore`, Redis implementation |
| `platform/src/aiplat/agent/loop.py` | EDIT | persist after **every** iteration |
| `apps/w07_tool_agent/router.py` | EDIT | `POST /run` → `run_id`; `GET /stream/{run_id}` |

## Flow

```
POST /run ──► RunState{QUEUED} written to Redis ──► enqueue ──► return {run_id}
                                                                    ▼
worker picks up ──► status=RUNNING
   each iteration ──► append_iteration(expected_version) ──► publish(events)
                            │
                            └─ version mismatch ⇒ another worker owns this run ⇒ abort
                                                                    ▼
GET /stream/{run_id}?from_seq=N
   ├─ replay stored events from N   ← THIS is what makes reconnect lossless
   └─ then subscribe to live pub/sub
```

## Rules

- **Persist after every iteration, not at the end.** A crash at iteration 9 of 10 must not discard
  nine iterations of paid-for work.
- **Events are stored *and* published.** Pub/sub alone is fire-and-forget: a client that reconnects
  two seconds later has missed everything. Storing them with sequence numbers makes
  `from_seq` replay possible, which is the whole basis of `useRunStream`.
- **Optimistic concurrency via `version`.** Two workers picking up the same run must not both
  advance it. The mismatch is detected and one aborts.
- **Redis is the source of truth while a run is live.** Postgres holds the *finished* record; Redis
  holds the in-flight state. W8 adds durable checkpoints on top.
- TTL on live run keys (e.g. 24h) so abandoned runs do not accumulate forever; completed runs are
  written to Postgres before expiry.
- `PAUSED` is defined now though nothing produces it — W8's interrupts need the status to exist
  before checkpointing can use it.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Worker killed at iteration 9 | State has 9 iterations; a new worker resumes from 10 |
| Client reconnects after 30s | `from_seq` replay delivers every missed event, in order |
| Two workers claim one run | `version` mismatch; one aborts; no double-spend |
| Redis down at start | Run rejected with `UPSTREAM_UNAVAILABLE` — never started un-persisted |
| Redis down mid-run | Loop halts and marks `FAILED`; it does not continue spending blind |
| Run abandoned by its client | Continues to completion (already paid for), then TTLs out |
| Duplicate `run_id` | `create` is atomic; the second attempt fails |

## Tests

- `test_reconnect_from_seq_replays_missed_events_in_order` ← the reconnect guarantee
- `test_worker_crash_preserves_completed_iterations`
- `test_two_workers_cannot_both_advance_a_run`
- `test_redis_unavailable_at_start_rejects_the_run`
- `test_no_run_state_lives_in_process_memory` — AST/grep scan of `aiplat/agent/`
- `test_completed_run_is_persisted_to_postgres_before_ttl`

## Acceptance criteria

- [ ] `grep -n "self\._runs\|RUNS = {}" platform/src/aiplat/agent/` returns nothing
- [ ] Killing and restarting the worker mid-run resumes correctly
- [ ] Reconnecting after any delay loses **zero** events
- [ ] Two workers on one run is detected, not silently tolerated
- [ ] `PAUSED` exists in the enum, ready for W8
