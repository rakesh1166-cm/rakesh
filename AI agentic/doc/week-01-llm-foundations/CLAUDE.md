# Week 1 — LLM Foundations

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Tokenization, context windows, temperature, embeddings and hallucination — **measured, not read
about**. Ships a lab, not a service. No HTTP, no React, no database.

The real deliverable is the **seam**: `LLMPort` exists before any provider client, so every later
week talks to an interface rather than to Anthropic.

## Features (5)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F1.1](F1.1-typed-settings-and-model-tiers/CLAUDE.md) | Typed settings + model tier registry | `aiplat/config/` | — |
| [F1.2](F1.2-llm-port-and-anthropic-client/CLAUDE.md) | `LLMPort` + Anthropic client | `aiplat/llm/` | F1.1 |
| [F1.3](F1.3-token-accounting-and-context-guard/CLAUDE.md) | Token counting + context-window guard | `aiplat/llm/tokens.py` | F1.2 |
| [F1.4](F1.4-foundations-lab-experiments/CLAUDE.md) | Foundations lab (temperature, embeddings, hallucination) | `apps/w01_llm_lab/` | F1.2, F1.3 |
| [F1.5](F1.5-theory-notes-and-understand-first/CLAUDE.md) | Theory notes + the understand-first discipline | `doc/week-NN/THEORY.md` | — |

## Architecture flow

```
python script / experiment
      │
      └─→ aiplat.llm.ports.LLMPort          ← the seam, defined BEFORE any client
            ├─→ aiplat.llm.anthropic_client ──→ Claude API
            ├─→ aiplat.llm.tokens           (count, context-window guard)
            └─→ aiplat.config.settings      (env-driven, typed)

tests/conftest.py  →  MockLLM implements LLMPort  →  every test runs offline
```

## Folder delta

**Backend**
```
├── pyproject.toml · .env.example                      ← NEW
├── platform/pyproject.toml                            ← NEW  pip install -e ./platform
├── platform/src/aiplat/
│   ├── config/{settings.py, models.py}                ← NEW
│   └── llm/{ports.py, anthropic_client.py, tokens.py} ← NEW
├── apps/w01_llm_lab/{experiments/, embeddings_demo.py, README.md}  ← NEW
└── tests/conftest.py                                  ← NEW  mock LLM, frozen clock
```

**Frontend** — *none, deliberately.* No HTTP surface exists. The SSE contract that shapes the whole
frontend is not defined until Week 4; anything built now gets rewritten.

## Build order

1. **F1.1** — settings first, so nothing hardcodes a key or model ID.
2. **F1.2** — `ports.py` **before** `anthropic_client.py`. Write the protocol, then the impl.
3. **F1.3** — token accounting, because F1.4's experiments need it to be measurable.
4. **F1.4** — the experiments. Findings go in the app README as numbers, not adjectives.

## Week Definition of Done

- [ ] `pip install -e ./platform` works; `import aiplat` succeeds from any directory
- [ ] No file outside `aiplat/llm/anthropic_client.py` imports the `anthropic` SDK
- [ ] `MockLLM` implements `LLMPort`; the whole test suite runs with no network
- [ ] Token counts from `tokens.py` match the provider's reported usage within tolerance
- [ ] A deliberate context overflow is caught **before** the request is sent, not after a 400
- [ ] `apps/w01_llm_lab/README.md` records measured numbers for each experiment
- [ ] Secrets only via `.env`; `.env` is gitignored, `.env.example` is committed

## What this week unlocks

`LLMPort` is the single import point for Weeks 2–12. Because it exists first, Week 6's reranker,
Week 7's agent loop, and Week 10's specialists all depend on an interface — which is why
[CLAUDE-12-WEEK.md §11](../../CLAUDE-12-WEEK.md) can say `aiplat/llm` never becomes a service.
