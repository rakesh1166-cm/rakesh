# W2-F2.5 — `/summarize` `/classify` `/extract` `/chat`

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `apps/w02_ai_service/` (thin app)
**Depends on:** [F2.1](../F2.1-api-skeleton-and-week-mounts/CLAUDE.md)–[F2.4](../F2.4-resilience-timeout-retry-breaker/CLAUDE.md)
**Consumed by:** W3 (these become the first versioned prompts), W11 (first eval suites)

## Goal

Four endpoints that each return a **validated object, never prose**. This is the first place the
repo proves the golden rule ([CLAUDE.md §1](../../../CLAUDE.md)): structured output with a repair
retry, not a string the caller has to parse.

## Contract (schema first)

```python
class SummarizeIn(BaseModel):
    text: str = Field(min_length=1, max_length=50_000)
    max_sentences: int = Field(3, ge=1, le=10)
class SummarizeOut(BaseModel):
    summary: str
    key_points: list[str]

class ClassifyIn(BaseModel):
    text: str = Field(min_length=1, max_length=50_000)
    labels: list[str] = Field(min_length=2, max_length=20)   # caller-supplied taxonomy
class ClassifyOut(BaseModel):
    label: str                                # MUST be one of the supplied labels
    confidence: float = Field(ge=0, le=1)
    rationale: str

class ExtractIn(BaseModel):
    text: str
    fields: dict[str, str]                    # {"invoice_no": "string", "total": "number"}
class ExtractOut(BaseModel):
    values: dict[str, Any]
    missing: list[str]                        # asked-for but absent — NOT invented

class ChatIn(BaseModel):
    messages: list[Message] = Field(max_length=40)
class ChatOut(BaseModel):
    reply: str
    usage: Usage
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w02_ai_service/schemas.py` | NEW | the eight models above |
| `apps/w02_ai_service/router.py` | NEW | HTTP shape only — path, status, response_model |
| `apps/w02_ai_service/service.py` | NEW | wiring: prompt → LLM → validate → repair once |
| `apps/w02_ai_service/tests/` | NEW | unit, contract, failure-injection |
| `services/api/mounts.py` | EDIT | register `w02` |

## Flow

```
router.py  (validates SummarizeIn)
    ▼
service.py
    ├─ build prompt   (inline strings for now — W3 moves these to the registry)
    ├─ resilience.call( llm.complete )        F2.4
    ├─ parse + validate against SummarizeOut
    │     └─ invalid? ONE repair retry with the validation error fed back
    │           └─ still invalid? raise AppError(VALIDATION_FAILED)  — never return prose
    └─ cost.record(component="w02.summarize")  F2.2
```

## Rules

- **No business logic in `router.py`** — it declares the HTTP contract and calls `service.py`.
- **Exactly one repair retry.** Two retries triple cost for a model that has already failed twice;
  zero retries makes a one-character JSON slip fatal.
- `ClassifyOut.label` must be validated as a member of the *caller's* `labels` list — a model
  inventing a label is a validation failure, not a warning.
- `ExtractOut.missing` exists so absence is representable. Without it, models invent values to fill
  a required field — the single most common structured-output failure.
- `ChatIn.messages` is length-capped; unbounded history is a cost incident waiting to happen.
- These endpoints are **synchronous JSON**. No streaming until W4 — determinism first.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Model returns prose instead of JSON | Repair retry; then `VALIDATION_FAILED` — never prose to the client |
| Model returns a label outside `labels` | Validation failure, not a coerced best-match |
| Model invents a value for an absent field | Caught by contract tests; correct behaviour is `missing[]` |
| Input 10× over `max_length` | 422 at the boundary, before any token is counted or spent |
| Provider times out | `UPSTREAM_TIMEOUT` envelope with `retryable=true` |
| Chat history exceeds context | `ContextOverflow` from W1-F1.3 — caught before dispatch |

## Tests

- `test_repair_retry_happens_exactly_once` — assert the LLM mock was called twice, not three times
- `test_classify_rejects_label_outside_taxonomy`
- `test_extract_reports_missing_instead_of_inventing`
- `test_oversized_input_rejected_before_llm_call`
- `test_every_endpoint_returns_envelope_on_provider_failure`
- Contract: round-trip each response model against 20 recorded fixtures

## Acceptance criteria

- [ ] All four endpoints return validated models or a typed envelope — never raw text
- [ ] Repair retry fires exactly once and is visible in logs (`event="llm.repair"`)
- [ ] `router.py` contains no prompt strings and no LLM calls
- [ ] Cost is recorded per endpoint with a distinct `component` value
- [ ] Failure-injection suite passes for timeout, malformed output, and oversized input
