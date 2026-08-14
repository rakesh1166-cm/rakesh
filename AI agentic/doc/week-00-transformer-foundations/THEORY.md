# Week 0 — Theory 🧱

> Written **before** Week 0's code. Revisited after. · [Week 0](CLAUDE.md) · [F0.1 owns this file](F0.1-concept-map-and-theory-note/CLAUDE.md) · [why theory notes exist](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #6 Transformer · #7 Attention · #8 Tokens/Tokenization · #9 Embeddings
> — steps **6–9**, which the ladder puts *before* #10 LLM. [Week 1](../week-01-llm-foundations/THEORY.md)
> starts at #10, so this week is the four things an LLM is *made of*.
>
> This is the deepest form of **Understand** in the whole repo: you build the mechanism before you
> call the API. Everything is pure NumPy, offline, on a laptop CPU.

---

## The 4 concepts (deeper than 15 minutes — you're building each one)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 8 | **Tokens / tokenization** | _(fill in)_ | [F0.2](F0.2-tokenization-lab/CLAUDE.md) — train a BPE yourself. Why a token is not a word, and what that does to code and non-English text |
| 9 | **Embeddings + positional encoding** | _(fill in)_ | [F0.3](F0.3-embeddings-and-positional-encoding/CLAUDE.md) — attention is order-blind on its own; position has to be *added* |
| 7 | **Attention** | _(fill in)_ | [F0.4](F0.4-attention-from-scratch/CLAUDE.md) — Q·Kᵀ/√d → softmax → ·V. Print the matrix and read it |
| 6 | **Transformer** | _(fill in)_ | [F0.5](F0.5-multi-head-and-transformer-block/CLAUDE.md), [F0.6](F0.6-tiny-transformer-end-to-end/CLAUDE.md) — multi-head, residuals, norm, then a whole tiny model that samples text |

### Study prompts — build first, then answer

- **Tokens:** train a BPE on a small corpus. Why does `unbelievable` split the way it does? What
  happens to `ERR_5521` and to non-English text? (The answer resurfaces in
  [W6-F6.6](../week-06-rag-pipeline/F6.6-hybrid-retrieval-bm25-and-vector/CLAUDE.md) — it's *why*
  hybrid retrieval exists.)
- **Embeddings:** what is a positional encoding actually *for*? Remove it from your model and
  describe what breaks.
- **Attention:** why divide by `√d`? Run it without and watch the softmax saturate.
- **Why `T²`:** compute the attention matrix shape for `T=10` and `T=10,000`. That number is why
  [W1-F1.3](../week-01-llm-foundations/F1.3-token-accounting-and-context-guard/CLAUDE.md)'s
  `TokenBudget` exists and why long context costs disproportionately.
- **Temperature:** sample from your own model at `T=0`, `0.7`, `1.5`. You will see the shape before
  Week 1 ever measures it.
- **Causal masking:** why can position 3 not see position 7? What would break if it could?

---

## What I predicted

> Before writing any NumPy. Be specific enough to be wrong.

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| Tokens in a 1,000-character English paragraph | _(guess)_ | _(after)_ |
| Same paragraph, but as source code | _(guess)_ | _(after)_ |
| Attention matrix entries at `T=512` | _(guess)_ | _(after)_ |
| Attention cost ratio, `T=10,000` vs `T=1,000` | _(guess)_ | _(after)_ |
| Output variance at `T=0` vs `T=1.5` on my own model | _(guess)_ | _(after)_ |

---

## Open questions

> Name them. Unnamed confusion just persists — and Week 1 will build on top of it.

- _(fill in)_

---

## Revisited

> Filled in **after** Week 0. Do not edit the predictions above to look smarter.

**Predictions that were wrong, and why:** _(after)_

**Can I now explain, from memory, why a token is not a word and why attention costs `T²`?**
_(after — this is Week 0's exit criterion)_

**Which Week 1 knob do I now understand mechanically rather than as a rule?** _(after)_

**New questions:** _(after — carry into [Week 1's THEORY.md](../week-01-llm-foundations/THEORY.md),
whose #6/#7 rows now point back here instead of doing a shallow pass)_
