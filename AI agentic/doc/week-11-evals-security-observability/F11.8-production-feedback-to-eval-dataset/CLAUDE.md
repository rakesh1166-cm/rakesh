# W11-F11.8 — Production Feedback → Eval Dataset

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/evals/feedback.py` (kernel)
**Depends on:** [F11.1](../F11.1-eval-harness-and-datasets/CLAUDE.md), [W7-F7.6](../../week-07-tool-agent/F7.6-trajectory-recording-and-replay-debugging/CLAUDE.md)
**Consumed by:** [F11.3](../F11.3-ci-regression-gate/CLAUDE.md), W12-F12.5

## Goal

An eval dataset that only grows by hand goes stale in months. It encodes the failures you
*imagined* in Week 11 and never learns the ones production actually produces.

This closes the loop: **a real failure becomes a permanent test case.** It is the single highest-
leverage habit in production LLM work, and it is the one that most separates a working system from
one that keeps working.

## Contract (schema first)

```python
class FeedbackSignal(str, Enum):
    EXPLICIT_NEGATIVE = "explicit_negative"   # thumbs down
    EXPLICIT_POSITIVE = "explicit_positive"
    IMPLICIT_RETRY    = "implicit_retry"      # user immediately rephrased — strong signal
    IMPLICIT_ABANDON  = "implicit_abandon"    # closed mid-stream
    REFUSAL           = "refusal"             # W6-F6.4 refused. Was it right to?
    GUARD_BLOCK       = "guard_block"         # W11-F11.7 blocked. Was it right to?
    ERROR             = "error"
    APPROVAL_REJECTED = "approval_rejected"   # W8-F8.3 — a HUMAN said this fix was wrong ⭐

class FeedbackEvent(BaseModel):
    correlation_id: str
    signal: FeedbackSignal
    component: str
    note: str | None                  # rejection notes are the richest source we have
    trajectory_ref: str | None        # W7-F7.6 — replayable
    at: datetime

class CandidateCase(BaseModel):
    """A production failure, on its way to becoming a permanent test."""
    id: str
    source_correlation_id: str
    signal: FeedbackSignal
    inputs: dict[str, Any]            # REDACTED (F11.6) before it ever lands here
    observed_output: Any
    proposed_assertions: list[Assertion]
    triage: Literal["pending","accepted","rejected","duplicate"]
    reviewed_by: str | None

class PromotionPolicy(BaseModel):
    auto_promote: list[FeedbackSignal] = [FeedbackSignal.APPROVAL_REJECTED]
    require_human_review: bool = True
    dedupe_window_days: int = 30
    max_cases_per_week: int = 20      # a dataset that doubles monthly stops being runnable
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/evals/feedback.py` | NEW | capture, triage, promote |
| `platform/src/aiplat/db/models/feedback.py` | NEW | `agent_feedback` |
| `services/api/middleware/feedback.py` | NEW | implicit-signal capture |
| `apps/w11_eval_guardrails/router.py` | EDIT | `/feedback`, `/feedback/triage` |
| `frontend/src/components/FeedbackControl.jsx` | NEW | thumbs + reason (shared, all weeks) |
| `frontend/src/weeks/w11/TriageQueue.jsx` | NEW | pending → accepted → dataset |

## Flow

```
production run
   ├─ explicit: user clicks thumbs-down + reason
   ├─ implicit: rephrase within 60s · abandon mid-stream · error
   └─ system:   refusal (W6) · guard block (W11-F11.7) · APPROVAL REJECTED (W8) ⭐
        ▼
FeedbackEvent{correlation_id, trajectory_ref}
        ▼
redact inputs (F11.6)  ← BEFORE anything is stored as a candidate case
        ▼
CandidateCase{proposed_assertions derived from the observed failure}
        ▼
dedupe against the last 30 days + the existing dataset
        ▼
TriageQueue → human review → accepted
        ▼
evals/datasets/<suite>/  ← the case is now permanent; the gate (F11.3) enforces it forever
```

## Rules

- **Rejected approvals are the richest signal in the system.** When a human rejects a W12 fix with
  a note, a qualified person has explicitly said *"the model was wrong, and here is why"*. Nothing
  else in the pipeline produces that quality of label. Auto-promote them.
- **Redact before storing candidates**, not before shipping the dataset. A candidate queue full of
  raw production PII is a breach waiting for someone to `git add` it.
- **Human review before promotion** (except auto-promoted signals). A dataset polluted by
  mis-triaged cases makes the gate untrustworthy, and an untrusted gate gets bypassed.
- **Cap growth at ~20 cases/week.** A dataset that doubles monthly becomes too slow and expensive to
  run, so it stops being run — which is a worse outcome than a smaller dataset.
- **Refusals and guard blocks are captured as feedback too.** Both are decisions that can be wrong
  in *either* direction — an over-eager refusal is as much a defect as a hallucination, and only
  this loop will ever tell you.
- **Every candidate carries a `trajectory_ref`** (W7-F7.6) so it is replayable at zero cost.
- **Implicit signals are noisy** — an immediate rephrase is weak evidence alone. Weight them below
  explicit ones and never auto-promote.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Same failure reported 50× | Deduped into one case with an occurrence count |
| Feedback contains PII | Redacted before storage; content never reaches the dataset raw |
| Dataset grows unbounded | Weekly cap; low-value cases retired to keep it runnable |
| Mis-triaged case pollutes the gate | Cases are revocable; the promotion is auditable |
| Thumbs-down with no reason | Captured, weighted low, still counted in aggregate |
| Approval rejection with a note | **Auto-promoted** — the highest-value case type |
| Feedback endpoint abused | Rate-limited per principal (F11.5) |

## Tests

- `test_rejected_approvals_are_auto_promoted`
- `test_candidate_inputs_are_redacted_before_storage`
- `test_duplicate_failures_are_deduped_with_a_count`
- `test_weekly_promotion_cap_is_enforced`
- `test_refusals_and_guard_blocks_are_captured_as_feedback`
- `test_promoted_case_appears_in_the_ci_gate`

## Acceptance criteria

- [ ] A production failure can become a permanent regression case in under a day
- [ ] Human-rejected fixes auto-promote — the highest-quality labels are never lost
- [ ] No raw PII is stored in the candidate queue
- [ ] Dataset growth is capped so the suite stays runnable
- [ ] Over-refusal and over-blocking are measurable, not just under-refusal
- [ ] Every candidate is replayable via its trajectory
