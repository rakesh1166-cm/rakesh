# Week 11 — Evaluation, Security, Observability

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

**Nothing new ships to users. Everything already built becomes provable.**

≥50 test cases per service, security controls enforced on every request, and full-stack tracing that
resolves a single correlation ID into the complete story of what a request did and what it cost.

This week closes loops opened long ago: the contextvar from W2-F2.2 finally becomes a user-visible
trace; the golden suites from W3-F3.3 grow into a CI merge gate; the injection guard from W4-F4.1
gets a real corpus thrown at it.

## Features (10)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F11.1](F11.1-eval-harness-and-datasets/CLAUDE.md) | Eval harness + datasets | `aiplat/evals/harness.py` | W3-F3.3 |
| [F11.2](F11.2-scorers/CLAUDE.md) | Scorers: exact, schema, judge, citation | `aiplat/evals/scorers/` | F11.1 |
| [F11.3](F11.3-ci-regression-gate/CLAUDE.md) | CI regression gate | `infra/ci/eval-gate.yml` | F11.2 |
| [F11.4](F11.4-prompt-injection-defense/CLAUDE.md) | Prompt-injection defense + corpus | `aiplat/security/injection.py` | W4-F4.1 |
| [F11.5](F11.5-rate-limits-and-cost-caps/CLAUDE.md) | Rate limits + per-user cost caps | `aiplat/security/limits.py` | W2-F2.2 |
| [F11.6](F11.6-redaction-audit-log-and-traceview/CLAUDE.md) | Redaction, audit log, `TraceView` | `aiplat/obs/redact.py` | W2-F2.2 |
| [F11.7](F11.7-output-guardrails/CLAUDE.md) | Output guardrails (PII, secrets, cross-tenant) | `aiplat/security/output_guard.py` | F11.6 |
| [F11.8](F11.8-production-feedback-to-eval-dataset/CLAUDE.md) | Production feedback → eval dataset | `aiplat/evals/feedback.py` | F11.1, W7-F7.6 |
| [F11.9](F11.9-load-and-capacity-testing/CLAUDE.md) | Load, concurrency + capacity testing | `apps/w11_eval_guardrails/load/` | F11.5 |
| [F11.10](F11.10-unit-economics-and-cost-forecasting/CLAUDE.md) | Unit economics + cost forecasting | `aiplat/obs/economics.py` | F11.5, F11.6 |

## Architecture flow

```
EVAL PATH (CI + on demand)              GUARD PATH (every request, W11 onward)
  evals.datasets                          inbound
        ▼                                   ▼
  evals.harness                         security.injection   user text = DATA, never authority
        ▼                                   ▼
  run suite vs. app under test          security.limits      rate + per-user cost cap
        ▼                                   ▼
  scorers/ {exact, schema_valid,        security.authz       tool authorization matrix
            llm_judge, citation}            ▼
        ▼                                 [ the week's app ]
  score diff vs. baseline                   ▼
        ▼                                 security.egress    outbound host allow-list
  infra/ci → BLOCK MERGE on regression      ▼
        ▼                                 obs.redact         PII · secrets · retrieved docs
  weeks/w11/ScoreDiff.jsx                   ▼
                                          obs.logging (operational) + audit log (SEPARATE)
                                            ▼
                                          weeks/w11/TraceView.jsx ← one correlation ID,
                                                                    full span tree, with cost
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── evals/{harness.py, scorers/, datasets/}     ← NEW
│   ├── security/{injection.py, limits.py}          ← NEW  (authz W9 · egress W4 present)
│   └── obs/redact.py                                ← NEW
├── apps/w11_eval_guardrails/{suites/, router.py}   ← NEW
└── infra/ci/eval-gate.yml                           ← NEW  ⚑ merge blocked on regression
```

**Frontend**
```
└── src/
    ├── components/CostBadge.jsx                     ← EDIT + budget remaining
    └── weeks/w11/{ObservabilityDashboard, EvalRunView, ScoreDiff, TraceView}.jsx  ← NEW
```

## Build order

1. **F11.1** harness — the runner before the scorers.
2. **F11.2** scorers — cheap and deterministic first, LLM judge last.
3. **F11.4** injection defense — before the gate, so the gate can enforce it.
4. **F11.5** limits — the other half of the guard path.
5. **F11.6** redaction + audit + trace — redaction must land before traces become browsable.
6. **F11.3** the CI gate — last, once there is something worth gating on.

## Week Definition of Done

- [ ] ≥50 eval cases per service (W02, W04, W06, W07, and W12 when it lands)
- [ ] A prompt or code change that lowers scores **blocks the merge**, naming the failing cases
- [ ] The prompt-injection corpus fails to make any tool execute outside its scope
- [ ] Per-user rate limits and daily cost caps are enforced and visible
- [ ] No user PII appears in operational logs — asserted by a scan, not by review
- [ ] Audit logs are separate from operational logs, and retained
- [ ] Any support question is answerable by pasting a correlation ID into `TraceView`

## What this week unlocks

Week 12 ships an assistant that proposes changes to production systems. Every claim it makes about
its own safety — bounded tools, mandatory approval, no PII leakage, no injection-driven escalation —
is only credible because it is measured here.
