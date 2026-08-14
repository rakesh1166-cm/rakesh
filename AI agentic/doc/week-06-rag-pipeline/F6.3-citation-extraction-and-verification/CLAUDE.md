# W6-F6.3 — Citation Extraction + Verification

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/citations.py` (kernel)
**Depends on:** [F6.2](../F6.2-rag-pipeline-orchestration/CLAUDE.md)
**Consumed by:** [F6.4](../F6.4-confidence-scoring-and-refusal/CLAUDE.md), W12 fix proposals

## Goal

**No claim without a source.** Map every factual sentence in an answer back to the chunk that
supports it, then *verify* the mapping rather than trusting the model's own citation markers — a
model that invents facts will happily invent the citation next to them.

## Contract (schema first)

```python
class Claim(BaseModel):
    text: str
    sentence_index: int
    cited_chunk_ids: list[str]        # what the MODEL claimed
    verified_chunk_ids: list[str]     # what actually SUPPORTS it — the difference is the signal
    support: Literal["supported", "partial", "unsupported"]

class CitationReport(BaseModel):
    claims: list[Claim]
    coverage: float                   # supported / total factual claims
    unsupported: list[int]            # sentence indices — the actionable part
    fabricated_refs: list[str]        # cited chunk ids that were never in the context pack
```

Answer markers use `[c1]`, `[c2]` … mapped positionally to `ContextPack.chunks`.

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/retrieval/citations.py` | NEW | extract markers, verify support, score coverage |
| `platform/src/aiplat/prompts/templates/rag_answer/v1.md` | EDIT | require `[cN]` markers per factual sentence |
| `platform/src/aiplat/prompts/templates/citation_check/v1.md` | NEW | entailment check prompt |

## Flow

```
Answer text with [cN] markers  +  ContextPack
      ▼
1. split into sentences; classify factual vs. connective ("Here is a summary." is not a claim)
      ▼
2. extract cited_chunk_ids from markers
      ├─ marker points outside the pack  ──► fabricated_refs  ⚠ a hard failure signal
      ▼
3. VERIFY: does the cited chunk actually support the sentence?
      ├─ cheap path: lexical/semantic overlap threshold
      └─ strict path: entailment check via llm.complete (citation_check/v1)
      ▼
Claim{support} per sentence  ──► coverage  ──► confidence (F6.4)
```

## Rules

- **Verify; do not trust the markers.** The model citing `[c3]` is a claim about a claim. An
  unverified citation is decoration, and decoration is worse than nothing because it looks like
  rigour.
- **`fabricated_refs` is a hard signal.** A citation pointing at a chunk that was never in the
  context pack means the model is generating references. Confidence must collapse, not degrade.
- **Distinguish factual claims from connective text.** Scoring "In summary:" as unsupported drags
  coverage down for no reason and trains you to ignore the metric.
- Verification runs on the **exact packed chunks** — the same objects the model saw, not a re-query.
  Re-querying introduces a different corpus view and makes the check meaningless.
- The strict entailment path costs tokens. Make it configurable, default to strict on
  `WRITE_EXTERNAL`-adjacent flows (W12), cheap elsewhere — and record which path ran.
- `unsupported[]` is the deliverable. A coverage percentage without the failing sentences is not
  actionable.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model cites `[c9]` with 5 chunks packed | `fabricated_refs=["c9"]`; confidence collapses (F6.4) |
| Model omits all markers | Every factual claim `unsupported`; coverage 0 → refusal |
| Answer is entirely connective text | Coverage undefined, not 0 — handled explicitly, not by division |
| Chunk supports a *different* claim than cited | `partial`; verification catches what markers hide |
| Entailment checker unavailable | Fall back to the lexical path, record which path ran |
| Answer in a different language than the chunk | Semantic path used; lexical overlap alone would misfire |

## Tests

- `test_fabricated_citation_is_detected` ← the core test of this feature
- `test_unmarked_factual_claims_count_as_unsupported`
- `test_connective_sentences_are_excluded_from_coverage`
- `test_verification_uses_the_packed_chunks_not_a_requery`
- `test_coverage_is_undefined_not_zero_for_a_pure_refusal`
- `test_entailment_fallback_is_recorded`

## Acceptance criteria

- [ ] A deliberately fabricated citation is caught in every test case
- [ ] `coverage` counts only factual claims
- [ ] `unsupported[]` names sentence indices, not just a percentage
- [ ] Verification never re-queries the store — it uses the exact packed chunks
- [ ] Which verification path ran is recorded on every request
