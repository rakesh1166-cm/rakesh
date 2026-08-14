# Week 0 — Transformer Foundations (Transformer · Attention · Tokens · Embeddings)

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Why this week exists

The blog [*AI to Agentic AI*](https://www.debug.school/rakeshdevcotocus_468/ai-to-agentic-ai-understanding-the-relationship-between-ai-ml-data-science-genai-llms-and-ai-5006)
prescribes a 25-step learning order. Steps **6–9 come before step 10 (LLM)**:

```
6. Transformer  →  7. Attention  →  8. Tokens / Tokenization  →  9. Embeddings  →  10. LLM
```

[Week 1](../week-01-llm-foundations/CLAUDE.md) starts at step 10 — it calls a hosted LLM and measures
it. This week is steps 6–9: the four concepts the LLM is *made of*. Without them, Week 1's numbers
are facts you memorised; with them, they are behaviour you can predict.

## Objective

Build a **tiny transformer from scratch in NumPy** — tokenizer, embeddings, attention, blocks,
sampling — and use it to explain every knob Weeks 1–12 will turn. No API key. No network. No
framework. If it can't run offline on a laptop CPU in under a minute, it doesn't belong here.

The deliverable is **understanding, evidenced by numbers**: a token count you predicted, an attention
matrix you can read, a `temperature` sweep whose shape you saw before Week 1 ever measured it.

## Features (7)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F0.1](F0.1-concept-map-and-theory-note/CLAUDE.md) | Concept map + Week-0 theory note | `doc/week-00-*/THEORY.md` | — |
| [F0.2](F0.2-tokenization-lab/CLAUDE.md) | Tokenization lab — train a BPE, count real tokens | `apps/w00_transformer_lab/tokenizer/` | F0.1 |
| [F0.3](F0.3-embeddings-and-positional-encoding/CLAUDE.md) | Embeddings + positional encoding | `apps/w00_transformer_lab/embeddings/` | F0.2 |
| [F0.4](F0.4-attention-from-scratch/CLAUDE.md) | Scaled dot-product attention, by hand | `apps/w00_transformer_lab/attention/` | F0.3 |
| [F0.5](F0.5-multi-head-and-transformer-block/CLAUDE.md) | Multi-head attention + one transformer block | `apps/w00_transformer_lab/block/` | F0.4 |
| [F0.6](F0.6-tiny-transformer-end-to-end/CLAUDE.md) | Tiny transformer: train, predict, sample | `apps/w00_transformer_lab/model/` | F0.5 |
| [F0.7](F0.7-bridge-to-production-llms/CLAUDE.md) | Bridge: from my transformer to a real LLM API | `apps/w00_transformer_lab/BRIDGE.md` | F0.6 |

## Reading order ≠ build order

The blog's order is how you **read** the concepts. The lab's order is how you **build** them, because
a forward pass runs bottom-up: text must be tokens before it can be vectors, and vectors before
attention has anything to attend to.

| | Order |
|---|---|
| **Read** (blog steps 6→9) | Transformer → Attention → Tokens → Embeddings |
| **Build** (this week, F0.2→F0.6) | Tokens → Embeddings → Attention → Block → Transformer |

Read top-down in [F0.1](F0.1-concept-map-and-theory-note/CLAUDE.md) so you know what you're aiming
at; build bottom-up so every layer has something real underneath it. Record in `THEORY.md` which
concept only made sense *after* you built the layer below it — that delta is the week's real output.

## Architecture flow

```
"Plan a trip to Rome"
      │
      ▼  F0.2  tokenizer          text ──► [15496, 1291, 257, ...]      ids
      ▼  F0.3  embedding table    ids  ──► (T, d_model) float matrix    vectors
      ▼  F0.3  + positional enc.  vectors + position ──► order-aware vectors
      ▼  F0.4  attention          softmax(QKᵀ/√d)·V, causally masked
      ▼  F0.5  block × N          multi-head → residual → LayerNorm → FFN → residual
      ▼  F0.6  output head        (T, d_model) ──► (T, vocab) logits
      ▼  F0.6  sampling           logits ──► temperature / top-k / top-p ──► next token
      └────────────────────────── loop ──────────────────────────┘

F0.7 maps every box above onto a knob in the Anthropic API — and hands off to Week 1.
```

## Folder delta

**Backend**
```
apps/w00_transformer_lab/                              ← NEW (pure NumPy, no aiplat, no network)
├── tokenizer/{bpe.py, corpus.py, report.py}           ← NEW  F0.2
├── embeddings/{table.py, positional.py, similarity.py} ← NEW  F0.3
├── attention/{scaled_dot_product.py, masks.py}        ← NEW  F0.4
├── block/{multi_head.py, layer_norm.py, ffn.py, block.py} ← NEW  F0.5
├── model/{tiny_transformer.py, train.py, sample.py}   ← NEW  F0.6
├── data/tiny_corpus.txt                               ← NEW  small, committed, deterministic
├── README.md                                          ← NEW  the measured-results table
└── BRIDGE.md                                          ← NEW  F0.7 concept → API mapping

tests/w00/                                             ← NEW  property tests, all offline
requirements-dev.txt: numpy, tokenizers, pytest        ← EDIT (no anthropic SDK in this week)
```

**Frontend** — *none, deliberately.* There is no HTTP surface until Week 2 and no SSE contract until
Week 4. A visualisation here would be a toy that gets deleted.

## Build order

1. **F0.1** — write the theory note **first**, with predictions. Predictions made after building are worthless.
2. **F0.2** — tokens, because nothing downstream has inputs until text becomes ids.
3. **F0.3** — embeddings, then positional encoding. Prove order matters before you add it.
4. **F0.4** — attention on hand-made vectors. Read the attention matrix before wrapping it in anything.
5. **F0.5** — multi-head + block. Shapes and parameter counts are the acceptance test.
6. **F0.6** — stack, train on a tiny corpus, sample. Sweep `temperature` here, not in Week 1.
7. **F0.7** — map it all onto the real API, then fill in `THEORY.md` → *Revisited*.

## Week Definition of Done

- [ ] `THEORY.md` exists, was written **before** any code in this folder, and its *Revisited* section is filled in
- [ ] The whole lab runs offline: `pytest tests/w00` passes with no network and no API key
- [ ] `apps/w00_transformer_lab/README.md` records **measured numbers**, not adjectives, for every feature
- [ ] Tokens-per-word measured for at least English, one non-Latin script, code, and emoji
- [ ] An attention-weight matrix is printed and **explained in one sentence** you wrote yourself
- [ ] The causal mask is verified by test: no position attends to a future position
- [ ] The tiny transformer's loss decreases on the tiny corpus, and the number is recorded
- [ ] A `temperature` sweep shows output diversity changing, with a number attached
- [ ] `BRIDGE.md` maps each of the four concepts to a concrete parameter or cost in the Anthropic API
- [ ] No file in this week imports `aiplat` (it does not exist yet) — see [F0.7](F0.7-bridge-to-production-llms/CLAUDE.md) for the single, time-boxed exception

## What this week unlocks

- **Week 1** — `tokens.py` and the context guard stop being magic: you already know why a token is
  not a word and why the window is a hard wall. The `temperature=0.0` default is a setting you have
  *seen* the effect of.
- **Week 5** — embeddings and cosine similarity are the same objects you built in F0.3; pgvector just
  stores them.
- **Week 6** — you know why retrieval exists: attention is quadratic and the window is finite, so you
  can't put the corpus in the prompt.
- **Week 11** — cost per request is a token count, and you can predict token counts.

> **Non-goal:** training anything useful. The tiny transformer will produce near-gibberish. That is
> the correct outcome — the artefact is the understanding, not the model.
