# W2-F2.6 — SPA Shell, `registry.js`, `client.js`, `ErrorPanel`

> [Week 2](../CLAUDE.md) · [doc index](../../CLAUDE.md) · [architecture](../../../CLAUDE-12-WEEK.md)

**Layer:** `frontend/src/` (shared shell + `weeks/w02/`)
**Depends on:** [F2.3](../F2.3-typed-error-envelope/CLAUDE.md), [F2.5](../F2.5-four-nlp-endpoints/CLAUDE.md)
**Consumed by:** every frontend week after this one

## Goal

**One SPA, never twelve.** The shell created here — `registry.js`, `client.js`, `ErrorPanel` — is
what makes each later week a folder of screens instead of a new application.
([CLAUDE-12-WEEK.md §4](../../../CLAUDE-12-WEEK.md))

## Contract (schema first)

```js
// weeks/registry.js — the frontend mirror of services/api/mounts.py
export const WEEKS = [
  { key: 'w02', route: '/w02', title: 'AI Service', component: W02 },
];

// api/client.js
async function request(path, { method, body, signal }) -> {
  data?: unknown,
  error?: { code, message, correlation_id, retryable, retry_after_s, details }
}
// Always resolves. Never throws for an HTTP error — an error IS a value here.
```

## Files

| Path | New/Edit | Responsibility |
|---|---|---|
| `frontend/index.html` · `vite.config.js` · `package.json` | NEW | Vite + React scaffold |
| `frontend/.env.example` | NEW | `VITE_API_BASE` |
| `frontend/src/main.jsx` · `App.jsx` | NEW | `App` builds nav **from** `WEEKS` |
| `frontend/src/api/client.js` | NEW | the one fetch wrapper; mints + surfaces `X-Correlation-ID` |
| `frontend/src/weeks/registry.js` | NEW | the mount table |
| `frontend/src/weeks/w02/{AiServicePanel.jsx, index.js}` | NEW | four endpoints, one form |
| `frontend/src/components/ErrorPanel.jsx` | NEW | renders `ErrorEnvelope`, nothing else |
| `frontend/src/hooks/useBackendStatus.js` | NEW | `/api/health` poll → offline banner |

## Flow

```
App.jsx ── WEEKS.map(...) ──► routes + nav      (no week name appears in App.jsx)
    ▼
weeks/w02/AiServicePanel.jsx
    ▼
api/client.js
    ├─ header X-Correlation-ID: <uuid4>       so the user can quote it in a bug report
    ├─ fetch
    └─ response.ok ? {data} : {error: ErrorEnvelope}
    ▼
error ? <ErrorPanel error={error}/>  ──► retryable ? [Retry] : [copy correlation id]
```

## Rules

- **`App.jsx` never names a week.** Adding Week 9 = one `registry.js` entry + one `weeks/w09/index.js`.
- `client.js` **resolves** on HTTP errors and returns `{error}`. Throwing forces every caller into
  try/catch and inevitably one forgets; an error as a value cannot be silently dropped.
- `ErrorPanel` renders **from the schema** — `code` and `retryable` drive the UI. Zero string
  matching on `message`. This is the frontend half of "fail typed, not raw".
- Shared code lives in `components/`, `hooks/`, `api/`. **These never import from `weeks/`**
  ([architecture §2](../../../CLAUDE-12-WEEK.md)).
- Every request is cancellable — pass an `AbortSignal`. W4's streams depend on this working.
- No `console.log` in shipped code, mirroring the backend logging rule.

## Failure modes

| Injected failure | Required behaviour |
|---|---|
| Backend down | `useBackendStatus` shows an offline banner; forms disable rather than 500-loop |
| 500 with envelope | `ErrorPanel` shows the safe message + copyable correlation ID |
| 429 with `retry_after_s` | Retry button disabled with a countdown — not an instant re-hammer |
| Network drops mid-request | `AbortSignal` cleanup; no state update on an unmounted component |
| Response fails shape check | Treated as `INTERNAL`; the UI must not render `undefined` fields |

## Tests

- `test_app_renders_nav_from_registry_only` — add a fake week in-test, assert it appears
- `test_client_returns_error_value_and_never_throws`
- `test_error_panel_renders_from_code_not_message`
- `test_retry_disabled_until_retry_after_elapses`
- `test_components_do_not_import_from_weeks` — ESLint `no-restricted-imports` rule

## Acceptance criteria

- [ ] `grep -n "w02" frontend/src/App.jsx` returns nothing
- [ ] The correlation ID of the last request is visible in the UI
- [ ] `ErrorPanel` handles every `ErrorCode` without a code change per code
- [ ] The ESLint boundary rule fails the build on a `components/ → weeks/` import
- [ ] Stopping the backend produces a banner, not a wall of console errors
