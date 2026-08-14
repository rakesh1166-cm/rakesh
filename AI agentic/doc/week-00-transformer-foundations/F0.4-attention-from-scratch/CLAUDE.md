# W0-F0.4 — Scaled Dot-Product Attention, By Hand

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** blog step **7 — Attention** ("a key LLM concept you should learn" — the mechanism the whole transformer is built around)
**Layer:** `apps/w00_transformer_lab/attention/` (pure NumPy, offline)
**Depends on:** [F0.3](../F0.3-embeddings-and-positional-encoding/CLAUDE.md)
**Consumed by:** [F0.5](../F0.5-multi-head-and-transformer-block/CLAUDE.md), W6 (why context is finite → why RAG), W11 (why long prompts cost more than linearly)

## Goal

Implement `Attention(Q, K, V) = softmax(QKᵀ / √d_k) · V` in about ten lines of NumPy, then **print the
attention matrix and read it**. Every token gets to look at every other token and decide how much
each one matters; the matrix is that decision, made visible.

Three things must be true at the end: you can point at a cell and say what it means, you can explain
why the `√d_k` is there, and you can show that a causal mask makes it impossible for position 2 to
see position 5.

## Contract (schema first)

```python
@dataclass(frozen=True)
class AttentionOutput:
    context: np.ndarray            # (T, d_v)  — the re-mixed value vectors
    weights: np.ndarray            # (T, T)    — the readable part. rows sum to 1.0

def scaled_dot_product_attention(
    q: np.ndarray,                 # (T, d_k)
    k: np.ndarray,                 # (S, d_k)
    v: np.ndarray,                 # (S, d_v)
    mask: np.ndarray | None,       # (T, S) bool — True = allowed to attend
) -> AttentionOutput: ...

def causal_mask(T: int) -> np.ndarray:      # (T, T) lower-triangular bool
def padding_mask(lengths: list[int], T: int) -> np.ndarray:
def softmax(x: np.ndarray, axis: int) -> np.ndarray:   # max-subtracted, numerically stable
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/attention/scaled_dot_product.py` | NEW | the mechanism itself + a stable `softmax` |
| `apps/w00_transformer_lab/attention/masks.py` | NEW | `causal_mask`, `padding_mask` |
| `apps/w00_transformer_lab/attention/qkv.py` | NEW | project `(T, d_model)` → `Q`, `K`, `V` via `W_q`, `W_k`, `W_v` |
| `apps/w00_transformer_lab/attention/visualise.py` | NEW | print the `(T, T)` matrix as an ASCII heatmap with token labels |
| `apps/w00_transformer_lab/README.md` | EDIT | one printed, annotated attention matrix — **the deliverable** |
| `tests/w00/test_attention.py` | NEW | rows sum to 1, causality, scaling, shape contract |

## Flow

```
(T, d_model) from F0.3
      ▼  qkv.project()             Q = XW_q ,  K = XW_k ,  V = XW_v
      ▼  scores = Q @ K.T          (T, S) raw affinities — "how much does i care about j"
      ▼  scores /= sqrt(d_k)       keeps softmax out of its saturated region
      ▼  scores[~mask] = -inf      causal: the future is unreachable, not just unlikely
      ▼  weights = softmax(scores) (T, S), each row sums to 1.0   ← THE READABLE ARTEFACT
      ▼  context = weights @ V     (T, d_v) each token re-expressed as a mix of what it attended to
AttentionOutput  ──►  F0.5 wraps this in multi-head + residual + norm
```

## Rules

- **Masking is `-inf` before softmax, never zeroing after.** Zeroing after softmax leaves rows that
  no longer sum to 1 and quietly leaks future information into the normalisation. Test the row sums.
- **`softmax` subtracts the row max before exponentiating.** Without it, a large score overflows to
  `inf` and the row becomes `nan`. This is the single most common from-scratch bug — assert it.
- **The `√d_k` is not decoration.** Include a recorded experiment: without scaling, at `d_k=64` the
  softmax saturates and attention becomes near-one-hot. Put the measured entropy in the README.
- **`weights` is a first-class output, not a debug print.** Everything interpretable about a
  transformer lives in that matrix; returning only `context` throws the lesson away.
- **No learning here.** `W_q`, `W_k`, `W_v` are random and fixed. This feature is the mechanism, not
  the training — the matrix will look like noise, and reading a noisy matrix correctly still counts.
- **Quadratic cost is the headline.** Record wall-clock and memory for `T = 8, 64, 512`. The `T²`
  curve you measure here is the reason Week 6 needs retrieval instead of a bigger prompt.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Large scores (e.g. `d_k=512`, unscaled) | Stable softmax returns finite values — no `nan`, no `inf` |
| Mask omitted where causality is required | Test fails: a future position has non-zero weight. Must be caught by test, not by eye |
| A fully-masked row (nothing attendable) | Typed `EmptyAttentionRow(index)` — not a silent `nan` row |
| `q`/`k` dimension mismatch | Typed shape error naming both shapes — never a raw broadcast error |
| `T` grows 8 → 512 | Completes, and the recorded time/memory shows the `T²` growth explicitly |
| Non-contiguous / transposed input | Correct result or typed error; never a silently wrong number |

## Tests

- `test_attention_rows_sum_to_one`
- `test_causal_mask_gives_zero_weight_to_future_positions` — the load-bearing test of this feature
- `test_softmax_is_stable_for_large_inputs` — no `nan`, no `inf`
- `test_scaling_by_sqrt_dk_lowers_saturation` — asserts the measured entropy difference
- `test_uniform_keys_produce_uniform_attention` — a hand-checkable known-good case
- `test_output_shape_is_T_by_dv`
- `test_fully_masked_row_raises_typed_error`

## Acceptance criteria

- [ ] `README.md` contains one printed `(T, T)` attention matrix with token labels and **your one-sentence reading of it**
- [ ] The causal-mask test passes and would fail if the mask were removed (verify by removing it once)
- [ ] Measured entropy with and without `√d_k` scaling is recorded, with the numbers
- [ ] Wall-clock and memory recorded for `T = 8, 64, 512`, and the `T²` shape is visible
- [ ] `softmax` is written from primitives and is stable on an input containing `1e9`
- [ ] `THEORY.md` answers, in your own words: what does one row of the attention matrix mean?
