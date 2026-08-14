# W0-F0.7 — Bridge: From My Transformer to a Real LLM

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** all four (**6 Transformer · 7 Attention · 8 Tokens · 9 Embeddings**) → the handoff to blog step **10 — LLM**
**Layer:** `apps/w00_transformer_lab/BRIDGE.md` + one comparison script
**Depends on:** [F0.6](../F0.6-tiny-transformer-end-to-end/CLAUDE.md)
**Consumed by:** [Week 1](../../week-01-llm-foundations/CLAUDE.md) — every one of its features

## Goal

Close the gap between the 30 KB of NumPy you just wrote and the model Week 1 will call over HTTP.
Same four concepts, four orders of magnitude apart. Produce one table that maps every hand-built
component onto a concrete API parameter, cost, or limit — so that when Week 1 sets `temperature`,
counts tokens, or hits a context wall, none of it is new.

This feature also **checks your tokenizer against a real one**: your BPE from
[F0.2](../F0.2-tokenization-lab/CLAUDE.md) vs the provider's actual count for the same string. The
delta is the last number Week 0 produces.

## Contract (schema first)

```python
@dataclass(frozen=True)
class ConceptMapping:
    concept: str                   # "attention" | "tokens" | "embeddings" | "transformer"
    my_lab: str                    # what I built, with the file that holds it
    production: str                # what the API exposes
    api_surface: str               # the literal parameter / field / limit name
    consequence: str               # what it costs me if I get it wrong

@dataclass(frozen=True)
class TokenCountComparison:
    text: str
    my_bpe_tokens: int             # from F0.2
    provider_tokens: int           # from the provider's token-counting endpoint
    ratio: float                   # provider / mine
    source: str                    # "measured" | "cited" — never silently mixed
```

The mapping table `BRIDGE.md` must contain, at minimum:

| Concept | My lab | Production | API surface |
|---|---|---|---|
| Tokens | `tokenizer/bpe.py`, ~2 K merges | provider BPE, ~10⁵ vocab | token counts → billing, `max_tokens` |
| Embeddings | `(vocab, 64)` random-init table | `(vocab, ~10⁴)` trained | vector search / `pgvector` in W5 |
| Attention | one `(T, T)` matrix I printed | many heads × many layers | why cost grows ~`T²`; why the window is finite |
| Transformer | 2 layers, ~50 K params | ~10¹¹ params | the thing behind `model="claude-opus-5"` |
| Sampling | `sample.py` temperature/top-k/top-p | request parameters | `temperature`, `effort`, determinism at `T=0` |
| Context window | `ModelConfig.max_seq_len = 128` | 200 K – 1 M tokens | `ContextOverflow` → W1's context guard |

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/BRIDGE.md` | NEW | the mapping table + the token-count comparison — **the deliverable** |
| `apps/w00_transformer_lab/compare_tokenizers.py` | NEW | my BPE vs the provider's count for the same sample set |
| `apps/w00_transformer_lab/README.md` | EDIT | link to `BRIDGE.md`; final Week-0 results summary |
| `doc/week-00-transformer-foundations/THEORY.md` | EDIT | fill in *Revisited* — the week is not closed until this is done |
| `tests/w00/test_bridge.py` | NEW | mapping completeness; offline-by-default; the migration guard |

## Flow

```
Week 0 lab results (F0.2 – F0.6)
      ▼
BRIDGE.md mapping table   ── one row per concept, each naming a real API surface
      ▼
compare_tokenizers.py  (offline by default; `--live` optionally hits the provider once)
      ▼
TokenCountComparison{my_bpe_tokens, provider_tokens, ratio}
      ▼
Week 1 opens with: "a token is not a word, and here is my measured ratio"
      ▼
W1-F1.2 LLMPort  ──►  compare_tokenizers.py is migrated to it (see Rules)
```

## Rules

- **Offline by default.** `compare_tokenizers.py` runs with committed, cited reference counts and
  needs no key. `--live` is opt-in and hits the provider's token-counting endpoint once
  (`client.messages.count_tokens(model="claude-opus-5", messages=[...])`).
- **The one pre-`aiplat` exception, and it is time-boxed.** Week 1's DoD says no file outside
  `aiplat/llm/anthropic_client.py` may import the provider SDK. `aiplat` does not exist yet, so this
  script may import it *until* [W1-F1.2](../../week-01-llm-foundations/F1.2-llm-port-and-anthropic-client/CLAUDE.md)
  lands — at which point it **must** be migrated to `LLMPort`. A skipped test pins this obligation so
  it cannot be forgotten (`test_bridge_script_uses_llmport_once_aiplat_exists`).
- **Never guess a token count.** Every number is either `source="measured"` (you ran it) or
  `source="cited"` (with a link). A remembered number is not a number.
- **Every row names a real API surface.** "Attention is important" is not a row. "Attention is `T²`,
  which is why a 200 K-token prompt costs more than 200× a 1 K one" is.
- **The honest-scale rule.** State the gap plainly: your model is ~50 K parameters, a frontier model
  is ~10¹¹. Nothing here claims you built an LLM. You built the *mechanism* an LLM is made of, which
  is what makes the API's parameters legible.
- **Secrets only via `.env`.** `--live` reads `ANTHROPIC_API_KEY` from the environment; no key is
  ever committed, printed, or logged.
- **This feature closes the week.** `THEORY.md` → *Revisited* is filled in here, not later.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| No API key present | Offline path runs and completes; `--live` exits with a clear message naming `ANTHROPIC_API_KEY` |
| `--live` and the provider is unreachable | Falls back to cited counts, marks rows `source="cited"`, never fabricates a measurement |
| Provider rate-limits the count call | Backs off once, then falls back to cited — the run still produces a table |
| My BPE and the provider disagree wildly | **Expected.** Record the ratio; different corpora and vocab sizes tokenize differently. Not a bug |
| A mapping row has no API surface named | Test fails — the row is an opinion, not a mapping |
| `aiplat` exists but this script still imports the SDK directly | Migration test un-skips and fails — the exception has expired |
| A token count appears with no `source` | Test fails; unsourced numbers are not allowed in `BRIDGE.md` |

## Tests

- `test_bridge_covers_all_four_concepts` — transformer, attention, tokens, embeddings
- `test_every_mapping_row_names_an_api_surface`
- `test_every_token_count_has_a_source_field`
- `test_comparison_runs_offline_with_no_api_key`
- `test_live_flag_degrades_to_cited_on_provider_failure`
- `test_bridge_script_uses_llmport_once_aiplat_exists` — skipped until `aiplat` is importable, then binding
- `test_theory_revisited_section_is_filled`

## Acceptance criteria

- [ ] `BRIDGE.md` has one row per concept, each naming a literal API parameter, field, or limit
- [ ] The token-count comparison table exists, with `my_bpe_tokens`, `provider_tokens`, and `ratio` for every F0.2 sample class
- [ ] Every number carries `source="measured"` or `source="cited"`
- [ ] The context-window row connects `ContextOverflow` in [F0.6](../F0.6-tiny-transformer-end-to-end/CLAUDE.md) to Week 1's context guard by name
- [ ] The sampling row connects your `temperature` sweep to the API's `temperature`, and explains why W1 defaults to `0.0`
- [ ] The parameter-count gap between your model and a frontier model is stated honestly
- [ ] `THEORY.md` → *Revisited* is complete: which predictions were wrong, and which concept only landed after you built the layer under it
- [ ] The week's open questions are carried into [Week 1's THEORY.md](../../week-01-llm-foundations/F1.5-theory-notes-and-understand-first/CLAUDE.md)
