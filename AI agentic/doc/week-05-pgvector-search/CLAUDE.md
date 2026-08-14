# Week 5 — pgvector Semantic Search

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Embed a document corpus, store it in Postgres with `pgvector`, and query it by meaning. **Retrieval
only — no generation.** Splitting retrieval from generation is deliberate: when a Week 6 RAG answer
is wrong, you need to already know whether retrieval or the model was at fault.

This is also where **Alembic becomes mandatory**: adding a vector column and an index to a populated
table is precisely the "schema change that must survive existing data" from
[ADR-009](../../TECH-STACK-DECISIONS.md).

## Features (5)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F5.1](F5.1-chunking-strategy/CLAUDE.md) | Chunking strategy | `aiplat/retrieval/chunking.py` | W1-F1.3 |
| [F5.2](F5.2-embeddings-batch-and-cache/CLAUDE.md) | Embeddings: batching + cache | `aiplat/retrieval/embeddings.py` | F5.1 |
| [F5.3](F5.3-pgvector-store-and-migration/CLAUDE.md) | pgvector store + Alembic | `aiplat/retrieval/store_pgvector.py` | F5.2 |
| [F5.4](F5.4-ingest-cli-and-search-endpoint/CLAUDE.md) | Ingest CLI + search endpoint + recall@k | `apps/w05_vector_search/` | F5.3 |
| [F5.5](F5.5-semantic-and-response-caching/CLAUDE.md) | Semantic + response caching | `aiplat/cache/` | F5.2 |

## Architecture flow

```
INGEST (offline CLI)                      QUERY (online)
  docs/                                     weeks/w05/SearchBox.jsx
    ▼                                            │ POST /api/w05/search  (plain JSON)
retrieval.chunking          (F5.1)               ▼
    ▼                                     retrieval.embeddings.embed(q)   (F5.2)
retrieval.embeddings        (F5.2)               ▼
  batched + cached                        store_pgvector.query()          (F5.3)
    ▼                                            ▼
store_pgvector.upsert()     (F5.3)        top-k chunks + SCORES — no LLM in this path
    ▼                                            ▼
PostgreSQL + pgvector                     ResultList + ScoreBar
agent_doc_chunks(embedding vector(N))
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── retrieval/{chunking.py, embeddings.py, store_pgvector.py}   ← NEW
│   └── db/models/doc_chunk.py                                      ← NEW  agent_doc_chunks
├── apps/w05_vector_search/{ingest.py, router.py, tests/}           ← NEW
└── infra/alembic/versions/0001_pgvector.py                         ← NEW  ⚠ REQUIRED
```

**Frontend**
```
└── src/weeks/
    ├── registry.js                                                 ← EDIT + w05
    └── w05/{SearchBox, ResultList, ScoreBar, IngestStatus}.jsx     ← NEW  no streaming
```

## Build order

1. **F5.1** chunking — everything downstream inherits the chunk boundary decision.
2. **F5.2** embeddings — batching and caching before ingesting anything at volume.
3. **F5.3** store + migration — Alembic *before* the first real ingest, not after.
4. **F5.4** CLI + endpoint + recall measurement.

## Week Definition of Done

- [ ] Alembic is set up and `0001_pgvector` applies cleanly to the existing database
- [ ] Re-ingesting the same document produces **no** duplicate chunks
- [ ] Embedding cache hit-rate is logged and visible in `IngestStatus`
- [ ] recall@k is **measured** on a fixed corpus and recorded in the app README
- [ ] Similarity scores are visible in the UI — hiding them makes bad recall undebuggable
- [ ] No LLM call exists anywhere in the query path this week
- [ ] `agent_doc_chunks` is prefixed and does not collide with the existing CMS schema

## What this week unlocks

Week 6 composes retrieval with generation. Because scores and recall are measured here first, a
wrong Week 6 answer can be diagnosed as *retrieval missed it* or *the model ignored it* — a
distinction that is nearly impossible to make if both land in the same week.
