# W5-F5.4 — Ingest CLI, Search Endpoint, recall@k

> [Week 5](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w05_vector_search/` + `frontend/src/weeks/w05/`
**Depends on:** [F5.3](../F5.3-pgvector-store-and-migration/CLAUDE.md)
**Consumed by:** W6 (this is the retrieval half of RAG), W12 (evidence gathering)

## Goal

Make retrieval **operable and measurable**: an idempotent ingest CLI, a plain search endpoint, and a
recorded recall@k number. Without a recall baseline, every Week 6 quality argument is guesswork.

## Contract (schema first)

```python
class IngestReport(BaseModel):
    docs_seen: int; chunks_written: int; chunks_unchanged: int
    tokens_billed: int; cache_hit_rate: float
    duration_s: float; config: ChunkConfig

class SearchIn(BaseModel):
    q: str = Field(min_length=2, max_length=1000)
    k: int = Field(10, ge=1, le=50)
    doc_ids: list[str] | None = None

class SearchOut(BaseModel):
    hits: list[SearchHit]          # score VISIBLE — this is a debugging surface
    query_embed_ms: float
    search_ms: float

class RecallReport(BaseModel):
    corpus: str; config: ChunkConfig
    k: int; recall_at_k: float
    queries_evaluated: int
    misses: list[str]              # the queries that failed — the actionable part
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w05_vector_search/ingest.py` | NEW | CLI: corpus → chunks → embeddings → pgvector |
| `apps/w05_vector_search/router.py` | NEW | `POST /api/w05/search`, `GET /api/w05/stats` |
| `apps/w05_vector_search/eval/recall.py` | NEW | recall@k over a labelled query set |
| `apps/w05_vector_search/eval/queries.yaml` | NEW | ≥30 queries with known-correct chunk IDs |
| `apps/w05_vector_search/README.md` | NEW | **the recall table** — measured, per config |
| `frontend/src/weeks/w05/{SearchBox,ResultList,ScoreBar,IngestStatus}.jsx` | NEW | UI |

## Flow

```
$ python -m apps.w05_vector_search.ingest --path docs/ --config default
    chunking (F5.1) → embed (F5.2) → upsert (F5.3) → IngestReport

$ python -m apps.w05_vector_search.eval.recall --k 10
    for each labelled query: search → is the known-correct chunk in top-k?
    → RecallReport{recall_at_k, misses[]} → README table

POST /api/w05/search  → SearchOut{hits with scores, timings}
    → ResultList + ScoreBar    (plain JSON — deliberately NOT streaming)
```

## Rules

- **No streaming this week.** Nothing generates; SSE would be theatre. Streaming arrives in W6
  where there is actually a token stream to show.
- **Scores are visible in the UI.** Hiding them makes bad recall undebuggable by eye — you cannot
  tell "the right chunk ranked 11th" from "the right chunk isn't in the corpus" without them.
- **`misses[]` is the deliverable of the recall report**, not the headline percentage. "recall@10 =
  0.82" is a number; the 18% that failed is the work.
- Ingest is **resumable and idempotent**: interrupting it and re-running must not duplicate or
  re-bill. This is `content_hash` (F5.1) and `ON CONFLICT` (F5.3) paying off.
- Measure **at least two** `ChunkConfig` variants and record both. The winner goes in the README
  with its number — that is what W6 builds on.
- `k` is capped at 50. An unbounded `k` is a memory and cost hazard, and by W6 it is a context
  hazard too.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Ingest interrupted at 60% | Re-run resumes; already-written chunks are skipped, not re-billed |
| Query with no good match | Empty or low-score hits returned honestly — never a padded top-k |
| Corpus not yet ingested | `/search` returns a typed "empty index" error, not zero results |
| Embedding provider down at query time | `UPSTREAM_UNAVAILABLE` envelope; the UI shows it |
| `k` larger than the corpus | Returns what exists; no error |
| Recall run with no labelled set | Refuses to report a number |

## Tests

- `test_interrupted_ingest_resumes_without_duplicates`
- `test_search_on_empty_index_returns_typed_error`
- `test_low_relevance_query_returns_low_scores_not_padding`
- `test_recall_report_lists_misses`
- `test_k_is_capped`
- `test_search_ui_displays_scores` (frontend snapshot)

## Acceptance criteria

- [ ] `README.md` has a recall@k table for ≥2 chunk configs, with real numbers
- [ ] Re-running ingest on an unchanged corpus bills ~0 tokens and writes 0 rows
- [ ] `SearchOut` exposes per-hit scores and separate embed/search timings
- [ ] `misses[]` from the recall run is recorded and reviewed
- [ ] The chosen `ChunkConfig` is documented with the number that justified it
