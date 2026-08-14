# W0-F0.5 — Multi-Head Attention + One Transformer Block

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** blog steps **6 — Transformer** and **7 — Attention** (the block *is* the transformer's repeating unit)
**Layer:** `apps/w00_transformer_lab/block/` (pure NumPy, offline)
**Depends on:** [F0.4](../F0.4-attention-from-scratch/CLAUDE.md)
**Consumed by:** [F0.6](../F0.6-tiny-transformer-end-to-end/CLAUDE.md), and every later week that says the word "model"

## Goal

Assemble one attention head into **many heads in parallel**, then wrap them in the four pieces that
make a transformer block: residual connections, LayerNorm, and a position-wise feed-forward network.

This is the unit that is stacked N times to make a transformer. After this feature you can draw the
block from memory, state what each piece is for, and compute its parameter count on paper before
running the code — and the code agrees with your arithmetic.

## Contract (schema first)

```python
@dataclass(frozen=True)
class MultiHeadConfig:
    d_model: int
    n_heads: int                   # d_model % n_heads == 0 — enforced, not assumed
    d_head: int                    # == d_model // n_heads

@dataclass(frozen=True)
class MultiHeadOutput:
    out: np.ndarray                # (T, d_model)  — shape-stable in, shape-stable out
    per_head_weights: np.ndarray   # (n_heads, T, T) — kept, because heads specialise differently

@dataclass(frozen=True)
class BlockConfig:
    d_model: int
    n_heads: int
    d_ff: int                      # conventionally 4 * d_model
    pre_norm: bool = True          # LayerNorm BEFORE the sublayer (the modern, stable choice)

# block(x: (T, d_model), mask) -> (T, d_model)     shape in == shape out. Always.
# param_count(cfg) -> int                          must match the hand-derived formula
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/block/multi_head.py` | NEW | split → per-head attention → concat → `W_o` |
| `apps/w00_transformer_lab/block/layer_norm.py` | NEW | LayerNorm from primitives (mean/var over `d_model`) |
| `apps/w00_transformer_lab/block/ffn.py` | NEW | `Linear(d_model→d_ff) → GELU → Linear(d_ff→d_model)` |
| `apps/w00_transformer_lab/block/block.py` | NEW | residual + norm wiring; the block itself |
| `apps/w00_transformer_lab/block/params.py` | NEW | `param_count(cfg)` + the derivation printed as a comment |
| `apps/w00_transformer_lab/README.md` | EDIT | block diagram, parameter-count table, per-head weight comparison |
| `tests/w00/test_block.py` | NEW | shape stability, head math, norm properties, param count |

## Flow

```
x : (T, d_model)   from F0.3, having passed through F0.4's mechanism
      │
      ├─ LayerNorm ─► split into n_heads × (T, d_head)
      │               ► scaled_dot_product_attention per head   (F0.4, reused verbatim)
      │               ► concat heads ─► @ W_o ─► (T, d_model)
      └────────────── + residual ────────────────────────────────┐
                                                                 ▼
      ┌────────────── + residual ──────────────────────────── x' : (T, d_model)
      │
      └─ LayerNorm ─► Linear(d_ff) ─► GELU ─► Linear(d_model) ─┘
                                                                 ▼
                                                        (T, d_model)   ──► stack N times in F0.6
```

## Rules

- **Shape in == shape out.** `(T, d_model)` enters, `(T, d_model)` leaves. That invariant is what
  makes stacking possible, and it is a test, not a convention.
- **Heads are a reshape, not a loop over N models.** `d_model` is *split* across heads, so
  `n_heads=8, d_model=64` means eight 8-dim heads — the block does not get 8× bigger. Verify with
  `param_count`: multi-head and single-head at the same `d_model` have the **same** parameter count.
- **`d_model % n_heads == 0` is enforced at construction** with a typed error naming both numbers.
- **Reuse F0.4's attention function unchanged.** If multi-head needs a modified copy of the
  mechanism, the abstraction in F0.4 was wrong — fix F0.4 rather than forking it.
- **Pre-norm by default.** LayerNorm before the sublayer; record why (post-norm needs warmup to train
  stably, and this lab has no warmup schedule).
- **Residual connections are not optional decoration.** Include an ablation: run a 6-block stack with
  residuals removed and record how the activation magnitudes degrade across depth.
- **LayerNorm normalises over `d_model`, per position** — not over the batch, not over `T`. Test it:
  each row of the output has mean ≈ 0 and variance ≈ 1.
- **Still no training.** Weights stay random. This feature ships a correct forward pass and correct
  arithmetic.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| `d_model` not divisible by `n_heads` | Typed `HeadSplitError(d_model, n_heads)` at construction, not mid-forward |
| Residual connection removed | Ablation runs and the recorded activation decay across 6 blocks shows why it exists |
| LayerNorm with zero-variance input | Epsilon guard, finite output — no `nan` from divide-by-zero |
| Wrong concat axis after per-head attention | Shape test fails immediately; must never produce a plausible wrong-shaped array |
| `n_heads == 1` | Result is numerically identical to F0.4's single-head path — asserted |
| `n_heads == d_model` | Runs, `d_head == 1`, and the degenerate behaviour is recorded rather than hidden |
| Mask not propagated to every head | Causal test fails per head — masking is checked head-wise, not just on the sum |

## Tests

- `test_block_output_shape_equals_input_shape`
- `test_multi_head_param_count_matches_hand_derived_formula`
- `test_single_head_equals_f04_scaled_dot_product` — the reuse guarantee
- `test_layer_norm_rows_have_zero_mean_unit_variance`
- `test_layer_norm_is_stable_on_constant_input`
- `test_causal_mask_holds_for_every_head`
- `test_indivisible_head_split_raises_typed_error`
- `test_residual_ablation_records_activation_decay`

## Acceptance criteria

- [ ] `README.md` has the block diagram and a parameter-count table for at least three `(d_model, n_heads, d_ff)` configs
- [ ] Your hand-derived parameter formula matches `param_count()` exactly, and the derivation is written down
- [ ] Multi-head and single-head at equal `d_model` have equal parameter counts, and you can say why in one sentence
- [ ] Per-head attention matrices are printed side by side and visibly differ
- [ ] The residual ablation numbers are recorded
- [ ] LayerNorm is implemented from mean/variance primitives, no library call
- [ ] `THEORY.md` answers: what does the FFN do that attention cannot?
