# W12-F12.1 — Incident Intake + Investigation Graph

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w12_ai_ops_assistant/workflows/investigate.py`
**Composes:** [W8](../../week-08-graph-workflows/CLAUDE.md) graph · [W10](../../week-10-multi-agent/CLAUDE.md) router · [W11](../../week-11-evals-security-observability/CLAUDE.md) guards
**Consumed by:** every other W12 feature

## Goal

The investigation workflow: **gather → diagnose → act → propose → [approval] → commit**. Built as a
W8 graph rather than a W7 loop for one reason — it must pause for a human and resume hours later
after a process restart. That is the stated decision rule, applied.

## Contract (schema first)

```python
class Incident(BaseModel):
    incident_id: str
    title: str = Field(max_length=200)
    description: str = Field(max_length=10_000)
    severity: Literal["sev1","sev2","sev3","sev4"]
    service: str
    error_samples: list[str] = Field(max_length=20)
    started_at: datetime
    model_config = ConfigDict(extra="forbid")

class InvestigationState(GraphState):        # extends W8-F8.1 — JSON-serialisable
    incident: Incident
    evidence: list[EvidenceItem] = []        # F12.2
    diagnosis: Diagnosis | None = None
    proposed_fix: Fix | None = None          # F12.3
    approval: ApprovalRequest | None = None  # W8-F8.3
    commit_result: CommitResult | None = None

INVESTIGATE_GRAPH = GraphSpec(
    name="investigate", version="v1",
    nodes=[gather, diagnose, act, propose, approve_gate, commit],
    entry="gather",
    max_total_cost_usd=2.00,
    max_wall_clock_s=600.0,
)
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w12_ai_ops_assistant/workflows/investigate.py` | NEW | the graph definition |
| `apps/w12_ai_ops_assistant/schemas.py` | NEW | `Incident`, `InvestigationState`, `Diagnosis` |
| `apps/w12_ai_ops_assistant/router.py` | NEW | `/investigate` · `/approve/{id}` · `/stream/{id}` |
| `frontend/src/weeks/w12/IncidentView.jsx` | NEW | live progress via `useRunStream` (W7) |

## Flow

```
POST /api/w12/investigate {Incident}
   ├─ sanitize(description, USER_INPUT)     W11-F11.4 — incident text is untrusted
   ├─ limits check                          W11-F11.5
   └─ enqueue → services/agent-runner       W7-F7.5
        ▼
  node: gather    → F12.2   read-only retrieval + read-only tools
  node: diagnose  → router (W10) picks a specialist → hypothesis + confidence
  node: act       → agent.loop (W7) with READ-ONLY tools only  ⚠ scope-enforced, not conventional
  node: propose   → Fix (F12.3)
  node: approve_gate → confidence < threshold? → terminate WITHOUT proposing
                     → else pause + checkpoint (W8-F8.2) + ApprovalRequest (W8-F8.3)
  node: commit    → F12.4   the ONLY node holding a WRITE_EXTERNAL scope
        ▼
  SSE (W4 events) → IncidentView
```

## Rules

- **`act` holds read-only tools only**, enforced by `AuthzScope` (W4-F4.3), not by naming
  convention. The agent investigating an incident must be structurally incapable of changing it.
- **Low confidence terminates without proposing.** An ops assistant that proposes a fix it cannot
  justify is worse than one that says "I could not determine the cause" — it consumes reviewer
  attention and erodes trust in every future proposal.
- **A graph, not a loop**, and the justification is written down: durable pause and hours-later
  resume. Anything that does not need that stays a W7 loop.
- **Incident text is untrusted** (W11-F11.4). Error samples in particular are attacker-influenced —
  a log line is a place an attacker can write text that reaches your model.
- **`sev1` may route differently**, but never skips approval. Urgency is the most tempting reason to
  weaken the gate and therefore the one to hard-code against.
- **Per-node budgets** (W8-F8.1). A runaway `gather` must not consume the whole incident budget.
- The graph is **versioned**; a `v1` checkpoint is never resumed under `v2` (W8-F8.2).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Injection in an error sample | Sanitized; tool scopes unchanged |
| `act` attempts a write | Refused by the authorization matrix at the executor |
| Diagnosis confidence below threshold | Terminate with "undetermined" — no proposal |
| Wall-clock exceeded mid-investigation | Partial evidence returned; no proposal from partial data |
| Process restart while paused | Resume from checkpoint; approval still pending |
| Two investigations for one incident | Idempotency key on `incident_id` |
| `sev1` incident | Same approval requirement; only routing and priority differ |

## Tests

- `test_act_node_cannot_execute_a_write_scoped_tool` ← the structural safety test
- `test_low_confidence_terminates_without_a_proposal`
- `test_error_sample_injection_does_not_change_tool_scopes`
- `test_sev1_still_requires_approval`
- `test_restart_while_paused_resumes_correctly`
- `test_duplicate_incident_id_is_idempotent`

## Acceptance criteria

- [ ] The `act` node is provably incapable of writing
- [ ] Low-confidence investigations end honestly rather than proposing something
- [ ] Severity never weakens the approval requirement
- [ ] The graph survives a full restart mid-investigation
- [ ] Per-node budgets prevent one node consuming the incident's whole budget
