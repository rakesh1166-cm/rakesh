# Vakeel Contracts API — Design & Flow

This document explains how the contract-analysis service works end to end: the overall
architecture, the **upload phase** (PDF/TXT → text extraction → Postgres) and the
**analysis phase** (contract text → Gemini → structured clauses, risks and recommendations).

Lawyers upload a contract and get back structured insights: a summary, the contract type, key
clauses explained in plain language, risk flags with severity, an overall risk level, and
recommendations.

> Diagrams use [Mermaid](https://mermaid.js.org/). They render on GitHub, and in VS Code / PyCharm
> with a Mermaid preview plugin.

> ℹ️ The original plan in [what to build  flow.txt](what%20to%20build%20%20flow.txt) mentions MongoDB.
> The implementation uses **PostgreSQL + SQLModel**, with JSON columns for the AI output.

---

## 1. High-level architecture

```mermaid
flowchart LR
    subgraph Client
        UI["React UI (Vite)<br/>frontend/ · :5176"]
        SW["Swagger UI<br/>/docs"]
    end

    subgraph API["FastAPI app — main.py · :8004"]
        AUTH["auth.py<br/>X-API-Key check"]
        R1["routes/contracts.py<br/>/contracts"]
        R2["routes/analysis.py<br/>/analysis"]
        R3["routes/stats.py<br/>/stats"]
        PARSE["service/document_parser.py<br/>PDF / TXT → text"]
        GEM["service/gemini_analyse.py<br/>+ service/prompt.py"]
        DB["database.py<br/>SQLModel session"]
    end

    DISK[("uploads/<br/>uuid.pdf / uuid.txt")]
    GAPI["Google Gemini API<br/>gemini-2.5-flash"]
    PG[("PostgreSQL vaken_db<br/>contracts · analyses")]

    UI -- "HTTP + X-API-Key (writes)" --> AUTH
    SW --> AUTH
    AUTH --> R1 & R2
    UI --> R3
    R1 --> PARSE
    R1 --> DISK
    R2 --> GEM
    GEM --> GAPI
    R1 & R2 & R3 --> DB
    DB --> PG
```

### Components

| Layer | File(s) | Responsibility |
|---|---|---|
| Entry point | [main.py](main.py) | Creates the FastAPI app, CORS for the UI on :5176, creates tables on startup (`lifespan`), mounts routers, `/` and `/health` |
| Config | [config.py](config.py) | Loads `.env`; `DATABASE_URL`, `VAKEN_API_KEY`, `GEMINI_API_KEY`, `GEMINI_MODEL`, allowed extensions, 10 MB limit, `uploads/` dir |
| Auth | [auth.py](auth.py) | `verify_api_key` dependency — compares the `X-API-Key` header to `VAKEN_API_KEY` (upload, analyse, delete) |
| Routes | [routes/](routes/) | HTTP layer: validation, 404s, status changes, persisting results |
| Parsing | [service/document_parser.py](service/document_parser.py) | `extract_text` → `{text, page_count, word_count}` for `.pdf` (pypdf) and `.txt` |
| AI | [service/gemini_analyse.py](service/gemini_analyse.py), [service/prompt.py](service/prompt.py) | Lazy Gemini client, prompt formatting, JSON parsing and validation |
| Models | [models/contract.py](models/contract.py), [models/analysis.py](models/analysis.py) | SQLModel tables, enums and response schemas |
| Persistence | [database.py](database.py) | Engine (`pool_pre_ping`) + per-request `Session` dependency |
| Frontend | [frontend/src/api.js](frontend/src/api.js) | `fetch` wrapper mapped 1:1 to the API routes, plus a live request log |

### Tech stack

- **API:** FastAPI + Uvicorn
- **ORM:** SQLModel (SQLAlchemy) on PostgreSQL 16 (optional [docker-compose.yml](docker-compose.yml) on port 5433)
- **Document parsing:** `pypdf` for PDFs, plain UTF-8 read for TXT
- **LLM:** Google Gemini via `google-genai` (async client, `response_mime_type="application/json"`)
- **UI:** React 18 + Vite

---

## 2. Data model

```mermaid
erDiagram
    CONTRACTS ||--o{ ANALYSES : "has (ON DELETE CASCADE)"

    CONTRACTS {
        int id PK
        string filename "uuid + ext, unique (name on disk)"
        string original_name "name the user uploaded, indexed"
        datetime upload_date
        text text_content "full extracted text"
        int page_count
        int word_count
        enum status "uploaded | analyzing | analyzed | error"
    }
    ANALYSES {
        int id PK
        int contract_id FK "indexed"
        datetime analysis_date
        text summary
        string contract_type
        json key_clauses "list of ClauseAnalysis"
        json risk_flags "list of RiskFlag"
        enum overall_risk_level "low | medium | high | critical"
        json recommendations "list of strings"
    }
```

- One contract can be analysed **many times**; each run adds a new `analyses` row, so you keep history.
- The AI output is stored in **JSON columns**. Before saving, each item is validated against the
  `ClauseAnalysis` / `RiskFlag` Pydantic shapes, so the JSON in the DB always has a known structure.
- List endpoints return `ContractRead` (no `text_content`) to keep payloads small;
  `GET /contracts/{id}` returns `ContractDetail` with the full text.

### Contract status lifecycle

```mermaid
stateDiagram-v2
    [*] --> uploaded: POST /contracts/upload
    uploaded --> analyzing: POST /analysis/analyse/{id}
    analyzing --> analyzed: Gemini OK, analysis saved
    analyzing --> error: Gemini / JSON / validation failure (502)
    analyzed --> analyzing: re-analyse
    error --> analyzing: retry
    analyzed --> [*]: DELETE
```

---

## 3. Upload phase

Triggered by `POST /contracts/upload` (multipart, field `file`).

```mermaid
flowchart TD
    A["Contract upload<br/>POST /contracts/upload"] --> B{"X-API-Key valid?"}
    B -- no --> X1["401 Invalid API Key"]
    B -- yes --> C{"extension .pdf or .txt?"}
    C -- no --> X2["400 File type not allowed"]
    C -- yes --> D["await file.read()"]
    D --> E{"size ≤ 10 MB?"}
    E -- no --> X3["400 File size exceeds limit"]
    E -- yes --> F["Save to uploads/&lt;uuid&gt;.ext"]
    F --> G["extract_text(file_path)<br/>pypdf or UTF-8 read"]
    G -- error --> X4["delete file<br/>400 Could not read the document"]
    G --> H["Contract row<br/>(text, page_count, word_count,<br/>status = uploaded)"]
    H --> I[("INSERT contracts")]
    I --> J["201 ContractDetail"]
```

### Step by step

1. **Authorise** — `verify_api_key` runs as a dependency before the handler body.
2. **Validate type** — extension must be in `ALLOWED_EXTENSIONS` (`.pdf`, `.txt`).
3. **Validate size** — bytes are read into memory and compared to `MAX_FILE_SIZE_MB` (10 MB).
4. **Store the file** — saved as `uploads/<uuid4>.ext`, so two uploads with the same name never collide.
   The user's name is kept in `original_name`.
5. **Extract text** — PDFs: every page's `extract_text()` joined by newlines. TXT: read as UTF-8 with
   `errors="replace"`. If parsing fails, the file is removed and a 400 is returned.
6. **Persist** — one `Contract` row with `status = uploaded`. No AI call happens yet.

---

## 4. Analysis phase (Gemini)

Triggered by `POST /analysis/analyse/{contract_id}`.

```mermaid
flowchart TD
    A["POST /analysis/analyse/{id}"] --> B{"X-API-Key valid?"}
    B -- no --> X1["401"]
    B -- yes --> C{"GEMINI_API_KEY set?"}
    C -- no --> X2["500 not configured"]
    C -- yes --> D{"contract exists?"}
    D -- no --> X3["404 Contract not found"]
    D -- yes --> E{"text_content empty?<br/>(e.g. scanned PDF)"}
    E -- yes --> X4["400 No text content"]
    E -- no --> F[("status = analyzing<br/>COMMIT")]
    F --> G["Build prompt<br/>CONTRACT_ANALYSIS_PROMPT<br/>+ first 15,000 chars"]
    G --> H["Gemini generate_content (async)<br/>response_mime_type = JSON"]
    H --> I["strip ``` fences → json.loads"]
    I --> J["Validate items:<br/>ClauseAnalysis · RiskFlag · RiskLevel"]
    H & I & J -- any exception --> X5[("status = error · COMMIT<br/>502 AI analysis failed")]
    J --> K[("INSERT analyses<br/>status = analyzed · COMMIT")]
    K --> L["201 AnalysisRead"]
```

### Step by step

1. **Pre-checks** — API key, Gemini key configured, contract exists, contract has text.
2. **Mark as analysing** — status is committed *before* the slow AI call, so the UI can show progress.
3. **Prompt** — [service/prompt.py](service/prompt.py) asks Gemini to act as an expert in Indian contract
   law and return **exactly** this JSON: `summary`, `contract_type`, `key_clauses[]`, `risk_flags[]`,
   `overall_risk_level`, `recommendations[]`. Only the first **15,000 characters** of the contract are sent.
4. **Call Gemini** — `client.aio.models.generate_content(...)` with JSON response mode. The client is
   created lazily on first use, so the API boots without a key.
5. **Parse defensively** — markdown code fences are stripped in case the model adds them, then `json.loads`.
6. **Validate** — each clause and risk is built as a Pydantic model (`ClauseAnalysis(**c)`, `RiskFlag(**r)`)
   and dumped back to plain dicts for the JSON columns. `overall_risk_level` is lower-cased and coerced into
   the `RiskLevel` enum.
7. **Save or fail** — on success an `Analysis` row is inserted and status becomes `analyzed`; on any
   failure status becomes `error` and the client gets a 502 with the reason.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as UI
    participant R as routes/analysis.py
    participant P as Postgres
    participant S as service/gemini_analyse.py
    participant G as Gemini API

    U->>R: POST /analysis/analyse/{id} (X-API-Key)
    R->>P: get Contract
    P-->>R: contract (text_content)
    R->>P: UPDATE status = analyzing (commit)
    R->>S: analyze_contract(text)
    S->>G: generate_content(prompt, JSON mode)
    G-->>S: JSON text
    S->>S: strip fences, json.loads, validate
    S-->>R: fields dict
    R->>P: INSERT analysis, status = analyzed (commit)
    R-->>U: 201 AnalysisRead
```

### What the AI returns

| Field | Type | Meaning |
|---|---|---|
| `summary` | string | 2–3 sentence description of the contract |
| `contract_type` | string | NDA, Service Agreement, Employment Contract… |
| `key_clauses[]` | `{clause_title, clause_text, explanation, is_standard}` | Important clauses explained simply; `is_standard=false` marks unusual ones |
| `risk_flags[]` | `{risk_title, description, risk_level, recommendation, clause_reference}` | Unusual, missing or one-sided terms |
| `overall_risk_level` | `low \| medium \| high \| critical` | Single headline risk rating |
| `recommendations[]` | string[] | What the lawyer should do next |

---

## 5. Delete & stats

- **`DELETE /contracts/{id}`** (API key) — deletes the contract; its analyses go with it (ORM
  `cascade="all, delete-orphan"` + FK `ondelete="CASCADE"`), then the file in `uploads/` is removed. Returns 204.
- **`GET /stats/summary`** — two `GROUP BY` queries: contracts by status and analyses by risk level.
  Every risk level is always present in the output, even with a count of 0.

---

## 6. API surface

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/contracts/upload` | ✅ | Upload a PDF/TXT and extract its text |
| `GET` | `/contracts/` | – | List contracts, newest first (no full text) |
| `GET` | `/contracts/{id}` | – | One contract with full text |
| `GET` | `/contracts/{id}/analyses` | – | Every analysis of one contract (404 if contract missing) |
| `DELETE` | `/contracts/{id}` | ✅ | Delete contract, its analyses and the file |
| `POST` | `/analysis/analyse/{contract_id}` | ✅ | Run Gemini analysis and store it |
| `GET` | `/analysis/` | – | All analyses, newest first |
| `GET` | `/analysis/contract/{contract_id}` | – | Same as `/contracts/{id}/analyses` (empty list, no 404) |
| `GET` | `/analysis/{analysis_id}` | – | One analysis |
| `GET` | `/stats/summary` | – | Counts by status and by risk level |
| `GET` | `/` · `/health` | – | Welcome message · liveness check |

---

## 7. Design decisions & trade-offs

| Decision | Why | Trade-off |
|---|---|---|
| Upload and analysis are separate steps | Upload is fast and free; the paid, slow AI call runs only when asked, and can be re-run | Two requests from the client |
| Keep every analysis (one-to-many) | History, compare re-runs or model changes | Table grows; "latest" must be picked by `id desc` |
| PostgreSQL + JSON columns (not MongoDB) | One DB for relational data + flexible AI output; FK cascade; SQL aggregates for stats | JSON is not JSONB, so no indexing/querying inside clauses |
| Gemini JSON mode + Pydantic validation | Output is machine-readable and shape-checked before it hits the DB | Model output that misses a field fails the whole run (502) |
| Truncate to 15,000 chars | Bounds cost and latency | Long contracts are analysed only partially — later clauses are ignored |
| Status column committed before the AI call | UI can show "analyzing" | If the process dies mid-call, the contract stays stuck in `analyzing` |
| Files on local disk with UUID names | No name collisions, no path traversal from user filenames | Not shared across servers; full text is also in the DB, so the file is mostly an archive |
| Lazy Gemini client | API starts and serves reads without a key | Missing key shows up only when analysing (500) |
| API key on write / paid routes only | Protects Gemini spend and data changes | Single shared key; reads are public; no per-user ownership |

### Known limitations

- **Scanned PDFs** produce empty text: upload succeeds, analysis returns 400. Needs OCR.
- **Async handler, sync DB session** — `analyse_contract` is `async` but uses a sync SQLModel `Session`,
  so DB calls briefly block the event loop.
- **Whole file read before the size check** — a very large upload is fully buffered in memory first.
- **No duplicate detection** — the same contract uploaded twice becomes two rows.
- **Orphan files** — if the DB commit fails after the file is written, the file stays in `uploads/`.

### Scaling path

```mermaid
flowchart LR
    A["Now<br/>sync request → Gemini"] --> B["Background job / queue<br/>(BackgroundTasks, Celery, RQ)<br/>client polls status"]
    A -.-> C["Chunk long contracts<br/>analyse per section, merge"]
    A -.-> D["OCR fallback<br/>for scanned PDFs"]
    A -.-> E["Object storage (S3/GCS)<br/>instead of local uploads/"]
    A -.-> F["Per-user auth (JWT)<br/>contracts owned by users"]
    A -.-> G["JSONB + GIN index<br/>query risks across contracts"]
```

---

## 8. Running locally

```bash
# 1. Postgres (skip if already running on 5433)
docker compose up -d

# 2. API
pip install -r requirements.txt
cp .env.example .env          # set GEMINI_API_KEY
uvicorn main:app --reload --port 8004

# 3. UI
cd frontend && npm install && npm run dev    # http://localhost:5176
```

- Swagger UI: http://127.0.0.1:8004/docs — read endpoints work directly; write endpoints show an
  `x-api-key` header field to fill in.
- `docker compose up -d` runs Postgres **detached**, so it keeps running after you close the terminal;
  data survives restarts in the `postgres_data` volume.
- Tables are created on startup by `create_tables()`. There are no migrations, so schema changes to an
  existing table need a manual `ALTER` or a fresh DB.
- Sample contract: [samples/sample_nda.txt](samples/sample_nda.txt).

---

## 9. Configuration

Set in `.env` (see [.env.example](.env.example)):

| Variable | Default | Used by |
|---|---|---|
| `DATABASE_URL` | `postgresql+psycopg2://postgres:root@localhost:5433/vaken_db` | `database.py` |
| `GEMINI_API_KEY` | – (required for analysis) | `service/gemini_analyse.py` |
| `GEMINI_MODEL` | `gemini-2.5-flash` | analysis |
| `VAKEN_API_KEY` | `my_secret_api_key` | `auth.py` |

Frontend (`frontend/.env`, see [frontend/.env.example](frontend/.env.example)):

| Variable | Default | Meaning |
|---|---|---|
| `VITE_API_BASE` | `http://127.0.0.1:8004` | Where the API runs |
| `VITE_API_KEY` | `my_secret_api_key` | Must match `VAKEN_API_KEY` |

> ⚠️ `VITE_*` values are bundled into the browser JavaScript, so the API key is visible to anyone using
> the UI. That's fine for local development, but in production you should use real user auth.
