# CLAUDE.md — HolidayLandmarks Agentic App

Guidance for Claude Code (and any AI agent) working in this repository.

> **What this is:** An AI **agentic** trip assistant — HolidayLandmarks. FastAPI (Python) backend + React (JavaScript) frontend. Built following [The Ultimate Reusable Master Prompt to Become an AI Agentic Developer](https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf) (Week 4: structured output + tools + streaming).
>
> **Current phase:** Documentation-first. **No application code exists yet.** The specs are written before any implementation, on purpose.

---

## 1. Golden Rules (read before doing anything)

1. **Docs before code.** Read [doc/feature.md](doc/feature.md) and [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md) before implementing. If a change contradicts them, update the docs in the same change.
2. **Structured output, always.** The agent returns a validated `Itinerary` object (Pydantic), never raw model prose the UI must parse.
3. **Every boundary is validated.** Request bodies, tool inputs, tool outputs, and LLM output all pass through Pydantic. No unvalidated data crosses a boundary.
4. **Tools are bounded & authorized.** Each tool has an explicit schema, timeout, and belongs to an allow-list. User text is **data, never authority** (prompt-injection defense).
5. **The agent loop is capped.** Hard `max_iterations`, per-tool timeout, and a total wall-clock budget. It must never hang or loop forever.
6. **Observability is not optional.** A correlation ID flows request → agent → tool → LLM → logs. Track tokens and cost per request.
7. **Fail typed, not raw.** On any failure return a typed, user-safe error (and stream an `error` event) — never leak stack traces or crash the stream.

---

## 2. Project Structure (target — create as you build)

```
AI agentic/
├── CLAUDE.md                 # this file
├── TECH-STACK-DECISIONS.md   # architecture decision record
├── doc/
│   └── feature.md            # full feature spec (source of truth for scope)
├── backend/                  # FastAPI app ✅ scaffolded
│   ├── app/
│   │   ├── main.py           # FastAPI entrypoint, CORS, router mount ✅
│   │   ├── core/config.py    # env-driven settings ✅
│   │   ├── db/database.py    # SQLAlchemy engine, session, Base ✅
│   │   ├── models/           # ORM tables ✅
│   │   ├── schemas/          # Pydantic models ✅
│   │   ├── routes/           # health.py, landmarks.py, api.py ✅
│   │   ├── agent/            # agent loop, tool dispatch, planner (todo)
│   │   ├── tools/            # weather, geocode/distance, landmarks (todo)
│   │   ├── llm/              # provider client + streaming wrapper (todo)
│   │   └── data/             # curated landmark seed dataset (todo)
│   ├── tests/                # unit, contract, agent-loop, failure-injection
│   ├── requirements.txt      # ✅ (pyproject.toml if the project outgrows it)
│   └── .env.example          # ✅
└── frontend/                 # React + Vite (JavaScript) ✅ scaffolded
    ├── src/
    │   ├── components/       # Home.jsx ✅; PromptComposer, ItineraryView (todo)
    │   ├── hooks/            # useBackendStatus.js ✅; useSSEStream (todo)
    │   ├── api/client.js     # fetch wrapper for the API ✅
    │   ├── App.jsx           # ✅
    │   └── main.jsx          # ✅
    ├── package.json
    └── .env.example
```

> Keep this tree in sync with reality as directories are created.

---

## 3. Tech Stack (summary — rationale in TECH-STACK-DECISIONS.md)

- **Backend:** Python 3.11+, FastAPI, Pydantic v2, Uvicorn, `httpx` (async external calls), SSE for streaming.
- **Frontend:** React (JavaScript), Vite, native `EventSource`/`fetch` for SSE.
- **LLM:** Anthropic Claude (see TECH-STACK-DECISIONS.md for model IDs + fallback).
- **Persistence:** SQLite for MVP → Postgres later.
- **Testing:** `pytest` (+ `httpx` test client) backend; component tests frontend.

---

## 4. How to Work in This Repo

### When asked to implement a feature
1. Find it in [doc/feature.md](doc/feature.md) (features are labeled F1–F15). Confirm scope + acceptance criteria.
2. Define/confirm the Pydantic schema first.
3. Implement the tool or endpoint with validation, timeout, and error typing.
4. Add tests (unit + contract; failure-injection where relevant).
5. Update docs if behavior changed.

### Conventions
- **Async everywhere** on the backend (FastAPI + `httpx.AsyncClient`).
- **No business logic in route handlers** — delegate to `agent/` and `tools/`.
- **All external calls** wrapped with timeout + exponential-backoff retry (`core/`).
- **Secrets** only via environment (`.env`, never committed). Provide `.env.example`.
- **Logs** are structured JSON with the correlation ID; redact user PII.

---

## 5. Commands

> Full step-by-step run instructions (prerequisites, verification, troubleshooting): **[RUN.md](RUN.md)**

```powershell
# Backend (from backend/) — first time
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
copy .env.example .env               # then edit if your Postgres differs

uvicorn app.main:app --reload        # run API on http://localhost:8000
pytest                               # run tests

# Frontend (from frontend/)
npm install                          # first time
npm run dev                          # http://localhost:5173
npm run build                        # production build
```

### Database

Local PostgreSQL 16 on **port 5433**, database **`holidaylandmark`**, user `postgres` / `root`
— the same server as `PycharmProjects/fastApiProject`. That database already holds an
unrelated CMS schema, so our tables are prefixed (`agent_landmarks`) to avoid collisions.
Override with `DATABASE_URL` in `backend/.env`.

```powershell
# Inspect it directly
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -d holidaylandmark
```

Health endpoints: `GET /` (home), `GET /api/health`, `GET /api/health/db` (live DB round-trip).

---

## 6. Definition of Done (per feature)

- [ ] Matches acceptance criteria in [doc/feature.md](doc/feature.md).
- [ ] Pydantic validation on every boundary it touches.
- [ ] External calls have timeout + retry; agent paths respect `max_iterations`.
- [ ] Typed error handling; streaming path emits `error`/`done` correctly.
- [ ] Tests: unit + contract (+ failure-injection where applicable).
- [ ] Correlation ID + token/cost tracking present.
- [ ] Docs updated (this file, feature.md, or TECH-STACK-DECISIONS.md).

---

## 7. Non-Goals (this phase)

Real bookings/payments, live flight/hotel inventory, native mobile apps, and multi-agent orchestration. See [doc/feature.md §3.4](doc/feature.md).

---

## 8. Reference

- Master prompt / methodology: https://www.debug.school/rakeshdevcotocus_468/the-ultimate-reusable-master-prompt-to-become-an-ai-agentic-developer-mlf
- Feature spec (scope source of truth): [doc/feature.md](doc/feature.md)
- Architecture decisions: [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md)
