# W8-F8.2 — Postgres Checkpointer

> [Week 8](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/graph/checkpointer.py` + `db/models/checkpoint.py`
**Depends on:** [F8.1](../F8.1-graph-builder-and-node-contracts/CLAUDE.md), [W7-F7.2](../../week-07-tool-agent/F7.2-run-state-in-redis/CLAUDE.md)
**Consumed by:** [F8.3](../F8.3-human-interrupt-and-approval-gate/CLAUDE.md), W12

## Goal

Durability that outlives the process. Week 7 put live run state in **Redis** (fast, TTL'd,
in-flight); checkpoints go to **Postgres** (durable, auditable, permanent) — because a run paused
for human approval may wait hours or days, far longer than any sensible Redis TTL.

## Contract (schema first)

```python
# db/models/checkpoint.py → table agent_checkpoints
#   id            uuid pk
#   run_id        text        (indexed)
#   graph_name    text
#   graph_version text        ← resume refuses on mismatch (F8.1)
#   seq           int         UNIQUE(run_id, seq)
#   node          text        the node ABOUT to run
#   state_json    jsonb       the validated GraphState
#   state_hash    text        sha256 — tamper + dedup detection
#   created_at    timestamptz

class Checkpoint(BaseModel):
    run_id: str; seq: int; node: str
    graph_name: str; graph_version: str
    state: GraphState
    created_at: datetime

class CheckpointerPort(Protocol):
    async def save(self, cp: Checkpoint) -> None
    async def latest(self, run_id: str) -> Checkpoint | None
    async def history(self, run_id: str) -> list[Checkpoint]
    async def resume_from(self, run_id: str, seq: int | None = None) -> GraphState
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/db/models/checkpoint.py` | NEW | `agent_checkpoints` |
| `platform/src/aiplat/graph/checkpointer.py` | NEW | `CheckpointerPort` + Postgres implementation |
| `infra/alembic/versions/0002_checkpoints.py` | NEW | the migration |

## Flow

```
before each node executes
      ▼
Checkpoint{seq, node, state, graph_version} ──► agent_checkpoints (Postgres)
      ▼
node runs
      ▼
interrupt (F8.3)? ──► status=PAUSED (Redis, W7-F7.2) + checkpoint is already durable
                          │
                    ... hours pass, processes restart ...
                          ▼
POST /approve ──► checkpointer.resume_from(run_id) ──► GraphState ──► continue at `node`
```

## Rules

- **Checkpoint *before* the node runs, not after.** Saving after means a node that crashes mid-way
  has no checkpoint recording the state it was given — and you resume into the same crash blind.
- **`UNIQUE(run_id, seq)` makes replay safe.** Two workers resuming the same run cannot both write
  `seq=5`; the constraint enforces it rather than application logic.
- **Redis for live, Postgres for durable.** They are not redundant: Redis has a TTL and serves the
  streaming reattach; Postgres is the permanent, auditable record. Do not collapse them.
- **`graph_version` is checked on resume.** A `v1` checkpoint resumed under a `v2` graph may hit a
  state shape that no longer exists — a mismatch is a refusal, not a best effort.
- **`history()` must be complete**, not just the latest. `CheckpointTimeline` (F8.4) shows every
  resume point, and W11's audit needs the full chain of what state produced what decision.
- **`state_hash` detects tampering.** By W12 a checkpoint holds an approved fix; if it can be edited
  between approval and execution, the approval means nothing.
- Keep sessions short — write the checkpoint, close, then run the node. Never hold a session across
  a node that calls an LLM ([architecture §10](../../../CLAUDE-12-WEEK.md)).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Process dies mid-node | Resume from the pre-node checkpoint; the node re-runs |
| Node is not idempotent and re-runs | Node declares it; the graph gates it (approval/idempotency key) |
| Two workers resume one run | `UNIQUE(run_id, seq)` rejects the second write |
| Checkpoint state edited in the DB | `state_hash` mismatch → refuse resume |
| Graph version bumped while paused | Resume refused with a clear version-mismatch message |
| Postgres down at checkpoint time | Node does **not** execute — no unrecorded progress |
| Very large state | Size limit enforced; oversized state is a design error, surfaced early |

## Tests

- `test_checkpoint_is_written_before_the_node_executes`
- `test_resume_after_full_process_restart_produces_identical_completion`
- `test_duplicate_seq_is_rejected_by_the_database`
- `test_tampered_state_hash_refuses_resume`
- `test_graph_version_mismatch_refuses_resume`
- `test_postgres_failure_prevents_node_execution`

## Acceptance criteria

- [ ] Killing every process mid-run and restarting resumes exactly where it paused
- [ ] `history()` returns the complete checkpoint chain for a run
- [ ] Concurrent resume attempts are prevented by the database, not by hope
- [ ] Tampered or version-mismatched checkpoints are refused
- [ ] No node executes without a durable pre-node checkpoint
