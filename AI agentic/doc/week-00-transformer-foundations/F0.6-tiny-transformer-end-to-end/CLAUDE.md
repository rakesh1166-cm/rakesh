# W0-F0.6 — Tiny Transformer End-to-End: Train, Predict, Sample

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** blog step **6 — Transformer** (all four concepts assembled into one working next-token predictor)
**Layer:** `apps/w00_transformer_lab/model/` (pure NumPy, offline, CPU, < 60s)
**Depends on:** [F0.5](../F0.5-multi-head-and-transformer-block/CLAUDE.md)
**Consumed by:** [F0.7](../F0.7-bridge-to-production-llms/CLAUDE.md), W1-F1.4 (temperature experiment), W3 (why prompts are deterministic at T=0)

## Goal

Stack the block, add an output head, train it on a tiny corpus until the loss goes **down**, and then
sample from it. This is the moment the four concepts become one object: tokens in
([F0.2](../F0.2-tokenization-lab/CLAUDE.md)) → embeddings ([F0.3](../F0.3-embeddings-and-positional-encoding/CLAUDE.md))
→ attention ([F0.4](../F0.4-attention-from-scratch/CLAUDE.md)) → blocks
([F0.5](../F0.5-multi-head-and-transformer-block/CLAUDE.md)) → a probability distribution over the
next token.

The model will produce near-gibberish. That is the expected result. The deliverable is that you can
now say exactly what an LLM *does*: it outputs one probability distribution per position, and
everything else — temperature, top-k, top-p, streaming — is what you do with that distribution.

## Contract (schema first)

```python
@dataclass(frozen=True)
class ModelConfig:
    vocab_size: int
    d_model: int = 64
    n_layers: int = 2
    n_heads: int = 4
    d_ff: int = 256
    max_seq_len: int = 128         # THE CONTEXT WINDOW. Hard wall, not a suggestion.

@dataclass(frozen=True)
class Logits:
    values: np.ndarray             # (T, vocab_size) — raw scores, NOT probabilities
    def probabilities(self) -> np.ndarray: ...   # softmax over the vocab axis

@dataclass(frozen=True)
class TrainingRun:
    steps: int
    losses: list[float]            # cross-entropy per step; must trend DOWN
    final_loss: float
    baseline_loss: float           # ln(vocab_size) — an untrained model's loss. Beat it or fail.
    seconds: float

@dataclass(frozen=True)
class SamplingConfig:
    temperature: float = 1.0       # 0.0 => greedy/argmax
    top_k: int | None = None
    top_p: float | None = None
    max_new_tokens: int = 64
    seed: int = 0                  # sampling is reproducible or it is not an experiment

@dataclass(frozen=True)
class SamplingResult:
    config: SamplingConfig
    completions: list[str]         # N runs of the same prompt
    distinct_ratio: float          # len(set(completions)) / len(completions)  — the measured knob
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/model/tiny_transformer.py` | NEW | embed → +positions → N blocks → LayerNorm → output head |
| `apps/w00_transformer_lab/model/train.py` | NEW | cross-entropy loss, gradients, a plain optimiser, the loop |
| `apps/w00_transformer_lab/model/sample.py` | NEW | greedy, temperature, top-k, top-p — one function each |
| `apps/w00_transformer_lab/model/context.py` | NEW | enforce `max_seq_len`; typed overflow, no silent truncation |
| `apps/w00_transformer_lab/README.md` | EDIT | loss curve, sampling sweep table — **the deliverables** |
| `tests/w00/test_model.py` | NEW | shapes, causality, loss decrease, sampling determinism |

## Flow

```
ids  (F0.2)
  ▼ embed + positions                (F0.3)
  ▼ block × n_layers, causally masked (F0.4 + F0.5)
  ▼ final LayerNorm
  ▼ output head  (T, d_model) @ (d_model, vocab) ─► (T, vocab)   Logits
  ▼
  ├─ TRAIN:  cross_entropy(logits[:-1], ids[1:])  ─► gradients ─► update ─► TrainingRun
  └─ SAMPLE: logits[-1] ─► temperature ─► top-k/top-p ─► draw ─► append ─► loop
                                                             ▼
                        SamplingResult  ──► W1-F1.4 runs the SAME sweep against a real LLM
```

## Rules

- **Next-token prediction is the whole objective.** Loss is cross-entropy between `logits[t]` and
  `ids[t+1]`. Write the shift explicitly; an off-by-one here silently teaches the model to copy its
  input, and the loss still goes down.
- **Beat the baseline or the run failed.** An untrained model's loss is `ln(vocab_size)`. Record
  both numbers. "Loss went down" without the baseline is not evidence.
- **The causal mask is load-bearing during training.** Without it, the model can see the answer and
  the loss collapses to near-zero — which looks like success. Include this as a deliberate
  demonstration, with both loss curves recorded side by side.
- **Sampling is separate from the model.** `sample.py` takes `Logits` and never touches the network.
  This is the same separation the Anthropic API has: the model returns a distribution; `temperature`
  is applied on top of it.
- **`temperature=0.0` means argmax**, special-cased before division. Do not divide by zero and hope.
- **Every sampling run takes a seed.** Same seed + same config + same prompt → identical output. This
  is what makes the diversity number in the sweep a measurement rather than an anecdote.
- **The context window is a hard wall.** Exceeding `max_seq_len` raises `ContextOverflow(needed,
  limit)`. Never truncate silently — that is the exact failure Week 1's context guard exists to
  prevent, and Week 0 is where you feel it.
- **Small enough to run in CI.** ≤ 2 layers, ≤ 64 `d_model`, a few thousand steps, under a minute on a
  laptop CPU, fixed seed. If it needs a GPU, it is out of scope for this week.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Causal mask removed during training | Loss collapses near zero — recorded and explained as leakage, never celebrated |
| Off-by-one in the target shift | Test fails: the model achieves an impossibly low loss by copying its input |
| Prompt longer than `max_seq_len` | `ContextOverflow(needed, limit)` raised **before** the forward pass, never truncated |
| `temperature=0.0` | Greedy path taken; no divide-by-zero, output identical across runs |
| `temperature` very large (e.g. 100) | Output approaches uniform sampling; recorded, not crashed |
| `top_k > vocab_size` | Clamps to `vocab_size` with a recorded warning; no `IndexError` |
| `top_p = 0.0` | Falls back to the single most likely token — an empty candidate set is never returned |
| Loss becomes `nan` | Run aborts with the step index and the last finite loss — never reported as a completed run |
| Same seed, re-run | Byte-identical completions |

## Tests

- `test_forward_output_shape_is_T_by_vocab`
- `test_model_cannot_see_future_tokens` — perturbing token `t+1` must not change `logits[t]`
- `test_loss_decreases_and_beats_ln_vocab_baseline`
- `test_shifted_targets_are_correct` — the off-by-one guard
- `test_greedy_sampling_is_deterministic`
- `test_same_seed_same_output_across_all_sampling_modes`
- `test_higher_temperature_increases_distinct_ratio` — the measured claim, asserted
- `test_context_overflow_raises_before_forward_pass`
- `test_full_training_run_completes_under_60_seconds_on_cpu`

## Acceptance criteria

- [ ] `README.md` records `baseline_loss`, `final_loss`, `steps`, and `seconds` for the training run
- [ ] The loss curve trends down and beats `ln(vocab_size)` — with the numbers, not a claim
- [ ] The masked vs unmasked training comparison is recorded, and you can explain the collapse in one sentence
- [ ] A sampling sweep table exists: `temperature ∈ {0.0, 0.3, 0.7, 1.0, 1.5}` × 10 runs, with `distinct_ratio` per row
- [ ] `top_k` and `top_p` each have at least one recorded row showing their effect on `distinct_ratio`
- [ ] The `temperature=0.0` row shows `distinct_ratio == 0.1` (all ten completions identical) — which is *why* W1 defaults to it
- [ ] `ContextOverflow` is demonstrated once on purpose and the error message is quoted in the README
- [ ] `pytest tests/w00` passes offline, with no API key, in under a minute
- [ ] `THEORY.md` answers: what exactly does an LLM return, before any sampling happens?
