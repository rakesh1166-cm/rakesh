# Week 5 — Theory

> Written **before** Week 5's code. Revisited after. · [Week 5](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #14 Vector Database · #9 Embeddings *(deeper than Week 1)*
> Note the ladder puts RAG (#13) *before* vector databases (#14). That ordering is backwards, and
> this week is why — you cannot build retrieval-augmented generation without retrieval.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 14 | **Vector database** | _(fill in)_ | [F5.3](F5.3-pgvector-store-and-migration/CLAUDE.md) — pgvector in the Postgres you already run. Why a separate datastore would be premature |
| 9 | **Embeddings** *(deeper)* | _(fill in)_ | [F5.2](F5.2-embeddings-batch-and-cache/CLAUDE.md) — vectors from different models are **not comparable**, which is why `model_id` is in every cache key |
| — | **Chunking** | _(fill in)_ | [F5.1](F5.1-chunking-strategy/CLAUDE.md) — the decision everything downstream inherits. No reranker recovers a bad boundary |
| — | **ANN indexes (ivfflat)** | _(fill in)_ | [F5.3](F5.3-pgvector-store-and-migration/CLAUDE.md) — *approximate* nearest neighbour, and why index quality depends on the data present at build time |
| — | **Cosine distance vs similarity** | _(fill in)_ | [F5.3](F5.3-pgvector-store-and-migration/CLAUDE.md) — `<=>` returns **distance**; callers want similarity. Get it backwards and everything ranks inverted |

### Study prompts

- Why is it "approximate" nearest neighbour? What are you trading, and for what?
- You re-ingest the same corpus twice. What stops the row count doubling?
- A chunk reads "Run the rollback script." Useful in isolation? What does `heading_path` fix?
- You switch embedding models. What in the database is now wrong, and how would you *detect* it
  rather than discover it?
- recall@10 = 0.82. Which number is the actual work — the 0.82 or the 18%?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| recall@10 with 512-token chunks | _(guess)_ | _(after)_ |
| recall@10 with a different chunk config | _(guess)_ | _(after)_ |
| Embedding cache hit rate on re-ingest | _(guess)_ | _(after)_ |
| Query latency, p95 | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 4](../week-04-holidaylandmarks/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Which chunk config won, and by how much?** _(after — this number is what Week 6 builds on)_
**New questions:** _(after — carry into [Week 6](../week-06-rag-pipeline/THEORY.md))_
