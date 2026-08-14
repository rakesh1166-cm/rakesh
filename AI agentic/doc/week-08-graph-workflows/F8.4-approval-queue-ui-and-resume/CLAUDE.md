# W8-F8.4 — Approval Queue UI + Resume

> [Week 8](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `frontend/src/components/ApprovalPanel.jsx` + `weeks/w08/`
**Depends on:** [F8.3](../F8.3-human-interrupt-and-approval-gate/CLAUDE.md)
**Consumed by:** **W12-F12.4** reuses `ApprovalPanel` verbatim

## Goal

Make a paused run **findable by someone who did not start it**. The approver is usually a different
person, on a different machine, arriving hours later — so a pending approval must live in a queue,
not in a live browser tab.

## Contract (schema first)

```js
// components/ApprovalPanel.jsx — SHARED (W12 reuses it unchanged)
<ApprovalPanel
  request={{approval_id, action_summary, rationale, evidence[], confidence,
            payload, payload_hash, required_scope, expires_at}}
  onDecide={(decision, note) => ...}   // sends payload_hash back with the decision
/>
// Renders: WHAT will happen · WHY · evidence (CitationChip, W6) · confidence
//          (ConfidenceMeter, W6) · [Approve] [Reject] [Reject with note]

// weeks/w08/PendingApprovals.jsx — the QUEUE
// GET /api/w08/approvals → list, sorted by expiry. Independent of any live run.
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `frontend/src/components/ApprovalPanel.jsx` | NEW | the shared decision surface |
| `frontend/src/weeks/w08/PendingApprovals.jsx` | NEW | the queue — the discoverability fix |
| `frontend/src/weeks/w08/GraphView.jsx` | NEW | nodes, edges, current position |
| `frontend/src/weeks/w08/CheckpointTimeline.jsx` | NEW | every resume point, replayable |
| `frontend/src/hooks/useApprovalQueue.js` | NEW | poll pending; optimistic decide |
| `frontend/src/weeks/registry.js` | EDIT | + w08 |

## Flow

```
/w08                     → PendingApprovals (queue, polled)      ← ANY user, ANY tab, ANY time
   click → ApprovalPanel
       action_summary · rationale · CitationChip[] · ConfidenceMeter
       [Approve] → POST /approve/{id} {decision, payload_hash, decided_by}
       [Reject]  → note required
            ▼
   run resumes server-side (F8.3) → useRunStream (W7) reattaches → GraphView advances

/w08/run/:runId          → GraphView + CheckpointTimeline
   current node highlighted; each checkpoint clickable to inspect the state it received
```

## Rules

- **The queue is the primary surface, the live run view is secondary.** A pending approval reachable
  only from the originating tab is effectively invisible — the run silently stalls forever.
- **`ApprovalPanel` goes in `components/`, not `weeks/w08/`.** W12 is a known second consumer, so
  the second-use rule fires with a real justification
  ([architecture §8](../../../CLAUDE-12-WEEK.md)).
- **Never render an approve button without evidence and confidence.** A gate that makes
  rubber-stamping easy is worse than no gate, because it manufactures a false audit trail.
- **`payload_hash` round-trips.** The UI sends back the hash it displayed, so approving a stale view
  is detected server-side (F8.3).
- **Expiry is visible and counted down.** An approver needs to know they are looking at something
  still actionable.
- **Reject requires a note.** The note feeds the graph (F8.3); a note-less reject wastes the run.
- `CheckpointTimeline` is clickable — inspecting the state a node received is the difference between
  debugging a workflow and guessing at it.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Approver opens a stale queue entry | Hash mismatch on submit → clear "this changed, reload" message |
| Approval expires while open | Buttons disable; the panel says so |
| Two approvers decide simultaneously | Second gets a "already decided" message, not a silent no-op |
| Run completes while the panel is open | Panel closes with a resolved state |
| Evidence list is empty | Approve is **disabled** — F8.3 forbids evidence-free requests |
| Backend unreachable | Queue shows stale-data warning; decisions are not optimistically confirmed |

## Tests

- `test_pending_approvals_visible_without_the_originating_run_open` ← the discoverability test
- `test_approve_button_disabled_without_evidence`
- `test_stale_payload_hash_shows_a_reload_message`
- `test_reject_requires_a_note`
- `test_expiry_countdown_disables_the_panel`
- `test_approval_panel_lives_in_components_not_weeks` — boundary lint

## Acceptance criteria

- [ ] A paused run is actionable by a second user who never saw it start
- [ ] Approve is impossible without visible evidence and confidence
- [ ] The approved payload hash matches what was displayed
- [ ] `CheckpointTimeline` lets you inspect the state each node received
- [ ] `ApprovalPanel` is imported by W12 with **zero** modifications
