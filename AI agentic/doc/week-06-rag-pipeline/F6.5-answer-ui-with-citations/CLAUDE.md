# W6-F6.5 — Answer UI: Citation Chips + Confidence Meter

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `frontend/src/components/` + `weeks/w06/`
**Depends on:** [F6.4](../F6.4-confidence-scoring-and-refusal/CLAUDE.md), [W4-F4.7](../../week-04-holidaylandmarks/F4.7-react-itinerary-ui/CLAUDE.md)
**Consumed by:** W12 (`DiffReview` reuses both components verbatim)

## Goal

Make provenance and uncertainty **visible**. Also the first proof that Week 4's event contract was
right: `useSSEStream` is reused with **zero modifications** to render a completely different payload
type.

## Contract (schema first)

```js
// components/CitationChip.jsx
<CitationChip index={1} chunk={{id, text, heading_path, source, char_start, char_end}} />
// inline [1]; hover/click → the exact supporting span

// components/ConfidenceMeter.jsx
<ConfidenceMeter verdict={{score, band, reasons}} />
// band='refuse' renders a REFUSAL STATE — not a small grey caption under an answer

// weeks/w06/AskView.jsx
const { status, text, data, error, usage } = useSSEStream()   // ← UNCHANGED from W4
// data.schema_name === 'Answer'  → validateAnswer(data.payload)
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `frontend/src/components/CitationChip.jsx` | NEW | inline marker → source span (shared) |
| `frontend/src/components/ConfidenceMeter.jsx` | NEW | band + reasons (shared) |
| `frontend/src/weeks/w06/AskView.jsx` | NEW | question form + stream |
| `frontend/src/weeks/w06/AnswerView.jsx` | NEW | claims linked to chips |
| `frontend/src/weeks/w06/RetrievedContext.jsx` | NEW | collapsible: the chunks actually sent |
| `frontend/src/weeks/w06/validateAnswer.js` | NEW | boundary shape check |
| `frontend/src/weeks/registry.js` | EDIT | + w06 |

## Flow

```
AskView ──► useSSEStream (W4-F4.7, unchanged) ──► POST /api/w06/ask
   token       → streaming text (progress only)
   data        → validateAnswer → refused ? <RefusalPanel/> : <AnswerView/>
   done        → CostBadge (W4)

AnswerView
   text with [cN] → <CitationChip/> per marker
   verdict        → <ConfidenceMeter/>  (band drives the entire visual treatment)
   RetrievedContext → the 5 packed chunks, with scores and rank_delta
```

## Rules

- **`useSSEStream` must not be modified.** If W6 needs a change to it, the W4 event contract was
  wrong — fix `schemas/events.py`, not the hook
  ([architecture §4](../../../CLAUDE-12-WEEK.md)). Assert this with a git-level check in review.
- **A refusal is a distinct UI state.** Not an answer with a warning attached — no answer text at
  all, plus `reasons[]`. Rendering a hedged answer next to "low confidence" trains users to ignore
  the meter.
- **`RetrievedContext` is the debugging surface** and is shipped, not a dev-only panel. When an
  answer is wrong, the first question is always "what did it actually see?"
- Citation chips link to the **exact span** via `char_start`/`char_end` (W5-F5.1), not just to a
  document. Document-level citations are unverifiable by a reader.
- `CitationChip` and `ConfidenceMeter` go in `components/` — W12 is their known second consumer, so
  the second-use rule fires with a real, not speculative, justification.
- Components never import from `weeks/` ([architecture §2](../../../CLAUDE-12-WEEK.md)).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Answer refused | Refusal panel with reasons; **no** answer text rendered |
| Citation points at a missing chunk | Chip renders as broken/warning, never silently omitted |
| `data` fails the shape check | Treated as `INTERNAL`; no `undefined` rendered |
| Stream drops before `done` | Status stays `streaming`; retry offered (W4 invariant) |
| Very long chunk in a chip | Truncated with an expand affordance; the span is still exact |
| Zero citations, high confidence | Impossible by F6.4 — assert it in a test |

## Tests

- `test_use_sse_stream_is_byte_identical_to_week_4` ← the architectural assertion
- `test_refusal_renders_no_answer_text`
- `test_citation_chip_links_to_the_exact_span`
- `test_broken_citation_is_visible_not_hidden`
- `test_components_do_not_import_from_weeks` (ESLint boundary rule)
- `test_retrieved_context_shows_scores_and_rank_delta`

## Acceptance criteria

- [ ] `git diff` on `hooks/useSSEStream.js` for this week is **empty**
- [ ] A refusal is visually unmistakable and shows its reasons
- [ ] Every citation chip resolves to an exact character span in a real source
- [ ] `RetrievedContext` shows the five packed chunks with scores
- [ ] `CitationChip` and `ConfidenceMeter` live in `components/`, ready for W12
