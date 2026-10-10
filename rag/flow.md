# RAG System — Design & Flow

This document explains how the RAG (Retrieval-Augmented Generation) service works end to end:
the overall architecture, the **indexing phase** (PDF → chunks → embeddings → Postgres) and the
**querying phase** (question → retrieval → LLM answer).

> 📖 **Recommended reading:** [**What is Retrieval-Augmented Generation (RAG)?** — Dr. Julija (Medium)](https://medium.com/@drjulija/what-is-retrieval-augmented-generation-rag-938e4f6e03d1)

> Diagrams use [Mermaid](https://mermaid.js.org/). They render on GitHub, and in VS Code / PyCharm
> with a Mermaid preview plugin.

---

## 1. High-level architecture

```mermaid
flowchart LR
    subgraph Client
        UI["React UI (Vite)<br/>frontend/ · :5176"]
        CLI["seed.py<br/>(one-off indexing)"]
    end

    subgraph API["FastAPI app — main.py"]
        AUTH["auth.py<br/>X-API-Key check"]
        R1["routes/documents.py<br/>/documents"]
        R2["routes/query.py<br/>/query"]
        R3["routes/stats.py<br/>/stats"]
        ENG["engine.py<br/>RAG pipeline"]
        DB["database.py<br/>SQLModel session"]
    end

    subgraph External
        OAI_E["OpenAI Embeddings<br/>text-embedding-3-small"]
        OAI_C["OpenAI Chat<br/>gpt-5"]
    end

    PG[("PostgreSQL rag_db<br/>documents · chunks · queries")]

    UI -- "HTTP + X-API-Key" --> AUTH
    AUTH --> R1 & R2
    UI --> R3
    CLI --> ENG
    R1 --> ENG
    R2 --> ENG
    R1 & R2 & R3 --> DB
    ENG --> OAI_E
    ENG --> OAI_C
    ENG --> DB
    DB --> PG
```

### Components

| Layer | File(s) | Responsibility |
|---|---|---|
| Entry point | [main.py](main.py) | Creates the FastAPI app, CORS for the UI, creates tables on startup (`lifespan`), mounts routers |
| Auth | [auth.py](auth.py) | `verify_api_key` dependency — compares `X-API-Key` header to `RAG_API_KEY` (upload, delete, query) |
| Routes | [routes/](routes/) | Thin HTTP layer: validation, 404s, persisting the query log |
| Pipeline | [engine.py](engine.py) | `ingest_pdf`, `embed`, `search`, `answer` — all RAG logic lives here |
| Models | [models/document.py](models/document.py), [models/query.py](models/query.py) | SQLModel tables + request/response schemas |
| Persistence | [database.py](database.py) | Engine + per-request `Session` dependency |
| Frontend | [frontend/src/api.js](frontend/src/api.js) | `fetch` wrapper mapped 1:1 to the API routes |

### Tech stack

- **API:** FastAPI + Uvicorn
- **ORM:** SQLModel (SQLAlchemy) on PostgreSQL
- **PDF parsing:** `pypdf`
- **Chunking:** `langchain-text-splitters` → `RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)`
- **Embeddings / LLM:** OpenAI (`OPENAI_EMBEDDING_MODEL`, `OPENAI_CHAT_MODEL`)
- **Vector search:** pgvector (`vector(1536)` column + HNSW index, cosine distance) inside Postgres
- **UI:** React 18 + Vite

---

## 2. Data model

```mermaid
erDiagram
    DOCUMENTS ||--o{ CHUNKS : "has (ON DELETE CASCADE)"

    DOCUMENTS {
        int id PK
        string filename
        int pages
        int chunk_count
        datetime uploaded_at
    }
    CHUNKS {
        int id PK
        int document_id FK
        int page "1-based page number"
        text content "~1000 chars"
        vector embedding "vector(1536), HNSW index"
    }
    QUERIES {
        int id PK
        text question
        text answer
        jsonb sources "chunks used + scores"
        datetime created_at
    }
```

- Embeddings are stored in a pgvector `vector(1536)` column with an HNSW index (`vector_cosine_ops`), so
  Postgres finds the nearest chunks itself. `embed()` requests exactly 1536 dimensions to match the column.
- Each chunk keeps its **page number**, which is what allows the LLM to cite `(page N)`.
- `queries` is an append-only log: every question, its answer, and the exact sources used.

---

## 3. Indexing phase (ingestion)

Triggered by `POST /documents/` (multipart upload) or by running `seed.py` for `data/sample.pdf`.

```mermaid
flowchart TD
    A["PDF upload<br/>POST /documents/"] --> B{"X-API-Key valid?"}
    B -- no --> X1["401 Invalid API Key"]
    B -- yes --> C{"filename ends<br/>with .pdf?"}
    C -- no --> X2["400 Only .pdf files"]
    C -- yes --> D["PdfReader(bytes)"]
    D -- parse error --> X3["400 Could not read PDF"]
    D --> E["For each page:<br/>extract_text()"]
    E --> F["RecursiveCharacterTextSplitter<br/>1000 chars / 200 overlap<br/>→ (page_no, chunk_text)"]
    F --> G{"any chunks?"}
    G -- no --> X4["400 No extractable text<br/>(scanned images?)"]
    G -- yes --> H["embed() in batches of 100<br/>OpenAI embeddings API"]
    H -- OpenAIError --> X5["502 Embeddings failed"]
    H --> I["Build Document + Chunk rows<br/>(page, content, embedding)"]
    I --> J[("INSERT in one transaction<br/>documents + chunks")]
    J --> K["201 DocumentRead<br/>{id, filename, pages, chunk_count}"]
```

### Step by step (`engine.ingest_pdf`)

1. **Load** — `pypdf.PdfReader` reads the bytes in memory; nothing is written to disk.
2. **Extract per page** — text is extracted page by page so every chunk remembers where it came from.
3. **Chunk** — each page is split into ~1000-character chunks with 200 characters of overlap so
   sentences spanning a boundary still appear whole in at least one chunk.
4. **Embed** — all chunk texts are sent to OpenAI in batches of 100 inputs per request.
5. **Store** — one `Document` row plus N `Chunk` rows are committed atomically. If embedding fails,
   nothing is written.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as UI / seed.py
    participant R as routes/documents.py
    participant E as engine.py
    participant O as OpenAI Embeddings
    participant P as Postgres

    U->>R: POST /documents/ (file, X-API-Key)
    R->>R: verify_api_key, check .pdf
    R->>E: ingest_pdf(session, filename, bytes)
    E->>E: PdfReader → pages → chunks (page, text)
    loop every 100 chunks
        E->>O: embeddings.create(input=batch)
        O-->>E: vectors
    end
    E->>P: INSERT document + chunks (commit)
    P-->>E: ids
    E-->>R: Document
    R-->>U: 201 {id, filename, pages, chunk_count}
```

---

## 4. Querying phase (retrieval + generation)

Triggered by `POST /query/` with `{ "question": "...", "top_k": 4, "document_id": null }`.

```mermaid
flowchart TD
    A["POST /query/<br/>{question, top_k, document_id?}"] --> B{"X-API-Key valid?"}
    B -- no --> X1["401"]
    B -- yes --> C{"document_id given<br/>and missing?"}
    C -- yes --> X2["404 Document not found"]
    C -- no --> E{"any chunks?"}
    E -- no --> N["answer = 'I don't know —<br/>no documents uploaded yet'"]
    E -- yes --> F["embed(question)<br/>OpenAI embeddings"]
    F --> G[("pgvector search (HNSW)<br/>ORDER BY embedding <=> q LIMIT top_k<br/>(optionally WHERE document_id)")]
    G --> H["top_k chunks<br/>score = 1 − cosine distance"]
    H --> I["Build system prompt:<br/>'answer only from context,<br/>cite page numbers'<br/>+ [filename · page N] chunks"]
    I --> J["OpenAI chat.completions<br/>(gpt-5)"]
    J -- OpenAIError --> X3["502 Chat failed"]
    J --> K[("INSERT queries<br/>(question, answer, sources JSONB)")]
    N --> K
    K --> L["200 QueryResponse<br/>{id, question, answer, sources[], created_at}"]
```

### Step by step

1. **Validate** — API key, and the optional `document_id` filter must exist.
2. **Embed the question** — same embedding model and dimensions as indexing, so vectors live in the same space.
3. **Search in Postgres** — `ORDER BY embedding <=> q LIMIT top_k` uses the HNSW index; only the
   `top_k` rows (default 4, max 20) come back to Python, never the embeddings. With a `document_id`
   filter, `hnsw.iterative_scan = strict_order` keeps scanning until enough rows of that document are found.
4. **Score** — each source's score is cosine similarity, `1 − cosine distance`.
5. **Augment** — chunks are formatted as `[filename · page N]\n<content>` and placed in the system prompt,
   which tells the model to answer only from that context, say "I don't know" otherwise, and cite pages.
6. **Generate** — OpenAI chat completion produces the grounded answer.
7. **Log & return** — question, answer and sources are saved in `queries`; the response includes the
   sources so the UI can show *why* the model answered as it did.

### Sequence

```mermaid
sequenceDiagram
    autonumber
    participant U as UI
    participant R as routes/query.py
    participant E as engine.py
    participant P as Postgres
    participant OE as OpenAI Embeddings
    participant OC as OpenAI Chat

    U->>R: POST /query/ {question, top_k}
    R->>R: verify_api_key, check document_id
    R->>E: search(session, question, top_k, document_id)
    E->>OE: embed(question)
    OE-->>E: query vector
    E->>P: ORDER BY embedding <=> q LIMIT top_k (HNSW)
    P-->>E: top_k rows + distance
    E-->>R: sources[]
    R->>E: answer(question, sources)
    E->>OC: system(context) + user(question)
    OC-->>E: answer text
    E-->>R: answer
    R->>P: INSERT queries (question, answer, sources)
    R-->>U: 200 {answer, sources[]}
```

---

## 5. API surface

| Method | Path | Auth | Phase | Purpose |
|---|---|---|---|---|
| `POST` | `/documents/` | ✅ | Indexing | Upload + index a PDF |
| `GET` | `/documents/` | – | – | List documents |
| `GET` | `/documents/{id}` | – | – | One document |
| `GET` | `/documents/{id}/chunks` | – | – | Inspect chunks (no embeddings) |
| `DELETE` | `/documents/{id}` | ✅ | – | Delete document (chunks cascade) |
| `POST` | `/query/` | ✅ | Querying | Ask a question |
| `GET` | `/query/history` | – | – | Recent questions + answers |
| `GET` | `/stats/summary` | – | – | Counts + model names |
| `GET` | `/health` | – | – | Liveness check |

---

## 6. Design decisions & trade-offs

| Decision | Why | Trade-off |
|---|---|---|
| pgvector instead of a separate vector DB | One database for metadata, chunks, vectors and logs; one transaction, cascade deletes, SQL filters | Needs the pgvector extension on the server; very large corpora may still outgrow it |
| HNSW index (cosine) | Fast approximate nearest-neighbour search inside Postgres | Approximate (tiny recall loss); building the index costs time and memory on ingest |
| Page-by-page chunking | Accurate page citations | Chunks never span page breaks |
| Chunk 1000 / overlap 200 | Good balance of context per chunk vs. precision | ~20% extra tokens embedded |
| Lazy OpenAI client | API starts and lists docs even without a key | Missing key surfaces only on first upload/query (500) |
| Query log with sources | Auditability; powers the History view | Table grows unbounded |
| API key on write / paid routes only | Protects OpenAI spend | Single shared key, no per-user auth |

### Scaling path

```mermaid
flowchart LR
    A["Now<br/>pgvector + HNSW"] --> C["Dedicated vector DB<br/>(Qdrant, etc.) at millions of vectors"]
    A -.-> D["Async ingestion<br/>(background task / queue)<br/>for large PDFs"]
    A -.-> E["Hybrid search<br/>BM25 + vectors, reranker"]
    A -.-> F["OCR fallback<br/>for scanned PDFs"]
```

---

## 7. Database setup (pgvector)

- The Postgres server needs the [pgvector](https://github.com/pgvector/pgvector) extension installed;
  `create_tables()` runs `CREATE EXTENSION IF NOT EXISTS vector` on startup.
- A database created before pgvector (with `float[]` embeddings) is upgraded once with
  [migrations/001_pgvector.sql](migrations/001_pgvector.sql).
- The earlier Qdrant prototype (`app/`, `docker-compose.yml`) is retired; everything runs on Postgres.

---

## 8. Configuration

Set in `rag/.env` (see [.env.example](.env.example)):

| Variable | Default | Used by |
|---|---|---|
| `OPENAI_API_KEY` | – (required for upload/query) | `engine.client()` |
| `DATABASE_URL` | `postgresql+psycopg2://postgres:root@localhost:5433/rag_db` | `database.py` |
| `RAG_API_KEY` | `my_secret_api_key` | `auth.py` |
| `OPENAI_EMBEDDING_MODEL` | `text-embedding-3-small` | indexing + querying |
| `OPENAI_CHAT_MODEL` | `gpt-5` | answer generation |

> ⚠️ Changing `OPENAI_EMBEDDING_MODEL` after indexing makes old vectors incompatible with new
> question vectors — re-index all documents when switching models.
