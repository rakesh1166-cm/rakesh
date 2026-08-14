# W10-F10.4 — Justification Log + Deletion Pass

> [Week 10](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/orchestration/README.md` + deletions across `apps/w10_multi_agent/`
**Depends on:** [F10.3](../F10.3-deterministic-baseline-harness/CLAUDE.md)
**Consumed by:** W12 (a small number of justified agents rather than an org chart)

## Goal

**The actual deliverable of Week 10: deletion.** Every surviving agent must answer one question in
writing — *what does this agent do that a deterministic function cannot?* — and every agent that
cannot answer it gets replaced by the function.

This is the master prompt's *aggressive simplification* applied with a real measurement (F10.3)
behind it rather than as a slogan.

## Contract (schema first)

```markdown
<!-- aiplat/orchestration/README.md — one entry per surviving agent -->
### <agent name>
- **Does what a function cannot:** <the specific dynamic decision — open-ended input,
  unbounded tool selection, judgement over unstructured text>
- **Evidence:** quality <x> vs baseline <y>, cost <a>× , latency <b>×   (from F10.3)
- **Deletion trigger:** the condition under which this becomes a function
- **Reviewed:** <date>
```

```python
class DeletionRecord(BaseModel):
    removed: str
    replaced_by: str                  # the module path of the function that replaced it
    reason: str
    evidence: dict[str, float]        # the numbers that decided it
    loc_removed: int
    date: date
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/orchestration/README.md` | NEW | the justification log |
| `apps/w10_multi_agent/README.md` | EDIT | deletion records + where multi-agent won/lost |
| `apps/w10_multi_agent/agents/**` | **DELETE** | the agents that failed to justify themselves |
| `apps/w10_multi_agent/baseline.py` | EDIT | absorbs the deleted agents' work |
| `tests/test_orchestration_justified.py` | NEW | every agent has a log entry — enforced |

## Flow

```
F10.3 Comparison
      ▼
for each agent / pattern:
   Q: "what does this do that a deterministic function cannot?"
      │
      ├─ concrete answer + F10.3 evidence  ──► keep. Write the log entry. Set a deletion trigger.
      └─ "it's more flexible" / "it feels right" / no numbers
                                            ──► DELETE. Write the function. Record it.
      ▼
tests assert: every registered agent has a README entry
      ▼
apps/w10_multi_agent/README.md ── deletion records ── BaselineCompare.jsx
```

## Rules

- **"It's more flexible" is not an answer.** Flexibility is what an agent costs you, not what it
  buys you. The answer must name a specific decision that cannot be enumerated in advance.
- **Every kept agent gets a deletion trigger** — the future condition that would make it a function.
  Without one, the log becomes a permanent justification rather than a live review.
- **At least one deletion is required this week.** If the honest analysis is that every agent
  earned its place, the task set (F10.3) is too easy and the exercise proved nothing — say so
  explicitly in the README rather than declaring victory.
- **Deletion records are kept**, including the line count removed. They are the strongest evidence
  the architecture is being maintained rather than accumulated.
- **A test enforces the log.** Registering an agent without a justification entry fails the build —
  otherwise the discipline lasts exactly one week.
- **Deleting the router or supervisor entirely is a valid outcome.** If F10.3 shows rules handle
  95% of routing, delete the LLM classifier and keep the rules.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Agent added without a log entry | Build fails |
| Justification is a vibe, no numbers | Review rejects it; agent is deleted |
| Nothing deleted this week | README must state *why*, and flag the task set as too easy |
| Deleted agent's behaviour regresses | The replacement function has the deleted agent's tests |
| Deletion trigger fires later | Log review catches it; a follow-up deletion is scheduled |
| Log drifts out of date | `Reviewed:` date is checked; stale entries surface in W11's review |

## Tests

- `test_every_registered_agent_has_a_justification_entry` ← the enforcing test
- `test_justification_entries_cite_numeric_evidence`
- `test_replacement_functions_inherit_the_deleted_agents_tests`
- `test_at_least_one_deletion_record_exists`
- `test_every_kept_agent_declares_a_deletion_trigger`

## Acceptance criteria

- [ ] `orchestration/README.md` has one evidenced entry per surviving agent
- [ ] At least one agent was deleted, with a `DeletionRecord` and a line count
- [ ] Every replacement function carries the tests of the agent it replaced
- [ ] Every kept agent has a stated deletion trigger
- [ ] The build fails if an agent is registered without a justification
