# W3-F3.2 — Template Rendering + Variable Validation

> [Week 3](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/prompts/render.py` (kernel)
**Depends on:** [F3.1](../F3.1-prompt-registry-and-versioning/CLAUDE.md)
**Consumed by:** every LLM call; W4 injects tool schemas, W6 injects retrieved chunks

## Goal

Substitution that **fails loudly**. A missing variable must raise before a token is spent — not
render as an empty string that quietly degrades output quality and shows up weeks later as a
mysterious eval regression.

This is also the first line of prompt-injection defence: user text is **substituted as data**, and
substituted values can never introduce new template directives.

## Contract (schema first)

```python
class RenderContext(BaseModel):
    values: dict[str, Any]
    model_config = ConfigDict(extra="forbid")     # an undeclared variable is an error

class RenderedPrompt(BaseModel):
    name: str
    version: str
    text: str
    token_count: int                 # from W1-F1.3 — known before dispatch
    truncated_fields: list[str] = [] # which values were clipped, and never silently

def render(prompt: Prompt, ctx: RenderContext, *, budget: TokenBudget) -> RenderedPrompt
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/prompts/render.py` | NEW | `render()`, variable checks, budget-aware truncation |
| `platform/src/aiplat/prompts/registry.py` | EDIT | expose `meta.variables` to the renderer |

## Flow

```
Prompt (F3.1) + RenderContext
      ▼
1. declared vs supplied variables
     missing  ──► MissingPromptVariable    (raise — do NOT render empty)
     extra    ──► UnknownPromptVariable    (raise — catches renamed variables)
      ▼
2. substitute values AS DATA
     substituted text is never re-scanned for directives
      ▼
3. tokens.count()  (W1-F1.3)
     over budget ──► truncate declared-truncatable fields, record in truncated_fields
     still over  ──► ContextOverflow
      ▼
RenderedPrompt{text, token_count, truncated_fields}  ──► llm.complete
```

## Rules

- **Missing variable → raise.** Never render an empty string. This single rule prevents the most
  expensive class of silent prompt bug.
- **Extra variable → raise.** When a template renames `text` to `input`, callers must break
  immediately, not keep passing a value that is now ignored.
- **Single-pass substitution.** Substituted values are not re-scanned. If user text contains
  `{system}`, it stays literal — user text is data, never authority
  ([ADR-012](../../../TECH-STACK-DECISIONS.md)).
- **Truncation is explicit and reported.** `truncated_fields` is logged and, from W6, surfaced in
  the UI. Silent truncation is how a RAG answer loses the chunk that held the answer.
- The renderer knows the token budget. Rendering blind and discovering overflow at dispatch wastes
  the whole assembly step — which by W6 includes reranking.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Variable omitted | `MissingPromptVariable` naming it; zero network calls |
| Variable renamed in template, not at call site | `UnknownPromptVariable` — caller breaks loudly |
| User text contains `{{...}}` or `{system}` | Rendered literally; no second substitution pass |
| Value 10× the budget | Truncated only if declared truncatable, and reported |
| Nothing truncatable, still over budget | `ContextOverflow` — never a silently clipped prompt |

## Tests

- `test_missing_variable_raises_before_any_llm_call`
- `test_unknown_variable_raises`
- `test_injected_template_syntax_in_user_text_is_literal` ← the security test
- `test_truncation_is_recorded_in_truncated_fields`
- `test_render_reports_token_count_matching_tokens_count`

## Acceptance criteria

- [ ] No code path can produce a prompt with an empty substituted variable
- [ ] `{system}` inside user input appears verbatim in the rendered prompt
- [ ] `RenderedPrompt.token_count` is known before dispatch and matches W1-F1.3's counter
- [ ] Truncation never happens silently — it is logged and reported to the caller
- [ ] All four W2 endpoints render through this path
