# W6-F6.1 — Reranker Behind a Port

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/rerank.py` (kernel)
**Depends on:** [W5-F5.4](../../week-05-pgvector-search/F5.4-ingest-cli-and-search-endpoint/CLAUDE.md)
**Consumed by:** [F6.2](../F6.2-rag-pipeline-orchestration/CLAUDE.md), W12 evidence gathering

## Goal

Vector search optimises for **recall** — cast a wide net at k=50. Reranking optimises for
**precision** — pick the 5 that actually answer the question. Almost all RAG quality lives in this
step, and it must sit behind a port so the strategy can be swapped on evidence rather than taste.

## Contract (schema first)

```python
class RerankStrategy(str, Enum):
    NONE          = "none"          # passthrough baseline — REQUIRED for comparison
    CROSS_ENCODER = "cross_encoder" # local model, cheap, fast
    LLM_JUDGE     = "llm_judge"     # accurate, costly, slow

class RerankRequest(BaseModel):
    query: str
    hits: list[SearchHit] = Field(max_length=100)
    top_n: int = Field(5, ge=1, le=20)

class RerankedHit(BaseModel):
    chunk: Chunk
    retrieval_score: float          # from W5 — KEPT, not overwritten
    rerank_score: float
    rank: int
    rank_delta: int                 # movement vs retrieval order; the diagnostic signal

class RerankResult(BaseModel):
    hits: list[RerankedHit]
    strategy: RerankStrategy
    duration_ms: float
    cost_usd: float                 # non-zero for LLM_JUDGE — precision is not free

class RerankPort(Protocol):
    strategy: RerankStrategy
    async def rerank(self, req: RerankRequest) -> RerankResult: ...
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/retrieval/rerank.py` | NEW | `RerankPort`, the strategies, selection |
| `platform/src/aiplat/prompts/templates/rerank_judge/v1.md` | NEW | LLM-judge prompt (versioned) |
| `apps/w06_rag_pipeline/eval/precision.py` | NEW | precision@5 per strategy — the comparison |

## Flow

```
SearchHit[50]  (W5, recall-optimised)
      ▼
RerankPort.rerank(query, hits, top_n=5)
   NONE          → first 5 by retrieval score          ← the baseline you must beat
   CROSS_ENCODER → score each (query, chunk) pair locally
   LLM_JUDGE     → batched relevance scoring via llm.complete (versioned prompt)
      ▼
RerankedHit[5] with BOTH scores + rank_delta
      ▼
pipeline (F6.2) packs only these into the prompt context
```

## Rules

- **`NONE` is a first-class strategy.** Without a passthrough baseline you cannot claim reranking
  helped. Measure precision@5 for every strategy on the same labelled query set (W5-F5.4's
  `queries.yaml`) and record the numbers.
- **Keep `retrieval_score`.** Overwriting it destroys the ability to diagnose whether a bad answer
  came from retrieval missing the chunk or reranking demoting it.
- **`rank_delta` is the diagnostic.** Large positive movement means reranking is earning its cost;
  near-zero movement across a corpus means it is a tax with no benefit — delete it.
- `LLM_JUDGE` scores in **batches**, never one call per candidate. 50 sequential calls is a latency
  and cost disaster.
- Reranking is a **kernel** capability, not a W6 app detail — W12 gathers evidence through it.
- If a strategy fails, **fall back to `NONE`** and record it. A degraded answer beats no answer;
  silent degradation does not.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Reranker unavailable | Fall back to `NONE`, set `strategy` accordingly, log it |
| LLM judge returns malformed scores | That candidate keeps its retrieval rank; no crash |
| `hits` empty | Empty result — the pipeline refuses downstream (F6.4), not here |
| `top_n` > `len(hits)` | Return what exists |
| Judge cost exceeds the request budget | Truncate to the top-N by retrieval score and record it |
| Reranker inverts good ordering | Caught by the precision@5 comparison against `NONE` |

## Tests

- `test_none_strategy_is_available_and_measured`
- `test_retrieval_score_is_preserved_after_reranking`
- `test_llm_judge_batches_instead_of_per_candidate_calls`
- `test_reranker_failure_falls_back_to_none_and_records_it`
- `test_rank_delta_is_computed_correctly`
- `test_precision_at_5_is_measured_per_strategy` — the deliverable

## Acceptance criteria

- [ ] precision@5 recorded for all three strategies on the same labelled query set
- [ ] The chosen strategy is justified by a number, not a preference
- [ ] `retrieval_score` and `rerank_score` are both present on every hit
- [ ] Reranker failure degrades to `NONE` and is visible in logs and in `RerankResult.strategy`
- [ ] `LLM_JUDGE` cost is recorded under its own `component`
