# W12-F12.3 — Fix Proposal: Diff, Rationale, Confidence

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w12_ai_ops_assistant/schemas.py`
**Composes:** [W4](../../week-04-holidaylandmarks/F4.2-itinerary-schema-and-repair/CLAUDE.md) structured output · [W6](../../week-06-rag-pipeline/F6.4-confidence-scoring-and-refusal/CLAUDE.md) confidence
**Consumed by:** [F12.4](../F12.4-approval-policy-and-single-write-path/CLAUDE.md), `DiffReview.jsx`

## Goal

The object a human approves. It must contain **everything needed to decide** — what changes, why,
on what evidence, how confident, what happens if it is wrong — and nothing that requires the
reviewer to go and reconstruct context themselves.

Schema first, as always: this is defined before the node that produces it.

## Contract (schema first)

```python
class ChangeKind(str, Enum):
    CONFIG_PATCH = "config_patch"; CODE_PATCH = "code_patch"
    RESTART = "restart"; SCALE = "scale"
    ROLLBACK = "rollback"; NO_ACTION = "no_action"   # a valid, sometimes correct proposal

class Change(BaseModel):
    kind: ChangeKind
    target: str                       # service / file / resource — exact, not descriptive
    diff: str | None                  # unified diff for patches
    command: str | None               # exact command for operational actions
    reversible: bool
    rollback: str | None              # REQUIRED when reversible is True

    @model_validator(mode="after")
    def rollback_required_if_reversible(self): ...

class Fix(BaseModel):
    summary: str = Field(max_length=200)          # what a reviewer reads first
    rationale: str = Field(max_length=2_000)      # WHY — must reference evidence
    changes: list[Change] = Field(min_length=1, max_length=5)
    evidence: list[EvidenceItem] = Field(min_length=1)   # never zero
    confidence: Confidence
    blast_radius: Literal["single_instance","service","cluster","global"]
    risk_if_wrong: str                            # REQUIRED — plain language
    verification: str                             # how to tell it worked
    model_config = ConfigDict(extra="forbid")
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w12_ai_ops_assistant/schemas.py` | EDIT | `Fix`, `Change`, `Diagnosis` |
| `apps/w12_ai_ops_assistant/workflows/investigate.py` | EDIT | the `propose` node |
| `platform/src/aiplat/prompts/templates/propose_fix/v1.md` | NEW | versioned prompt |
| `frontend/src/weeks/w12/DiffReview.jsx` | NEW | diff + rationale + chips + meter |

## Flow

```
Diagnosis + GatherOutcome (F12.2)
      ▼
render propose_fix/v1 (W3-F3.2) with evidence packed
      ▼
llm.complete → validate against Fix → ONE repair retry (W4-F4.2) → else terminate
      ▼
citations.verify (W6-F6.3): does `rationale` actually rest on `evidence`?
      ▼
confidence (W6-F6.4) with gaps[] and blast_radius as inputs
      ▼
confidence below threshold OR blast_radius=global with confidence < high
      ──► do NOT propose. Terminate as "undetermined".
      ▼
DiffReview.jsx: summary · diff · rationale · CitationChip[] (W6) · ConfidenceMeter (W6)
                · blast_radius · risk_if_wrong · rollback
```

## Rules

- **`evidence` has `min_length=1`.** A fix with no evidence is structurally unrepresentable. This is
  the schema doing safety work rather than a reviewer being expected to notice.
- **`risk_if_wrong` and `verification` are required.** They are what turn an approval from a
  rubber stamp into a decision. A reviewer who does not know the downside cannot weigh it.
- **`reversible=True` requires a `rollback`.** Claiming reversibility without stating how is the
  most dangerous field combination in the schema, so the validator forbids it.
- **`NO_ACTION` is a legitimate proposal.** "This is a known transient, no action needed" is often
  the correct output, and a schema that cannot express it pushes the model toward inventing work.
- **Blast radius gates confidence.** A `global` change needs materially higher confidence than a
  `single_instance` one. Same threshold for both is how a small win and a large outage get approved
  by the same standard.
- **`extra="forbid"`.** An unexpected field in an approved payload is exactly the kind of thing that
  should fail loudly.
- **Max 5 changes.** A fix touching twenty things is not reviewable, and an unreviewable proposal
  defeats the entire approval mechanism.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model proposes with no evidence | Schema validation fails; repair once; then terminate |
| `rationale` not supported by `evidence` | Citation verification (W6-F6.3) → confidence collapses |
| `reversible=True`, no rollback | Validator rejects |
| Global blast radius, medium confidence | Not proposed |
| Model proposes 20 changes | `max_length=5` rejects; repair asks for the smallest safe change |
| Confidence high, evidence weak | Confidence is computed from signals (W6-F6.4), not self-reported |
| Correct answer is "do nothing" | `NO_ACTION` — a valid and complete proposal |

## Tests

- `test_fix_without_evidence_is_unrepresentable`
- `test_reversible_change_requires_a_rollback`
- `test_global_blast_radius_requires_higher_confidence`
- `test_no_action_is_a_valid_proposal`
- `test_rationale_unsupported_by_evidence_collapses_confidence`
- `test_more_than_five_changes_is_rejected`

## Acceptance criteria

- [ ] Every proposal carries evidence, risk, verification, and (where reversible) a rollback
- [ ] Confidence is computed from measured signals, never self-reported by the model
- [ ] Blast radius raises the confidence bar
- [ ] `DiffReview` shows everything a reviewer needs without leaving the page
- [ ] "No action" is expressible and used when correct
