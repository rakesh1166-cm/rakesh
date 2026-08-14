# Week 3 — Prompts as Versioned Software

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Prompts stop being string literals and become **versioned, tested, regression-gated artifacts**.
No new runtime layer — this week changes *where prompts live* and *what happens when one is edited*.

Timing is the point: prompts must be versioned **before** Week 4 ties them to structured output
schemas. Editing a prompt that a schema depends on, with no version history and no scored diff, is
exactly how a silent regression ships.

## Features (4)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F3.1](F3.1-prompt-registry-and-versioning/CLAUDE.md) | Prompt registry, immutable versions | `aiplat/prompts/registry.py` | W2-F2.5 |
| [F3.2](F3.2-template-render-and-variable-validation/CLAUDE.md) | Rendering + variable validation | `aiplat/prompts/render.py` | F3.1 |
| [F3.3](F3.3-golden-suites-and-scoring/CLAUDE.md) | Golden-case suites + scoring | `apps/w03_prompt_lab/suites/` | F3.2 |
| [F3.4](F3.4-regression-gate-and-diff-ui/CLAUDE.md) | Regression gate + diff UI | `tests/regression/`, `weeks/w03/` | F3.3 |

## Architecture flow

```
weeks/w03/VersionPicker.jsx ──GET /api/w03/prompts──► available (name, version) pairs
      │
      └─ POST /api/w03/compare {name, versions:[v1,v2], input}
             ▼
      apps/w03_prompt_lab/service.py
             └─► aiplat.prompts.registry.get(name, version)      ← NEW node in every LLM path
                   └─► aiplat.prompts.render(template, vars)     ← validates every variable
                         └─► aiplat.llm.complete
             ▼
      {v1: output, v2: output, scores} → PromptDiffView.jsx
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/prompts/
│   ├── registry.py · render.py                     ← NEW
│   └── templates/{summarize/v1.md,v2.md, classify/v1.md, extract/v1.md}  ← NEW
├── apps/w02_ai_service/service.py                  ← EDIT inline strings → registry.get()
├── apps/w03_prompt_lab/{router.py, suites/}        ← NEW
└── tests/regression/                               ← NEW  build fails when scores move
```

**Frontend**
```
└── src/weeks/
    ├── registry.js                                 ← EDIT + w03
    └── w03/{VersionPicker, PromptDiffView, SuiteScoreTable}.jsx  ← NEW
```

## Build order

1. **F3.1** registry — the storage and lookup contract.
2. **F3.2** render + variable validation — a missing variable must fail before the LLM call.
3. **F3.3** golden suites — you cannot gate on scores you do not yet compute.
4. **F3.4** gate + UI — wire the score diff into CI and make it visible.

## Week Definition of Done

- [ ] Zero inline prompt strings anywhere in `apps/` or `services/` — enforced by a scan test
- [ ] Every prompt is addressed by `(name, version)`; a shipped version file is immutable
- [ ] A missing template variable fails loudly *before* any token is spent
- [ ] Each prompt has a golden suite with ≥10 cases and recorded baseline scores
- [ ] Editing a prompt and re-running produces a scored diff, visible in `SuiteScoreTable`
- [ ] W2's four endpoints now load their prompts from the registry, unchanged in behaviour

## What this week unlocks

Week 11's CI eval gate is this machinery scaled up: suites become datasets, the score diff becomes
a merge blocker. Building the diff now, on four simple prompts, is far cheaper than retrofitting it
across twelve weeks of prompts later.
