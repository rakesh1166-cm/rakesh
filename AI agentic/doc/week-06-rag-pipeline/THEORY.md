# Week 6 — Theory

> Written **before** Week 6's code. Revisited after. · [Week 6](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #13 RAG
> Everything else below is what "RAG" actually decomposes into once you need it to be *correct*
> rather than to demo.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 13 | **RAG** | _(fill in)_ | [F6.2](F6.2-rag-pipeline-orchestration/CLAUDE.md) — retrieve → rerank → pack → generate, with every stage separately measurable |
| — | **Recall vs precision** | _(fill in)_ | [F6.1](F6.1-reranker-port/CLAUDE.md) — vector search optimises recall (k=50), reranking optimises precision (top-5) |
| — | **Reranking** | _(fill in)_ | [F6.1](F6.1-reranker-port/CLAUDE.md) — where most RAG quality lives. `NONE` is a first-class strategy so you can prove it helps |
| — | **Grounding & citations** | _(fill in)_ | [F6.3](F6.3-citation-extraction-and-verification/CLAUDE.md) — the model's own `[c3]` marker is a claim about a claim. Verify it |
| — | **Calibrated refusal** | _(fill in)_ | [F6.4](F6.4-confidence-scoring-and-refusal/CLAUDE.md) — a system that always answers hallucinates on questions its corpus can't support |
| — | **Hybrid retrieval (BM25 + vector)** | _(fill in)_ | [F6.6](F6.6-hybrid-retrieval-bm25-and-vector/CLAUDE.md) — embeddings are weakest on exact tokens: `ERR_5521`, `snake_case`, semver |

### Study prompts

- Why cast a wide net at k=50 then cut to 5, instead of just retrieving 5?
- The model cites `[c9]` but only 5 chunks were packed. What just happened, and what should
  confidence do? (Not "decrease" — read [F6.4](F6.4-confidence-scoring-and-refusal/CLAUDE.md).)
- Search for `ERR_5521`. Why might a pure vector search miss it entirely?
- Nothing relevant was retrieved. Should you call the model anyway? Justify the cost either way.
- What's the difference between a low-confidence answer and a refusal, *to the user*?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| precision@5 — no rerank vs cross-encoder vs LLM judge | _(guess)_ | _(after)_ |
| Chunks found by keyword only (hybrid's justification) | _(guess)_ | _(after)_ |
| Citation coverage on a typical answer | _(guess)_ | _(after)_ |
| False-refusal rate on the calibration set | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 5](../week-05-pgvector-search/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Did `useSSEStream` need any change?** If yes, the Week 4 event contract was wrong — say how. _(after)_
**New questions:** _(after — carry into [Week 7](../week-07-tool-agent/THEORY.md))_
