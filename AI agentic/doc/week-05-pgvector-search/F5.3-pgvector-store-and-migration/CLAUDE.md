# W5-F5.3 — pgvector Store + Alembic Migration

> [Week 5](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/store_pgvector.py` + `infra/alembic/`
**Depends on:** [F5.2](../F5.2-embeddings-batch-and-cache/CLAUDE.md)
**Consumed by:** [F5.4](../F5.4-ingest-cli-and-search-endpoint/CLAUDE.md), W6 retrieval, W12 evidence gathering

## Goal

Store chunk vectors in the existing PostgreSQL 16 instance and query them by approximate nearest
neighbour. **This is where Alembic becomes mandatory** — `create_all` cannot add a vector index to
a table that already holds data ([ADR-009](../../../TECH-STACK-DECISIONS.md)).

## Contract (schema first)

```python
# aiplat/db/models/doc_chunk.py  → table agent_doc_chunks
#   id            uuid pk
#   doc_id        text        (indexed)
#   chunk_index   int
#   content_hash  text        UNIQUE(doc_id, content_hash)   ← idempotent re-ingest
#   text          text
#   heading_path  text[]
#   char_start    int
#   char_end      int
#   embedding     vector(N)   N = EmbeddingModelSpec.dimensions
#   embed_model   text        ← which model produced this vector; a mismatch must be detectable
#   token_count   int
#   created_at    timestamptz

class SearchHit(BaseModel):
    chunk: Chunk
    score: float = Field(ge=0, le=1)      # normalized similarity, NOT raw distance
    rank: int

class SearchQuery(BaseModel):
    text: str = Field(min_length=2, max_length=1000)
    k: int = Field(10, ge=1, le=100)
    doc_ids: list[str] | None = None      # scope filter
    min_score: float | None = None

async def upsert(chunks: list[Chunk], vectors: list[list[float]]) -> int
async def query(q: SearchQuery) -> list[SearchHit]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/db/models/doc_chunk.py` | NEW | the ORM table |
| `platform/src/aiplat/retrieval/store_pgvector.py` | NEW | `upsert`, `query`, index management |
| `infra/alembic/env.py` · `alembic.ini` | NEW | migration setup |
| `infra/alembic/versions/0001_pgvector.py` | NEW | `CREATE EXTENSION vector` + table + ivfflat index |

## Flow

```
INGEST                                    QUERY
chunks + vectors (F5.1, F5.2)             SearchQuery{text, k, filters}
      ▼                                        ▼
ON CONFLICT (doc_id, content_hash)        embed(text, purpose="query")   (F5.2)
DO UPDATE                                      ▼
      ▼                                   SELECT ... ORDER BY embedding <=> $1 LIMIT k
agent_doc_chunks                          + WHERE doc_id = ANY(...)  when scoped
      ▼                                        ▼
(re-index after bulk load —               cosine distance → normalized score → SearchHit
 ivfflat quality depends on the                ▼
 data present when it is built)           rank assigned; scores returned to the caller
```

## Rules

- **Alembic from this migration onward.** `Base.metadata.create_all` stays only for local
  bootstrapping of an empty database ([ADR-009](../../../TECH-STACK-DECISIONS.md)).
- **`agent_` prefix.** The `holidaylandmark` database holds an unrelated CMS schema; collisions are
  a real risk, not a hypothetical.
- **Store `embed_model` on every row.** A query embedded with model B against rows embedded with
  model A returns plausible garbage. The store must be able to *detect* the mismatch and refuse.
- **Return a normalized score, not raw distance.** `<=>` returns cosine distance; the caller wants
  similarity. Leaking the raw operator output means every consumer re-derives the conversion, and
  one of them gets it backwards.
- **Build the ivfflat index after bulk load.** Its quality depends on the data present at build
  time; indexing an empty table then loading gives poor recall that looks like a chunking problem.
- `UNIQUE(doc_id, content_hash)` is what makes re-ingest idempotent — the constraint enforces it,
  not application logic.
- Keep DB sessions short. The query path here is a fast indexed lookup, which is why sync
  SQLAlchemy in the threadpool is appropriate; never hold one across an embedding call.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| `pgvector` extension missing | Migration fails with a clear message, not a cryptic type error |
| Query vector dimension ≠ column | Rejected with a named error before hitting Postgres |
| Row embedded by a different model | `query` refuses or filters, and says which model mismatched |
| Same chunk ingested twice | `ON CONFLICT` updates; row count unchanged |
| Index built on an empty table | Detected by the recall test in F5.4 |
| Migration run on the CMS schema | `agent_` prefix means no collision; asserted in a test |

## Tests

- `test_migration_applies_to_a_database_containing_the_cms_schema`
- `test_reingest_does_not_increase_row_count`
- `test_dimension_mismatch_is_rejected_with_a_named_error`
- `test_rows_from_a_different_embed_model_are_not_silently_mixed`
- `test_score_is_similarity_not_distance` — identical text scores ≈1.0, not ≈0.0
- `test_doc_id_filter_scopes_results`

## Acceptance criteria

- [ ] `alembic upgrade head` applies cleanly to the existing `holidaylandmark` database
- [ ] Re-ingesting an unchanged corpus leaves the row count identical
- [ ] `SearchHit.score` is similarity in `[0,1]`, verified by an identity query
- [ ] `embed_model` is stored and checked on every query
- [ ] The ivfflat index is built after bulk load, and recall (F5.4) confirms it
