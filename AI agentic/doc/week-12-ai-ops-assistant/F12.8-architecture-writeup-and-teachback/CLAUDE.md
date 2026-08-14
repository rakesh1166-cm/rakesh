# W12-F12.8 — Architecture Write-Up + Teach-Back

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md §9 milestone 7](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `doc/ASSESSMENT.md` + `doc/runbooks/`
**Depends on:** every prior feature; pairs with [W1-F1.5](../../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
**Consumed by:** you, in an interview or a design review

## Goal

The blog's loop is **Understand → Build → Break → Debug → Improve → Test → Explain**, and
[feature.md §9](../../feature.md) lists milestone 7 as *"Assessment — golden dataset eval +
interview/architecture write-up"*. Until now **Explain** was owned by nothing.

This is the closing feature of the twelve weeks, and the one that converts a working repo into
demonstrable expertise. **If you cannot explain a decision, you did not make it — you inherited it.**

## Contract (schema first)

```markdown
<!-- doc/ASSESSMENT.md -->
# 1. System in one page
   The architecture, drawn from memory, then checked against CLAUDE-12-WEEK.md.
   Note what you got wrong when you drew it. That gap is the finding.

# 2. Ten decisions, defended
   | Decision | Alternative rejected | Why | What would change my mind |
   ← the last column is the one that separates understanding from recitation

# 3. Five failures and what they taught
   Real failures from building it. Symptom → wrong hypothesis → actual cause → what changed.

# 4. The numbers
   recall@k · precision@5 · eval pass rate · cost per unit · saturation point
   · injection corpus result · agent efficiency
   Every one measured, none estimated.

# 5. What I would do differently
   Boundaries drawn wrong, features over/under-built, weeks that should have been ordered otherwise.

# 6. What I still do not know
   Carried forward from the THEORY.md open questions (W1-F1.5) that never got answered.

# 7. Interview answers
   10 questions with answers ≤3 minutes spoken, each citing something in THIS repo.
```

```python
class TeachBack(BaseModel):
    topic: str                        # "why the agent loop is bounded the way it is"
    audience: Literal["junior_dev","senior_non_ai","stakeholder"]
    duration_min: int                 # ≤ 10
    delivered: bool
    questions_i_could_not_answer: list[str]   # ⭐ the real output
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `doc/ASSESSMENT.md` | NEW | the seven sections above |
| `doc/runbooks/` | NEW | deploy · model migration · incident response · secret rotation |
| `doc/week-*/THEORY.md` | EDIT | close out unanswered open questions (W1-F1.5) |
| `README.md` | EDIT | the honest project summary, with real numbers |

## Flow

```
1. Draw the architecture from memory. Diff against CLAUDE-12-WEEK.md.
      The diff is the first finding — it shows what you actually internalised.
2. For each of 10 decisions: state the alternative and WHAT WOULD CHANGE YOUR MIND.
      A decision with no falsifier is a preference wearing a rationale.
3. Collect the numbers. Every claim in this repo either has one or gets deleted.
4. Teach it back — 3 audiences, ≤10 min each.
      Record the questions you could not answer. THAT is the assessment result.
5. Feed unanswered questions back into THEORY.md as open items.
      The loop does not close; it continues at a higher level.
```

## Rules

- **"What would change my mind" is mandatory on every decision.** [ADR-004](../../../TECH-STACK-DECISIONS.md)
  chose a hand-rolled loop over LangGraph; the falsifier is "when we need durable resumability" —
  and Week 8 is that falsifier firing exactly as predicted. A decision without one is untestable
  taste.
- **Every number is measured, none estimated.** If recall@k was never run, say "not measured" rather
  than quoting a plausible figure. One invented number destroys the credibility of the rest.
- **The teach-back's output is the questions you could not answer**, not the talk. A talk you
  delivered smoothly proves you can present; a question that stopped you shows exactly where the
  understanding ends.
- **Three audiences, because they fail differently.** A junior dev exposes vague mechanism; a senior
  non-AI engineer exposes hand-waved LLM specifics; a stakeholder exposes an inability to justify
  cost and risk. Only surviving all three means you understand it.
- **Section 5 must be substantive.** Twelve weeks with nothing you would do differently means you
  were not paying attention. Concretely: which boundary was drawn wrong, which week should have
  come earlier.
- **Section 6 carries forward unanswered questions from every `THEORY.md`.** Closing the loop opened
  in W1-F1.5 is the point — and an honest list of what you still do not know is a stronger signal of
  expertise than a list of what you do.
- **Runbooks are written for someone else.** A runbook only you can execute is a note to self.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Architecture drawn from memory is wrong | Record the gap — do not quietly redraw it correctly |
| A decision has no falsifier | It is not a decision. Find the real reason or reverse it |
| A number was never measured | Write "not measured". Never estimate into the table |
| Teach-back goes perfectly | Suspicious — the audience was too gentle. Try a harder one |
| Section 5 is empty | Twelve weeks of no learning. Re-read the `THEORY.md` "Revisited" sections |
| Runbook untested by a second person | Not a runbook yet |

## Tests

- `test_assessment_has_all_seven_sections`
- `test_every_decision_row_has_a_falsifier`
- `test_every_number_cited_traces_to_a_measurement` — cross-check against eval/load outputs
- `test_all_theory_md_open_questions_are_resolved_or_carried_forward`
- `test_each_runbook_records_a_second_person_dry_run`

## Acceptance criteria

- [ ] Ten decisions defended, each with an explicit falsifier
- [ ] Every number in the write-up traces to a real measurement
- [ ] Teach-back delivered to three audiences; unanswered questions recorded
- [ ] Four runbooks exist and have been executed by a second person
- [ ] Section 6 honestly lists what is still not understood
- [ ] The blog's loop is complete — **Understand** (W1-F1.5) through **Explain** (here)
