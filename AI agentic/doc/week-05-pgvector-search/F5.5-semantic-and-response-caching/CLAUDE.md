# W5-F5.5 — Semantic + Response Caching

> [Week 5](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/cache/` (kernel)
**Depends on:** [F5.2](../F5.2-embeddings-batch-and-cache/CLAUDE.md)
**Consumed by:** W6 RAG answers, W7 agent planning, W12 incident triage

## Goal

Three cache layers, each with a different correctness risk. Exact-match caching is free money;
**semantic** caching is where teams quietly ship wrong answers to save a few cents.

Building it here — right after embeddings exist and before RAG and agents multiply the call
volume — is the cheapest point to get the risk boundaries right.

## Contract (schema first)

```python
class CacheTier(str, Enum):
    EXACT     = "exact"      # sha256 of the full request. Zero risk.
    SEMANTIC  = "semantic"   # embedding similarity above a threshold. REAL risk.
    PROMPT    = "prompt"     # provider-side prompt caching (W4-F4.5). Zero risk.

class CacheEntry(BaseModel):
    key: str
    tier: CacheTier
    value: dict[str, Any]
    model_id: str                     # part of the key — outputs are not model-portable
    prompt_version: str               # part of the key — a new prompt invalidates the cache
    created_at: datetime
    ttl_s: int
    hit_count: int

class SemanticCacheConfig(BaseModel):
    similarity_threshold: float = 0.97      # DELIBERATELY high — see rules
    ttl_s: int = 3600
    max_entries: int = 10_000
    enabled_for: list[str] = []             # OPT-IN per component, never global
    forbid_for: list[str] = ["w12", "w08"]  # never cache anything that precedes a write

class CacheOutcome(BaseModel):
    hit: bool
    tier: CacheTier | None
    similarity: float | None
    saved_usd: float
    age_s: float | None
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/cache/exact.py` | NEW | hash-keyed Redis cache |
| `platform/src/aiplat/cache/semantic.py` | NEW | embedding-similarity cache (opt-in) |
| `platform/src/aiplat/cache/keys.py` | NEW | key composition — the correctness-critical part |
| `platform/src/aiplat/obs/cost.py` | EDIT | record `saved_usd` per hit |

## Flow

```
request
   ▼
EXACT: sha256(model_id + prompt_version + rendered_prompt + tool_defs)
   hit ──► return. Zero risk: identical input, identical config.
   ▼ miss
SEMANTIC — only if component ∈ enabled_for and ∉ forbid_for
   embed(request) → nearest neighbour in the cache
   similarity ≥ 0.97 AND same model AND same prompt version ──► return + record similarity
   ▼ miss
provider call (prompt caching applies here — W4-F4.5)
   ▼
store in EXACT always; in SEMANTIC only when enabled
   ▼
CacheOutcome{tier, similarity, saved_usd} → logged → ObservabilityDashboard (W11)
```

## Rules

- **`model_id` and `prompt_version` are always in the key.** A cache that survives a prompt edit
  serves the *old* prompt's answers while your eval suite measures the new one — and the two never
  reconcile. This is the most common and most confusing caching bug in LLM systems.
- **Semantic caching is opt-in per component and default-off.** "What is the refund policy?" and
  "What is *not* the refund policy?" can sit above 0.95 similarity. The threshold defaults to
  **0.97**, which is deliberately strict enough to be nearly exact-match.
- **Never semantically cache anything upstream of a write.** `forbid_for` includes W12 and W8 —
  serving a cached diagnosis for a *different* incident is exactly how an assistant proposes the
  right fix for the wrong outage.
- **Record `similarity` on every semantic hit.** Without it you cannot audit whether the threshold
  is safe, and you will not discover it wasn't until a user does.
- **`saved_usd` is tracked.** A cache whose benefit is not measured cannot be tuned, and cannot be
  defended when someone proposes removing it.
- **Negative results are not cached.** A failure caused by a transient outage must not be served
  for an hour.
- Caching is **transparent to callers** — they get the same typed object either way, with
  `CacheOutcome` alongside.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Prompt edited to v3 | Cache keys change; zero stale hits |
| Model switched | Same — `model_id` in the key |
| Semantically similar but opposite question | Threshold 0.97 rejects; a corpus test asserts it |
| Semantic hit in a W12 flow | Impossible — `forbid_for` blocks it |
| Provider error cached | Never — failures are not stored |
| Redis down | Full miss-through; slower and costlier, still correct |
| Cache grows unbounded | `max_entries` + TTL evict; eviction rate is logged |
| Stale answer served after a corpus re-ingest | Retrieval-dependent components key on corpus version too |

## Tests

- `test_prompt_version_change_invalidates_the_cache` ← the classic bug
- `test_model_change_invalidates_the_cache`
- `test_opposite_meaning_pairs_do_not_hit_semantically` — a curated adversarial pair set
- `test_semantic_cache_is_off_by_default_and_forbidden_for_w12`
- `test_failures_are_never_cached`
- `test_saved_usd_is_recorded_per_hit`
- `test_redis_down_degrades_to_full_miss`

## Acceptance criteria

- [ ] Cache keys include model, prompt version, and (where relevant) corpus version
- [ ] Semantic caching is opt-in, threshold ≥0.97, and blocked for write-adjacent flows
- [ ] An adversarial near-miss pair set proves the threshold is safe
- [ ] `saved_usd` and hit rates are visible in the W11 dashboard
- [ ] Losing the cache degrades cost and latency, never correctness
