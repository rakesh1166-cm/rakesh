# W1-F1.2 — `LLMPort` + Anthropic Client

> [Week 1](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/llm/` (kernel)
**Depends on:** [F1.1](../F1.1-typed-settings-and-model-tiers/CLAUDE.md)
**Consumed by:** W2 endpoints, W3 prompts, W4 tools/streaming, W6 rerank, W7 loop, W10 specialists

## Goal

**The seam of the entire repo.** A provider-agnostic protocol written *before* any client, plus one
Anthropic implementation. After this feature, exactly one file in the monorepo imports the
`anthropic` SDK — which is why swapping or adding a provider later is a single-file change.

## Contract (schema first)

```python
# aiplat/llm/ports.py  — written FIRST
class Message(BaseModel):
    role: Literal["user", "assistant"]
    content: str

class CompletionRequest(BaseModel):
    system: str
    messages: list[Message]
    tier: ModelTier = ModelTier.DEFAULT
    max_output_tokens: int | None = None
    tools: list[dict] | None = None          # populated from W4 onward
    temperature: float = Field(0.0, ge=0.0, le=1.0)

class Usage(BaseModel):
    input_tokens: int
    output_tokens: int
    cache_read_tokens: int = 0               # W4 prompt caching
    cost_usd: float

class CompletionResponse(BaseModel):
    text: str
    tool_calls: list[ToolCall] = []
    stop_reason: str
    usage: Usage
    model_id: str

class LLMPort(Protocol):
    async def complete(self, req: CompletionRequest) -> CompletionResponse: ...
    def stream(self, req: CompletionRequest) -> AsyncIterator[StreamChunk]: ...   # used from W4
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/llm/ports.py` | NEW | `LLMPort` protocol + request/response models |
| `platform/src/aiplat/llm/anthropic_client.py` | NEW | The **only** file importing `anthropic` |
| `tests/conftest.py` | NEW | `MockLLM(LLMPort)` — scripted responses, zero network |

## Flow

```
caller ──► LLMPort.complete(CompletionRequest)
              │
              ├─ tier ──► config.models.TIERS[tier] ──► ModelSpec.model_id
              ├─ anthropic SDK call  (timeout from settings)
              ├─ raw response ──► CompletionResponse  (validated)
              └─ usage ──► cost = tokens × ModelSpec rates
```

## Rules

- **Protocol before implementation.** `ports.py` is written and reviewed first; the client conforms.
- The caller passes a **tier**, never a model ID. Tier→ID resolution happens inside the client.
- The client returns `CompletionResponse` — never a raw SDK object. SDK types must not escape.
- `stream()` is declared now, implemented in W4. Declaring it now prevents an interface change later.
- No retry or timeout logic here yet — W2's `aiplat/resilience/` wraps this. Keep the client thin.
- `temperature` defaults to `0.0`: determinism first ([master prompt](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf)).

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Provider returns 429 | Raise a typed `LLMRateLimited`, not the SDK exception (W2 adds backoff) |
| Provider returns 500 | Typed `LLMUnavailable`; the SDK exception never reaches a caller |
| Response missing usage | `CompletionResponse` validation fails loudly — no silent `cost=0` |
| Unknown tier requested | `KeyError` at call time is unacceptable — validate against `ModelTier` enum |
| Network hangs | `settings.llm_timeout_s` applies; the call cannot block forever |

## Tests

- `test_mock_llm_satisfies_llm_port` — structural check against the Protocol
- `test_caller_never_passes_a_model_id` — grep-style AST test over `apps/` and `services/`
- `test_sdk_exceptions_are_translated` — each provider error class → each typed error
- `test_cost_matches_tier_rates` — usage × `ModelSpec` rates, exact arithmetic
- `test_anthropic_sdk_imported_exactly_once` — repo-wide import scan

## Acceptance criteria

- [ ] `grep -rl "import anthropic" platform/ apps/ services/` returns exactly one path
- [ ] Every test in the repo passes with the network disabled
- [ ] No SDK object is reachable from any `CompletionResponse` field
- [ ] `stream()` is declared in the Protocol even though W1 does not implement it
- [ ] Swapping `MockLLM` for the real client requires changing one wiring line, no call sites
