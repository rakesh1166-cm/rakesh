# Chai Point Menu API

A read-only FastAPI service that serves a chai shop menu for kiosk displays and mobile apps.
No database — all data lives in `data.py` as a Python list.

---

## 1. Project files

| File | Purpose |
|---|---|
| `main.py` | FastAPI app + all 3 route handlers |
| `models.py` | Pydantic response models (`MenuItem`, `MenuResponse`) |
| `data.py` | Hardcoded menu list (10 items) |
| `requirements.txt` | Dependencies |

---

## 2. Requirements

- **Python 3.10 or newer** (the code uses `str | None` and `list[MenuItem]` syntax).
  Verified working on Python 3.12.10.

Check your version:

```powershell
python --version
```

---

## 3. Install dependencies

Run these from the project folder (`01-chaimenu`).

### Windows (PowerShell)

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
```

> If PowerShell blocks the activate script, run this once:
> `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`

### Windows (CMD)

```cmd
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
```

### how to start
uvicorn main:app --reload
##how to stop
To stop it: press Ctrl+C in that terminal.
### macOS / Linux

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

### Skip activation (works anywhere)

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## 4. What gets installed

`requirements.txt` lists only two direct packages; pip pulls the rest in as dependencies.

**Direct:**

| Package | Installed version | Why |
|---|---|---|
| `fastapi` | 0.141.1 | The web framework |
| `uvicorn[standard]` | 0.52.4 | ASGI server that runs the app |

**Pulled in automatically:**

| Package | Version | Comes from |
|---|---|---|
| `pydantic` | 2.13.5 | fastapi — validates/serializes the models |
| `pydantic_core` | 2.46.5 | pydantic |
| `starlette` | 1.6.0 | fastapi — HTTP/routing layer |
| `anyio` | 4.15.1 | starlette — async support |
| `idna` | 3.19 | anyio |
| `annotated-types` | 0.8.0 | pydantic |
| `annotated-doc` | 0.0.5 | fastapi |
| `typing_extensions` | 4.16.0 | pydantic |
| `typing-inspection` | 0.4.4 | pydantic |
| `click` | 8.5.0 | uvicorn — CLI parsing |
| `h11` | 0.16.0 | uvicorn — HTTP/1.1 |
| `httptools` | 0.8.0 | uvicorn[standard] — faster HTTP parser |
| `watchfiles` | 1.2.0 | uvicorn[standard] — powers `--reload` |
| `websockets` | 17.1 | uvicorn[standard] |
| `python-dotenv` | 1.2.3 | uvicorn[standard] |
| `PyYAML` | 6.0.3 | uvicorn[standard] |

Verify your install matches:

```powershell
pip freeze
```

To pin these exact versions for later:

```powershell
pip freeze > requirements.lock.txt
```

---

## 5. Run the project

### With the venv activated

```powershell
uvicorn main:app --reload
```

### Without activating

```powershell
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

### Explicit host and port

```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Expected output:

```
INFO:     Will watch for changes in these directories: ['...\01-chaimenu']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [29836] using WatchFiles
INFO:     Started server process [29784]
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Stop the server:** `Ctrl+C`

Notes:

- `main:app` means "the variable `app` inside `main.py`" — you must run this from the project folder.
- `--reload` restarts the server whenever you save a `.py` file. Use it for development only.
- To let other devices on your network reach it: `--host 0.0.0.0`

---

## 6. Open in a browser

| URL | What it is |
|---|---|
| http://127.0.0.1:8000/ | Welcome message |
| http://127.0.0.1:8000/docs | **Swagger UI** — click "Try it out" to call endpoints |
| http://127.0.0.1:8000/redoc | ReDoc documentation |
| http://127.0.0.1:8000/openapi.json | Raw OpenAPI schema |

`/docs` is the easiest way to test everything manually.

---

## 7. Endpoints

### `GET /`

Health/welcome check.

```powershell
curl http://127.0.0.1:8000/
```

```json
{ "message": "Welcome to chai point Menu API" }
```

---

### `GET /menu`

Returns the full menu.

```powershell
curl http://127.0.0.1:8000/menu
```

```json
{
  "status": "success",
  "count": 10,
  "items": [
    {
      "id": 1,
      "name": "Masala Chai",
      "category": "chai",
      "price": 30.0,
      "description": "Classic Indian spiced tea with ginger and cardamom",
      "available": true
    }
  ]
}
```

---

### `GET /menu?category={category}`

Filters by category. The value is lowercased before matching, so `CHAI` and `chai` both work.

**Valid values:** `chai` (4 items), `snacks` (3 items), `combos` (3 items)

```powershell
curl "http://127.0.0.1:8000/menu?category=chai"
curl "http://127.0.0.1:8000/menu?category=snacks"
curl "http://127.0.0.1:8000/menu?category=combos"
```

An unknown category returns **404**:

```powershell
curl "http://127.0.0.1:8000/menu?category=coffee"
```

```json
{ "detail": "No item found in category: coffee" }
```

> **Heads up:** the Swagger description for this parameter says *"chai, snack or combo"*, but the
> data in `data.py` uses the plural forms `snacks` and `combos`. So `?category=snack`
> returns 404 even though the docs suggest it should work.

---

### `GET /menu/{item_id}`

Returns one item by its numeric id. Valid ids are **1–10**.

```powershell
curl http://127.0.0.1:8000/menu/5
```

```json
{
  "id": 5,
  "name": "Samosa",
  "category": "snacks",
  "price": 25.0,
  "description": "Crispy potato-filled pastry with mint chutney",
  "available": true
}
```

A missing id returns **404**:

```powershell
curl http://127.0.0.1:8000/menu/99
```

```json
{ "detail": "Menu item with id 99 not found" }
```

A non-numeric id returns **422** (FastAPI rejects it before your code runs):

```powershell
curl http://127.0.0.1:8000/menu/abc
```

---

## 8. Manual test checklist

Start the server, then run each of these in a second terminal.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/menu
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8000/menu?category=chai"
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8000/menu?category=snacks"
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8000/menu?category=combos"
curl.exe -s -o NUL -w "%{http_code}`n" "http://127.0.0.1:8000/menu?category=coffee"
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/menu/1
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/menu/10
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/menu/99
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/menu/abc
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/docs
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/openapi.json
```

| # | Request | Expected |
|---|---|---|
| 1 | `GET /` | 200 |
| 2 | `GET /menu` | 200, `count: 10` |
| 3 | `GET /menu?category=chai` | 200, `count: 4` |
| 4 | `GET /menu?category=snacks` | 200, `count: 3` |
| 5 | `GET /menu?category=combos` | 200, `count: 3` |
| 6 | `GET /menu?category=coffee` | 404 |
| 7 | `GET /menu/1` | 200, Masala Chai |
| 8 | `GET /menu/10` | 200, Office Party Pack |
| 9 | `GET /menu/99` | 404 |
| 10 | `GET /menu/abc` | 422 |
| 11 | `GET /docs` | 200 |
| 12 | `GET /openapi.json` | 200 |

### PowerShell alternative to curl

```powershell
Invoke-RestMethod http://127.0.0.1:8000/menu | ConvertTo-Json -Depth 5
(Invoke-RestMethod "http://127.0.0.1:8000/menu?category=chai").count
```

> In PowerShell, bare `curl` is an alias for `Invoke-WebRequest`, which does not understand
> `-s -o -w`. Use `curl.exe` to force the real binary, as shown above.

---

## 9. Full menu data reference

| id | Name | Category | Price | Available |
|---:|---|---|---:|---|
| 1 | Masala Chai | chai | 30 | yes |
| 2 | Adrak Chai | chai | 35 | yes |
| 3 | Elaichi Chai | chai | 40 | yes |
| 4 | Cutting Chai | chai | 15 | yes |
| 5 | Samosa | snacks | 25 | yes |
| 6 | Vada Pav | snacks | 30 | **no** |
| 7 | Bun Maska | snacks | 35 | yes |
| 8 | Chai + Samosa Combo | combos | 50 | yes |
| 9 | Chai + Bun Maska Combo | combos | 60 | yes |
| 10 | Office Party Pack | combos | 250 | yes |

Note: `available: false` items (Vada Pav) are still returned by the API — nothing filters them out.

---

## 10. Troubleshooting

| Problem | Cause / fix |
|---|---|
| `Error loading ASGI app. Could not import module "main"` | You're in the wrong folder. `cd` into `01-chaimenu` first. |
| `'uvicorn' is not recognized` | The venv isn't activated. Activate it, or use `.\.venv\Scripts\python.exe -m uvicorn main:app --reload`. |
| `[Errno 10048] address already in use` | Port 8000 is taken. Use `--port 8001`, or find the process with `netstat -ano \| findstr :8000` then `taskkill /PID <pid> /F`. |
| `TypeError: unsupported operand type(s) for \|` | Python is older than 3.10. Upgrade. |
| `Activate.ps1 cannot be loaded` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| Changes to `.py` files do nothing | You started without `--reload`. |
| `500 Internal Server Error` on `/menu` | A dict in `data.py` is missing a field or has the wrong type, so `MenuResponse` validation failed. Read the traceback in the terminal. |

---

## 11. PyCharm run configuration

1. **Run → Edit Configurations → + → Python**
2. Set:
   - **Module name** (switch from *Script path* using the dropdown): `uvicorn`
   - **Parameters:** `main:app --reload`
   - **Working directory:** the `01-chaimenu` folder
   - **Python interpreter:** the `.venv` interpreter
3. Save and hit **Run**.
