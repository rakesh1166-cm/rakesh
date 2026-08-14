# W12-F12.4 — Approval Policy + The Only Write Path

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w12_ai_ops_assistant/approvals/policy.py` + the `commit` node
**Composes:** [W8-F8.3](../../week-08-graph-workflows/F8.3-human-interrupt-and-approval-gate/CLAUDE.md) · [W4-F4.3](../../week-04-holidaylandmarks/F4.3-tool-port-registry-executor/CLAUDE.md) scopes · [W11-F11.6](../../week-11-evals-security-observability/F11.6-redaction-audit-log-and-traceview/CLAUDE.md) audit
**Consumed by:** [F12.5](../F12.5-audit-trail-and-replay-eval/CLAUDE.md)

## Goal

**The safety-critical feature of the entire twelve weeks.** Exactly one code path can change the
outside world, it runs only after a recorded human approval, and it executes exactly the payload
that was approved — no more, no less, no later substitution.

## Contract (schema first)

```python
class ApproverRole(str, Enum):
    ONCALL = "oncall"; SERVICE_OWNER = "service_owner"; SRE_LEAD = "sre_lead"

class ApprovalRule(BaseModel):
    blast_radius: Literal["single_instance","service","cluster","global"]
    min_confidence: float
    required_roles: list[ApproverRole]
    min_approvers: int = 1            # 2 for cluster/global — two-person rule
    max_age_s: float = 3600.0         # an hour-old approval is stale in an incident

APPROVAL_POLICY = [
    ApprovalRule("single_instance", 0.70, [ONCALL], 1, 3600),
    ApprovalRule("service",         0.80, [ONCALL, SERVICE_OWNER], 1, 1800),
    ApprovalRule("cluster",         0.90, [SRE_LEAD], 2, 900),
    ApprovalRule("global",          0.95, [SRE_LEAD], 2, 600),
]

class CommitResult(BaseModel):
    approval_id: str
    executed: list[tuple[str, Literal["success","failure","skipped"]]]
    payload_hash: str                 # the hash ACTUALLY executed
    audit_entry_id: str               # REQUIRED — no audit id, no commit
    rolled_back: bool = False
    at: datetime
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w12_ai_ops_assistant/approvals/policy.py` | NEW | `APPROVAL_POLICY`, rule resolution |
| `apps/w12_ai_ops_assistant/workflows/investigate.py` | EDIT | the `commit` node |
| `apps/w12_ai_ops_assistant/tools/write_tools.py` | NEW | the only `WRITE_EXTERNAL` tools |
| `frontend/src/weeks/w12/ApprovalGate.jsx` | NEW | thin wrapper over `ApprovalPanel` (W8) |

## Flow

```
Fix (F12.3)
      ▼
resolve ApprovalRule by blast_radius
   confidence < rule.min_confidence ──► never requested. The gate is not a way to launder low confidence.
      ▼
ApprovalRequest{payload = Fix.changes, payload_hash, evidence, confidence, expires_at}   W8-F8.3
      ▼
PAUSE + checkpoint (W8-F8.2)     ── durable; survives everything
      ▼
approvers decide via ApprovalPanel (W8-F8.4)
   ├─ fewer than min_approvers          → stays pending
   ├─ approver lacks a required role    → rejected, audited as denied
   └─ older than max_age_s              → expired; re-propose from scratch
      ▼
node: commit — THE ONLY WRITE PATH
   1. re-verify payload_hash            mismatch ──► ABORT
   2. re-verify approval age + roles    stale    ──► ABORT
   3. write AuditEntry BEFORE acting    sink down ──► ABORT     (W11-F11.6)
   4. execute changes in order, idempotently (W4-F4.3)
   5. any failure → rollback the applied changes → audit the rollback
      ▼
CommitResult → AuditTrail.jsx
```

## Rules

- **One write path.** `write_tools.py` holds every `WRITE_EXTERNAL` tool, and the `commit` node is
  the only caller. A test enumerates the scope across the whole repo and fails if a second path
  appears — because "we'll remember" does not survive a codebase.
- **Audit before action.** The `AuditEntry` is written *before* the change is attempted. If the
  audit sink is down, the write does not happen (W11-F11.6). An unaudited production change is
  worse than an unfixed incident.
- **Re-verify at execution, not only at decision.** Hash, age, and roles are all checked again in
  the `commit` node. Between approval and execution the world may have moved.
- **Two-person rule for cluster and global.** The blast radius that can take down everything is the
  one where a single tired approver is not enough.
- **Approvals expire fast during incidents** — 10 minutes for global. An approval is a judgement
  about a *situation*, and situations change.
- **Confidence below the rule threshold is never requested.** The gate exists to check good
  proposals, not to outsource the decision on bad ones.
- **Rollback on partial failure.** Three changes where the second fails must not leave the system
  half-changed — apply-then-rollback, and audit the rollback too.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Payload modified after approval | Hash mismatch → abort, audit as denied |
| Approval expired before execution | Abort; re-propose from scratch |
| Approver lacks the required role | Rejected, audited |
| Only 1 of 2 approvers for a global change | Stays pending; never executes |
| Audit sink unavailable | **No write happens.** Investigation terminates with the reason. |
| Change 2 of 3 fails | Change 1 rolled back; failure and rollback both audited |
| Injection tries to reach the write path | Approval is code, not prompt-driven — unaffected |
| Someone adds a second `WRITE_EXTERNAL` caller | The enumeration test fails the build |

## Tests

- `test_only_the_commit_node_calls_write_external_tools` ← the structural guarantee
- `test_payload_hash_mismatch_aborts_the_write`
- `test_expired_approval_aborts_the_write`
- `test_cluster_change_requires_two_approvers`
- `test_audit_sink_failure_prevents_the_write`
- `test_partial_failure_rolls_back_and_audits_the_rollback`
- `test_below_threshold_confidence_never_requests_approval`
- `test_injection_corpus_cannot_reach_the_write_path`

## Acceptance criteria

- [ ] Exactly one code path performs external writes, enforced by a repo-wide test
- [ ] No write occurs without a recorded, in-date, correctly-roled approval
- [ ] The executed payload provably equals the approved payload
- [ ] An audit entry exists before every change is attempted
- [ ] Cluster and global changes require two approvers
- [ ] Partial failures roll back and are audited
