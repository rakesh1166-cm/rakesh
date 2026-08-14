# W4-F4.3 — Tool Port, Registry, Authorization Matrix, Executor

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F7](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F7** (agent loop — the tool half)
**Layer:** `platform/src/aiplat/tools/` (kernel)
**Depends on:** [W2-F2.4](../../week-02-fastapi-ai-service/F2.4-resilience-timeout-retry-breaker/CLAUDE.md)
**Consumed by:** [F4.4](../F4.4-tools-landmark-weather-geocode/CLAUDE.md), W7 agent loop, **W9 MCP** (serialises this port directly)

## Goal

The tool contract for the whole repo. **Write this before writing any tool** — a port designed
around the weather API produces a weather-shaped port; a port designed first produces something
Week 9 can serialise to MCP without a rewrite.

## Contract (schema first)

```python
class AuthzScope(str, Enum):
    READ_PUBLIC   = "read:public"      # curated dataset, no side effects
    READ_EXTERNAL = "read:external"    # outbound HTTP to an allow-listed host
    WRITE_INTERNAL= "write:internal"   # our DB
    WRITE_EXTERNAL= "write:external"   # ⚠ requires human approval from W8

class ToolSpec(BaseModel):
    name: str = Field(pattern=r"^[a-z][a-z0-9_]{2,31}$")
    description: str                   # the model reads this — it is a prompt, review it as one
    input_schema: type[BaseModel]
    output_schema: type[BaseModel]
    timeout_s: float = Field(gt=0, le=30)
    authz_scope: AuthzScope
    idempotent: bool                   # False ⇒ resilience retry is forbidden
    cacheable_ttl_s: int | None = None

class ToolPort(Protocol):
    spec: ToolSpec
    async def run(self, args: BaseModel) -> BaseModel: ...

class ToolCall(BaseModel):
    name: str; args: dict[str, Any]; call_id: str
class ToolResult(BaseModel):
    call_id: str; name: str
    ok: bool
    output: dict[str, Any] | None
    error: ErrorEnvelope | None
    duration_ms: float
    cached: bool = False
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/tools/ports.py` | NEW | `ToolSpec`, `ToolPort`, `ToolCall`, `ToolResult`, `AuthzScope` |
| `platform/src/aiplat/tools/registry.py` | NEW | allow-list + **authorization matrix** |
| `platform/src/aiplat/tools/executor.py` | NEW | validate → authorize → timeout → run → validate |
| `platform/src/aiplat/security/egress.py` | NEW | outbound host allow-list (SSRF defense) |

## Flow

```
model emits ToolCall{name, args}
      ▼
registry.resolve(name)          unknown name ──► typed error, NOT a crash, NOT a guess
      ▼
authorize(spec.authz_scope, caller_context)
      │  ⚠ decided by the MATRIX. Nothing the model or user said influences this.
      ▼
input_schema.model_validate(args)      invalid ──► ToolResult{ok:False, VALIDATION_FAILED}
      ▼
cache hit? (cacheable_ttl_s)  ──► ToolResult{cached: True}      ← the cheapest call is none
      ▼
resilience.call(tool.run, timeout_s=spec.timeout_s,
                retry = policy if spec.idempotent else None,
                breaker_key = host)
      ▼
output_schema.model_validate(result)   invalid ──► ToolResult{ok:False}  (a tool CAN be wrong)
      ▼
ToolResult ──► SSE `tool_result` (F4.5) + log(event="tool.call", correlation_id)
```

## Rules

- **Adding a tool requires an authorization-matrix entry**, not just registry wiring
  ([ADR-012](../../../TECH-STACK-DECISIONS.md)). A tool with no matrix entry fails at startup.
- **Both** schemas are validated. Tool *output* is as untrusted as tool input — an external API can
  return nonsense, and unvalidated nonsense reaches the model and becomes a hallucinated fact.
- `idempotent=False` ⇒ retry is **forbidden**. A retried write is a duplicate write.
- Unknown tool name → typed `ToolResult`, never an exception and never a fuzzy name match.
- `description` is read by the model. Treat it as a prompt: version-controlled, reviewed, tested.
- `WRITE_EXTERNAL` exists now though nothing uses it — W12's only write path depends on the scope
  being defined here.
- Every tool result is logged with the correlation ID; W11's `TraceView` renders these directly.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model calls a nonexistent tool | `ToolResult{ok:False, NOT_FOUND}`; the loop continues |
| Model passes wrong-typed args | Validation failure returned **to the model** so it can correct |
| Tool returns malformed output | `ok:False`; the bad data never reaches the model |
| Tool exceeds `timeout_s` | Cancelled; `UPSTREAM_TIMEOUT`; other tools unaffected |
| Non-idempotent tool fails | **Not** retried; failure surfaced |
| Tool tries to reach a non-allow-listed host | Blocked by `egress.py` before the socket opens |
| Tool registered without a matrix entry | **Startup failure** |

## Tests

- `test_tool_without_authz_entry_fails_startup`
- `test_unknown_tool_returns_typed_result_not_exception`
- `test_non_idempotent_tool_is_never_retried`
- `test_malformed_tool_output_never_reaches_the_model`
- `test_egress_blocks_non_allowlisted_host`
- `test_tool_spec_is_serialisable_to_mcp_shape` ← the W9 prerequisite, asserted now

## Acceptance criteria

- [ ] `ToolSpec` fully describes a tool: no behaviour lives outside it
- [ ] The authorization matrix is the single source of truth; user/model text cannot alter it
- [ ] Every tool call produces a `ToolResult` — the executor never raises to its caller
- [ ] Input **and** output validated on every call
- [ ] `test_tool_spec_is_serialisable_to_mcp_shape` passes, making W9 near-free
