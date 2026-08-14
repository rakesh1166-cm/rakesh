# W9-F9.4 — Tool Catalog + Scope Inspector

> [Week 9](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `frontend/src/weeks/w09/`
**Depends on:** [F9.2](../F9.2-scope-bounds-and-least-privilege/CLAUDE.md)
**Consumed by:** W11 (security review surface), W12 (what the ops assistant may do)

## Goal

A **read-only inspector**, deliberately small. MCP's real consumers are other agents, not this SPA.
Its job is to answer two questions a human periodically needs answered: *what tools exist and what
can each do?*, and *given this client, what may it actually call?*

An authorization matrix nobody can read is an authorization matrix nobody audits.

## Contract (schema first)

```js
// GET /api/w09/catalog  → rendered straight from manifest.json + the registry
{ tools: [{ name, description, authz_scope, input_schema, output_schema,
            timeout_s, idempotent, exposed_via_mcp, source: 'local' | 'mcp:<server>' }] }

// GET /api/w09/clients/:clientId/scopes
{ client_id, granted_scopes[], granted_tools[]|null,
  effective_tools: [{ name, allowed: bool, reason }],   // the ANSWER, not the inputs
  rate_limit_per_min, cost_cap_usd_per_day, spent_today_usd }
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `frontend/src/weeks/w09/ToolCatalog.jsx` | NEW | every tool + scope, from the manifest |
| `frontend/src/weeks/w09/ScopeInspector.jsx` | NEW | "given this client, what may it call?" |
| `frontend/src/weeks/w09/ToolTryIt.jsx` | NEW | invoke one tool with validated input |
| `apps/w09_mcp_tools/router.py` | EDIT | `/catalog`, `/clients/{id}/scopes` |
| `frontend/src/weeks/registry.js` | EDIT | + w09 |

## Flow

```
/w09  → ToolCatalog
          rows generated from manifest.json + registry — NEVER a hand-written list
          columns: name · source (local | mcp:<server>) · scope · exposed? · idempotent
             ▼ select a tool
          input_schema rendered as a form (JSON Schema → fields)
             ▼
          ToolTryIt → POST → ToolResult shown raw (this is a debugging surface)

/w09/clients/:id → ScopeInspector
          effective_tools[]: allowed ✓ / denied ✗ WITH THE REASON
          today's spend against the cap
```

## Rules

- **Rendered from the manifest and registry, never hand-listed.** A catalog that drifts from reality
  is worse than none: it becomes the thing people trust while being wrong.
- **`ScopeInspector` shows the *answer*, not the inputs.** Listing granted scopes makes a human do
  the matrix computation in their head, and they will get it wrong. Show `effective_tools` with a
  per-tool allowed/denied and the reason.
- **`ToolTryIt` runs through the real authorization path.** A test harness that bypasses `authorize`
  proves nothing and is actively misleading.
- **Show `source`.** Whether a tool is local or from `mcp:<server>` is the single most important
  security-relevant fact about it (F9.3) — remote tools are untrusted.
- **Read-only by default.** The inspector does not grant, revoke, or edit scopes. Scope changes are
  a config-and-deploy operation with a review, not a click.
- No streaming here — nothing generates. Same reasoning as W5.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Manifest and registry disagree | Catalog shows the conflict loudly; F9.1's test also fails the build |
| Tool exists but is unexposed | Listed with `exposed_via_mcp: false` — visible, clearly marked |
| `ToolTryIt` call is denied | Shows the denial exactly as an external client would see it |
| MCP server unreachable | Its tools show as unavailable, not silently missing |
| Client id unknown | Typed 404; no scope information leaked |
| Very large `ToolResult` | Truncated per F9.2, with the truncation visible |

## Tests

- `test_catalog_is_generated_not_hardcoded`
- `test_scope_inspector_shows_effective_allow_deny_per_tool`
- `test_try_it_goes_through_the_real_authorize_path`
- `test_mcp_sourced_tools_are_visibly_labelled`
- `test_unreachable_mcp_server_shows_unavailable_not_missing`

## Acceptance criteria

- [ ] The catalog matches the registry exactly — a mismatch is visible and fails CI
- [ ] `ScopeInspector` answers "what may this client call?" without mental arithmetic
- [ ] `ToolTryIt` cannot bypass authorization
- [ ] Remote (MCP-sourced) tools are clearly distinguished from local ones
- [ ] The UI cannot modify scopes
