# W6-F6.6 — Hybrid Retrieval: BM25 + Vector Fusion

> [Week 6](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/hybrid.py` (kernel)
**Depends on:** [F6.1](../F6.1-reranker-port/CLAUDE.md), [W5-F5.3](../../week-05-pgvector-search/F5.3-pgvector-store-and-migration/CLAUDE.md)
**Consumed by:** [F6.2](../F6.2-rag-pipeline-orchestration/CLAUDE.md), W12 evidence gathering

## Goal

Pure vector search has a specific, well-known blind spot: **exact tokens**. Error codes
(`ERR_5521`), function names (`retry_with_backoff`), version strings (`v2.14.3`), and product SKUs
are precisely the queries where embeddings are weakest and keyword search is trivially strong.

For an ops assistant (W12) searching logs and runbooks, that blind spot is not an edge case — it is
the majority of real queries.

## Contract (schema first)

```python
class RetrievalMode(str, Enum):
    VECTOR = "vector"; KEYWORD = "keyword"; HYBRID = "hybrid"

class HybridConfig(BaseModel):
    mode: RetrievalMode = RetrievalMode.HYBRID
    k_vector: int = 50
    k_keyword: int = 50
    fusion: Literal["rrf", "weighted"] = "rrf"    # Reciprocal Rank Fusion — scale-free
    rrf_k: int = 60
    vector_weight: float = 0.5                    # only used when fusion="weighted"
    auto_mode: bool = True                        # detect exact-token queries and lean keyword

class FusedHit(BaseModel):
    chunk: Chunk
    vector_rank: int | None           # None ⇒ this source did not find it
    keyword_rank: int | None
    fused_score: float
    found_by: list[Literal["vector","keyword"]]   # the diagnostic signal
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/retrieval/hybrid.py` | NEW | `query()`, RRF fusion, auto mode |
| `platform/src/aiplat/retrieval/keyword.py` | NEW | Postgres full-text search (`tsvector`) |
| `platform/src/aiplat/db/models/doc_chunk.py` | EDIT | add `tsv` column + GIN index |
| `infra/alembic/versions/0003_fulltext.py` | NEW | the migration |
| `apps/w06_rag_pipeline/eval/precision.py` | EDIT | add hybrid to the comparison |

## Flow

```
query
   ▼
auto_mode: does the query contain exact-token signals?
   (quoted phrases, ALL_CAPS codes, snake_case, semver, hex ids, stack-trace lines)
   yes ──► keyword weight raised     no ──► balanced
   ▼
run BOTH concurrently (asyncio.gather — W7-F7.4 semantics)
   ├─ vector:  store_pgvector.query(k_vector)     W5-F5.3
   └─ keyword: tsvector @@ plainto_tsquery(k_keyword)
   ▼
RRF fusion:  score(d) = Σ 1 / (rrf_k + rank_i(d))
   ← rank-based, so it needs NO score normalisation between two incomparable scales
   ▼
FusedHit[] with found_by ──► rerank (F6.1) ──► pipeline (F6.2)
```

## Rules

- **Use RRF, not weighted score blending.** Cosine similarity and BM25 scores live on different,
  non-comparable scales; blending them requires normalisation constants that are wrong the moment
  the corpus changes. RRF operates on **ranks**, so it is scale-free and needs no tuning.
- **`found_by` is the diagnostic that justifies the whole feature.** Chunks found by keyword only
  are the exact-token cases vector search missed. If that set is consistently empty, hybrid is a tax
  — delete it (the W10-F10.4 discipline applies to retrieval too).
- **Both sources run concurrently.** Serial hybrid doubles latency for a precision gain that is not
  worth doubled latency.
- **`auto_mode` detects exact-token queries** — quoted strings, `ERR_5521`, `snake_case`, semver,
  hex ids. These are the queries where keyword should dominate, and detecting them is cheap
  deterministic code, not a model call.
- **Measure hybrid against vector-only and keyword-only** on W5's labelled set, same as F6.1's
  strategies. Adopt it on the number, not the intuition.
- Keyword search is **Postgres full-text**, not a second datastore. Adding Elasticsearch for this
  would be exactly the premature distribution [architecture §11](../../../CLAUDE-12-WEEK.md) warns
  against.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Query is a bare error code | `auto_mode` raises keyword weight; the exact chunk ranks first |
| Query is conceptual ("why is it slow") | Vector dominates; keyword adds little and costs little |
| One source returns nothing | Fusion proceeds with the other; `found_by` records it |
| Both sources return nothing | Empty → refusal (F6.4), not a padded result |
| `tsvector` index missing | Migration check at startup; keyword degrades to vector-only with a log |
| Non-English content | Text search config per corpus; recorded, not assumed |
| Fusion always favours one source | Caught by the precision comparison — hybrid is then a deletion candidate |

## Tests

- `test_exact_error_code_query_ranks_the_right_chunk_first` ← the reason this exists
- `test_rrf_requires_no_score_normalisation`
- `test_both_sources_query_concurrently`
- `test_found_by_records_keyword_only_discoveries`
- `test_precision_at_5_measured_for_vector_keyword_and_hybrid`
- `test_missing_fulltext_index_degrades_to_vector_only`

## Acceptance criteria

- [ ] precision@5 recorded for vector-only, keyword-only and hybrid on the same labelled set
- [ ] Exact-token queries (error codes, function names) retrieve correctly — with a test proving it
- [ ] `found_by` shows a non-trivial keyword-only set, or hybrid is deleted
- [ ] Fusion is rank-based; no normalisation constants exist in the code
- [ ] Both retrievers run concurrently; latency is close to the slower of the two
