# W4-F4.4 — Landmark, Weather, Geocode/Distance Tools

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F3, F4, F5](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F3** (landmark knowledge), **F4** (weather), **F5** (geocode/distance)
**Layer:** `platform/src/aiplat/tools/impl/`
**Depends on:** [F4.3](../F4.3-tool-port-registry-executor/CLAUDE.md)
**Consumed by:** [F4.6](../F4.6-bounded-tool-sequence-and-persistence/CLAUDE.md), W7 loop, W9 MCP

## Goal

Three tools that make the itinerary factual instead of imagined. Each is a thin `ToolPort` — all
timeout, retry, breaker, caching and validation already come from F4.3, so a tool file is mostly
its two schemas plus one call.

## Contract (schema first)

```python
# landmark_search — READ_PUBLIC, deterministic, curated dataset (ADR-008)
class LandmarkSearchIn(BaseModel):
    city: str = Field(max_length=100)
    theme: str | None = None
    limit: int = Field(10, ge=1, le=20)
class LandmarkSearchOut(BaseModel):
    landmarks: list[Landmark]          # each carries citation + confidence (F4.2)
    dataset_version: str

# weather_forecast — READ_EXTERNAL, cacheable 6h
class WeatherIn(BaseModel):
    lat: float = Field(ge=-90, le=90); lng: float = Field(ge=-180, le=180)
    start_date: date; end_date: date          # validator: span <= 14 days
class DailyWeather(BaseModel):
    date: date; temp_c_min: float; temp_c_max: float
    precip_prob: float = Field(ge=0, le=1)
    condition: Literal["clear","cloudy","rain","snow","storm","fog"]
class WeatherOut(BaseModel):
    daily: list[DailyWeather]; source: str; stale: bool = False   # served from cache after failure

# geocode — READ_EXTERNAL, cacheable 30d (place names barely move)
class GeocodeIn(BaseModel):
    place: str = Field(min_length=2, max_length=200)
class GeocodeMatch(BaseModel):
    canonical_name: str; lat: float; lng: float
    country: str; confidence: Confidence
class GeocodeOut(BaseModel):
    matches: list[GeocodeMatch]        # >1 ⇒ ambiguous, and the model must be told so

# distance — READ_PUBLIC, pure function, no network
class DistanceIn(BaseModel):
    from_: GeoPoint = Field(alias="from"); to: GeoPoint
class DistanceOut(BaseModel):
    meters: float; walking_minutes: int
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/tools/impl/landmarks.py` | NEW | curated dataset lookup |
| `platform/src/aiplat/tools/impl/weather.py` | NEW | external forecast API |
| `platform/src/aiplat/tools/impl/geocode.py` | NEW | place → coords, with disambiguation |
| `platform/src/aiplat/tools/impl/distance.py` | NEW | haversine + walking estimate; pure |
| `platform/src/aiplat/tools/impl/mock/` | NEW | deterministic doubles for every tool |
| `apps/w04_holidaylandmarks/data/landmarks.json` | NEW | seed dataset, each row cited |
| `platform/src/aiplat/db/models/landmark.py` | NEW | `agent_landmarks` table |

## Flow

```
planner → executor(F4.3) → tool.run()
   landmark_search → agent_landmarks (Postgres, seeded from data/landmarks.json)  no network
   weather_forecast → Redis(6h) → miss → httpx → allow-listed host → validate
   geocode        → Redis(30d) → miss → httpx → allow-listed host → validate
   distance       → pure computation, no I/O, no cache needed
```

## Rules

- **The curated dataset is the source of landmark truth** ([ADR-008](../../../TECH-STACK-DECISIONS.md)).
  The model selects and arranges landmarks; it does not invent them. Every row ships with a
  `source` and a `confidence`.
- **Caching is the highest-ROI performance work in the repo**
  ([architecture §10](../../../CLAUDE-12-WEEK.md)). Weather per (lat,lng,date) and geocode per place
  repeat constantly across users. Cache keys must round coordinates, or every request is a miss.
- **Ambiguity is returned, not resolved.** `geocode` returning three Springfields hands the choice
  to the model with confidences attached; silently picking the first is how a trip lands in the
  wrong state.
- **`stale: true` beats a hard failure.** When the weather API is down, serving a cached forecast
  marked stale (with a `warnings[]` entry) is better than failing the itinerary.
- `distance` does no I/O. Not everything that helps the model needs to be a network call — the
  master prompt's *deterministic code over agents* principle applies to tools too.
- Every tool has a **mock** in `impl/mock/`. The entire suite must run offline.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Weather API 500s | Retry → breaker opens → serve cache as `stale:true` → itinerary `warnings[]` |
| Weather API down, cache empty | `ToolResult{ok:False}`; planner proceeds without weather + warns |
| Geocode returns 3 matches | All returned with confidences; the model chooses explicitly |
| Geocode returns 0 matches | Empty `matches`; planner asks for clarification, never guesses |
| Landmark dataset missing a city | Empty list + a warning — never a fabricated landmark |
| Tool asked to reach an unknown host | `egress.py` blocks it before the socket opens |
| Coordinates unrounded in a cache key | Test asserts a hit for two near-identical requests |

## Tests

- `test_weather_serves_stale_cache_when_upstream_is_down`
- `test_geocode_ambiguity_is_surfaced_not_resolved`
- `test_landmark_tool_never_returns_an_uncited_row`
- `test_cache_key_rounds_coordinates`
- `test_distance_makes_no_network_calls`
- `test_full_suite_runs_offline_with_mocks`

## Acceptance criteria

- [ ] Every landmark returned traces to a row in the curated dataset with a citation
- [ ] Weather and geocode hit Redis before the network; hit-rate is logged
- [ ] A dead weather API degrades the itinerary with a warning — it never fails the request
- [ ] Geocode ambiguity reaches the model as a choice, with confidences
- [ ] Every tool has a mock, and the whole test suite runs with no network
