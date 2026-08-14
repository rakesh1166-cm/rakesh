# W12-F12.2 — Evidence Gathering with Citations

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w12_ai_ops_assistant/workflows/gather.py`
**Composes:** [W5](../../week-05-pgvector-search/CLAUDE.md) retrieval · [W6](../../week-06-rag-pipeline/CLAUDE.md) rerank + citations · [W7](../../week-07-tool-agent/CLAUDE.md) loop · [W9](../../week-09-mcp-tools/CLAUDE.md) MCP tools
**Consumed by:** [F12.3](../F12.3-fix-proposal-schema/CLAUDE.md)

## Goal

Assemble the factual basis for a diagnosis — runbooks, past incidents, logs, metrics — where
**every item is attributable**. A fix proposal without traceable evidence is a guess with good
formatting, and a reviewer cannot tell the difference.

## Contract (schema first)

```python
class EvidenceKind(str, Enum):
    RUNBOOK = "runbook"; PAST_INCIDENT = "past_incident"
    LOG_SAMPLE = "log_sample"; METRIC = "metric"
    CODE_REF = "code_ref"; CONFIG = "config"

class EvidenceItem(BaseModel):
    kind: EvidenceKind
    summary: str
    citation: Citation                # aiplat/schemas/common.py — W4, kernel
    relevance: Confidence
    retrieved_via: Literal["vector","tool","mcp"]
    raw_ref: str                      # chunk id | tool call id — resolvable, not decorative
    sanitized: bool = True            # W11-F11.4 — logs are untrusted text

class GatherOutcome(BaseModel):
    items: list[EvidenceItem]
    coverage: dict[EvidenceKind, int]
    gaps: list[str]                   # what was sought and NOT found — the honest part
    total_cost_usd: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w12_ai_ops_assistant/workflows/gather.py` | NEW | the gather node |
| `apps/w12_ai_ops_assistant/evidence.py` | NEW | `EvidenceItem` assembly + dedup |
| `frontend/src/weeks/w12/IncidentView.jsx` | EDIT | evidence panel using `CitationChip` (W6) |

## Flow

```
Incident
   ├─ vector: retrieval.query(k=50) over runbooks + past incidents   (W5-F5.3)
   │      → rerank (W6-F6.1) → top-N with scores
   ├─ tools: read-only log/metric tools via agent.loop (W7-F7.1)
   │      → tools.parallel (W7-F7.4) — logs, metrics, config fetched concurrently
   └─ mcp:  external observability tools as ToolPort (W9-F9.3), scope-clamped
        ▼
  sanitize every retrieved text (W11-F11.4)    ← log lines are attacker-influenceable
        ▼
  dedup by (kind, raw_ref); keep the highest relevance
        ▼
  GatherOutcome{items, coverage, gaps}
        ▼
  gaps feed the confidence score (F12.3) — missing evidence LOWERS confidence
```

## Rules

- **Every item carries a resolvable `raw_ref`.** A reviewer must be able to click through to the
  exact log line or runbook span. A citation that cannot be followed is decoration
  (W6-F6.3's reasoning, applied where the stakes are higher).
- **`gaps[]` is as important as `items[]`.** "No runbook found for this service" is a finding that
  should lower confidence — and a system that only reports what it found systematically overstates
  its basis.
- **Sanitize all retrieved text.** Log lines are the most attacker-influenceable input in the whole
  system: anyone who can trigger an error can write text that reaches your model
  (W11-F11.4, `RETRIEVED_DOC` and `TOOL_OUTPUT`).
- **Parallel gathering** (W7-F7.4). Logs, metrics and runbooks are independent; serial fetching adds
  latency to every incident for no benefit.
- **Read-only tools only.** Enforced by scope (W4-F4.3). Gathering evidence must never change state.
- **Deduplicate.** The same runbook reached via vector search and via an MCP tool is one piece of
  evidence, not two — double-counting inflates the confidence score.
- **Cost-bounded.** A gather node that exhausts the incident budget leaves nothing for diagnosis.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| No runbook exists | `gaps: ["no runbook for service X"]`; confidence lowered |
| Log tool unavailable | Gap recorded; investigation continues with what exists |
| Log line contains an injection payload | Sanitized; recorded as content, never obeyed |
| MCP observability server down | Degrades (W9-F9.3); gap recorded |
| Same evidence from two sources | Deduplicated by `raw_ref` |
| Gather exceeds its node budget | Terminated with partial evidence; the gap is explicit |
| Retrieval returns only low-relevance items | Reported as such; confidence collapses (F12.3) |

## Tests

- `test_every_evidence_item_has_a_resolvable_raw_ref`
- `test_gaps_are_reported_when_evidence_is_missing`
- `test_log_sample_injection_is_sanitized` ← the highest-risk path in the app
- `test_evidence_is_deduplicated_across_sources`
- `test_gather_uses_read_only_tools_only`
- `test_gather_sources_are_fetched_concurrently`

## Acceptance criteria

- [ ] Every evidence item resolves to a real, clickable source
- [ ] Missing evidence is reported as a gap and lowers confidence
- [ ] All retrieved text is sanitized before reaching any prompt
- [ ] Evidence from multiple sources is deduplicated
- [ ] Gathering cannot modify any system state
