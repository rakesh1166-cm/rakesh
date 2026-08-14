# W0-F0.3 — Embeddings + Positional Encoding: Ids Become Meaning

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** blog step **9 — Embeddings** ("the numerical representation tokens acquire during processing")
**Layer:** `apps/w00_transformer_lab/embeddings/` (pure NumPy, offline)
**Depends on:** [F0.2](../F0.2-tokenization-lab/CLAUDE.md)
**Consumed by:** [F0.4](../F0.4-attention-from-scratch/CLAUDE.md) (attention needs vectors), W5 (pgvector, cosine similarity), W6 (why retrieval works at all)

## Goal

An id like `4171` means nothing — `4171` is not "more" than `271`. Give every id a **learned vector**,
show that similar meanings land near each other under cosine similarity, then prove that a bag of
vectors has **lost word order** and fix it with positional encoding.

Two things must be true at the end: you can compute a similarity number by hand, and you can state
why `"dog bites man"` and `"man bites dog"` are identical to the model without positions.

## Contract (schema first)

```python
@dataclass(frozen=True)
class EmbeddingTable:
    vocab_size: int
    d_model: int
    weights: np.ndarray            # (vocab_size, d_model) — the entire "knowledge" at this stage

    def lookup(self, ids: list[int]) -> np.ndarray:   # -> (T, d_model)
        ...                                            # it is a row-gather. Nothing more.

@dataclass(frozen=True)
class SimilarityResult:
    a: str
    b: str
    cosine: float                  # in [-1, 1]
    relation: str                  # "related" | "unrelated" | "negated"

@dataclass(frozen=True)
class OrderProbe:
    sentence_a: str                # "dog bites man"
    sentence_b: str                # "man bites dog"
    summed_embeddings_identical: bool     # True  WITHOUT positional encoding
    with_positions_identical: bool        # False WITH positional encoding

# positional_encoding(T, d_model) -> (T, d_model)   sinusoidal, deterministic, no parameters
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/embeddings/table.py` | NEW | `EmbeddingTable` — init, `lookup`, shape contract |
| `apps/w00_transformer_lab/embeddings/positional.py` | NEW | sinusoidal encoding; optional learned variant for comparison |
| `apps/w00_transformer_lab/embeddings/similarity.py` | NEW | cosine similarity, nearest-neighbour search |
| `apps/w00_transformer_lab/embeddings/order_probe.py` | NEW | the `dog bites man` demonstration — the feature's punchline |
| `apps/w00_transformer_lab/README.md` | EDIT | similarity table + the order-probe result |
| `tests/w00/test_embeddings.py` | NEW | shapes, cosine bounds, order probe, determinism |

## Flow

```
ids from F0.2:  [1043, 271, 4171]
      ▼  EmbeddingTable.lookup(ids)          row-gather, (T, d_model)
      ▼  + positional_encoding(T, d_model)   elementwise add — position is now IN the vector
(T, d_model) order-aware matrix
      ▼  cosine(a, b)  ──►  SimilarityResult   (this is exactly what W5's pgvector stores)
      ▼
F0.4 attention consumes the (T, d_model) matrix
```

## Rules

- **An embedding lookup is a row-gather, not a matrix multiply.** Implement it as indexing. If you
  reach for a one-hot matmul, you have learned the identity you were meant to learn — write it down
  in `THEORY.md` and then index.
- **Cosine similarity is normalised dot product.** Implement it from `np.dot` and `np.linalg.norm`,
  not from a library helper. It is four lines, and it is the same number pgvector returns in Week 5.
- **Measure the negated pair.** `"I like it"` vs `"I do not like it"` scoring *high* is the failure
  mode that makes Week 6 need reranking. Record the number now so W6 can cite it.
- **Positional encoding is added, not concatenated.** Same shape in, same shape out — `(T, d_model)`.
  Every downstream layer stays shape-stable.
- **Sinusoidal first, learned second.** Sinusoidal has no parameters and can be printed and inspected;
  build the one you can look at before the one you have to train.
- **Untrained vectors are random and that is fine.** At this stage similarity numbers are noise. The
  deliverable is the *machinery* plus the order proof — real similarity arrives in
  [F0.6](../F0.6-tiny-transformer-end-to-end/CLAUDE.md) after training.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Id ≥ `vocab_size` | Typed `TokenIdOutOfRange(id, vocab_size)` — never a raw `IndexError` |
| Zero vector passed to cosine | Returns `0.0` by definition, no `nan`, no divide-by-zero warning |
| Sequence longer than the precomputed positional table | Table extends on demand — a long input must not silently truncate |
| Positional encoding omitted | `OrderProbe.summed_embeddings_identical` is `True` — the bug is *visible*, and that is the lesson |
| `d_model` odd | Sinusoidal encoding either handles it or raises a typed error — never emits a wrong-shaped array |
| Re-run with the same seed | Byte-identical weights; experiments must be reproducible |

## Tests

- `test_lookup_shape_is_T_by_d_model`
- `test_cosine_is_bounded_and_symmetric` — `-1 ≤ cos ≤ 1`, `cos(a,b) == cos(b,a)`
- `test_cosine_of_vector_with_itself_is_one`
- `test_bag_of_embeddings_cannot_distinguish_word_order` — the probe, asserted
- `test_positional_encoding_makes_the_two_sentences_differ`
- `test_positional_encoding_is_deterministic_and_parameter_free`
- `test_out_of_range_id_raises_typed_error`

## Acceptance criteria

- [ ] `README.md` records cosine numbers for **related / unrelated / negated** pairs
- [ ] `OrderProbe` shows `summed_embeddings_identical=True` without positions and `False` with them
- [ ] You can state in one sentence why word order is lost without positional encoding
- [ ] Cosine similarity is implemented from primitives and matches a hand-computed value on a 3-dim example
- [ ] The sinusoidal encoding for `T=8, d_model=16` is printed in the README and is legibly periodic
- [ ] `THEORY.md` notes whether the negated-pair number surprised you (it should)
