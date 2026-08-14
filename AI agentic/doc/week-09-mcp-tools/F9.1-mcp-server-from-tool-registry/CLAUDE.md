# W9-F9.1 — MCP Server Generated from the Tool Registry

> [Week 9](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/mcp/server.py` + `services/mcp-server/`
**Depends on:** [W4-F4.3](../../week-04-holidaylandmarks/F4.3-tool-port-registry-executor/CLAUDE.md)
**Consumed by:** [F9.2](../F9.2-scope-bounds-and-least-privilege/CLAUDE.md), [F9.4](../F9.4-tool-catalog-and-scope-inspector/CLAUDE.md)

## Goal

Expose `aiplat.tools.registry` over MCP by **generating** the protocol definitions from the existing
`ToolSpec`s. A hand-written parallel list would drift within a week, and a drifted tool definition
means the external client's schema and the executor's validation disagree — which surfaces as
mysterious validation failures for someone else's agent.

## Contract (schema first)

```python
class McpToolDefinition(BaseModel):
    """Generated. Never hand-authored."""
    name: str
    description: str                  # ToolSpec.description — a prompt, reviewed as one
    inputSchema: dict[str, Any]       # JSON Schema from ToolSpec.input_schema

class McpServerConfig(BaseModel):
    exposed_scopes: set[AuthzScope]   # an ALLOW-LIST, never "everything registered"
    exclude_tools: set[str] = set()
    max_concurrent_calls: int = 10
    call_timeout_s: float = 30.0

def generate_definitions(registry: ToolRegistry, cfg: McpServerConfig) -> list[McpToolDefinition]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/mcp/server.py` | NEW | generate definitions; dispatch calls to the executor |
| `services/mcp-server/main.py` | NEW | the MCP process (stdio and/or HTTP transport) |
| `services/mcp-server/Dockerfile` | NEW | separate image |
| `apps/w09_mcp_tools/manifest.json` | NEW | declared scopes per exposed tool |

## Flow

```
aiplat.tools.registry (W4-F4.3)
      ▼
generate_definitions(cfg)
   ├─ filter by cfg.exposed_scopes        ← allow-list, not deny-list
   ├─ ToolSpec.input_schema → JSON Schema  (Pydantic → JSON Schema, mechanical)
   └─ omit anything not explicitly exposed
      ▼
services/mcp-server serves tools/list
      ▼
external client calls tools/call {name, arguments}
      ▼
bounds.authorize (F9.2)  ──► aiplat.tools.executor (W4-F4.3, UNCHANGED)
      ▼
ToolResult → MCP result   (errors as typed MCP errors, never tracebacks)
```

## Rules

- **Definitions are generated, never hand-written.** A test asserts the generated set matches the
  registry exactly, so drift is a build failure rather than a support ticket.
- **`exposed_scopes` is an allow-list.** Exposing everything registered means every new internal
  tool is silently published the moment it is added. New exposure must be a deliberate act.
- **The executor is reused unchanged.** MCP is a transport; validation, timeout, retry, breaker,
  authorization, and logging all already exist (W4-F4.3). If MCP needs its own copy of any of these,
  the port was wrong.
- **Correlation IDs cross the boundary.** An MCP call arrives with no request context; the server
  mints an ID and includes it in results, so W11's `TraceView` can follow a call that originated
  outside this system.
- **Errors are typed MCP errors.** Never a Python traceback — this is a public-facing surface, and
  the W2-F2.3 reasoning applies with more force here.
- `WRITE_EXTERNAL` tools are **never** exposed over MCP without the W8 approval gate in front.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Registry gains a tool | It appears over MCP **only** if its scope is in `exposed_scopes` |
| Hand-edited definitions drift | Generation test fails the build |
| Client calls an unexposed tool | `tools/list` never showed it; the call is refused as unknown |
| Client sends malformed arguments | Executor validation → typed MCP error with field detail |
| Tool raises | `ToolResult{ok:false}` → typed MCP error; no traceback crosses the boundary |
| 100 concurrent calls | `max_concurrent_calls` caps them; excess queued or refused cleanly |
| `WRITE_EXTERNAL` tool exposed | Startup failure unless an approval gate is configured |

## Tests

- `test_generated_definitions_match_the_registry_exactly`
- `test_only_allowlisted_scopes_are_exposed`
- `test_unexposed_tool_is_not_callable_even_by_exact_name`
- `test_no_traceback_crosses_the_mcp_boundary`
- `test_correlation_id_is_minted_and_returned`
- `test_write_external_without_approval_gate_fails_startup`

## Acceptance criteria

- [ ] Adding a tool to the registry requires an explicit scope decision to expose it
- [ ] Generated definitions provably match the registry
- [ ] MCP dispatch reuses `tools/executor.py` with no duplicated logic
- [ ] Every MCP result carries a correlation ID
- [ ] No MCP-visible tool offers arbitrary SQL, shell, or unbounded HTTP
