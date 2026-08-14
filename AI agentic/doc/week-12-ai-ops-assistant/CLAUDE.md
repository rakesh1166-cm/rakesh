# Week 12 — 🏁 Capstone: Enterprise AI Operations Assistant

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Investigate errors → gather evidence → propose a fix → **require human approval** → write, and audit
everything. Every capability comes from Weeks 1–11.

**Kernel delta: none. Shared frontend delta: none.** That is the success criterion, not a nice
outcome. If the capstone needs a new `aiplat/` module or a new shared `hooks/`/`components/` file,
a boundary was drawn wrong somewhere in Weeks 1–11
([architecture §5](../../CLAUDE-12-WEEK.md)).

## Features (8)

| ID | Feature | Layer | Composes |
|---|---|---|---|
| [F12.1](F12.1-incident-intake-and-investigation-graph/CLAUDE.md) | Incident intake + investigation graph | `apps/w12/workflows/` | W8 graph · W11 guards |
| [F12.2](F12.2-evidence-gathering-with-citations/CLAUDE.md) | Evidence gathering with citations | `apps/w12/workflows/gather.py` | W5 · W6 · W7 · W9 |
| [F12.3](F12.3-fix-proposal-schema/CLAUDE.md) | Fix proposal: diff, rationale, confidence | `apps/w12/schemas.py` | W4 schemas · W6 confidence |
| [F12.4](F12.4-approval-policy-and-single-write-path/CLAUDE.md) | Approval policy + **the only** write path | `apps/w12/approvals/` | W8-F8.3 · W4-F4.3 scopes |
| [F12.5](F12.5-audit-trail-and-replay-eval/CLAUDE.md) | Audit trail + incident replay eval | `apps/w12/tests/` | W11-F11.6 · W11-F11.1 |
| [F12.6](F12.6-deployment-docker-ci-and-rollback/CLAUDE.md) | Deployment: Docker, CI/CD, secrets, rollback | `infra/` | **resolves ADR-013** · W11-F11.9 |
| [F12.7](F12.7-model-migration-procedure/CLAUDE.md) | Model migration procedure | `aiplat/llm/migration.py` | W11-F11.1 · W11-F11.10 · F12.6 |
| [F12.8](F12.8-architecture-writeup-and-teachback/CLAUDE.md) | Architecture write-up + teach-back | `doc/ASSESSMENT.md` | everything · W1-F1.5 |

## Architecture flow — every prior week, composed

```
  Alert / error report
        ▼
  services/api ── security.injection · limits (W11) · correlation (W2)
        ▼
  apps/w12_ai_ops_assistant/workflows/investigate.py
        ▼
  aiplat.graph (W8) ── durable · resumable · interruptible
        │
        ├─ node: gather    → aiplat.retrieval (W5/W6)  logs, runbooks, incidents + CITATIONS
        ├─ node: diagnose  → aiplat.orchestration.router (W10) → specialist
        ├─ node: act       → aiplat.agent.loop (W7) → aiplat.tools (W4) / aiplat.mcp (W9)
        │                     ⚠ READ-ONLY tools only at this stage
        ├─ node: propose   → Fix{diff, rationale, confidence, citations}   (W4 schemas, W6)
        │        ▼
        │   ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
        │   ┃  interrupts (W8) → PAUSE + checkpoint        ┃
        │   ┃  HUMAN APPROVAL REQUIRED before ANY write    ┃
        │   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
        │        ▼ approved (payload_hash verified)
        └─ node: commit    → write tool (idempotent, W4) → audit log (W11-F11.6)
        ▼
  SSE (W4 events) → useRunStream (W7) → weeks/w12/
        ▼
  evals (W11) score the whole pipeline in CI
```

## Folder delta

**Backend — apps and infra only**
```
├── apps/w12_ai_ops_assistant/
│   ├── workflows/investigate.py · gather.py         ← NEW
│   ├── approvals/policy.py                           ← NEW
│   ├── schemas.py · router.py · tests/               ← NEW
│   └── README.md
├── infra/docker-compose.yml                          ← EDIT api + agent-runner + mcp-server + pg + redis
├── infra/ci/deploy.yml                               ← NEW
└── platform/src/aiplat/                              ← UNCHANGED  ⭐ the backend exam result
```

**Frontend — `weeks/` only**
```
└── src/
    ├── weeks/registry.js                             ← EDIT + w12
    ├── weeks/w12/{IncidentView, DiffReview, ApprovalGate, AuditTrail}.jsx  ← NEW
    ├── hooks/                                        ← UNCHANGED  ⭐ the frontend exam result
    └── components/                                   ← UNCHANGED  ⭐
```

## Build order

1. **F12.3** the `Fix` schema — schema first, as always. Everything else produces or consumes it.
2. **F12.1** the graph skeleton with read-only nodes.
3. **F12.2** evidence gathering.
4. **F12.4** the approval policy and the single write path.
5. **F12.5** audit trail + the replay corpus.

## Week Definition of Done

- [ ] **No external write occurs without a recorded human approval** — proven by test, not by review
- [ ] The executed payload provably equals the approved payload (hash, W8-F8.3)
- [ ] Every proposed fix carries citations and a confidence score; low confidence refuses
- [ ] The incident replay corpus passes in CI under the W11 gate
- [ ] `git diff platform/src/aiplat/` for this week is **empty**
- [ ] `git diff frontend/src/hooks frontend/src/components` for this week is **empty**
- [ ] An unavailable audit sink blocks writes rather than allowing them silently

## The exam

The two empty diffs above are the point of the entire twelve weeks. Everything the capstone needs —
bounded tools, durable pause, human approval, citations, confidence, cost caps, tracing — was built
because an earlier week needed it, and generalised only when a *second* week did.

If `aiplat/` had to change here, go find which week's boundary was wrong. That is a more valuable
outcome than a working capstone.
