# Netra Vision

AI crop disease detection: FastAPI + PostgreSQL (SQLModel) backend, React (Vite) frontend.

```
netra-vision/
├── main.py            FastAPI app, CORS, routers, /uploads static files
├── database.py        engine + get_session (Postgres netra_db on :5433)
├── auth.py            X-API-Key check for write routes
├── models/analysis.py Analysis table (diseases/treatments stored as JSONB)
├── routes/            analyse.py (POST), analyses.py (GET/DELETE), stats.py
├── services/          image.py (validate/resize/save), vision.py (OpenAI vision)
├── uploads/           saved images
└── frontend/          React UI (Analyse, History, Stats)
```

## Setup (once)

```powershell
# database (Postgres 16 on port 5433, user postgres / root)
psql -h localhost -p 5433 -U postgres -c "CREATE DATABASE netra_db"

# backend
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt

# frontend
cd frontend; npm install
```

`.env` in the project root needs `OPENAI_API_KEY=...` (optional: `OPENAI_MODEL`, `DATABASE_URL`, `NETRA_API_KEY`).

## Run

```powershell
.\.venv\Scripts\python -m uvicorn main:app --reload --port 8008   # API  -> http://127.0.0.1:8008/docs
cd frontend; npm run dev                                          # UI   -> http://localhost:5177
```
