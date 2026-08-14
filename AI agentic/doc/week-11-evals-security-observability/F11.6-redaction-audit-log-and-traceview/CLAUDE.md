# W11-F11.6 — Redaction, Audit Log, `TraceView`

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/obs/redact.py` + `frontend/src/weeks/w11/`
**Depends on:** [W2-F2.2](../../week-02-fastapi-ai-service/F2.2-correlation-id-and-structured-logging/CLAUDE.md)
**Consumed by:** W12 (an audit trail is a hard requirement for anything that writes)

## Goal

Close the loop opened in Week 2. The correlation ID threaded through every layer since then becomes
a **browsable trace** — request → agent iterations → tool calls → LLM calls, with tokens and cost per
span. And before any of that is browsable, **redaction must land**: a trace UI over unredacted logs
is a PII incident with a nice interface.

## Contract (schema first)

```python
class RedactionRule(BaseModel):
    name: str
    pattern: str                      # email, phone, card, api key, JWT, connection string
    replacement: str = "[REDACTED:{name}]"
    applies_to: list[str]             # which log fields

class RedactionResult(BaseModel):
    text: str
    hits: dict[str, int]              # rule → count. Counts are kept; content is not.

class AuditEntry(BaseModel):
    """SEPARATE from operational logs. Retained. Never redacted into uselessness."""
    id: str
    correlation_id: str
    principal: Principal
    action: Literal["tool_call","approval_requested","approval_decided",
                    "external_write","config_change","scope_grant"]
    target: str
    payload_hash: str                 # W8-F8.3 — proves WHAT was done
    outcome: Literal["success","failure","denied"]
    at: datetime

class Span(BaseModel):
    span_id: str; parent_id: str | None
    correlation_id: str
    name: str                         # "http.request" · "agent.iteration" · "tool.call" · "llm.complete"
    start: datetime; duration_ms: float
    attrs: dict[str, Any]             # REDACTED before storage
    usage: Usage | None; cost_usd: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/obs/redact.py` | NEW | rules, `redact()`, log-formatter integration |
| `platform/src/aiplat/obs/audit.py` | NEW | `AuditEntry` writer — separate sink |
| `platform/src/aiplat/db/models/audit.py` | NEW | `agent_audit_log` |
| `apps/w11_eval_guardrails/router.py` | EDIT | `/traces/{correlation_id}`, `/metrics` |
| `frontend/src/weeks/w11/{TraceView,ObservabilityDashboard,EvalRunView,ScoreDiff}.jsx` | NEW | UI |

## Flow

```
every log line ──► redact() ──► operational log (redacted, rotated)
                       │
consequential action ──┴──► audit log (SEPARATE sink, retained, hash-anchored)
                                   ▼
spans ──► store keyed by correlation_id
                                   ▼
GET /api/w11/traces/{correlation_id}
                                   ▼
TraceView.jsx
   http.request ──────────────────────────────── 4,210ms  $0.084
     agent.iteration 1 ────────────────────────  1,120ms  $0.021
       llm.complete (sonnet) ────────────────────  890ms  $0.019
       tool.call weather_forecast (cached) ───────  12ms  $0.000
     agent.iteration 2 ────────────────────────  2,890ms  $0.063
```

## Rules

- **Redaction ships before the trace UI.** Making logs browsable first and redacting later means the
  window between them is a live exposure.
- **Audit logs are separate from operational logs.** Operational logs are redacted and rotate; audit
  logs record who did what to which target with which payload hash, and are **retained**. Collapsing
  them means either losing the audit trail or retaining PII.
- **Redaction counts are kept, content is not.** `{"email": 3}` tells you a prompt contained emails
  without storing them — that is enough to act on.
- **Redact before the log line is written**, not at display time. A redacting viewer over raw stored
  logs protects nobody with database access.
- **`TraceView` is keyed by correlation ID** — the value `api/client.js` has surfaced in the UI since
  Week 2. That is the whole payoff: a user quotes an ID, you paste it, you see everything.
- **Cost per span, not just per request.** "This request cost $0.084" is a number; "iteration 2's
  rerank call cost $0.063 of it" is a finding.
- **Audit entries are append-only.** An editable audit log is not an audit log.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Email in a user prompt | Redacted in operational logs; count recorded |
| API key in an error message | Redacted; a scan test asserts no key pattern survives |
| Redaction rule too aggressive | Counts reveal it; rules are versioned and tested |
| Audit sink unavailable | The consequential action is **refused** — unaudited writes never happen |
| Trace requested for an unknown ID | Typed 404 |
| Trace spans exceed a size limit | Truncated with a visible marker |
| Attempt to modify an audit entry | Rejected — append-only enforced at the DB level |

## Tests

- `test_no_pii_pattern_survives_in_operational_logs` — scan over a generated corpus
- `test_redaction_counts_are_recorded_without_content`
- `test_audit_sink_failure_prevents_the_external_write` ← the W12 prerequisite
- `test_audit_entries_are_append_only`
- `test_trace_reconstructs_the_full_span_tree_from_one_id`
- `test_cost_is_attributed_per_span`

## Acceptance criteria

- [ ] No PII pattern appears in operational logs, proven by a scan
- [ ] Audit and operational logs are separate sinks with different retention
- [ ] An unavailable audit sink blocks consequential actions rather than allowing them silently
- [ ] Pasting any correlation ID into `TraceView` reconstructs the full request
- [ ] Cost is attributed per span, not only per request
- [ ] Audit entries cannot be edited
