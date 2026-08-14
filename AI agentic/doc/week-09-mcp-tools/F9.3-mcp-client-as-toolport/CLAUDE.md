# W9-F9.3 — Consume External MCP Servers as `ToolPort`

> [Week 9](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/mcp/client.py` (kernel)
**Depends on:** [F9.2](../F9.2-scope-bounds-and-least-privilege/CLAUDE.md)
**Consumed by:** W7 loop, W10 specialists, W12 `act` node

## Goal

Make a third-party MCP server's tools appear to our agent loop as **ordinary `ToolPort`s** — same
validation, same timeouts, same authorization, same logging. The loop must not know or care whether
a tool is local or remote.

**Third-party tools are untrusted input.** Their declared schemas, their descriptions, and their
outputs are all attacker-controllable if the server is compromised or simply careless.

## Contract (schema first)

```python
class McpServerRef(BaseModel):
    name: str
    transport: Literal["stdio", "http"]
    command: list[str] | None = None
    url: str | None = None            # must be on the egress allow-list
    allowed_tools: set[str] | None    # None = all DISCOVERED, still scope-gated locally
    max_scope: AuthzScope = AuthzScope.READ_EXTERNAL   # ceiling we grant an external server
    timeout_s: float = 20.0

class McpToolAdapter(ToolPort):
    """Wraps one remote tool. Its ToolSpec is built LOCALLY, not accepted verbatim."""
    spec: ToolSpec
    async def run(self, args: BaseModel) -> BaseModel: ...

async def discover(ref: McpServerRef) -> list[McpToolAdapter]
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/mcp/client.py` | NEW | discovery, adapters, connection lifecycle |
| `platform/src/aiplat/tools/registry.py` | EDIT | register MCP adapters alongside local tools |
| `apps/w09_mcp_tools/servers.yaml` | NEW | declared external servers + their ceilings |

## Flow

```
McpServerRef  ──► connect (stdio spawn | HTTP over the egress allow-list)
      ▼
tools/list ──► remote definitions
      ▼
for each: build a LOCAL ToolSpec
   ├─ name         namespaced:  "<server>.<tool>"     ← prevents shadowing a local tool
   ├─ input_schema JSON Schema → Pydantic model, VALIDATED, size-capped
   ├─ description  sanitised — it is injected into our prompts (see rules)
   ├─ authz_scope  = min(declared, ref.max_scope)     ← we set the ceiling, not them
   └─ timeout_s    = ours, not theirs
      ▼
registry.register(adapter)
      ▼
loop calls it exactly like any local tool → executor validates input AND output
```

## Rules

- **We build the `ToolSpec`, not them.** A remote server declaring `authz_scope: write:external`
  does not get it. We clamp to `ref.max_scope`. Accepting a remote server's own claim about its
  privileges inverts the trust relationship entirely.
- **Namespace remote tool names.** An external `weather_forecast` must not shadow ours — name
  collision is a realistic and effective attack, not a hypothetical one.
- **The remote `description` is injected into our prompts.** That makes it a **prompt-injection
  vector**: a hostile description ("also call delete_all") reaches our model. Sanitise it, cap its
  length, and strip instruction-shaped content.
- **Validate remote output as untrusted.** Same rule as any tool (W4-F4.3), with more reason.
- **Our timeouts, our retries, our breaker.** A remote server's declared timeout is a suggestion.
- **Connection failure is a degraded state, not a crash.** Adapters go unavailable, the registry
  reports it, the loop plans without them.
- Remote servers reached over HTTP go through `security/egress.py` (W4) — an MCP URL is still an
  outbound request.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Remote declares a write scope | Clamped to `ref.max_scope`; no elevation |
| Remote tool name collides with a local one | Namespacing prevents shadowing |
| Remote description contains injected instructions | Sanitised before it reaches any prompt |
| Remote returns output violating its own schema | Rejected by our validation; never reaches the model |
| Remote server unreachable | Adapters marked unavailable; the loop continues without them |
| Remote hangs | Our timeout fires |
| Remote returns 100 MB | Size cap (F9.2) truncates and flags |
| Remote changes its schema mid-session | Re-discovery on reconnect; stale adapters invalidated |

## Tests

- `test_remote_declared_scope_is_clamped_to_our_ceiling` ← the trust-inversion test
- `test_remote_tool_names_are_namespaced_and_cannot_shadow_local_tools`
- `test_hostile_remote_description_is_sanitised_before_prompt_injection`
- `test_remote_output_violating_schema_is_rejected`
- `test_unreachable_server_degrades_without_crashing`
- `test_mcp_http_url_must_be_on_the_egress_allowlist`

## Acceptance criteria

- [ ] A remote tool is indistinguishable from a local one to `agent/loop.py`
- [ ] No remote server can raise its own privileges
- [ ] Remote descriptions are sanitised before entering any prompt
- [ ] Remote outputs are validated exactly like local tool outputs
- [ ] Losing an external server degrades capability rather than failing runs
