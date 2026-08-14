# Week 9 — MCP Server with Bounded Tools

> [doc index](../CLAUDE.md) · [12-week architecture](../../CLAUDE-12-WEEK.md) · [repo rules](../../CLAUDE.md) · [ADRs](../../TECH-STACK-DECISIONS.md)

## Objective

Expose the tool layer over the **Model Context Protocol** so other agents and applications can use
it, and consume third-party MCP servers as ordinary `ToolPort`s. This is the **second seam split**
([architecture §11](../../CLAUDE-12-WEEK.md)): `services/mcp-server`.

**This week is nearly free — because of a Week 4 decision.** `aiplat/tools/ports.py` was designed
with `input_schema`, `output_schema`, and `authz_scope`. MCP is essentially a serialization of
exactly that. Had Week 4 shipped loose dicts, this week would be a rewrite.

The security requirement is the hard part: **least privilege**. No arbitrary SQL, no shell, no
unbounded HTTP — an external client must not be able to exceed its declared scope.

## Features (5)

| ID | Feature | Layer | Depends on |
|---|---|---|---|
| [F9.1](F9.1-mcp-server-from-tool-registry/CLAUDE.md) | MCP server generated from the registry | `aiplat/mcp/server.py` | W4-F4.3 |
| [F9.5](F9.5-mcp-resources-and-prompts/CLAUDE.md) | MCP resources + prompts (beyond tools) | `aiplat/mcp/{resources,prompts}.py` | F9.2 |
| [F9.2](F9.2-scope-bounds-and-least-privilege/CLAUDE.md) | Scope bounds + authorization enforcement | `aiplat/mcp/bounds.py`, `security/authz.py` | F9.1 |
| [F9.3](F9.3-mcp-client-as-toolport/CLAUDE.md) | Consume external MCP servers as `ToolPort` | `aiplat/mcp/client.py` | F9.2 |
| [F9.4](F9.4-tool-catalog-and-scope-inspector/CLAUDE.md) | Tool catalog + scope inspector UI | `frontend/src/weeks/w09/` | F9.2 |

## Architecture flow

```
   aiplat.agent.loop (W7) / aiplat.graph (W8)
              │
     ┌────────┴─────────┐
     ▼                  ▼
 aiplat.tools      aiplat.mcp.client ──► third-party MCP servers
 .registry                                (wrapped by mcp/bounds.py — they are UNTRUSTED)
     │
     └──exposed by──► services/mcp-server ──MCP──► Claude Desktop · other agents · other apps
                            │
                     aiplat.mcp.bounds
                     scope + permission wrapper
                     ⚠ NO arbitrary SQL · NO shell · NO unbounded HTTP
                            │
                     weeks/w09/ToolCatalog.jsx   (read-only inspector)
```

## Folder delta

**Backend**
```
├── platform/src/aiplat/
│   ├── mcp/{server.py, client.py, bounds.py}       ← NEW
│   └── security/authz.py                            ← NEW  matrix enforcement, cross-process
├── services/mcp-server/{main.py, Dockerfile}        ← NEW  ⚑ SECOND SEAM SPLIT
└── apps/w09_mcp_tools/{tools/, manifest.json, tests/}  ← NEW
```

**Frontend** — deliberately small; MCP's real consumers are other agents, not this SPA
```
└── src/weeks/
    ├── registry.js                                  ← EDIT + w09
    └── w09/{ToolCatalog, ScopeInspector, ToolTryIt}.jsx  ← NEW  read-only inspector
```

## Build order

1. **F9.1** server generated from the registry — never a hand-written parallel list of tools.
2. **F9.2** bounds — before exposing anything to an external client.
3. **F9.3** client — consuming external servers, treated as untrusted input.
4. **F9.4** catalog UI, rendered from the manifest.

## Week Definition of Done

- [ ] MCP tool definitions are **generated** from `aiplat/tools/registry.py`, never hand-maintained
- [ ] An external client provably **cannot** exceed its declared scope
- [ ] Privilege-escalation attempts are a test suite, and they all fail to escalate
- [ ] No tool exposes arbitrary SQL, shell, or unbounded HTTP
- [ ] A third-party MCP server is consumed through `client.py` as an ordinary `ToolPort`
- [ ] Output from external MCP servers is validated as untrusted — same as any tool output
- [ ] `ToolCatalog` renders from `manifest.json`, never a hand-written list

## What this week unlocks

Week 12's `act` node calls tools that may be local or MCP-provided — indistinguishable to the agent
loop, because both are `ToolPort`. The scope enforcement built here is what makes it safe for an ops
assistant to hold tools at all.
