# HolidayLandmarks — Feature Specification

> **Project:** HolidayLandmarks Trip Assistant
> **Type:** AI Agentic Application (Structured Output + Tools + Streaming)
> **Backend:** FastAPI (Python)  ·  **Frontend:** React (JavaScript)
> **Reference:** [The Ultimate Reusable Master Prompt to Become an AI Agentic Developer](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf) — Week 4 deliverable
> **Status:** Specification only. No code implemented yet — this document is written first, per the master-prompt workflow.

---

## 1. Product Vision

HolidayLandmarks is an AI **agentic** trip assistant. A traveler asks natural-language questions about holiday destinations and famous landmarks ("Plan a 3-day trip to Rome focused on ancient history"), and the assistant responds with **structured, validated itineraries** by calling real **tools** (weather, geocoding, landmark database, distance) and **streaming** its reasoning and answer back token-by-token.

It is an *agent*, not a chatbot: the LLM decides which tools to call, in what order, validates every input/output with Pydantic, and returns a strictly-typed itinerary the React frontend can render deterministically.

### 1.1 Why "agentic"?
- The model **plans** (which landmarks, which days) then **acts** (tool calls) in a bounded loop.
- Every tool is **authorized, bounded, and validated** — no free-form side effects.
- Output is **structured** (JSON schema / Pydantic), never raw prose the UI must parse.
- The loop is **observable** (correlation IDs) and **safe** (timeouts, retries, max-iterations).

---

## 2. Personas & Primary Use Cases

| Persona | Goal | Example Prompt |
|---|---|---|
| Leisure traveler | Get a day-by-day itinerary | "3 days in Paris, love art and food" |
| Family planner | Kid-friendly landmarks + weather | "Family trip to London, 2 kids, indoor options if it rains" |
| History enthusiast | Deep landmark facts | "Ancient ruins near Athens I can visit in a day" |
| Budget backpacker | Free/cheap landmarks + walking routes | "Free things to see in Berlin, walking distance" |

---

## 3. Feature List (MoSCoW)

### 3.1 Must-Have (MVP)
- **F1 — Conversational trip request.** Free-text prompt → structured itinerary.
- **F2 — Structured itinerary output.** Strictly-typed JSON (days → activities → landmarks) validated by Pydantic before returning.
- **F3 — Landmark knowledge tool.** Look up landmarks by city/theme from a curated dataset.
- **F4 — Weather tool.** Fetch forecast for destination + dates to influence planning.
- **F5 — Geocoding/distance tool.** Resolve place names to coordinates; compute walkability between stops.
- **F6 — Streaming responses.** Server-Sent Events (SSE) stream partial tokens + tool-call events to the React UI.
- **F7 — Agent loop.** Bounded plan→act→observe loop with a hard `max_iterations` cap.
- **F8 — React itinerary UI.** Render the structured itinerary as cards/timeline; show live streaming state.

### 3.2 Should-Have
- **F9 — Multi-turn refinement.** "Make day 2 more relaxed" edits the existing itinerary in context.
- **F10 — Confidence + citations.** Each landmark fact carries a source and confidence score.
- **F11 — Cost & token tracking.** Per-request token/cost accounting surfaced to logs and (optionally) UI.
- **F12 — Save / share itinerary.** Persist to DB and produce a shareable read-only link.

### 3.3 Could-Have
- **F13 — Map view.** Plot landmarks on a map with the walking route.
- **F14 — Export.** PDF / calendar (.ics) export of the itinerary.
- **F15 — User accounts + history.** Auth + saved trips.

### 3.4 Won't-Have (this phase)
- Real bookings/payments, live flight/hotel inventory, mobile native apps.

---

## 4. Feature Deep-Dives

### F1 — Conversational Trip Request
**Description:** User submits a natural-language trip request with optional structured hints (city, dates, days, interests, budget).
**Acceptance criteria:**
- Accepts free text up to N chars; optional fields (city, start_date, num_days, interests[], budget_level).
- Rejects empty/oversized input with a validation error (HTTP 422).
- Prompt-injection guarded (system prompt isolation; user text never granted tool-authorization authority).
**Edge cases:** ambiguous city ("Springfield"), impossible dates (past dates), unsupported destinations.

### F2 — Structured Itinerary Output
**Contract (conceptual Pydantic model):**
```
Itinerary
  destination: str
  start_date: date | null
  num_days: int (1..14)
  currency: str
  days: List[DayPlan]
  total_estimated_cost: float | null
  warnings: List[str]

DayPlan
  day_index: int
  theme: str
  activities: List[Activity]

Activity
  landmark: Landmark
  start_time: time | null
  duration_minutes: int
  notes: str
  estimated_cost: float | null

Landmark
  name: str
  category: str            # museum | monument | nature | religious | ...
  lat: float
  lng: float
  source: str              # citation
  confidence: float (0..1)
```
**Acceptance criteria:**
- Response ALWAYS conforms to `Itinerary` schema or returns a typed error — never raw model prose.
- `num_days` in `days` matches requested count (or a `warnings[]` entry explains the difference).
- Invalid model output triggers one repair retry, then a graceful typed failure.

### F3 — Landmark Knowledge Tool
- Input: `{ city: str, theme?: str, limit: int<=20 }`
- Output: `List[Landmark]` from a curated seed dataset (JSON/DB), each with source + confidence.
- Deterministic and side-effect-free; safe to call repeatedly.

### F4 — Weather Tool
- Input: `{ lat, lng, date_range }`
- Output: `{ daily: [{date, temp_c, precip_prob, condition}] }`
- External API with timeout (e.g. 5s), retry with exponential backoff, and a cached/fallback path.
- Influences planning: high precip → prefer indoor landmarks; extreme heat → morning outdoor slots.

### F5 — Geocoding / Distance Tool
- Geocode: place name → `{lat, lng, canonical_name}` (disambiguation returned when multiple matches).
- Distance: two coordinates → `{ meters, walking_minutes }`.
- Used to order daily activities to minimize backtracking (nearest-neighbor is acceptable for MVP).

### F6 — Streaming Responses (SSE)
**Event types streamed to the frontend:**
- `token` — partial assistant text.
- `tool_call` — `{ name, args }` when the agent invokes a tool.
- `tool_result` — `{ name, summary }` after a tool returns.
- `itinerary` — final validated structured object.
- `error` — typed error with a user-safe message.
- `done` — stream complete (with token/cost totals).
**Acceptance criteria:** UI shows live "thinking / calling weather / building day 2…" states; final `itinerary` event replaces the streamed text with structured cards.

### F7 — Agent Loop
- Bounded loop: `plan → (tool_call → observe)* → finalize`.
- Hard caps: `max_iterations` (e.g. 6), per-tool timeout, total wall-clock budget.
- On cap hit: return best partial itinerary + `warnings[]`, never hang.
- Deterministic tool dispatch table; unknown tool name → typed error, not a crash.

### F8 — React Itinerary UI
- Prompt composer (free text + optional structured hints).
- Live streaming panel (token stream + tool-activity chips).
- Structured itinerary render: per-day timeline, landmark cards (name, category, confidence, source).
- Empty / loading / error states. Retry and "refine" actions.

---

## 5. API Surface (Contracts)

| Method | Path | Purpose | Notes |
|---|---|---|---|
| `POST` | `/api/trip/plan` | Create itinerary (non-streaming) | Returns full `Itinerary` JSON |
| `GET`  | `/api/trip/plan/stream` | Create itinerary (SSE stream) | Streams events from §F6 |
| `POST` | `/api/trip/{id}/refine` | Multi-turn refinement | F9 |
| `GET`  | `/api/trip/{id}` | Fetch saved itinerary | F12 |
| `GET`  | `/api/landmarks` | Browse landmark dataset | Debug/tool-backing |
| `GET`  | `/health` | Liveness | Prod checklist |
| `GET`  | `/ready` | Readiness (deps reachable) | Prod checklist |

**Cross-cutting:** every request carries/creates a correlation ID propagated through agent → tools → LLM → logs.

---

## 6. Non-Functional Requirements

- **Validation:** Pydantic on every boundary (request, tool I/O, LLM output).
- **Security:** system-prompt isolation, prompt-injection guards, tool authorization matrix, secrets via env, no PII in logs (redaction).
- **Reliability:** timeouts + exponential-backoff retries on every external call; circuit breaker on the weather/geocode APIs; idempotency key on `POST /plan`.
- **Observability:** structured JSON logs, correlation IDs, per-request token & cost tracking, tool-call tracing.
- **Performance:** first streamed token < ~2s; full itinerary < ~15s typical; landmark tool cached.
- **Cost control:** per-request token cap + monthly budget threshold with alerting.

---

## 7. Testing Strategy

- **Golden dataset:** 50+ trip prompts with expected itinerary properties (city resolves, day count correct, indoor-on-rain rule fires).
- **Unit:** each tool (weather/geocode/landmark) with mocked externals; Pydantic schema round-trips.
- **Contract:** `Itinerary` schema validation on every generated output.
- **Agent-loop:** max-iteration cap, timeout, unknown-tool, tool-failure fallback.
- **Failure injection (Break & Debug):** invalid input, API timeout, rate limit, DB down, context overflow, prompt injection, infinite-loop attempt.
- **Frontend:** streaming state machine, error/empty/loading, itinerary render snapshot.

---

## 8. Threat Model (summary)

| Threat | Mitigation |
|---|---|
| Prompt injection via user text | System-prompt isolation; user text is data, never authority; allow-list of tools |
| Tool abuse / SSRF via geocode | Validate/normalize inputs; allow-list external hosts; timeouts |
| Cost blow-up (loop / large output) | `max_iterations`, token caps, output-size limits, budget alerts |
| PII leakage in logs | Redaction rules; correlation IDs instead of raw content |
| Malformed LLM output crashing UI | Strict Pydantic validation + one repair retry + typed error |

---

## 9. Milestones (maps to master-prompt phases)

1. **Theory & contracts** — this document + schemas + threat model. ✅ (docs-first)
2. **Minimal implementation** — one tool + structured output, no streaming.
3. **Coding task** — full tool set + agent loop.
4. **Code review** — correctness, security, retries, testability pass.
5. **Break & debug** — failure-injection suite.
6. **Production upgrade** — Docker, health/ready, tracing, caching, CI/CD.
7. **Assessment** — golden dataset eval + interview/architecture write-up.

---

## 10. Open Questions

- Which LLM provider/model + fallback model? (see [TECH-STACK-DECISIONS.md](../TECH-STACK-DECISIONS.md))
- Real weather/geocode APIs vs. mocked for MVP?
- Persistence: SQLite for MVP → Postgres later?
- Auth in this phase or deferred to F15?
