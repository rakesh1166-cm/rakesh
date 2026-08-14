# W8-F8.3 — Human Interrupt + Approval Gate

> [Week 8](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/graph/interrupts.py` + `aiplat/agent/approval.py` (kernel)
**Depends on:** [F8.2](../F8.2-postgres-checkpointer/CLAUDE.md)
**Consumed by:** [F8.4](../F8.4-approval-queue-ui-and-resume/CLAUDE.md), **W12-F12.4** (the only write path)

## Goal

A workflow that **stops and waits for a person** before doing something consequential. The master
prompt is explicit: human approval before external writes or destructive actions. This is the
mechanism, built here on low-stakes workflows so W12 can depend on it for real.

## Contract (schema first)

```python
class ApprovalRequest(BaseModel):
    approval_id: str
    run_id: str
    node: str
    action_summary: str               # WHAT will happen, in plain language
    rationale: str                    # WHY the agent proposes it
    evidence: list[Citation] = []     # W6 — what it is basing this on
    confidence: Confidence
    payload: dict[str, Any]           # the exact action to execute — hashed into payload_hash
    payload_hash: str
    required_scope: AuthzScope        # W4-F4.3
    expires_at: datetime | None
    created_at: datetime

class ApprovalDecision(BaseModel):
    approval_id: str
    decision: Literal["approve", "reject"]
    decided_by: str
    note: str | None                  # rejection reason feeds back into the graph
    decided_at: datetime
    payload_hash: str                 # MUST match — approval binds to an exact payload

class ApprovalStore(Protocol):
    async def request(self, r: ApprovalRequest) -> None
    async def pending(self, *, scope: AuthzScope | None = None) -> list[ApprovalRequest]
    async def decide(self, d: ApprovalDecision) -> ApprovalRequest
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/graph/interrupts.py` | NEW | interrupt node type; pause + checkpoint |
| `platform/src/aiplat/agent/approval.py` | NEW | `ApprovalRequest/Decision/Store` — shared by loop **and** graph |
| `platform/src/aiplat/db/models/approval.py` | NEW | `agent_approvals` — the audit record |
| `apps/w08_graph_workflows/router.py` | EDIT | `GET /approvals`, `POST /approve/{id}` |

## Flow

```
node: propose  ──► ApprovalRequest{payload, payload_hash, evidence, confidence}
      ▼
interrupts.pause()
   ├─ checkpoint written (F8.2)          ← durable BEFORE pausing
   ├─ RunStatus = PAUSED (W7-F7.2)
   └─ approval row persisted             ← discoverable by anyone, not just this tab
      ▼
   ... hours. processes restart. the approver is a different person ...
      ▼
POST /approve/{approval_id}  {decision, decided_by, note, payload_hash}
   ├─ payload_hash mismatch ──► REJECT the decision (the payload changed since approval)
   ├─ expired               ──► REJECT; a re-request is required
   ├─ approve ──► resume_from(run_id) ──► node: commit executes the EXACT payload
   └─ reject  ──► resume with the rejection note in state; graph adapts or terminates
```

## Rules

- **Approval binds to a `payload_hash`.** Approving "restart service X" must not authorise
  "restart service Y" because state changed in between. The hash is checked at execution, not only
  at decision time — otherwise the binding is decorative.
- **The approval record is persisted, not held in memory.** The approver is often not the person who
  started the run, may be on another machine, and may arrive hours later.
- **A rejection carries a note back into the graph.** "Rejected: wrong environment" lets the agent
  correct; a bare reject teaches it nothing and it proposes the same thing again.
- **Evidence and confidence are mandatory** (W6). Approving an action with no visible basis is
  rubber-stamping, and a UI that enables it is worse than no gate.
- **Expiry is required for consequential actions.** An approval sitting unactioned for a week is
  stale; the world has moved.
- **`agent/approval.py` is shared by loop and graph.** W12 uses the graph path; a future W7-loop
  path must not fork a second approval concept.
- The `WRITE_EXTERNAL` scope (defined in W4-F4.3) is what triggers a mandatory interrupt. That
  linkage is the point of having defined the scope early.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Payload changes between request and approval | Hash mismatch → execution refused |
| Approval expires | Refused; the graph must re-propose |
| Same approval decided twice | Second decision rejected — idempotent by `approval_id` |
| Approver rejects with a note | Graph resumes with the note and adapts |
| Process restarts while paused | Approval survives; resume works |
| Approval requested with no evidence | Validation failure — the request cannot be constructed |
| Nobody ever decides | Run stays `PAUSED`; visible in the queue; expiry eventually applies |

## Tests

- `test_payload_hash_mismatch_refuses_execution` ← the core security test
- `test_expired_approval_cannot_be_used`
- `test_double_decision_is_idempotent`
- `test_rejection_note_reaches_the_graph_state`
- `test_approval_survives_full_process_restart`
- `test_write_external_scope_always_requires_approval`
- `test_approval_request_without_evidence_is_invalid`

## Acceptance criteria

- [ ] No `WRITE_EXTERNAL` action can execute without a recorded approval
- [ ] The executed payload is provably the approved payload, by hash
- [ ] Approvals are durable across restarts and discoverable by other people
- [ ] Rejections feed a reason back into the workflow
- [ ] `agent/approval.py` is the single approval concept for both loop and graph
