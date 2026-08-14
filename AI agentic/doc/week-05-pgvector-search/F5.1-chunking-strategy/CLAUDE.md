# W5-F5.1 — Chunking Strategy

> [Week 5](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/retrieval/chunking.py` (kernel)
**Depends on:** [W1-F1.3](../../week-01-llm-foundations/F1.3-token-accounting-and-context-guard/CLAUDE.md)
**Consumed by:** [F5.2](../F5.2-embeddings-batch-and-cache/CLAUDE.md), and every W6 answer

## Goal

Split documents into retrievable units **without severing the sentence that holds the answer**.
Chunking is the decision everything downstream inherits: a bad boundary cannot be recovered by a
better reranker, a better prompt, or a better model.

## Contract (schema first)

```python
class ChunkConfig(BaseModel):
    target_tokens: int = Field(512, ge=64, le=2048)
    overlap_tokens: int = Field(64, ge=0)
    respect_boundaries: list[Literal["heading","paragraph","sentence"]] = ["heading","paragraph"]
    min_tokens: int = 32              # below this, merge forward — a 3-token chunk is noise

    @model_validator(mode="after")
    def overlap_is_sane(self):        # overlap < target // 2, else storage explodes
        ...

class Chunk(BaseModel):
    doc_id: str
    chunk_index: int
    text: str
    token_count: int
    heading_path: list[str]           # ["Deployment", "Rollback"] — carried INTO the embedded text
    char_start: int; char_end: int    # exact provenance for citations (W6)
    content_hash: str                 # sha256 — the idempotency key for re-ingest

def chunk_document(doc_id: str, text: str, cfg: ChunkConfig) -> list[Chunk]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/retrieval/chunking.py` | NEW | `ChunkConfig`, `Chunk`, `chunk_document` |
| `apps/w05_vector_search/tests/fixtures/` | NEW | corpus with headings, tables, code blocks |

## Flow

```
raw document
      ▼
split on respect_boundaries, largest first (heading → paragraph → sentence)
      ▼
accumulate to target_tokens using tokens.count (W1-F1.3)  ← real tokens, not len()//4
      ▼
apply overlap_tokens backwards from the previous chunk
      ▼
merge any chunk under min_tokens into its neighbour
      ▼
prepend heading_path to the text that gets EMBEDDED   ← "Deployment > Rollback: <text>"
      ▼
content_hash = sha256(doc_id + chunk_index + text)
```

## Rules

- **Token-based, not character-based.** `len(text)//4` is an estimate that drifts badly on code,
  tables, and non-English text — exactly the content where chunking already struggles.
- **`heading_path` is embedded with the text.** A chunk reading "Run the rollback script" is
  near-useless in isolation; "Deployment > Rollback > Run the rollback script" retrieves correctly.
- **`char_start`/`char_end` are mandatory.** Week 6 needs exact provenance to render a citation that
  points at the source span, not just at a document.
- **`content_hash` makes ingest idempotent** (F5.4). Without it, re-ingesting a corpus silently
  doubles it and quietly degrades every subsequent recall number.
- Overlap is bounded to `target // 2`. Beyond that, storage and embedding cost grow faster than
  recall improves.
- `ChunkConfig` is a **tunable**, not a constant. F5.4 measures recall@k across configs; the winner
  is recorded with its number.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Document with no paragraph breaks | Falls back to sentence, then hard token split — never one giant chunk |
| Code block longer than `target_tokens` | Split, but never mid-line; the split is recorded |
| Table spanning the boundary | `heading_path` keeps both halves attributable |
| Document shorter than `min_tokens` | One chunk, not zero |
| Same document ingested twice | Identical `content_hash` values ⇒ upsert, not insert |
| Empty / whitespace-only document | Zero chunks and a warning — not a crash |

## Tests

- `test_chunk_token_counts_use_the_real_tokenizer`
- `test_heading_path_is_included_in_embedded_text`
- `test_char_offsets_reconstruct_the_original_span_exactly`
- `test_reingest_produces_identical_content_hashes`
- `test_no_chunk_below_min_tokens_survives`
- `test_document_with_no_boundaries_still_chunks`

## Acceptance criteria

- [ ] `text[char_start:char_end]` on the source reproduces the chunk body exactly
- [ ] Chunk token counts match W1-F1.3's counter, not an estimate
- [ ] Re-chunking an unchanged document yields identical hashes
- [ ] `heading_path` is present on every chunk from a structured document
- [ ] At least two `ChunkConfig` variants are measured in F5.4, with recorded recall@k
