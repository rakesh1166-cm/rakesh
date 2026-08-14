# W10-F10.1 — Intent Router

> [Week 10](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/orchestration/router.py` (kernel)
**Depends on:** [W7-F7.1](../../week-07-tool-agent/F7.1-bounded-agent-loop/CLAUDE.md)
**Consumed by:** [F10.2](../F10.2-supervisor-fanout-and-merge/CLAUDE.md), W12 `diagnose` node

## Goal

Classify a request and dispatch it to **exactly one** specialist. This is the cheapest multi-agent
pattern and usually the only one that pays: it avoids loading one giant do-everything prompt with
twenty tools, without any of the coordination cost of real fan-out.

## Contract (schema first)

```python
class Intent(BaseModel):
    name: str
    description: str                  # used for classification — it is a prompt
    specialist: str                   # the agent/graph that handles it
    examples: list[str]               # few-shot anchors AND router regression cases

class RoutingDecision(BaseModel):
    intent: str
    confidence: Confidence
    alternatives: list[tuple[str, float]]   # runners-up — the debugging signal
    method: Literal["rule", "llm"]          # which path decided
    fallback_used: bool

class RouterConfig(BaseModel):
    intents: list[Intent]
    default_intent: str               # REQUIRED — there is always a destination
    min_confidence: float = 0.55      # below this → default, never a coin flip
    rules_first: bool = True          # try deterministic matching BEFORE the model
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/orchestration/router.py` | NEW | `route()`, rules path, LLM path |
| `platform/src/aiplat/prompts/templates/route_intent/v1.md` | NEW | versioned classifier prompt |
| `apps/w10_multi_agent/router.py` | NEW | this week's intents + dispatch |
| `apps/w10_multi_agent/tests/routing.yaml` | NEW | labelled routing cases |

## Flow

```
request
   ▼
rules_first ── deterministic matchers (keyword, regex, explicit hints)
   │              hit? ──► RoutingDecision{method:"rule", confidence:1.0}     ← FREE and instant
   ▼ miss
llm.complete(route_intent/v1, intents)   → intent + confidence
   ▼
confidence < min_confidence ──► default_intent, fallback_used=True
   ▼
dispatch to ONE specialist (agent.loop W7 or graph W8)
   ▼
RoutingDecision logged + streamed → RouterDecision.jsx
```

## Rules

- **Rules before the model.** A large share of real traffic is trivially classifiable. Spending an
  LLM call to route "what's the weather in Paris" is cost with no benefit — and it adds latency to
  every single request.
- **`default_intent` is mandatory.** A router with no destination for the unclassifiable is a router
  that throws on the input you didn't anticipate.
- **Low confidence routes to default, never to a coin flip** between two near-tied intents. Being
  usefully generic beats being confidently wrong.
- **`alternatives` are recorded.** When routing is wrong, the runner-up scores tell you whether the
  intents overlap (fix the taxonomy) or the classifier is weak (fix the prompt).
- **One specialist. No cascades.** Router → specialist → done. Router → router → specialist is where
  multi-agent systems become undebuggable.
- **`Intent.examples` double as regression cases.** The router is a classifier; a classifier without
  a labelled set is untested, and W11's gate needs it.
- The router **is itself a candidate for deletion** (F10.4). If rules handle 95% of traffic, the LLM
  path is a tax — delete it and keep the rules.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Unclassifiable input | `default_intent`, `fallback_used=True`, logged |
| Two intents tie | Below `min_confidence` → default; never a coin flip |
| Classifier LLM unavailable | Rules-only, then default. Routing never hard-fails. |
| Specialist for an intent missing | Startup validation catches it, not runtime |
| Malformed classifier output | Default + `fallback_used`; recorded for the eval set |
| Intent list grows past ~10 | Accuracy degrades — measured by the labelled set, not assumed |

## Tests

- `test_rules_path_avoids_the_llm_call_entirely`
- `test_low_confidence_routes_to_default_not_a_tie_break`
- `test_every_intent_has_a_registered_specialist` — startup validation
- `test_classifier_failure_degrades_to_rules_then_default`
- `test_routing_accuracy_on_the_labelled_set` — a recorded number
- `test_alternatives_are_recorded_on_every_decision`

## Acceptance criteria

- [ ] Routing accuracy is measured on a labelled set and recorded
- [ ] The share of traffic handled by rules (no LLM call) is measured
- [ ] Routing never hard-fails; there is always a destination
- [ ] Every decision is explainable from `RoutingDecision` alone
- [ ] If rules dominate, the LLM path is a deletion candidate in F10.4
