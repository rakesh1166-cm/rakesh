# W4-F4.8 — Conversation Memory, Refinement + Context Compaction

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F9](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F9** (multi-turn refinement) — previously unowned by any feature
**Layer:** `aiplat/memory/` (kernel) + `apps/w04_holidaylandmarks/refine.py`
**Depends on:** [F4.2](../F4.2-itinerary-schema-and-repair/CLAUDE.md), [W1-F1.3](../../week-01-llm-foundations/F1.3-token-accounting-and-context-guard/CLAUDE.md)
**Consumed by:** W6 follow-up questions, W7 long runs, W12 incident conversations

## Goal

"Make day 2 more relaxed." Refining a **previously validated structured object** is a different
problem from generating one, and it is the one most agentic apps get wrong — they re-plan from
scratch, silently discarding everything the user already approved.

Also solves the problem every multi-turn system eventually hits: history grows without bound until
it hits the context window, and naive truncation drops the message that mattered.

## Contract (schema first)

```python
class Turn(BaseModel):
    role: Literal["user", "assistant"]
    content: str
    data_ref: str | None              # id of the structured object produced this turn
    tokens: int
    at: datetime
    pinned: bool = False              # NEVER compacted away (constraints, preferences)

class Conversation(BaseModel):
    conversation_id: str
    turns: list[Turn]
    summary: str | None               # compacted older turns, regenerated on compaction
    summary_covers_through: int       # turn index — so nothing is double-counted
    current_data_ref: str | None      # the itinerary being refined
    total_tokens: int

class RefineRequest(BaseModel):
    conversation_id: str
    instruction: str = Field(min_length=2, max_length=1000)
    target: Literal["whole", "day", "activity"] = "whole"
    target_index: int | None = None   # "day 2" → 2

class RefineOutcome(BaseModel):
    itinerary: Itinerary              # the FULL updated object, revalidated
    changed_paths: list[str]          # ["days[1].activities[0]"] — what actually moved
    unchanged_preserved: bool         # asserted, not hoped
    warnings: list[str]

class CompactionPolicy(BaseModel):
    trigger_at_pct: float = 0.60      # of the context window
    keep_recent_turns: int = 4
    keep_pinned: bool = True
    summarize_with: tuple[str, str] = ("compact_history", "v1")
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/memory/conversation.py` | NEW | `Turn`, `Conversation`, store |
| `platform/src/aiplat/memory/compaction.py` | NEW | budget-triggered summarisation |
| `platform/src/aiplat/db/models/conversation.py` | NEW | `agent_conversations` |
| `apps/w04_holidaylandmarks/refine.py` | NEW | `POST /api/w04/trip/{id}/refine` |
| `platform/src/aiplat/prompts/templates/{refine_itinerary,compact_history}/v1.md` | NEW | versioned |
| `frontend/src/weeks/w04/RefineBar.jsx` | NEW | instruction input + changed-path highlight |

## Flow

```
RefineRequest
      ▼
load Conversation + current Itinerary
      ▼
tokens.count (W1-F1.3) ── over trigger_at_pct? ──► COMPACT
      │                        ├─ keep last N turns verbatim
      │                        ├─ keep ALL pinned turns verbatim
      │                        └─ summarise the rest → summary (versioned prompt)
      ▼
render refine_itinerary/v1 with: current Itinerary + instruction + (summary + recent turns)
      ▼
model returns the FULL updated Itinerary — never a patch it invents the format for
      ▼
validate (F4.2) + repair once
      ▼
diff old vs new → changed_paths
      ├─ target="day", target_index=2 but days[0] changed  ──► warning, not silent acceptance
      └─ unchanged_preserved asserted
      ▼
persist new version; the OLD itinerary is retained (refinement is undoable)
```

## Rules

- **The model returns the whole object, not a patch.** Model-authored patches (JSON Patch, diffs)
  fail in creative ways and cannot be validated against a schema. Return the full `Itinerary`,
  revalidate it, and compute the diff **yourself** — the diff is then trustworthy.
- **Verify scope, don't trust it.** "Make day 2 relaxed" that quietly rewrites day 1 is the
  characteristic refinement failure. `changed_paths` is computed and checked against `target`; a
  mismatch is a warning the user sees.
- **Refinement is undoable.** Keep prior versions. A user who says "actually, go back" after three
  refinements must be able to.
- **Pinned turns survive compaction.** Constraints ("I'm vegetarian", "no stairs") stated in turn 1
  are exactly what naive truncation drops — and their loss is invisible until the output is quietly
  wrong.
- **Compact on token budget, not turn count.** Ten short turns and two long ones are different
  problems; only the token count knows which you have.
- **`summary_covers_through` prevents double-counting.** Compacting twice without it re-summarises
  already-summarised content and degrades it each pass.
- The summariser is a **versioned prompt** (W3-F3.1) — it silently shapes every later turn.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| "Make day 2 relaxed" changes day 1 | `changed_paths` mismatch → warning surfaced to the user |
| History exceeds the window | Compaction fires at 60%, before overflow, not at 100% |
| Constraint from turn 1 dropped | Pinned turns are never compacted; test asserts it |
| Model returns a partial object | Schema validation fails → one repair → typed failure |
| Refinement makes it worse | Prior version retained; undo available |
| Injection inside a refine instruction | Sanitized (W11-F11.4); authority never accumulates across turns |
| Compaction runs twice | `summary_covers_through` prevents re-summarising |
| Conversation abandoned | TTL; the last itinerary persists independently |

## Tests

- `test_refinement_scope_violation_is_reported` ← the characteristic failure
- `test_pinned_constraints_survive_compaction`
- `test_compaction_triggers_on_tokens_not_turn_count`
- `test_double_compaction_does_not_resummarise`
- `test_refinement_is_undoable`
- `test_model_returns_full_object_not_a_patch`
- `test_multi_turn_injection_does_not_accumulate_authority`

## Acceptance criteria

- [ ] Legacy **F9** is fully covered — refinement works and is scoped
- [ ] A constraint stated in turn 1 still holds at turn 12
- [ ] Out-of-scope changes are detected and surfaced, never silently accepted
- [ ] Context never overflows — compaction fires on budget
- [ ] Every refinement is undoable
- [ ] `aiplat/memory/` is week-agnostic and reusable by W6, W7 and W12
