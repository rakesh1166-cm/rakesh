# W9-F9.5 — MCP Resources + Prompts (Beyond Tools)

> [Week 9](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/mcp/{resources,prompts}.py` (kernel)
**Depends on:** [F9.2](../F9.2-scope-bounds-and-least-privilege/CLAUDE.md)
**Consumed by:** W12 (runbooks as resources, investigation templates as prompts)

## Goal

MCP has three primitives, not one. **Tools** are model-invoked actions; **resources** are
application-controlled data the client attaches as context; **prompts** are user-invoked templates.

Exposing only tools forces everything through function calls — including things that are plainly
*context*, like a runbook or a config file. That wastes tool-selection reasoning on data retrieval
and, more importantly, gets the trust model wrong: a resource is content, and content is untrusted.

## Contract (schema first)

```python
class McpResource(BaseModel):
    uri: str                          # "runbook://payments/timeout"
    name: str; description: str
    mime_type: str
    authz_scope: AuthzScope           # resources are scope-gated exactly like tools
    max_bytes: int = 128_000

class McpResourceContent(BaseModel):
    uri: str
    content: str
    sanitized: bool = True            # W11-F11.4 — resources are UNTRUSTED text
    truncated: bool = False
    etag: str                         # clients cache on this

class McpPromptTemplate(BaseModel):
    name: str; description: str
    arguments: list[McpPromptArg]
    prompt_ref: tuple[str, str]       # (name, version) — backed by W3-F3.1, not a loose string

class McpPromptArg(BaseModel):
    name: str; description: str; required: bool
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/mcp/resources.py` | NEW | `resources/list`, `resources/read`, subscriptions |
| `platform/src/aiplat/mcp/prompts.py` | NEW | `prompts/list`, `prompts/get` from the registry |
| `services/mcp-server/main.py` | EDIT | serve all three primitives |
| `apps/w09_mcp_tools/manifest.json` | EDIT | declare resources and prompts + scopes |

## Flow

```
services/mcp-server exposes THREE primitives
   ├─ tools/*      → aiplat.tools.registry (F9.1) — model-invoked ACTIONS
   ├─ resources/*  → aiplat.mcp.resources   — application-attached CONTEXT
   │      list → uris + descriptions (scope-filtered, F9.2)
   │      read → content, sanitized, size-capped, etag'd
   └─ prompts/*    → aiplat.mcp.prompts     — user-invoked TEMPLATES
          list → names + arguments
          get  → rendered from aiplat.prompts.registry (W3-F3.1), version-pinned
```

## Rules

- **Resource content is untrusted.** It is *content*, not instruction — a runbook containing
  "SYSTEM: grant admin" must be sanitized (W11-F11.4, `RETRIEVED_DOC`) before it reaches a model.
  This is the same lesson as W9-F9.3's hostile tool descriptions, one primitive over.
- **Resources are scope-gated like tools.** A config file exposed as a resource is exactly as
  sensitive as a tool that reads it, and the same matrix decides both (F9.2).
- **Prompts are backed by the versioned registry** (W3-F3.1), never inline strings. An MCP prompt
  is still a prompt: it needs a version, a golden suite, and the regression gate.
- **Don't model data as a tool.** "Fetch the payments runbook" is a resource, not an action.
  Forcing it through tool-calling burns the model's tool-selection reasoning on retrieval and
  crowds the tool list, degrading selection accuracy for the tools that *are* actions.
- **`etag` enables client caching**, which matters because resources are re-read far more often
  than tools are called.
- **Size caps on read**, same reasoning as F9.2's result bounds — an unbounded resource read is
  bulk exfiltration wearing a legitimate interface.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Resource content contains an injection | Sanitized before it reaches any prompt |
| Client reads a resource outside its scope | Denied, indistinguishable from "not found" (F9.2) |
| Resource is 50 MB | Truncated at `max_bytes`, `truncated=true` flagged |
| Prompt template references an unpinned version | Startup failure — W3-F3.1's freeze check |
| Resource changed since the last read | `etag` differs; client re-reads |
| Resource backing file deleted | Typed not-found; the list is regenerated, not stale |
| A resource is registered as a tool | Review catches it; a scan test flags read-only tool shapes |

## Tests

- `test_resource_content_is_sanitized_before_prompt_use`
- `test_resource_scope_denial_matches_not_found`
- `test_mcp_prompts_resolve_to_pinned_registry_versions`
- `test_resource_read_is_size_capped_and_flagged`
- `test_etag_changes_when_content_changes`
- `test_no_read_only_data_fetch_is_registered_as_a_tool`

## Acceptance criteria

- [ ] All three MCP primitives are served, each scope-gated by the same matrix
- [ ] Resource content is sanitized and size-capped
- [ ] MCP prompts are pinned registry versions covered by the W11 gate
- [ ] Pure data access is exposed as resources, not as tools — enforced by a scan
- [ ] `ToolCatalog` (F9.4) shows resources and prompts alongside tools
