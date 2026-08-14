# W11-F11.7 — Output Guardrails

> [Week 11](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/security/output_guard.py` (kernel)
**Depends on:** [F11.6](../F11.6-redaction-audit-log-and-traceview/CLAUDE.md)
**Consumed by:** every streaming and non-streaming response path

## Goal

F11.6 redacts what goes into **logs**. Nothing yet checks what goes out to the **user**.

The realistic failures are not "the model said something rude". They are: a retrieved document
containing another customer's data gets echoed into an answer; a connection string in a stack trace
lands in a tool result and then in the response; the model repeats back the PII it was given. All
three are exfiltration paths that input-side defenses cannot see.

## Contract (schema first)

```python
class OutputViolation(str, Enum):
    PII_LEAK        = "pii_leak"          # email, phone, card, national id
    SECRET_LEAK     = "secret_leak"       # api key, JWT, connection string, private key
    SYSTEM_LEAK     = "system_leak"       # system prompt or tool schema echoed back
    UNSAFE_CONTENT  = "unsafe_content"
    OFF_DOMAIN      = "off_domain"        # answering outside the product's remit
    CROSS_TENANT    = "cross_tenant"      # ⚠ data from another principal's scope

class GuardAction(str, Enum):
    ALLOW = "allow"; REDACT = "redact"; BLOCK = "block"

class OutputVerdict(BaseModel):
    action: GuardAction
    violations: list[OutputViolation]
    redacted_text: str | None
    detail: str
    checked_ms: float

class OutputGuardPolicy(BaseModel):
    on_pii: GuardAction = GuardAction.REDACT
    on_secret: GuardAction = GuardAction.BLOCK      # never redact-and-ship a secret
    on_system_leak: GuardAction = GuardAction.BLOCK
    on_cross_tenant: GuardAction = GuardAction.BLOCK
    stream_buffer_tokens: int = 24                  # see rules — the streaming problem
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/security/output_guard.py` | NEW | detectors + policy + verdicts |
| `platform/src/aiplat/llm/streaming.py` | EDIT | buffered guarding on the token stream |
| `services/api/middleware/output_guard.py` | NEW | non-streaming response path |
| `platform/src/aiplat/evals/datasets/exfiltration/` | NEW | ≥30 cases, tagged `safety` |

## Flow

```
NON-STREAMING                          STREAMING (the hard case)
response body                            token events
     ▼                                        ▼
output_guard.check()                   buffer stream_buffer_tokens before emitting
     ├─ PII      → REDACT                     ▼
     ├─ secret   → BLOCK                 guard the buffered window
     ├─ system   → BLOCK                      ├─ clean  → emit the oldest token
     └─ x-tenant → BLOCK                      └─ violation → discard buffer,
     ▼                                             emit `error` + `done` (W4-F4.5)
verdict → response | typed envelope             (the UI already handles this — no new path)
     ▼
violation logged + audited (F11.6); NEVER logged with the leaked content itself
```

## Rules

- **Secrets are blocked, never redacted-and-shipped.** If a credential reached the output, the
  pipeline is already compromised — sending a partially-scrubbed version tells an attacker the
  format, the length, and that they are close.
- **Streaming needs a buffer.** A secret split across token boundaries (`sk-` … `abc123`) is
  invisible token-by-token. A small sliding buffer is the cost of guarding a stream at all; the
  latency it adds is a few tokens, and it is not optional.
- **Blocking mid-stream reuses the existing `error` → `done` path** (W4-F4.5). No new client
  behaviour, no new UI state — the contract designed in Week 4 already covers it.
- **`CROSS_TENANT` is the highest-severity check.** By W6 a retrieval bug can surface another
  principal's document; by W9 an MCP server can return one. Output is the last place to catch it.
- **Never log the violating content.** Log the violation type, the correlation ID, and the offset.
  Logging the leak to prove the leak happened is the classic own-goal (F11.6's reasoning).
- **Guarding is fail-closed.** If the guard itself errors, block. A guard that fails open is
  decorative.
- **Measure the cost.** `checked_ms` on every response — a guard adding 200ms to every request will
  be disabled by someone within a month, so keep it cheap and prove it is.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Retrieved doc contains another customer's email | `PII_LEAK` → redacted before it ships |
| API key appears in a tool result and is echoed | `SECRET_LEAK` → response **blocked** |
| User asks the model to repeat its system prompt | `SYSTEM_LEAK` → blocked |
| Secret split across token boundaries | Buffer catches it; token-level checking would not |
| Guard raises | Fail closed — block |
| Legitimate content matches a pattern | False-positive rate measured on the eval corpus; patterns tuned |
| Guard adds material latency | `checked_ms` tracked; a budget is enforced |

## Tests

- `test_secret_is_blocked_not_redacted`
- `test_secret_split_across_token_boundaries_is_caught` ← the streaming-specific test
- `test_blocked_stream_emits_error_then_done`
- `test_violation_logs_never_contain_the_leaked_content`
- `test_guard_failure_fails_closed`
- `test_cross_tenant_content_is_blocked`
- `test_false_positive_rate_on_the_benign_corpus`

## Acceptance criteria

- [ ] No response path bypasses the output guard — streaming or not
- [ ] Secrets block; PII redacts; system-prompt echoes block
- [ ] Streaming guards over a buffer, not per token
- [ ] Violations are audited without recording the leaked content
- [ ] The exfiltration corpus is tagged `safety` and gated with zero tolerance (F11.3)
- [ ] Guard latency is measured and within budget
