# W9-F9.2 — Scope Bounds + Least Privilege

> [Week 9](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/mcp/bounds.py` + `aiplat/security/authz.py` (kernel)
**Depends on:** [F9.1](../F9.1-mcp-server-from-tool-registry/CLAUDE.md)
**Consumed by:** [F9.3](../F9.3-mcp-client-as-toolport/CLAUDE.md), W12 (an ops assistant holding tools)

## Goal

The security feature of the week. Once tools are reachable from outside this process, the
authorization matrix stops being an internal convention and becomes a **boundary**. An external
client must be provably unable to exceed its declared scope — and no tool may offer arbitrary SQL,
shell, or unbounded HTTP.

## Contract (schema first)

```python
class ClientIdentity(BaseModel):
    client_id: str
    granted_scopes: set[AuthzScope]   # what this client MAY use
    granted_tools: set[str] | None    # None = all tools within granted_scopes
    rate_limit_per_min: int = 60
    cost_cap_usd_per_day: float = 5.0

class AuthzDecision(BaseModel):
    allowed: bool
    reason: str
    required_scope: AuthzScope
    client_scopes: set[AuthzScope]

def authorize(client: ClientIdentity, tool: ToolSpec) -> AuthzDecision

class BoundsPolicy(BaseModel):
    """Hard limits applied to EVERY externally-reachable tool."""
    max_result_bytes: int = 256_000
    max_arg_bytes: int = 32_000
    forbid_patterns: list[str]        # raw SQL, shell metacharacters, file:// and similar
    egress_allowlist: list[str]       # reuses aiplat/security/egress.py (W4)
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/security/authz.py` | NEW | the matrix, now enforced cross-process |
| `platform/src/aiplat/mcp/bounds.py` | NEW | per-call scope check + hard bounds |
| `apps/w09_mcp_tools/manifest.json` | EDIT | declared scope per tool |
| `apps/w09_mcp_tools/tests/escalation/` | NEW | the privilege-escalation suite |

## Flow

```
MCP tools/call {name, arguments} from client C
      ▼
resolve ClientIdentity(C)              unknown client ──► refuse, log, rate-limit the source
      ▼
authorize(client, tool.spec)
   tool.authz_scope ∈ client.granted_scopes ?     ← the ONE question. Nothing else influences it.
   tool.name ∈ client.granted_tools (if set) ?
      ▼  denied → typed MCP error. No hint about whether the tool exists.
bounds.check(arguments)
   ├─ size limits
   ├─ forbid_patterns    (SQL fragments, shell metacharacters, file:// …)
   └─ egress allow-list  (W4-F4.3)
      ▼
executor (W4-F4.3) ──► result
      ▼
bounds.check_result()  size cap; truncate + flag, never stream unbounded output
      ▼
rate limit + daily cost accounting per client
```

## Rules

- **Least privilege by default.** A new client starts with **no** scopes. Grants are explicit
  entries, never inherited and never implied by "it's internal".
- **Deny reveals nothing.** A denial for an unauthorised tool and for a nonexistent tool must look
  identical to the client, or the error becomes a tool-enumeration oracle.
- **No tool may accept arbitrary SQL, shell, or unrestricted URLs** — the master prompt states this
  as a hard rule, and it is enforced here structurally, not by review discipline. A tool whose input
  schema is `{"query": "string"}` feeding a database is the shape to reject.
- **Bound the result, not just the input.** An unbounded result is a memory and cost hazard for the
  *caller*, and a way to exfiltrate a whole table one "legitimate" call at a time.
- **Per-client cost caps.** Scope answers "may you"; the cap answers "how much" — an authorised
  client can still bankrupt you.
- The matrix lives in `aiplat/security/authz.py` and is the **same object** the internal executor
  consults. Two authorization systems means one of them is wrong.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Client calls a tool outside its scope | Denied; indistinguishable from "no such tool" |
| Client enumerates tools by probing errors | Uniform denials leak nothing |
| Argument contains `; DROP TABLE` | `forbid_patterns` rejects before the executor is reached |
| Tool returns 50 MB | Truncated at `max_result_bytes` and flagged |
| Client exceeds its rate limit | `RATE_LIMITED` with `retry_after_s` |
| Client exceeds its daily cost cap | `BUDGET_EXCEEDED`, **not** retryable |
| Unknown client | Refused; source rate-limited to prevent probing |
| A new tool is registered | Unreachable until an explicit scope grant exists |

## Tests

- `test_escalation_suite_all_attempts_denied` — the deliverable of this feature
- `test_denial_for_unauthorised_and_nonexistent_are_identical`
- `test_no_registered_tool_accepts_raw_sql_or_shell` — scan every `input_schema`
- `test_result_size_cap_truncates_and_flags`
- `test_daily_cost_cap_is_not_retryable`
- `test_new_client_has_zero_scopes_by_default`
- `test_internal_and_mcp_paths_share_one_authz_module`

## Acceptance criteria

- [ ] Every escalation test fails to escalate
- [ ] Denials leak no information about tool existence
- [ ] No exposed tool accepts arbitrary SQL, shell, or unbounded URLs — asserted by a scan
- [ ] Results are size-capped and truncation is visible
- [ ] Scope grants are explicit, per client, and default to empty
