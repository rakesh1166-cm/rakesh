# W0-F0.1 — Concept Map + the Week-0 Theory Note

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** all four — blog steps **6 Transformer · 7 Attention · 8 Tokens/Tokenization · 9 Embeddings**
**Layer:** `doc/week-00-transformer-foundations/` (a repo convention, not code)
**Depends on:** —
**Consumed by:** every other Week-0 feature; adopts the template owned by [W1-F1.5](../../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)

## Goal

Write down, **before writing any code**, what you currently believe *transformer*, *attention*,
*token* and *embedding* mean — in your own words — plus what you expect to be hard. Then place those
four concepts on the blog's 25-step ladder so you always know what you already have underneath you
and what you are not allowed to skip to yet.

[W1-F1.5](../../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md) defines the
`THEORY.md` convention and owns the test that enforces it. This feature is that convention's **first
instance** — Week 0 predates Week 1, so this note is the standard-setter and W1-F1.5 remains the
owner of the rule.

## Contract (schema first)

```markdown
<!-- doc/week-00-transformer-foundations/THEORY.md — max 1 page. Written BEFORE any Week-0 code. -->
# Week 0 — Theory

## Where I am on the ladder
| # | Step (blog order) | Have it? | Note |
| 6 | Transformer          | ? | |
| 7 | Attention            | ? | |
| 8 | Tokens/Tokenization  | ? | |
| 9 | Embeddings           | ? | |
| 10| LLM                  | not yet — that is Week 1 |

## The 4 concepts (10–15 min each)
| Concept | In one sentence, in my own words | Where it bites in this week's code |

## What I predicted
Before building: what I expect to be hard, and what I expect to work first try.
Include at least one *numeric* prediction (e.g. "'internationalisation' will be ~4 tokens").

## Open questions
Things I do not understand yet. Named, not hidden.

## Revisited (filled in AFTER the week)
- Predictions that were wrong, and why
- Which concept only made sense after I built the layer below it
- Open questions now answered — and the new ones this week created
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `doc/week-00-transformer-foundations/THEORY.md` | NEW | the note itself — written first, revisited last |
| `doc/week-00-transformer-foundations/GLOSSARY.md` | NEW | the 4 terms + `logit`, `softmax`, `context window`, `vocab`, `d_model`, one line each, own words |
| `doc/CLAUDE.md` | EDIT | Week-0 row in the index |
| `tests/w00/test_theory_note.py` | NEW | the note exists, has all five sections, and holds ≥1 numeric prediction |

## Flow

```
read the blog's steps 6–9  (10–15 min per concept, no code open)
      ▼
write THEORY.md: ladder · own-words table · predictions (incl. one number) · open questions
      ▼
build F0.2 → F0.6  (predictions are now falsifiable)
      ▼
F0.7 bridge, then fill in "Revisited"
      ▼
the wrong predictions are this week's actual learning record  ──►  feeds W12-F12.8 teach-back
```

## Rules

- **Written before the code.** A note written afterwards is a summary of what you did, which is worth
  very little. Written before, it is a falsifiable prediction, and the delta is the learning.
- **One numeric prediction minimum.** "Tokenization will be surprising" cannot be wrong.
  "`internationalisation` is 4 tokens" can be — and that is the point.
- **"In my own words" is the whole test.** A pasted definition proves nothing. If you cannot say what
  attention is without looking, record that you cannot. That is a valid, useful entry.
- **Don't skip ahead on the ladder.** No LLM API call, no prompt engineering, no RAG in this week's
  note. Steps 10+ belong to Weeks 1–6, and knowing what you are *not* doing yet is half the value.
- **One page maximum.** A long theory note is a copied one.
- **Wrong predictions are the valuable content.** Do not edit them to look smarter afterwards.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Note written after the lab | Predictions section is empty → test fails the week as incomplete |
| Note is copied definitions | Review rejects it; the "own words" column is the check |
| No numeric prediction | Test fails — nothing in the note is falsifiable |
| No open questions listed | Suspicious. Nobody understands attention completely on day one. Push back |
| *Revisited* never filled in | Week 0 is not closed; blocks the Week DoD |
| Note grows past a page | Compress. Length is a symptom of not having understood it |

## Tests

- `test_theory_md_exists_for_week_00`
- `test_theory_md_has_all_five_sections`
- `test_theory_md_contains_at_least_one_numeric_prediction`
- `test_glossary_covers_the_four_concepts`
- `test_revisited_section_filled_before_week_is_marked_done`

## Acceptance criteria

- [ ] `THEORY.md` is committed **before** the first commit under `apps/w00_transformer_lab/`
- [ ] All four concepts have a one-sentence own-words definition and a "where it bites" note
- [ ] At least one prediction is numeric, and it is checked against F0.2's measured output
- [ ] At least one prediction turns out **wrong** and is preserved, not edited away
- [ ] `GLOSSARY.md` has no sentence you could not say out loud from memory
- [ ] Open questions carry forward into [Week 1's THEORY.md](../../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
