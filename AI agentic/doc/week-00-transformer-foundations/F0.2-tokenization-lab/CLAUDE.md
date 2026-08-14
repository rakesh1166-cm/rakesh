# W0-F0.2 — Tokenization Lab: Train a BPE, Count Real Tokens

> [Week 0](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Concept:** blog step **8 — Tokens / Tokenization** ("token = unit; tokenization = the process of making those units")
**Layer:** `apps/w00_transformer_lab/tokenizer/` (pure NumPy + `tokenizers`, offline)
**Depends on:** [F0.1](../F0.1-concept-map-and-theory-note/CLAUDE.md)
**Consumed by:** [F0.3](../F0.3-embeddings-and-positional-encoding/CLAUDE.md) (ids → vectors), W1-F1.3 (token accounting), W5 (chunking), W11 (cost per request)

## Goal

Turn "an LLM reads text" into "an LLM reads **integers**". Train a byte-level BPE tokenizer on a tiny
committed corpus, watch the merge rules being learned, and measure — not guess — how many tokens a
string costs across English, a non-Latin script, code, and emoji.

After this feature, `"AI is powerful"` is not a sentence. It is `[1043, 271, 4171]`, and you know why
it is three ids and not two or fourteen.

## Contract (schema first)

```python
@dataclass(frozen=True)
class TokenizerSpec:
    vocab_size: int                 # 256 (bytes) + learned merges
    merges: list[tuple[str, str]]   # learned, in learn order — the whole "training"
    special_tokens: list[str]       # e.g. ["<pad>", "<bos>", "<eos>"]

@dataclass(frozen=True)
class Encoding:
    text: str
    ids: list[int]
    pieces: list[str]               # human-readable, aligned 1:1 with `ids`
    n_tokens: int                   # == len(ids); the number that costs money later

@dataclass(frozen=True)
class TokenizationReport:
    sample_name: str                # "english" | "devanagari" | "python_code" | "emoji" | ...
    chars: int
    words: int
    n_tokens: int
    tokens_per_word: float
    chars_per_token: float
    roundtrip_ok: bool              # decode(encode(text)) == text  — MUST be True

# encode(text) -> Encoding      decode(ids) -> str      report(sample) -> TokenizationReport
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `apps/w00_transformer_lab/tokenizer/bpe.py` | NEW | train merges, `encode`, `decode` — the byte-level BPE itself |
| `apps/w00_transformer_lab/tokenizer/corpus.py` | NEW | load `data/tiny_corpus.txt`; the multi-script sample set |
| `apps/w00_transformer_lab/tokenizer/report.py` | NEW | build `TokenizationReport` rows; render the results table |
| `apps/w00_transformer_lab/tokenizer/inspect_merges.py` | NEW | print the first N merges — "th" before "the" before "there" |
| `apps/w00_transformer_lab/data/tiny_corpus.txt` | NEW | small, committed, deterministic; no download step |
| `apps/w00_transformer_lab/README.md` | EDIT | the tokens-per-word table — **the deliverable** |
| `tests/w00/test_tokenizer.py` | NEW | round-trip, determinism, vocab bounds |

## Flow

```
data/tiny_corpus.txt
      ▼  train_bpe(corpus, vocab_size)         ← merges are learned, not hand-written
TokenizerSpec{merges}
      ▼  encode("AI is powerful")
Encoding{ids=[...], pieces=["AI"," is"," powerful"], n_tokens=3}
      ▼  decode(ids)  ──► must equal the input, byte for byte
      ▼  report() across 4+ scripts
README.md table  ──►  F0.3 consumes `ids`;  W1-F1.3 consumes the "tokens ≠ words" fact
```

## Rules

- **Byte-level, so nothing is ever unknown.** Every input is valid UTF-8 bytes, so there is no `<unk>`
  path and no crash on an unseen emoji. Prove it with a test, don't assert it in prose.
- **Round-trip is non-negotiable.** `decode(encode(t)) == t` for every sample, including emoji,
  combining accents, and leading/trailing whitespace. A tokenizer that loses a byte is a bug, not a
  simplification.
- **Whitespace belongs to the token.** `" powerful"` (with the leading space) is one piece, not two.
  Record this in `THEORY.md` — it is the single most common tokenization surprise.
- **No pretrained vocab downloads.** The merges are learned here, from the committed corpus, offline,
  deterministically. A fixed seed and a fixed corpus mean a fixed vocabulary.
- **Measure at least 4 sample classes:** English prose, a non-Latin script (e.g. Devanagari), source
  code, and emoji. The point is that `tokens_per_word` differs by **several times** across them.
- **No model, no embeddings, no attention here.** This feature ends at a list of integers.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Emoji / non-Latin input | Encodes and round-trips exactly — byte-level means no `<unk>` ever |
| Text longer than the corpus vocabulary saw | Still encodes, just into more, shorter pieces — degrade, never raise |
| Empty string | `ids == []`, `n_tokens == 0`, round-trip returns `""` — no crash, no special-case branch |
| Same corpus re-trained | Byte-identical `merges` — training is deterministic or it is not reproducible |
| Corpus file missing | Typed `CorpusNotFound`, naming the expected path — never a bare `FileNotFoundError` traceback |
| `decode(encode(t)) != t` | Test fails loudly with the offending byte offset. Never "close enough" |

## Tests

- `test_roundtrip_is_exact_for_every_sample` — including emoji and combining characters
- `test_no_unknown_token_is_ever_emitted`
- `test_training_is_deterministic` — same corpus + seed → identical merges
- `test_leading_space_is_part_of_the_token`
- `test_tokens_per_word_differs_across_scripts` — the measured claim, asserted
- `test_empty_and_whitespace_only_inputs`

## Acceptance criteria

- [ ] `README.md` has a table with **measured** `n_tokens`, `tokens_per_word`, `chars_per_token` for ≥4 sample classes
- [ ] The numeric prediction from [F0.1](../F0.1-concept-map-and-theory-note/CLAUDE.md)'s `THEORY.md` is checked against the real count, and the delta is recorded
- [ ] `inspect_merges.py` output shows short merges being learned before longer ones, and you can explain why in one sentence
- [ ] Round-trip holds for 100% of samples, emoji included
- [ ] The whole lab runs offline with no downloaded vocabulary
- [ ] `THEORY.md` records the one tokenization fact that surprised you most
