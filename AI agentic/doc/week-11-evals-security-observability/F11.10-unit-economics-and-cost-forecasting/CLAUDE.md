# W11-F11.10 — Unit Economics + Cost Forecasting

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/obs/economics.py` (kernel)
**Depends on:** [F11.5](../F11.5-rate-limits-and-cost-caps/CLAUDE.md), [F11.6](../F11.6-redaction-audit-log-and-traceview/CLAUDE.md)
**Consumed by:** [F12.7](../../week-12-ai-ops-assistant/F12.7-model-migration-procedure/CLAUDE.md), every model-tier decision

## Goal

F11.5 stops runaway spend. It does not answer the question that decides whether an AI product
exists: **what does one unit of value cost, and does it scale?**

"$0.31 per itinerary, 62% of it reranking, projecting $9,300/month at 1,000 daily users" is a
product decision. "We spent $4,200 last month" is a bill. The distinction is what separates
engineers who ship AI features from engineers who ship AI features that survive review.

## Contract (schema first)

```python
class UnitKind(str, Enum):
    ITINERARY = "itinerary"        # W4
    RAG_ANSWER = "rag_answer"      # W6
    AGENT_RUN  = "agent_run"       # W7
    INCIDENT   = "incident"        # W12

class UnitCost(BaseModel):
    unit: UnitKind
    correlation_id: str
    total_usd: float
    breakdown: dict[str, float]    # {"llm.plan":0.11,"retrieval.embed":0.01,"rerank.judge":0.19}
    cache_saved_usd: float         # W5-F5.5 — what caching actually returned
    tokens_in: int; tokens_out: int; cache_read_tokens: int
    model_mix: dict[str, int]      # tier usage — where tiering (W1-F1.1) is or is not working
    succeeded: bool                # FAILED units still cost money and must be counted

class UnitEconomics(BaseModel):
    unit: UnitKind; period: str
    count: int
    p50_usd: float; p95_usd: float   # p95 matters — the tail is what blows budgets
    mean_usd: float; total_usd: float
    cost_per_successful_unit: float  # ⚠ total spend / SUCCESSFUL units. The honest number.
    top_cost_drivers: list[tuple[str, float]]
    cache_hit_savings_usd: float

class Forecast(BaseModel):
    scenario: str                  # "1k daily users"
    assumptions: dict[str, float]
    monthly_usd: float
    monthly_usd_p95: float         # plan for the tail, not the median
    breakeven_price_per_unit: float
    sensitivity: dict[str, float]  # "if rerank switched to cross-encoder: -$3,100"
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/obs/economics.py` | NEW | unit attribution, rollups, forecasting |
| `platform/src/aiplat/obs/cost.py` | EDIT | tag every `CostEntry` with a unit id |
| `apps/w11_eval_guardrails/router.py` | EDIT | `/economics`, `/forecast` |
| `frontend/src/weeks/w11/EconomicsPanel.jsx` | NEW | cost per unit, drivers, forecast |

## Flow

```
every CostEntry (W2-F2.2) carries unit_kind + unit_id
      ▼
on unit completion (success OR failure) → UnitCost with a full component breakdown
      ▼
rollups: p50 / p95 / cost_per_SUCCESSFUL_unit    ← failures divide into the numerator only
      ▼
top_cost_drivers ranks components across all units
      ▼
Forecast(scenario) = p50 and p95 × projected volume
      ▼
sensitivity: swap a tier, enable a cache, change a reranker → the delta, in dollars
      ▼
EconomicsPanel + a monthly review that feeds F12.7 (model migration) decisions
```

## Rules

- **Count failed units in the numerator.** A retry that eventually succeeds cost you twice; a run
  that failed after $0.40 still cost $0.40. `cost_per_successful_unit` is the only number that
  survives contact with a finance conversation.
- **Forecast on p95, not the mean.** Cost distributions here are long-tailed — a few agent runs hit
  `max_iterations` and cost 10× the median. Budgeting on the mean under-provisions by design.
- **Attribute to components, not just totals.** "Reranking is 62% of unit cost" is the finding that
  makes F6.1's `NONE` baseline worth revisiting; a single total tells you nothing actionable.
- **Track what caching actually saved** (W5-F5.5). A cache whose savings are unmeasured is a cache
  someone will delete as complexity — or keep long after it stopped helping.
- **`model_mix` reveals whether tiering works.** If 95% of turns run on the escalate tier, the
  routing built in W1-F1.1 is not doing its job, and this is the only place that shows up.
- **Sensitivity analysis before optimising.** Knowing that switching the reranker saves $3,100/month
  and costs 4 precision points is a decision; guessing is not.
- Publish the numbers **monthly**. Unit economics reviewed once at launch is a slide, not a practice.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Only successful units counted | `cost_per_successful_unit` corrects for it explicitly |
| Forecast built on the mean | p95 forecast reported alongside; both shown |
| Cost not attributable to a unit | Unattributed spend surfaced as its own line, never hidden |
| Cache savings unmeasured | `cache_saved_usd` required on every unit |
| Tiering not engaging | `model_mix` exposes it |
| One pathological unit skews the mean | p50/p95 reported; outliers listed separately |
| Provider prices change | `ModelSpec` rates are the single source (W1-F1.1); history recosted |

## Tests

- `test_failed_units_are_counted_in_cost_per_successful_unit`
- `test_forecast_reports_both_p50_and_p95`
- `test_every_cost_entry_is_attributable_to_a_unit`
- `test_cache_savings_are_measured_per_unit`
- `test_sensitivity_analysis_matches_a_simulated_config_change`
- `test_price_change_recosts_historical_units`

## Acceptance criteria

- [ ] Cost per successful unit is known for every unit kind
- [ ] The top three cost drivers are named, with percentages
- [ ] A forecast exists at a stated volume, on p50 **and** p95
- [ ] Cache savings and tier mix are both measured
- [ ] Sensitivity analysis exists for at least the reranker and the model tier
- [ ] Unattributed spend is visible rather than absorbed into a total
