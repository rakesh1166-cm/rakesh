# W12-F12.7 — Model Migration Procedure

> [Week 12](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/llm/migration.py` + `doc/runbooks/model-migration.md`
**Depends on:** [W11-F11.1](../../week-11-evals-security-observability/F11.1-eval-harness-and-datasets/CLAUDE.md), [W11-F11.10](../../week-11-evals-security-observability/F11.10-unit-economics-and-cost-forecasting/CLAUDE.md), [F12.6](../F12.6-deployment-docker-ci-and-rollback/CLAUDE.md)
**Consumed by:** every future model release — i.e. every few months, forever

## Goal

A new model ships. **This happens continuously and is the most common large change an AI system
ever undergoes** — yet almost nobody has a procedure for it, so migrations are done by vibes and
regressions are discovered by users.

Everything needed already exists: tiering ([W1-F1.1](../../week-01-llm-foundations/F1.1-typed-settings-and-model-tiers/CLAUDE.md)),
evals ([W11-F11.1](../../week-11-evals-security-observability/F11.1-eval-harness-and-datasets/CLAUDE.md)),
trajectory replay ([W7-F7.6](../../week-07-tool-agent/F7.6-trajectory-recording-and-replay-debugging/CLAUDE.md)),
unit economics ([W11-F11.10](../../week-11-evals-security-observability/F11.10-unit-economics-and-cost-forecasting/CLAUDE.md)),
manifests ([F12.6](../F12.6-deployment-docker-ci-and-rollback/CLAUDE.md)). This feature is the
**procedure that composes them** — which is why it belongs in the capstone.

## Contract (schema first)

```python
class MigrationCandidate(BaseModel):
    from_model: str; to_model: str
    tier: ModelTier
    reason: Literal["new_release","deprecation","cost","quality","capability"]
    deprecation_date: date | None      # forced migrations have a deadline

class MigrationEvidence(BaseModel):
    eval_delta: ScoreDelta             # W11 — quality, per suite AND per tag
    cost_delta_pct: float              # W11-F11.10 — per UNIT, not per token ⚠
    latency_delta_pct: float
    trajectory_diffs: int              # W7-F7.6 — behaviour changes on recorded runs
    prompt_regressions: list[str]      # prompts that need rework for the new model
    tool_use_delta: dict[str, float]   # does it call tools differently?
    refusal_rate_delta: float          # W6 — over/under-refusal shifts are easy to miss

class MigrationPlan(BaseModel):
    candidate: MigrationCandidate
    evidence: MigrationEvidence
    rollout: Literal["shadow","canary_10","canary_50","full"]
    rollback_trigger: dict[str, float]  # {"pass_rate_drop":0.02,"cost_increase":0.15}
    prompt_work_required: list[str]
    decision: Literal["adopt","reject","defer","adopt_after_prompt_work"]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/llm/migration.py` | NEW | shadow runner, evidence collection |
| `platform/src/aiplat/llm/tiering.py` | EDIT | per-tier canary split |
| `doc/runbooks/model-migration.md` | NEW | the human procedure |
| `apps/w11_eval_guardrails/router.py` | EDIT | `/migration/evidence` |

## Flow

```
1. SHADOW — zero user impact
   replay recorded trajectories (W7-F7.6, STRICT off / TOOLS mode) against the new model
   run every eval suite (W11-F11.1) on both models
        ▼
2. EVIDENCE
   quality per suite AND per tag · cost per UNIT · latency · trajectory diffs
   · tool-use pattern shifts · refusal-rate shift
        ▼
3. DECIDE
   worse on any zero-tolerance tag ──► reject
   needs prompt rework            ──► adopt_after_prompt_work (new prompt VERSIONS, W3-F3.1)
   better/equal + acceptable cost ──► canary
        ▼
4. CANARY — cheapest tier first, one tier at a time
   10% → watch → 50% → watch → 100%
   rollback_trigger breached at any point ──► revert that tier immediately
        ▼
5. BAKE — the old model stays configured for one full release cycle (F12.6 manifest)
```

## Rules

- **Cost is compared per unit, not per token** (W11-F11.10). A model with 30% cheaper tokens that
  is chattier, or calls more tools, can cost *more* per itinerary. Token price is a headline, not a
  number you can act on.
- **Migrate one tier at a time**, cheapest first. Moving `fallback` first exposes the new model to
  real traffic at the lowest quality stakes and the lowest cost of being wrong.
- **Prompts are model-specific in practice.** A prompt tuned for one model routinely underperforms
  on its successor. `prompt_regressions` names them, and the fix is a new prompt **version**
  (W3-F3.1) — never an edit to a frozen one.
- **Watch tool-use patterns, not just output quality.** A new model that calls three tools where the
  old called one scores identically on output and costs triple. Only trajectory comparison
  (W7-F7.6) surfaces that.
- **Watch the refusal rate in both directions.** A model that refuses less looks better on quality
  scores while being *worse* on safety — one of the easiest regressions to ship accidentally.
- **Never migrate all tiers in one release.** If quality drops you cannot attribute it, and
  attribution is the whole reason to have tiers.
- **Keep the old model configured for a full cycle.** Rollback is a config change, not a redeploy.
- **Deprecation deadlines make migration mandatory** — start shadow-testing on announcement, not on
  the deadline.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| New model better on quality, worse per unit cost | Evidence shows both; decision is explicit |
| New model regresses one adversarial case | Rejected — zero tolerance (W11-F11.3) |
| New model calls more tools for the same result | `tool_use_delta` catches it; cost per unit reflects it |
| Refusal rate drops sharply | Flagged as a **safety** regression, not a quality win |
| Prompt needs rework | `adopt_after_prompt_work`; new versions, then re-evaluate |
| Canary breaches a trigger | That tier reverts immediately, automatically |
| Old model deprecated with no successor passing | Documented risk; deadline escalated early |
| Model id changed without a manifest update | Startup verification fails (F12.6) |

## Tests

- `test_shadow_evaluation_has_zero_user_impact`
- `test_cost_comparison_is_per_unit_not_per_token`
- `test_tool_use_pattern_shift_is_detected`
- `test_refusal_rate_drop_is_flagged_as_a_safety_regression`
- `test_canary_rollback_trigger_reverts_one_tier_only`
- `test_old_model_remains_configured_for_one_cycle`

## Acceptance criteria

- [ ] `doc/runbooks/model-migration.md` is executable by someone who did not build the system
- [ ] Shadow evaluation runs with no user impact and produces full evidence
- [ ] Decisions cite quality, per-unit cost, latency, tool-use, and refusal-rate deltas
- [ ] Canary is per-tier with automatic rollback triggers
- [ ] Rollback is a config change, not a redeploy
- [ ] The procedure has been rehearsed once end-to-end, even without a new model to adopt
