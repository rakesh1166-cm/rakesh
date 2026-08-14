# W5-F5.2 — Embeddings: Batching + Cache

> [Week 5](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/embeddings.py` (kernel)
**Depends on:** [F5.1](../F5.1-chunking-strategy/CLAUDE.md)
**Consumed by:** [F5.3](../F5.3-pgvector-store-and-migration/CLAUDE.md), every W6 query

## Goal

Embedding calls are the **cost driver** of retrieval — one per chunk at ingest, one per query
forever after. Batching and caching are not optimisations here; they are the difference between a
corpus you can re-ingest freely and one you are afraid to touch.

## Contract (schema first)

```python
class EmbeddingModelSpec(BaseModel):
    model_id: str
    dimensions: int                  # the pgvector column width — changing it is a migration
    max_batch: int = 96
    max_input_tokens: int = 8192
    cost_per_mtok: float

class EmbedRequest(BaseModel):
    texts: list[str] = Field(min_length=1)
    purpose: Literal["document", "query"]   # some models embed queries differently

class EmbedResult(BaseModel):
    vectors: list[list[float]]
    model_id: str
    dimensions: int
    cache_hits: int
    tokens_billed: int               # billed only for MISSES

async def embed(req: EmbedRequest) -> EmbedResult
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/retrieval/embeddings.py` | NEW | batching, cache, provider call |
| `platform/src/aiplat/config/models.py` | EDIT | add `EMBEDDING_MODELS` registry |

## Flow

```
EmbedRequest{texts, purpose}
      ▼
cache key = sha256(model_id + purpose + text)          ← model_id in the key is essential
      ▼
partition into hits / misses
      ▼
misses → chunks of max_batch → resilience.call(provider, retry=idempotent) (W2-F2.4)
      ▼
reassemble IN THE ORIGINAL ORDER                        ← the classic batching bug
      ▼
cache misses (Redis, no TTL — embeddings for fixed text never change)
      ▼
EmbedResult{vectors, cache_hits, tokens_billed}  → cost.record(component="retrieval.embed")
```

## Rules

- **`model_id` is part of the cache key.** Vectors from different models are not comparable;
  a key without it silently mixes vector spaces and destroys recall in a way that looks like a
  ranking bug.
- **Order preservation is the batching hazard.** Partitioning into hits and misses and reassembling
  is where vectors get attached to the wrong chunks — and it produces plausible-looking wrong
  results rather than an error. Test it explicitly.
- **Embedding cache has no TTL.** The embedding of fixed text under a fixed model never changes.
- `purpose` is passed through because some providers embed queries and documents asymmetrically.
  Getting this wrong costs recall silently.
- **`dimensions` is a migration boundary.** Changing embedding model changes the pgvector column
  width and invalidates the entire corpus. Record the model in the store (F5.3) so a mismatch is
  detectable rather than mysterious.
- Batch failures fall back to **per-item** retries: one bad input must not fail 95 good ones.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| One text in a batch is oversized | That item fails alone; the rest succeed |
| Provider rate limits mid-ingest | Backoff (W2-F2.4); ingest resumes; already-cached work not redone |
| Cache returns a vector of the wrong dimension | Detected and treated as a miss, not stored |
| Model changed but cache not cleared | `model_id` in the key means no stale hit is possible |
| Empty string input | Rejected before the call — an embedding of "" is meaningless |
| Redis down | Degrade to no-cache; ingest is slower and costlier but still correct |

## Tests

- `test_batch_reassembly_preserves_order` — mixed hits/misses, assert vector↔text pairing
- `test_model_id_is_part_of_the_cache_key`
- `test_oversized_item_fails_alone_within_a_batch`
- `test_tokens_billed_counts_misses_only`
- `test_dimension_mismatch_from_cache_is_rejected`
- `test_ingest_works_with_redis_down`

## Acceptance criteria

- [ ] Re-embedding an unchanged corpus bills ~0 tokens
- [ ] Cache hit-rate logged per ingest run and surfaced in `IngestStatus`
- [ ] Order-preservation test passes with a deliberately shuffled hit/miss mix
- [ ] Switching embedding models cannot produce a stale cache hit
- [ ] Embedding cost is recorded under its own `component` for W11 attribution
