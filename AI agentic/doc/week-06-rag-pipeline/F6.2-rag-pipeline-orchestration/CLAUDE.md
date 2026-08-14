# W6-F6.2 — RAG Pipeline Orchestration

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w06_rag_pipeline/pipeline.py` (thin app)
**Depends on:** [F6.1](../F6.1-reranker-port/CLAUDE.md)
**Consumed by:** [F6.3](../F6.3-citation-extraction-and-verification/CLAUDE.md), W12 evidence gathering

## Goal

Compose retrieval and generation into one traceable path where **every stage is separately
measurable**. When an answer is wrong, the pipeline must make it obvious which stage failed —
retrieval missed it, reranking demoted it, packing truncated it, or the model ignored it.

## Contract (schema first)

```python
class RagRequest(BaseModel):
    question: str = Field(min_length=3, max_length=1000)
    doc_ids: list[str] | None = None
    k_retrieve: int = Field(50, ge=5, le=100)
    k_context: int = Field(5, ge=1, le=20)

class ContextPack(BaseModel):
    chunks: list[RerankedHit]
    total_tokens: int
    dropped_for_budget: list[str]     # chunk ids that did NOT fit — never silent

class Answer(BaseModel):
    text: str
    citations: list[Citation]         # aiplat/schemas/common.py — kernel (W4)
    confidence: Confidence
    refused: bool = False
    refusal_reason: str | None = None

class RagTrace(BaseModel):
    """Emitted on every request. The whole point of the feature."""
    retrieve_ms: float; retrieved: int
    rerank_ms: float; rerank_strategy: RerankStrategy
    context_tokens: int; dropped: int
    llm_ms: float; usage: Usage
    citation_coverage: float
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w06_rag_pipeline/pipeline.py` | NEW | the six stages + `RagTrace` |
| `apps/w06_rag_pipeline/schemas.py` | NEW | `RagRequest`, `Answer`, `ContextPack` |
| `apps/w06_rag_pipeline/router.py` | NEW | `POST /api/w06/ask` (SSE) |
| `platform/src/aiplat/prompts/templates/rag_answer/v1.md` | NEW | the answer prompt |
| `platform/src/aiplat/schemas/common.py` | EDIT | `Citation` confirmed as kernel — second use |

## Flow

```
RagRequest
  1. store_pgvector.query(k_retrieve)     → SearchHit[50]      (W5-F5.3)
  2. rerank(top_n=k_context)              → RerankedHit[5]     (F6.1)
  3. pack under budget (W1-F1.3)          → ContextPack{dropped_for_budget[]}
  4. render rag_answer/v1 (W3-F3.2)       ← context = ONLY the packed chunks
  5. llm.streaming (W4-F4.5)              → token events
  6. citations.verify (F6.3) + confidence (F6.4)
       ▼
  data(Answer) → done                     + RagTrace logged with the correlation ID
```

## Rules

- **The model sees only the packed chunks.** No "and here's the whole document just in case" — that
  destroys the ability to attribute an answer to a source, and blows the budget.
- **`dropped_for_budget` is mandatory.** Silent truncation is how the chunk holding the answer
  disappears while the pipeline reports success.
- **`RagTrace` on every request.** Per-stage timings and counts are what make a wrong answer
  diagnosable instead of mysterious.
- The prompt is **versioned** (W3-F3.1) and pinned. RAG prompts drift more than most because they
  are edited whenever an answer looks off — the version gate is what keeps that honest.
- The pipeline is **deterministic given its inputs**: same chunks, same prompt version,
  `temperature=0` ⇒ same answer. Non-determinism here makes W11's eval suite meaningless.
- `Citation` moves to `aiplat/schemas/common.py` **now** — W4 wrote it, W6 is the second consumer,
  the second-use rule fires ([architecture §8](../../../CLAUDE-12-WEEK.md)).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Retrieval returns nothing | Skip generation entirely; refuse (F6.4). Do **not** ask the model anyway |
| All chunks are low-score | Proceed but with low confidence, likely refusal |
| Context exceeds budget | Drop lowest-ranked chunks, record ids in `dropped_for_budget` |
| One chunk alone exceeds budget | Truncate it, record it, never silently drop the whole chunk |
| LLM fails mid-stream | `error` + `done` (W4-F4.5); `RagTrace` still logged |
| Model answers ignoring context | Caught by citation coverage (F6.3) → confidence collapses |

## Tests

- `test_empty_retrieval_skips_the_llm_call_entirely`
- `test_dropped_chunks_are_reported_not_silent`
- `test_pipeline_is_deterministic_at_temperature_zero`
- `test_rag_trace_is_emitted_on_every_path_including_failure`
- `test_only_packed_chunks_appear_in_the_rendered_prompt`
- `test_prompt_version_is_pinned_not_latest`

## Acceptance criteria

- [ ] `RagTrace` is logged for every request with per-stage timings
- [ ] Empty retrieval never results in an LLM call
- [ ] `dropped_for_budget` is populated whenever packing truncates
- [ ] The rendered prompt provably contains only the packed chunks
- [ ] Same inputs at `temperature=0` produce the same answer across runs
