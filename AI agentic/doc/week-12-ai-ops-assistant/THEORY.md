# Week 12 — Theory 🏁

> Written **before** Week 12's code. Revisited after. · [Week 12](CLAUDE.md) · [why this file exists](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
>
> **Concepts from the ladder:** #25 Production Agentic AI *(continued)* — the ladder ends here.
> Everything below is beyond it, and it is what actually keeps an agentic system alive.

---

## The 5 concepts (10–15 min each)

| Concept | In one sentence, in my own words | Where it bites in this week's code |
|---|---|---|
| **Composition over construction** | _(fill in)_ | The capstone adds **no** kernel code. If it needs any, an earlier boundary was wrong |
| **Blast radius & approval policy** | _(fill in)_ | [F12.4](F12.4-approval-policy-and-single-write-path/CLAUDE.md) — a global change needs higher confidence and two approvers |
| **Single write path** | _(fill in)_ | [F12.4](F12.4-approval-policy-and-single-write-path/CLAUDE.md) — one code path touches the outside world, enforced by a repo-wide test |
| **Release manifests** | _(fill in)_ | [F12.6](F12.6-deployment-docker-ci-and-rollback/CLAUDE.md) — code + prompts + graphs + baselines roll back **together** |
| **Model migration** | _(fill in)_ | [F12.7](F12.7-model-migration-procedure/CLAUDE.md) — the most frequent large change any AI system undergoes, and almost nobody has a procedure |

### Study prompts

- What makes an AI action *irreversible*, and what must be true before one executes?
- The audit sink is down. Do you make the change? Justify it in one sentence.
- You roll back the code but not the prompts. What configuration is now running? Was it ever tested?
- A new model has 30% cheaper tokens. Is your system cheaper? What would you have to measure?
- An assistant is confidently wrong vs. correctly uncertain. Which is more dangerous, and which do
  your evals currently reward?
- **The real question:** what would make you trust this thing to change production?

---

## What I predicted

**I expect to be hard:** _(fill in)_
**I expect to work first try:** _(fill in)_

| Measurement | My guess | Actual |
|---|---|---|
| **Lines changed in `platform/src/aiplat/`** | _(guess — the design says 0)_ | _(after)_ |
| **Lines changed in `frontend/src/{hooks,components}/`** | _(guess — the design says 0)_ | _(after)_ |
| Replay corpus pass rate | _(guess)_ | _(after)_ |
| Cost per incident investigation | _(guess)_ | _(after)_ |

---

## Open questions

- _(fill in)_
- _(carried from [Week 11](../week-11-evals-security-observability/THEORY.md): …)_

---

## Revisited

**Predictions that were wrong, and why:** _(after)_

**Were both diffs empty?** If not, name the week whose boundary was drawn wrong. That finding is
worth more than a working capstone. _(after)_

**Every unanswered question from all twelve `THEORY.md` files** now carries into
[`doc/ASSESSMENT.md` §6](F12.8-architecture-writeup-and-teachback/CLAUDE.md) — "what I still do not
know". An honest list there is a stronger signal of expertise than a list of what you do.

**The loop closes:** Understand ([W1-F1.5](../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md))
→ Build → Break → Debug → Improve → Test → Explain ([F12.8](F12.8-architecture-writeup-and-teachback/CLAUDE.md)).
