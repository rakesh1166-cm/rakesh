# doc/ — Feature Specification Index

Every week of the [12-week architecture](../CLAUDE-12-WEEK.md) has a folder here. Every folder has
a **week root `CLAUDE.md`** (objective, feature table, folder delta, build order, DoD) and one
subfolder per feature, each with its own **feature `CLAUDE.md`** (contract, files, flow, failure
modes, tests, acceptance criteria).

> **Docs before code** ([CLAUDE.md §1](../CLAUDE.md)). A feature is specified here *before* it is
> implemented. If the implementation diverges, update the feature's CLAUDE.md in the same change.

---

## Index

| Week | Folder | Feat. | Theory | Theme |
|---|---|---|---|---|
| 0 | [week-00-transformer-foundations](week-00-transformer-foundations/CLAUDE.md) | 7 | [THEORY](week-00-transformer-foundations/THEORY.md) | 🧱 Transformer, attention, tokens/tokenization, embeddings — built from scratch, before any LLM |
| 1 | [week-01-llm-foundations](week-01-llm-foundations/CLAUDE.md) | 5 | [THEORY](week-01-llm-foundations/THEORY.md) | Typed settings, LLM port, token accounting, theory notes |
| 2 | [week-02-fastapi-ai-service](week-02-fastapi-ai-service/CLAUDE.md) | 6 | [THEORY](week-02-fastapi-ai-service/THEORY.md) | First service, correlation IDs, resilience, SPA shell |
| 3 | [week-03-prompts-as-software](week-03-prompts-as-software/CLAUDE.md) | 4 | [THEORY](week-03-prompts-as-software/THEORY.md) | Prompt registry, versioning, regression gate |
| 4 | [week-04-holidaylandmarks](week-04-holidaylandmarks/CLAUDE.md) | 8 | [THEORY](week-04-holidaylandmarks/THEORY.md) | ⭐ Structured output + tools + SSE + memory (current project) |
| 5 | [week-05-pgvector-search](week-05-pgvector-search/CLAUDE.md) | 5 | [THEORY](week-05-pgvector-search/THEORY.md) | Chunking, embeddings, pgvector, ingest, caching |
| 6 | [week-06-rag-pipeline](week-06-rag-pipeline/CLAUDE.md) | 6 | [THEORY](week-06-rag-pipeline/THEORY.md) | Hybrid retrieval, rerank, citations, confidence, refusal |
| 7 | [week-07-tool-agent](week-07-tool-agent/CLAUDE.md) | 6 | [THEORY](week-07-tool-agent/THEORY.md) | Bounded loop, Redis state, guards, worker, trajectories |
| 8 | [week-08-graph-workflows](week-08-graph-workflows/CLAUDE.md) | 4 | [THEORY](week-08-graph-workflows/THEORY.md) | LangGraph, checkpoints, human interrupts |
| 9 | [week-09-mcp-tools](week-09-mcp-tools/CLAUDE.md) | 5 | [THEORY](week-09-mcp-tools/THEORY.md) | MCP tools, resources, prompts, scope bounds, client |
| 10 | [week-10-multi-agent](week-10-multi-agent/CLAUDE.md) | 4 | [THEORY](week-10-multi-agent/THEORY.md) | Router, supervisor, baseline, deletion pass |
| 11 | [week-11-evals-security-observability](week-11-evals-security-observability/CLAUDE.md) | 10 | [THEORY](week-11-evals-security-observability/THEORY.md) | Evals, CI gate, guardrails, feedback loop, load, economics |
| 12 | [week-12-ai-ops-assistant](week-12-ai-ops-assistant/CLAUDE.md) | 8 | [THEORY](week-12-ai-ops-assistant/THEORY.md) | 🏁 Capstone + deployment, model migration, write-up |

**78 features total · 13 theory notes.**

### Concept ladder → week mapping

The 25-step ladder is a **glossary, not a path**. Items are pulled into the week that needs them,
via each `THEORY.md`:

| Ladder items | Land in |
|---|---|
| #6 Transformer · #7 Attention · #8 Tokens · #9 Embeddings — *built from scratch* | **Week 0** |
| #10 LLM · #11 Generative AI · #8/#9 *revisited as API behaviour* | Week 1 |
| *(none — engineering, not AI)* | Week 2 |
| #12 Prompt Engineering | Week 3 |
| #15 Tool/Function Calling · #16 AI Agents *(definition)* · #17 Memory | Week 4 |
| #14 Vector Database · #9 Embeddings *(deeper)* | Week 5 |
| #13 RAG | Week 6 |
| #18 Planning+Reasoning · #19 ReAct · #20 Agentic AI · #16 *(properly)* | Week 7 |
| #23 LangGraph · #17 Memory *(durable state)* | Week 8 |
| #24 MCP | Week 9 |
| #21 Multi-Agent Systems | Week 10 |
| #25 Production Agentic AI | Weeks 11–12 |

**Skipped:** #1–#5 (AI → ML → DL → Neural Networks → NLP) — model-*building* theory, months of it,
not required to ship. Revisit after Week 12. · **#22 LangChain** — skipped permanently per
[ADR-004](../TECH-STACK-DECISIONS.md): plain Python until Week 8's resumability need forces LangGraph.

**What the ladder is missing:** its final box, "#25 Production Agentic AI", is 18 features across
Weeks 11–12 here — evals, injection defense, cost caps, output guardrails, deployment, model
migration. That is where agentic systems actually fail.

> **Week 0 is a prerequisite lab, not part of the 12-week runtime architecture.** It sits before
> Week 1 because the [blog's learning order](https://www.debug.school/rakeshdevcotocus_468/ai-to-agentic-ai-understanding-the-relationship-between-ai-ml-data-science-genai-llms-and-ai-5006)
> puts **Transformer (6) → Attention (7) → Tokens/Tokenization (8) → Embeddings (9)** *before*
> **LLM (10)**, which is where Week 1 starts. It ships pure-NumPy labs under
> `apps/w00_transformer_lab/` — no `aiplat`, no HTTP, no network — so it adds nothing to
> [CLAUDE-12-WEEK.md](../CLAUDE-12-WEEK.md)'s kernel. Skip it only if you can already explain, from
> memory, why a token is not a word and why attention costs `T²`.

### The blog's full loop

The blog's method is **Understand → Build → Break → Debug → Improve → Test → Explain.** Feature
files cover Build / Break / Test by construction. The two ends are owned explicitly:

- **Understand** — [W1-F1.5](week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
  installs a one-page `THEORY.md` per week, written *before* that week's code, with predictions that
  get checked afterwards. Its first instance is
  [W0-F0.1](week-00-transformer-foundations/F0.1-concept-map-and-theory-note/CLAUDE.md); Week 0 as a
  whole is the deepest form of *Understand* — you build the mechanism before you call the API.
- **Explain** — [W12-F12.8](week-12-ai-ops-assistant/F12.8-architecture-writeup-and-teachback/CLAUDE.md)
  is `doc/ASSESSMENT.md` + teach-backs, closing [feature.md §9](feature.md) milestone 7.

Neither is optional. A week that ships code without a completed theory note is incomplete, and the
repo is not finished until the write-up survives three audiences.

---

## Feature ID scheme

`W<week>-F<week>.<n>` — e.g. **W4-F4.2** is Week 4, feature 2. The folder is
`week-04-holidaylandmarks/F4.2-itinerary-schema-and-repair/CLAUDE.md`.

Week 4 additionally maps onto the legacy F1–F15 IDs in [feature.md](feature.md), which stays the
narrative scope document for HolidayLandmarks. Each Week-4 feature file names the F-IDs it covers.

---

## Every feature CLAUDE.md has the same seven sections

1. **Goal** — what exists after this feature that did not before.
2. **Contract (schema first)** — the Pydantic model or TypeScript-ish shape, *before* any prose
   about implementation. [CLAUDE.md §4](../CLAUDE.md) requires the schema first.
3. **Files** — exact paths, New/Edit, one-line responsibility each.
4. **Flow** — where this sits in the request path.
5. **Rules** — the non-negotiables (bounds, validation, dependency direction).
6. **Failure modes** — injected failure → required behaviour. Not optional; this is the
   *Break & Debug* step of the master prompt.
7. **Tests + Acceptance criteria** — checkable, not aspirational.

---

## Working rules

- A feature is **done** when its acceptance checkboxes are ticked *in its own file*.
- A feature that turns out to need a new kernel module late (W9+) is a **design smell** — check
  [CLAUDE-12-WEEK.md §8](../CLAUDE-12-WEEK.md) before adding it.
- The **second-use rule**: the first week to need something writes it in `apps/` or `weeks/wNN/`;
  the second week to need it promotes it to `aiplat/` or `components/` in the same PR.
- Reference: [Master Prompt](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)
  · [TECH-STACK-DECISIONS.md](../TECH-STACK-DECISIONS.md) · [RUN.md](../RUN.md)
