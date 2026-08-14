# W4-F4.7 — `useSSEStream` + Itinerary UI + Cost Badge

> [Week 4](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [feature.md F8, F10, F11](../../feature.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Covers:** legacy **F8** (React itinerary UI), **F10** (confidence + citations shown), **F11** (cost surfaced)
**Layer:** `frontend/src/hooks/` + `components/` + `weeks/w04/`
**Depends on:** [F4.5](../F4.5-sse-streaming-contract/CLAUDE.md), [F4.6](../F4.6-bounded-tool-sequence-and-persistence/CLAUDE.md)
**Consumed by:** **W6, W7, W8, W10, W12** all reuse `useSSEStream` unchanged

## Goal

Write the streaming state machine **once**. `useSSEStream` consumes the F4.5 event union and knows
nothing about itineraries — which is what lets Week 6 render answers and Week 12 render incident
fixes through the same hook.

## Contract (schema first)

```js
// hooks/useSSEStream.js
const { status, text, toolCalls, data, schemaName, error, usage, start, abort } = useSSEStream()
// status: 'idle' | 'streaming' | 'done' | 'error'
//
// INVARIANTS the hook guarantees to every week:
//   1. `data` arriving REPLACES `text` as the source of truth (text is progress only)
//   2. status reaches a terminal state ONLY on `done` — so a dropped stream is detectable
//   3. an unknown event type is ignored, never fatal
//   4. abort() cancels the request AND stops all state updates
```

```js
// weeks/w04/validateItinerary.js — defensive shape check at the boundary (ADR-002)
validateItinerary(payload) -> { ok: true, itinerary } | { ok: false, reason }
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `frontend/src/hooks/useSSEStream.js` | NEW | ⭐ the event state machine — week-agnostic |
| `frontend/src/components/StreamLog.jsx` | NEW | `tool_call` → `tool_result` live timeline |
| `frontend/src/components/CostBadge.jsx` | NEW | tokens + $ read from `done` |
| `frontend/src/components/ErrorPanel.jsx` | EDIT | `retryable` → Retry button |
| `frontend/src/weeks/w04/PromptComposer.jsx` | NEW | form mirroring `TripRequest` |
| `frontend/src/weeks/w04/ItinerarySkeleton.jsx` | NEW | shown while tokens stream |
| `frontend/src/weeks/w04/ItineraryView.jsx` | NEW | renders the validated object |
| `frontend/src/weeks/w04/validateItinerary.js` | NEW | boundary shape check |
| `frontend/src/weeks/registry.js` | EDIT | + w04 |

## Flow

```
PromptComposer  ──► start(POST /api/w04/plan, {TripRequest}, Idempotency-Key)
      ▼
useSSEStream
  token       → append to `text`         → ItinerarySkeleton (PROGRESS ONLY)
  tool_call   → toolCalls[]              → StreamLog "calling weather(Paris)…"
  tool_result → resolve the row          → StreamLog ✓ 340ms (cached)
  data        → validateItinerary()      → ItineraryView REPLACES the skeleton
  error       → error                    → ErrorPanel
  done        → status='done', usage     → CostBadge
```

## Rules

- **The UI never parses prose.** Tokens are a progress indicator; the `data` payload is what
  renders. This is [ADR-002](../../../TECH-STACK-DECISIONS.md) made concrete — type safety lives in
  Pydantic, and the client verifies the shape at its boundary rather than trusting blindly.
- **`useSSEStream` contains no HolidayLandmarks vocabulary.** No "itinerary", no "landmark". A grep
  proves it. This is the single rule that makes Weeks 6–12 cheap.
- **Terminal state only on `done`.** If the connection dies, status stays `streaming` and the UI can
  show "connection lost" — silently flipping to `done` would fake a successful result.
- Every `Landmark` card shows its **source and confidence** (F4.2). Low-confidence entries are
  visually distinct, not footnoted.
- `abort()` on unmount, and `AbortSignal` on the fetch. A closed tab must stop token spend (F4.5).
- Cost is **visible** (F11). A user who cannot see cost cannot develop judgement about it.
- No `console.log` in shipped code, mirroring the backend logging rule.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| `error` mid-stream | `ErrorPanel` shows it; partial content stays visible, not wiped |
| Connection drops with no `done` | Status stays `streaming`; UI offers Retry; never fakes success |
| `data` fails the shape check | Treated as `INTERNAL`; the UI never renders `undefined` fields |
| Unknown event type | Ignored; the stream continues |
| Component unmounts mid-stream | `abort()` fires; no setState-after-unmount warnings |
| Double submit | Same idempotency key reused; no second run |

## Tests

- `test_use_sse_stream_has_no_week_specific_identifiers` — source grep
- `test_data_event_replaces_streamed_text`
- `test_status_stays_streaming_when_done_never_arrives`
- `test_unmount_aborts_the_request`
- `test_unknown_event_type_is_ignored`
- `test_low_confidence_landmark_is_visually_distinct` — snapshot
- `test_double_submit_reuses_the_idempotency_key`

## Acceptance criteria

- [ ] `grep -in "itinerary\|landmark" frontend/src/hooks/useSSEStream.js` returns nothing
- [ ] The final render comes from `data`, never from accumulated token text
- [ ] A dropped connection is visibly distinct from a completed one
- [ ] Every landmark card shows source and confidence
- [ ] `CostBadge` shows tokens and $ after `done`
- [ ] W6 reuses this hook with **zero** modifications — re-asserted in W6-F6.5
