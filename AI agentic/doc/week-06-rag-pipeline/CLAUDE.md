# Week 6 — Full RAG Pipeline

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Compose Week 5's retrieval with generation: **retrieve → rerank → answer with citations and
confidence**. The governing rule is *no claim without a source* — and when the corpus does not
support an answer, the system **refuses** rather than fills the gap.

Two things get proven this week, both about Week 4's design:
`useSSEStream` is reused with **zero changes** (the event contract was right), and `Citation`
moves to the kernel on its **second** consumer (the second-use rule, working as intended).

## Features (6)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F6.1](F6.1-reranker-port/CLAUDE.md) | Reranker behind a port | `aiplat/retrieval/rerank.py` | W5-F5.4 |
| [F6.6](F6.6-hybrid-retrieval-bm25-and-vector/CLAUDE.md) | Hybrid retrieval: BM25 + vector fusion | `aiplat/retrieval/hybrid.py` | F6.1, W5-F5.3 |
| [F6.2](F6.2-rag-pipeline-orchestration/CLAUDE.md) | Pipeline: retrieve → rerank → pack → answer | `apps/w06_rag_pipeline/` | F6.1 |
| [F6.3](F6.3-citation-extraction-and-verification/CLAUDE.md) | Claim → chunk mapping, verified | `aiplat/retrieval/citations.py` | F6.2 |
| [F6.4](F6.4-confidence-scoring-and-refusal/CLAUDE.md) | Confidence + refusal threshold | `apps/w06_rag_pipeline/confidence.py` | F6.3 |
| [F6.5](F6.5-answer-ui-with-citations/CLAUDE.md) | Answer UI, citation chips, confidence meter | `frontend/src/` | F6.4, W4-F4.7 |

## Architecture flow

```
weeks/w06/AskView.jsx ── useSSEStream (W4-F4.7, UNCHANGED) ──► POST /api/w06/ask
                                       ▼
                          apps/w06_rag_pipeline/pipeline.py
   ├─1─ store_pgvector.query(k=50)          candidates          (W5)
   ├─2─ rerank                              50 → 5              ← precision comes from here
   ├─3─ pack context under the token budget (W1-F1.3)
   ├─4─ prompts.registry.get("rag_answer")  + llm.streaming     (W3, W4)
   ├─5─ citations.verify()                  claim → chunk
   └─6─ confidence score → refuse below threshold
                                       ▼
   token… → data(Answer{text, citations[], confidence}) → done
                                       ▼
   AnswerView + CitationChip + ConfidenceMeter  (low confidence renders a REFUSAL)
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── retrieval/{rerank.py, citations.py}             ← NEW
│   ├── schemas/common.py                                ← EDIT Citation confirmed as kernel
│   └── prompts/templates/rag_answer/v1.md               ← NEW
└── apps/w06_rag_pipeline/{pipeline.py, router.py, schemas.py, confidence.py, tests/}  ← NEW
```

**Frontend**
```
└── src/
    ├── components/{CitationChip, ConfidenceMeter}.jsx   ← NEW  shared, reused in W12
    └── weeks/w06/{AskView, AnswerView, RetrievedContext}.jsx  ← NEW
```

## Build order

1. **F6.1** reranker — precision before composition; a pipeline over bad candidates teaches nothing.
2. **F6.2** pipeline — retrieve → rerank → pack → answer.
3. **F6.3** citations — the mapping that makes claims checkable.
4. **F6.4** confidence + refusal — depends on citation coverage as its main signal.
5. **F6.5** UI — refusal must be visually distinct, not a caption.

## Week Definition of Done

- [ ] A question with no supporting document produces a **refusal**, not a hallucination
- [ ] Every sentence in a high-confidence answer maps to a retrieved chunk ID
- [ ] `RetrievedContext` shows exactly the chunks sent to the model — the debugging surface
- [ ] `useSSEStream` is reused with **zero** modifications (greppable proof)
- [ ] Reranking measurably improves precision@5 over raw vector search — with the number recorded
- [ ] Context packing respects the token budget; truncation is reported, never silent
- [ ] Low confidence is visually distinct in the UI, not a small grey note

## What this week unlocks

Week 12's capstone gathers evidence with citations through exactly this pipeline. The refusal
threshold set here is the mechanism that stops an ops assistant from confidently proposing a fix
for an incident it has no evidence about.
