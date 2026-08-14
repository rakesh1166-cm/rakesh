# W3-F3.1 — Prompt Registry + Immutable Versions

> [Week 3](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `platform/src/aiplat/prompts/` (kernel)
**Depends on:** [W2-F2.5](../../week-02-fastapi-ai-service/F2.5-four-nlp-endpoints/CLAUDE.md)
**Consumed by:** every LLM call from W3 onward; W11 pairs prompt versions with eval datasets

## Goal

Address a prompt by `(name, version)` instead of pasting a string. A shipped version is
**immutable** — improving a prompt means adding `v3`, never editing `v2` — so a score change is
always attributable to a specific, reviewable diff.

## Contract (schema first)

```python
class PromptMeta(BaseModel):
    name: str                       # "summarize"
    version: str                    # "v2"  — monotonically increasing, never reused
    variables: list[str]            # declared, not inferred at render time
    model_tier: ModelTier           # the tier this prompt was tuned for
    frozen: bool                    # True once it has shipped — edits then rejected
    notes: str                      # WHY this version exists vs the previous

class Prompt(BaseModel):
    meta: PromptMeta
    template: str
    checksum: str                   # sha256 of template; frozen prompts must match

def get(name: str, version: str) -> Prompt          # raises PromptNotFound
def latest(name: str) -> Prompt
def versions(name: str) -> list[PromptMeta]
```

Template file layout — front-matter carries the meta, body carries the template:

```
platform/src/aiplat/prompts/templates/summarize/v2.md
---
variables: [text, max_sentences]
model_tier: default
frozen: true
notes: "v1 over-summarised short inputs; v2 adds a length floor."
---
You are a summarisation service. ...
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `platform/src/aiplat/prompts/registry.py` | NEW | load, cache, validate, freeze-check |
| `platform/src/aiplat/prompts/templates/**/v*.md` | NEW | the prompts themselves |
| `apps/w02_ai_service/service.py` | EDIT | inline strings → `registry.get(name, version)` |
| `apps/w03_prompt_lab/router.py` | NEW | `GET /api/w03/prompts` lists `PromptMeta` |

## Flow

```
process start ──► registry scans templates/ ──► parse front-matter ──► validate ──► cache
                                                     │
                                    frozen && checksum mismatch ──► STARTUP FAILURE
      ▼
service.py ──► registry.get("summarize", "v2") ──► Prompt ──► render (F3.2) ──► llm
```

## Rules

- **Frozen means frozen.** The checksum is verified at startup; editing a shipped `v2.md` fails the
  process. This is the mechanism that makes versions trustworthy — without it, `v2` is just a name.
- Callers name an **explicit version**. `latest()` exists for the lab UI only; production paths pin
  a version so a new file cannot silently change behaviour.
- `variables` are **declared** in front-matter, not inferred by scanning `{...}` in the body. A typo
  in the template then surfaces as a declaration mismatch instead of an empty substitution.
- `notes` is required and must say *why*, not *what*. It is the changelog a reviewer reads.
- Templates live in the **kernel**, not in `apps/`. Week 11 versions eval datasets alongside them,
  and a prompt reachable from only one app cannot be regression-tested across weeks.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| A frozen template is edited | Startup fails, naming file and both checksums |
| `get()` on an unknown version | `PromptNotFound` at call time, never a silent fallback to latest |
| Two files declare the same version | Startup fails — no last-writer-wins |
| Front-matter missing `variables` | Startup fails; an undeclared prompt cannot be validated |
| Template contains a secret | Scan test rejects anything matching credential patterns |

## Tests

- `test_editing_a_frozen_template_fails_startup`
- `test_get_unknown_version_raises_not_found`
- `test_duplicate_version_detected`
- `test_no_inline_prompt_strings_in_apps` — AST scan for long string literals near LLM calls
- `test_every_template_declares_its_variables`

## Acceptance criteria

- [ ] `apps/` and `services/` contain no prompt text — only `registry.get(...)` calls
- [ ] Every production call site pins an explicit version
- [ ] A tampered frozen template is caught at startup, not by a failing eval days later
- [ ] `GET /api/w03/prompts` lists every `(name, version)` with its notes
- [ ] W2's endpoints behave identically after the migration — proven by their existing tests
