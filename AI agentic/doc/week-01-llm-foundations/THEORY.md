# Week 1 — Theory

> Written **before** Week 1's code. Revisited after. · [Week 1](CLAUDE.md) · [why this file exists](F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts pulled from the ladder:** #10 LLM · #11 Generative AI · #8 Tokens · #9 Embeddings
> *(both revisited — now as API behaviour rather than mechanism)*
> **Already built in [Week 0](../week-00-transformer-foundations/THEORY.md):** #6 Transformer ·
> #7 Attention · #8 Tokens · #9 Embeddings. If you did Week 0, the rows below are recognition, not
> new learning. If you skipped it, do the "light" pass — one hour, not one month.
> **Deliberately skipped:** #1–#5 (AI → ML → DL → Neural Networks → NLP). Model-*building* theory;
> you are model-*using*. Revisit after Week 12 if you want it.

---

## The 6 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 8 | **Tokens / tokenization** | _(fill in)_ | [F1.3](F1.3-token-accounting-and-context-guard/CLAUDE.md) — you must count tokens *before* sending. `len(text)//4` drifts badly on code and non-English, which is why `tokens.py` uses the real tokenizer |
| 9 | **Embeddings** | _(fill in)_ | [F1.4](F1.4-foundations-lab-experiments/CLAUDE.md) `embeddings_demo.py`. The **negated pair** result is the one that matters — it's what makes Week 5 retrieval behave strangely |
| 10 | **LLM** | _(fill in)_ | [F1.2](F1.2-llm-port-and-anthropic-client/CLAUDE.md) — `LLMPort` is an interface over a *stateless* function. Every "memory" in this repo is something you rebuild and resend |
| 11 | **Generative AI** | _(fill in)_ | [F1.4](F1.4-foundations-lab-experiments/CLAUDE.md) temperature experiment. Why `temperature=0.0` is the default in `CompletionRequest` — determinism first |
| 6 | **Transformer** | _(fill in)_ | Why context has a hard ceiling at all, and why long context costs disproportionately. Justifies `TokenBudget` existing. **Built in [W0-F0.5/F0.6](../week-00-transformer-foundations/CLAUDE.md)** |
| 7 | **Attention** | _(fill in)_ | Why position in the prompt matters — the basis for [W3-F3.2](../week-03-prompts-as-software/F3.2-template-render-and-variable-validation/CLAUDE.md)'s data/instruction separation. **Built in [W0-F0.4](../week-00-transformer-foundations/F0.4-attention-from-scratch/CLAUDE.md)** |

**If you skipped Week 0**, treat #6 and #7 as a one-hour pass: enough to explain why cost grows
faster than linearly with context and why token order matters. Not the math, not the paper.
**If you did Week 0**, you already printed an attention matrix — write down here what that changed.

### Study prompts — answer these, don't summarise the topic

- **Tokens:** why is a token not a word, and not a character? What does that do to non-English text
  and to code? What is your model's context window, in tokens, *exactly*?
- **Embeddings:** two sentences that mean the opposite — are they far apart in embedding space?
  Guess first, then measure in the lab. (This one usually surprises people.)
- **LLM:** the API is stateless. So where does a "conversation" actually live?
- **Generative AI:** what does temperature change, mechanically? What is `temperature=0` *not*?
- **Transformer/Attention:** if I double the prompt length, what happens to cost and to latency?

---

## What I predicted

> Before writing any code. Be specific enough to be wrong.

**I expect to be hard:**
- _(fill in)_

**I expect to work first try:**
- _(fill in)_

**My guess at the numbers** — write these down *before* running [F1.4](F1.4-foundations-lab-experiments/CLAUDE.md):

| Measurement | My guess | Actual |
|---|---|---|
| Output variance at `temperature=0` vs `1.0`, over 10 runs | _(guess)_ | _(after)_ |
| Cosine similarity: related sentence pair | _(guess)_ | _(after)_ |
| Cosine similarity: **negated** pair ("X is safe" / "X is not safe") | _(guess)_ | _(after)_ |
| Hallucination rate on invented-landmark questions | _(guess)_ | _(after)_ |
| Tokens in a 1,000-character English paragraph | _(guess)_ | _(after)_ |

---

## Open questions

> Things I do not understand yet. Name them — unnamed confusion just persists.

- _(fill in)_

---

## Revisited

> Filled in **after** Week 1. Do not edit the predictions above to look smarter — the gap is the record.

**Predictions that were wrong, and why:**
- _(fill in after)_

**Open questions now answered:**
- _(fill in after)_

**New questions this week created:**
- _(fill in after — these carry into [Week 2's THEORY.md](../week-02-fastapi-ai-service/THEORY.md))_

**Which concept turned out to matter most in the code?**
- _(fill in after)_
