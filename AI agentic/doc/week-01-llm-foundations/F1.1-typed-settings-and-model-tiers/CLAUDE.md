# W1-F1.1 — Typed Settings + Model Tier Registry

> [Week 1](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/config/` (kernel)
**Depends on:** —
**Consumed by:** every module, every week

## Goal

One typed, env-driven settings object and one **model tier registry**, so no code anywhere
hardcodes an API key, a base URL, a timeout, or a model ID. Tiering exists from day one because
cost control is a per-request lever, not a Week-11 retrofit.

## Contract (schema first)

```python
# aiplat/config/settings.py
class Settings(BaseSettings):
    anthropic_api_key: SecretStr
    database_url: str = "postgresql+psycopg2://postgres:root@localhost:5433/holidaylandmark"
    redis_url: str = "redis://localhost:6379/0"
    env: Literal["local", "ci", "prod"] = "local"
    llm_timeout_s: float = 30.0
    request_token_cap: int = 40_000
    model_config = SettingsConfigDict(env_file=".env", extra="forbid")

# aiplat/config/models.py
class ModelTier(str, Enum):
    DEFAULT  = "default"    # planning / tool use
    ESCALATE = "escalate"   # hard multi-step reasoning
    FALLBACK = "fallback"   # cheap / simple turns

class ModelSpec(BaseModel):
    model_id: str
    max_output_tokens: int
    input_cost_per_mtok: float
    output_cost_per_mtok: float

TIERS: dict[ModelTier, ModelSpec]     # loaded from config, never inlined at call sites
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/config/settings.py` | NEW | `Settings`, one cached `get_settings()` |
| `platform/src/aiplat/config/models.py` | NEW | `ModelTier`, `ModelSpec`, `TIERS` |
| `.env.example` | NEW | every key in `Settings`, with placeholder values |
| `platform/pyproject.toml` | NEW | package metadata; `pydantic-settings` dependency |

## Flow

```
.env  ──►  Settings (validated at import)  ──►  get_settings()  ──►  every module
                                                       │
model tier name ("default") ──► TIERS[tier] ──► ModelSpec ──► aiplat.llm (F1.2)
                                                         └──► aiplat.obs.cost (W2)
```

## Rules

- `extra="forbid"` — an unknown env var is a startup failure, not a silent typo.
- `SecretStr` for every credential. `repr()` of `Settings` must never print a key.
- **Model IDs live only in `models.py`.** Verify them against the live Anthropic API before
  shipping; do not hardcode them in business logic ([ADR-006](../../../TECH-STACK-DECISIONS.md)).
- `get_settings()` is `@lru_cache`'d — settings are read once per process, not per call.
- No module reads `os.environ` directly. Ever.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| `ANTHROPIC_API_KEY` missing | Startup fails with a named field error, not a 500 at first request |
| Unknown key in `.env` | Startup fails (`extra="forbid"`) — catches typos like `ANTROPIC_API_KEY` |
| Invalid `DATABASE_URL` | Startup fails at config parse, before any connection attempt |
| Settings logged accidentally | `SecretStr` renders `**********`; assert this in a test |

## Tests

- `test_settings_rejects_unknown_env_var`
- `test_secret_never_appears_in_repr_or_json`
- `test_missing_required_key_fails_at_import_with_field_name`
- `test_every_tier_has_a_spec` — parametrised over `ModelTier`

## Acceptance criteria

- [ ] `grep -r "os.environ" platform/ apps/ services/` returns nothing outside `settings.py`
- [ ] `grep -r "claude-" platform/ apps/ services/` returns hits only in `config/models.py`
- [ ] `.env.example` lists every field in `Settings`; `.env` is gitignored
- [ ] `repr(get_settings())` contains no secret material
- [ ] Startup with a malformed `.env` fails loudly and names the offending field
