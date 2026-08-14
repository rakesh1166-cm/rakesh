# W4-F4.2 — `Itinerary` Schema + Repair Retry

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F2, F10](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F2** (structured itinerary output), **F10** (confidence + citations)
**Layer:** `apps/w04_holidaylandmarks/schemas.py` + `aiplat/schemas/common.py`
**Depends on:** [F4.1](../F4.1-trip-request-intake/CLAUDE.md)
**Consumed by:** [F4.5](../F4.5-sse-streaming-contract/CLAUDE.md), [F4.7](../F4.7-react-itinerary-ui/CLAUDE.md)

## Goal

**The golden rule made concrete** ([CLAUDE.md §1](../../../CLAUDE.md)): the agent returns a
validated `Itinerary` object, never prose the UI must parse. Invalid model output gets exactly one
repair retry, then fails typed.

## Contract (schema first)

```python
# aiplat/schemas/common.py — kernel, because W6 will reuse Citation/Confidence
class Citation(BaseModel):
    source: str
    retrieved_at: datetime | None = None
Confidence = Annotated[float, Field(ge=0.0, le=1.0)]

# apps/w04_holidaylandmarks/schemas.py
class Landmark(BaseModel):
    name: str
    category: Literal["museum","monument","nature","religious","park","market","viewpoint"]
    lat: float = Field(ge=-90, le=90)
    lng: float = Field(ge=-180, le=180)
    citation: Citation
    confidence: Confidence

class Activity(BaseModel):
    landmark: Landmark
    start_time: time | None = None
    duration_minutes: int = Field(ge=15, le=480)
    notes: str = Field(max_length=500)
    estimated_cost: float | None = Field(None, ge=0)

class DayPlan(BaseModel):
    day_index: int = Field(ge=1)
    theme: str
    activities: list[Activity] = Field(min_length=1, max_length=8)

class Itinerary(BaseModel):
    destination: str
    start_date: date | None
    num_days: int = Field(ge=1, le=14)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    days: list[DayPlan]
    total_estimated_cost: float | None = None
    warnings: list[str] = []          # degraded-tool notes land here, NOT in an error

    @model_validator(mode="after")
    def day_count_consistent(self):
        # len(days) != num_days is allowed ONLY with an explaining warnings[] entry
        ...
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w04_holidaylandmarks/schemas.py` | NEW | the models above |
| `platform/src/aiplat/schemas/common.py` | NEW | `Citation`, `Confidence` (kernel) |
| `apps/w04_holidaylandmarks/planner.py` | NEW | validate → repair once → typed failure |
| `platform/src/aiplat/prompts/templates/trip_repair/v1.md` | NEW | repair prompt |

## Flow

```
llm output (tool_use result or final JSON)
      ▼
Itinerary.model_validate()
   ├─ valid   ──► emit `data` event (F4.5) ──► persist (F4.6)
   └─ invalid ──► REPAIR (exactly once)
         │   prompt = trip_repair/v1 with: the invalid output + the Pydantic error text
         ▼
      re-validate
         ├─ valid   ──► continue, log event="llm.repair.success"
         └─ invalid ──► AppError(VALIDATION_FAILED) — never prose to the client
```

## Rules

- **Exactly one repair retry.** Two triples the cost of a model that has already failed twice; zero
  makes a single trailing comma fatal. Feed the *actual validation error* back — a generic "that was
  invalid" retry is barely better than none.
- **`warnings[]` is the degradation channel.** A dead weather API means an itinerary with a warning,
  not a 500. Errors are for failures; warnings are for reduced quality.
- `day_count_consistent` permits a mismatch **only** with an explaining warning. Silent mismatch is
  the bug; explained mismatch is honest.
- Every `Landmark` carries a `Citation` and a `Confidence` — hallucinated landmarks are the core
  risk of this product, and an uncited landmark is unshippable.
- `Citation`/`Confidence` go in the **kernel**, not this app, because W6 is their second consumer —
  the second-use rule, anticipated with a known consumer rather than speculatively.
- Bounds everywhere (`duration_minutes`, `max_length` on activities) cap both nonsense output and
  output-token cost.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model returns prose | Repair once → `VALIDATION_FAILED`. Never prose to the client. |
| Model returns 5 days for `num_days=3` | Rejected unless `warnings[]` explains it |
| Landmark at `lat=200` | Field bounds reject; repair retry gets the field error |
| Landmark with no citation | Validation failure — citations are required, not optional |
| Weather tool dead | `warnings: ["weather unavailable; indoor prefs not applied"]`, HTTP 200 |
| Repair also fails | One typed error, and the invalid output logged for debugging |

## Tests

- `test_repair_fires_exactly_once` — assert the LLM mock saw 2 calls, not 3
- `test_repair_prompt_contains_the_actual_validation_error`
- `test_day_count_mismatch_requires_a_warning`
- `test_uncited_landmark_is_rejected`
- `test_tool_degradation_produces_warning_not_error`
- Contract: 20 recorded model outputs round-trip through `Itinerary`

## Acceptance criteria

- [ ] No code path returns unvalidated model text to a client
- [ ] Repair fires exactly once and is logged (`event="llm.repair"`)
- [ ] Every `Landmark` in every generated itinerary has a citation and a confidence
- [ ] Degraded tools produce `warnings[]` with HTTP 200, not an error envelope
- [ ] `Citation`/`Confidence` live in `aiplat/schemas/common.py`, ready for W6
