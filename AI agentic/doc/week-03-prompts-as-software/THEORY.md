# Week 3 — Theory

> Written **before** Week 3's code. Revisited after. · [Week 3](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #12 Prompt Engineering
> The other four below are what the ladder's single "prompt engineering" box actually contains once
> you have to maintain prompts rather than write them.

---

## The 5 concepts (10–15 min each)

| # | Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|---|
| 12 | **Prompt engineering** | _(fill in)_ | [F3.1](F3.1-prompt-registry-and-versioning/CLAUDE.md) — the techniques (role, few-shot, structure) are the easy half |
| — | **Prompts as versioned artifacts** | _(fill in)_ | [F3.1](F3.1-prompt-registry-and-versioning/CLAUDE.md) — why a shipped `v2` is *frozen* by checksum, and why "just edit it" is the bug |
| — | **Data/instruction separation** | _(fill in)_ | [F3.2](F3.2-template-render-and-variable-validation/CLAUDE.md) — user text substituted as **data**; the first layer of injection defense |
| — | **Golden datasets & property assertions** | _(fill in)_ | [F3.3](F3.3-golden-suites-and-scoring/CLAUDE.md) — why you assert *properties*, never exact strings |
| — | **Regression gating** | _(fill in)_ | [F3.4](F3.4-regression-gate-and-diff-ui/CLAUDE.md) — a prompt edit is a code change; it needs CI |

### Study prompts

- Name three prompting techniques and, for each, the failure mode it *causes* when overused.
- A prompt gets 4% better and 2× more expensive. Better or worse? What would make you sure?
- You edit a prompt and outputs "seem better". What would you need to believe that?
- Why is `contains("Rome")` a better assertion than `equals("<exact paragraph>")`?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_
**My guess:** how many of my Week 2 prompts will need a `v2` once they have a golden suite pointed
at them? _(guess)_ → _(actual)_

---

## Open questions

- _(fill in)_
- _(carried from [Week 2](../week-02-fastapi-ai-service/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_
**Open questions now answered:** _(after)_
**New questions:** _(after — carry into [Week 4](../week-04-holidaylandmarks/THEORY.md))_
