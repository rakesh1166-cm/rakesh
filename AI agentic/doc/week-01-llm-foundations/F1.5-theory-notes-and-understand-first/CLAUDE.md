# W1-F1.5 — Theory Notes + the Understand-First Discipline

> [Week 1](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `doc/week-NN-*/THEORY.md` (a repo convention, not code)
**Depends on:** —
**Consumed by:** **every week**. This feature installs a pattern the other eleven weeks follow.

## Goal

The blog's loop is **Understand → Build → Break → Debug → Improve → Test → Explain.** The feature
specs in this folder cover Build, Break and Test well and skip Understand almost entirely — every
file jumps straight to contracts.

This feature installs the missing first step: a **short, dated, honest** theory note per week,
written *before* that week's code, recording what you understood and — more usefully — what you
did not.

## Contract (schema first)

```markdown
<!-- doc/week-NN-<theme>/THEORY.md — max 1 page. Written BEFORE the week's code. -->
# Week N — Theory

## The 5 concepts (10–15 min each)
| Concept | In one sentence, in my own words | Where it bites in this week's code |

## What I predicted
Before building: what I expect to be hard, and what I expect to work first try.

## Open questions
Things I do not understand yet. Named, not hidden.

## Revisited (filled in AFTER the week)
- Predictions that were wrong, and why
- Open questions now answered — and the new ones the week created
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `doc/week-01-llm-foundations/THEORY.md` | NEW | the first one — sets the standard |
| `doc/week-NN-*/THEORY.md` | NEW (per week) | one per week, written before that week's code |
| `doc/CLAUDE.md` | EDIT | link `THEORY.md` from each week row |
| `tests/test_docs_complete.py` | NEW | a week with code but no `THEORY.md` fails |

## Flow

```
BEFORE the week's code
   read/experiment 10–15 min per concept
   write THEORY.md: concepts · predictions · open questions
        ▼
   build the week (the feature CLAUDE.md files)
        ▼
AFTER the week
   fill in "Revisited": which predictions were wrong, which questions resolved
        ▼
   the wrong predictions are the actual learning record
        ▼
   feeds W12-F12.8 (the architecture write-up / teach-back)
```

## Rules

- **Written before the code, revisited after.** A theory note written afterwards is a summary of
  what you did, which is worth very little. Written before, it becomes a **falsifiable prediction**
  — and the delta is the learning.
- **"In my own words" is the whole test.** A pasted definition proves nothing. If you cannot say
  what a context window is without looking, you do not know it yet, and that is fine to record.
- **Open questions are named, not hidden.** "I don't understand why reranking beats raw vector
  search" written down in Week 5 is what makes Week 6 land. Unnamed confusion just persists.
- **One page maximum.** A long theory note is a copied one. The constraint forces compression,
  which is where understanding actually happens.
- **Wrong predictions are the valuable content.** Do not edit them to look smarter afterwards —
  the "Revisited" section exists precisely to preserve them.
- A week whose code exists but whose `THEORY.md` does not is **incomplete**, and a test says so.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Theory note written after the code | Predictions section is empty → the test flags the week incomplete |
| Note is copied definitions | Review rejects it; the "own words" column is the check |
| No open questions listed | Suspicious — nobody understands a new topic completely. Push back |
| "Revisited" never filled in | Week not closed; blocks the week's Definition of Done |
| Note grows past a page | Compress. Length is a symptom of not having understood it |

## Tests

- `test_every_week_with_code_has_a_theory_md`
- `test_theory_md_has_all_four_sections`
- `test_revisited_section_filled_before_week_is_marked_done`
- `test_theory_md_is_under_one_page` — a crude length cap, deliberately

## Acceptance criteria

- [ ] `THEORY.md` exists for Week 1 and is written *before* Week 1's code
- [ ] The template is followed by every subsequent week
- [ ] At least one prediction per week turns out wrong and is preserved, not edited away
- [ ] Open questions carry forward — each week's note names which prior questions it answered
- [ ] The build fails when a week ships code without a completed theory note
