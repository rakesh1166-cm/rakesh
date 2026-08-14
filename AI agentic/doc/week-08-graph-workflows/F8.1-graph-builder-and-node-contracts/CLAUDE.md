# W8-F8.1 — Graph Builder + Node Contracts

> [Week 8](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/graph/builder.py` (kernel)
**Depends on:** [W7-F7.1](../../week-07-tool-agent/F7.1-bounded-agent-loop/CLAUDE.md)
**Consumed by:** [F8.2](../F8.2-postgres-checkpointer/CLAUDE.md), W12 investigation graph

## Goal

Wrap LangGraph behind our own thin builder so that **node contracts, budgets, and observability are
ours** — not the framework's. A node must be a typed, checkpointable, individually testable step;
if it isn't, resuming from a checkpoint is guesswork.

## Contract (schema first)

```python
class GraphState(BaseModel):
    """The ONLY thing that crosses node boundaries. Must be JSON-serialisable —
       it is what gets checkpointed."""
    run_id: str
    correlation_id: str
    goal: str
    scratch: dict[str, Any] = {}
    history: list[NodeRecord] = []
    spent_usd: float = 0.0
    awaiting_approval: ApprovalRequest | None = None

class NodeRecord(BaseModel):
    node: str
    started_at: datetime; duration_ms: float
    usage: Usage | None
    outcome: Literal["ok", "error", "interrupt"]
    detail: str

class NodeSpec(BaseModel):
    name: str
    max_cost_usd: float               # per-node budget, not just per-graph
    timeout_s: float
    interruptible: bool = False       # only these may pause (F8.3)

class NodePort(Protocol):
    spec: NodeSpec
    async def run(self, state: GraphState) -> GraphState: ...

class GraphSpec(BaseModel):
    name: str; version: str           # graphs are versioned like prompts
    nodes: list[NodeSpec]
    entry: str
    max_total_cost_usd: float
    max_wall_clock_s: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/graph/builder.py` | NEW | `GraphSpec` → compiled LangGraph, wrapped |
| `platform/src/aiplat/graph/ports.py` | NEW | `NodePort`, `GraphState`, `NodeSpec` |
| `apps/w08_graph_workflows/graphs/` | NEW | one module per workflow definition |

## Flow

```
GraphSpec ──► builder.compile()
      ▼
per node, the wrapper adds — BEFORE the framework sees anything:
   ├─ correlation id bound          (W2-F2.2)
   ├─ node budget check             (W7-F7.3 guards, reused)
   ├─ trace span                    (W7-F7.1)
   ├─ NodeRecord appended to state
   └─ GraphState validated in AND out    ← the checkpoint boundary
      ▼
LangGraph executes edges; our wrapper owns everything inside a node
```

## Rules

- **`GraphState` is the only thing crossing node boundaries**, and it must be JSON-serialisable.
  A node stashing a DB session, an open client, or a lambda in `scratch` makes the graph
  un-checkpointable — and that failure appears only when you try to resume.
- **Per-node budgets, not just per-graph.** One runaway node inside a 6-node graph should be caught
  at that node, with its name attached.
- **Nodes are individually testable**: `state in → state out`, no framework required. If testing a
  node needs a running graph, the node is doing too much.
- **Graphs are versioned** like prompts (W3-F3.1). A checkpoint written by `investigate/v1` must not
  be resumed by `v2` — the state shape may have changed. Store the version in the checkpoint.
- **The framework stays inside `aiplat/graph/`.** No `apps/` file imports LangGraph. That is what
  keeps [ADR-004](../../../TECH-STACK-DECISIONS.md)'s "revisit if requirements change" a real option
  rather than a comforting sentence.
- Reuse W7's guards; do not write a second budget system.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Node puts a non-serialisable object in state | Validation fails **at that node**, not at resume time |
| Node exceeds its cost budget | Terminated with the node name in the reason |
| Graph has an unreachable node | Detected at compile, not at runtime |
| Graph has a cycle with no exit | Compile-time rejection or a mandatory iteration cap |
| Node raises | `NodeRecord{outcome:"error"}`; graph terminates cleanly with state preserved |
| Checkpoint from v1 resumed under v2 | Refused with a version-mismatch error |

## Tests

- `test_state_must_be_json_serialisable_at_every_node_boundary`
- `test_node_can_be_tested_without_a_graph`
- `test_unreachable_node_fails_at_compile`
- `test_per_node_budget_names_the_offending_node`
- `test_no_apps_module_imports_langgraph` — import scan
- `test_graph_version_mismatch_refuses_resume`

## Acceptance criteria

- [ ] `GraphState` round-trips through JSON at every node boundary, asserted in tests
- [ ] Each node has unit tests that do not construct a graph
- [ ] LangGraph appears only under `platform/src/aiplat/graph/`
- [ ] Per-node budgets are enforced and attributed by name
- [ ] Graphs carry a version, stored with every checkpoint
