# W1-F1.3 — Token Accounting + Context-Window Guard

> [Week 1](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/llm/tokens.py` (kernel)
**Depends on:** [F1.2](../F1.2-llm-port-and-anthropic-client/CLAUDE.md)
**Consumed by:** W2 cost tracking, W4 conversation history, W6 RAG context packing, W7 loop budget

## Goal

Know the size of a request **before sending it**. A context overflow must be caught locally as a
typed error, never discovered as a provider 400 — because by Week 6 (RAG stuffing chunks) and
Week 7 (a loop appending observations) overflow is a *routine* condition to be handled, not a bug.

## Contract (schema first)

```python
class TokenBudget(BaseModel):
    context_window: int          # from ModelSpec
    max_output_tokens: int
    reserved_output: int         # never fill the window past window - reserved_output
    request_cap: int             # settings.request_token_cap — a cost lever, not a model limit

class TokenCount(BaseModel):
    system: int
    messages: int
    tools: int                   # tool schemas cost tokens too — counted from W4
    total: int
    remaining: int               # budget headroom; negative means overflow

def count(req: CompletionRequest) -> TokenCount: ...
def check(req: CompletionRequest, budget: TokenBudget) -> None:
    """Raises ContextOverflow | RequestTokenCapExceeded. Never returns a bool."""
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/llm/tokens.py` | NEW | `count()`, `check()`, `TokenBudget`, `TokenCount` |
| `platform/src/aiplat/llm/anthropic_client.py` | EDIT | call `check()` before dispatching |
| `platform/src/aiplat/config/models.py` | EDIT | add `context_window` to `ModelSpec` |

## Flow

```
CompletionRequest
      ▼
tokens.count()  ── system + messages + tool schemas
      ▼
tokens.check(req, budget)
      ├─ total > window - reserved_output   ──► raise ContextOverflow
      ├─ total > request_cap                ──► raise RequestTokenCapExceeded
      └─ ok ──► anthropic_client dispatches
                      ▼
              response.usage ──► reconciled against count()  (drift is a test failure)
```

## Rules

- `check()` **raises**, never returns a boolean. A caller cannot forget to branch on it.
- Called **inside** `anthropic_client`, not by every caller — one enforcement point.
- Two separate limits: `context_window` is the model's, `request_cap` is *yours*. Hitting the cost
  cap is a different error from hitting the model limit, and callers handle them differently.
- Tool schemas count toward the total. They are not free, and W4 adds many of them.
- Reconcile `count()` against the provider's reported `usage` in tests; drift beyond tolerance
  means the counter is wrong and every downstream budget is wrong with it.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| 200k-token message | `ContextOverflow` raised locally; **zero** network calls made |
| Request just under window, output would overflow | `reserved_output` catches it — no truncated generation |
| Cost cap exceeded but window fine | `RequestTokenCapExceeded` — a *different* error, distinguishable |
| Counter drifts from provider usage | Reconciliation test fails; counter is fixed, not the tolerance |
| Tool schemas ignored in count | Test asserts tool tokens > 0 when tools are present |

## Tests

- `test_overflow_raises_before_any_network_call` (assert the mock transport was never touched)
- `test_reserved_output_prevents_truncation`
- `test_cost_cap_and_window_limit_are_distinct_errors`
- `test_count_reconciles_with_provider_usage` — within ±2% on a recorded fixture
- `test_tool_schemas_are_counted`

## Acceptance criteria

- [ ] A deliberate overflow raises `ContextOverflow` with **no** outbound request
- [ ] `TokenCount.remaining` is correct and used by W6/W7 to decide how much context to pack
- [ ] Model context windows live in `ModelSpec`, not as constants in `tokens.py`
- [ ] Reconciliation test passes against a recorded real-provider response
- [ ] The check cannot be bypassed by calling `LLMPort` directly
