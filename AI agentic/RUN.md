# RUN.md — How to Run HolidayLandmarks Manually

Step-by-step commands to start the **backend** (FastAPI) and **frontend** (React + Vite)
by hand on Windows. Both must be running at the same time, in **two separate terminals**.

| Piece | URL | Port |
|---|---|---|
| Backend API | http://localhost:8000 | 8000 |
| API docs (Swagger) | http://localhost:8000/docs | 8000 |
| Frontend | http://localhost:5173 | 5173 |
| PostgreSQL | localhost:5433 · db `holidaylandmark` | 5433 |

---

## 0. Prerequisites (one time)

| Tool | Required | Check with |
|---|---|---|
| Python | 3.11 or 3.12 | `python --version` |
| Node.js | 18+ (22.x works) | `node --version` |
| PostgreSQL | 16, running on port **5433** | see §0.3 |

### 0.1 Python

> ⚠️ **Python is not currently installed on this machine.** `python`, `python3`, and `py`
> all resolve to the Microsoft Store stub, and the venvs inside
> `C:\Users\rakes\PycharmProjects\fastApiProject` are broken (they point at a deleted
> `Python312`). Install it before running the backend.

```powershell
winget install --id Python.Python.3.12 -e
```

Close and reopen the terminal, then confirm:

```powershell
python --version      # expect: Python 3.12.x
```

If `python` still opens the Microsoft Store, turn off the alias:
**Settings → Apps → Advanced app settings → App execution aliases** → disable
`python.exe` and `python3.exe`.

### 0.2 Node.js

```powershell
node --version        # expect: v18+ (v22.7.0 confirmed working)
npm --version
```

Install from https://nodejs.org if missing.

### 0.3 PostgreSQL

The project reuses the same local server as `PycharmProjects\fastApiProject`:
**PostgreSQL 16, port 5433, user `postgres`, password `root`, database `holidaylandmark`.**

Confirm the port is listening:

```powershell
Test-NetConnection -ComputerName localhost -Port 5433
# TcpTestSucceeded : True
```

Confirm the database exists:

```powershell
$env:PGPASSWORD='root'
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -h localhost -p 5433 -Atc "SELECT datname FROM pg_database WHERE datistemplate = false;"
```

`holidaylandmark` should appear in the list. If Postgres is not running, start the service:

```powershell
Get-Service -Name "*postgres*"
Start-Service -Name "postgresql-x64-16"     # name may differ; use what Get-Service shows
```

---

## 1. Backend — FastAPI

Open **Terminal 1**.

### 1.1 First-time setup only

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\backend"

python -m venv .venv
.\.venv\Scripts\Activate.ps1

pip install --upgrade pip
pip install -r requirements.txt
```

> If PowerShell blocks `Activate.ps1` with a script-execution error, run once:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```

`backend\.env` already exists with working defaults. To recreate it:

```powershell
copy .env.example .env
```

### 1.2 Every time — start the API

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\backend"
.\.venv\Scripts\Activate.ps1

uvicorn app.main:app --reload --port 8000
```

Expected output:

```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Application startup complete.
```

Leave this terminal running. `--reload` restarts the server on file changes.

### 1.3 Verify the backend

In a **third** terminal (or a browser):

```powershell
# Home page — app name, version, environment
curl http://localhost:8000/

# Liveness
curl http://localhost:8000/api/health

# Real Postgres round-trip — this is the database connection test
curl http://localhost:8000/api/health/db
```

A healthy `/api/health/db` returns:

```json
{
  "status": "connected",
  "dialect": "postgresql",
  "database": "holidaylandmark",
  "server_version": "PostgreSQL 16.4"
}
```

If it returns `"status": "error"`, the API is fine but Postgres is not reachable —
go back to §0.3.

Interactive docs: **http://localhost:8000/docs**

### 1.4 Run the backend tests

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\backend"
.\.venv\Scripts\Activate.ps1
pytest
```

### 1.5 Stop the backend

`Ctrl + C` in Terminal 1.

---

## 2. Frontend — React + Vite

Open **Terminal 2**.

### 2.1 First-time setup only

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\frontend"
npm install
```

The API base URL defaults to `http://localhost:8000`. To point elsewhere:

```powershell
copy .env.example .env.local
# then edit VITE_API_BASE_URL in .env.local
```

### 2.2 Every time — start the dev server

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\frontend"
npm run dev
```

Expected output:

```
VITE v6.4.3  ready in 400 ms
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in a browser.

### 2.3 What you should see

The home page shows a status pill in the hero section:

| Pill | Meaning |
|---|---|
| 🟢 **API + Postgres connected** | Everything is working |
| 🟠 **API up · database unreachable** | Backend running, Postgres down — see §0.3 |
| 🔴 **Backend offline** | Uvicorn is not running — see §1.2 |

The **System status** panel below lists the API endpoint, service version, environment,
database name, and Postgres server version. The **Re-check** button re-queries without a
page reload.

### 2.4 Production build (optional)

```powershell
cd "C:\Users\rakes\PycharmProjects\AI agentic\frontend"
npm run build       # outputs to frontend\dist
npm run preview     # serve the build at http://localhost:4173
```

### 2.5 Stop the frontend

`Ctrl + C` in Terminal 2.

---

## 3. Quick reference — daily startup

Two terminals, in this order:

```powershell
# Terminal 1 — backend
cd "C:\Users\rakes\PycharmProjects\AI agentic\backend"; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --port 8000
```

```powershell
# Terminal 2 — frontend
cd "C:\Users\rakes\PycharmProjects\AI agentic\frontend"; npm run dev
```

Then open http://localhost:5173

---

## 4. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `python` opens Microsoft Store | Python not installed / Store alias on | §0.1 |
| `Activate.ps1 cannot be loaded` | PowerShell execution policy | `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` |
| `ModuleNotFoundError: No module named 'app'` | Ran uvicorn from the wrong folder | `cd` into `backend\` first — the app is `app.main:app` |
| `ModuleNotFoundError: fastapi` | venv not activated | `.\.venv\Scripts\Activate.ps1` |
| `[Errno 10048] address already in use` | Port 8000 or 5173 taken | Use `--port 8001` / `npm run dev -- --port 5174`, or kill the process: `Get-NetTCPConnection -LocalPort 8000 \| Select-Object OwningProcess` |
| Home page shows 🔴 **Backend offline** | Uvicorn not running | §1.2 |
| Home page shows 🟠 **database unreachable** | Postgres down or wrong credentials | §0.3, then check `DATABASE_URL` in `backend\.env` |
| Browser console: CORS error | Frontend origin not allow-listed | Add it to `FRONTEND_ORIGINS` in `backend\.env`, restart uvicorn |
| `psycopg2` install fails | Missing build tools | `requirements.txt` uses `psycopg2-binary` (prebuilt) — make sure you didn't swap it for `psycopg2` |

---

## 5. Notes

- The backend does **not** crash if Postgres is down. Startup logs the failure and
  `/api/health/db` reports `"status": "error"` — by design, so the frontend can show it.
- Tables are created automatically on startup via `Base.metadata.create_all`. Our table is
  named `agent_landmarks` because the `holidaylandmark` database already contains an
  unrelated CMS schema.
- Secrets live in `backend\.env`, which is git-ignored. `backend\.env.example` is the
  committed template.

See also: [CLAUDE.md](CLAUDE.md) · [TECH-STACK-DECISIONS.md](TECH-STACK-DECISIONS.md) · [doc/feature.md](doc/feature.md)
