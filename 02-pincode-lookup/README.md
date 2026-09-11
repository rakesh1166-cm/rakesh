# Pincode Lookup API

A FastAPI service that auto-fills **city / state / district** from an Indian 6-digit pincode —
the kind of lookup a checkout form does after the user types their PIN.
No database — all data lives in `data.py` as a Python dict keyed by pincode.

---

## 1. Project files

| File | Purpose |
|---|---|
| `main.py` | FastAPI app + all 3 route handlers + exception-handler registration |
| `models.py` | Pydantic models (`PincodeRequest`, `LocationResponse`, `BulkRequest`, `BulkResponse`) |
| `exceptions.py` | Custom exceptions (`PinCodeNotFoundError`, `InvalidPinCodeError`) and their JSON handlers |
| `data.py` | Hardcoded pincode dict (15 entries) |
| `requirements.txt` | Dependencies |

---

## 2. Requirements

- **Python 3.10 or newer** (the code uses `list[str]` / `list[LocationResponse]` syntax).
  Verified working on Python 3.12.10.

Check your version:

```powershell
python --version
```

---

## 3. Install dependencies

Run these from the project folder (`02-pincode-lookup`).

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
INFO:     Will watch for changes in these directories: ['...\02-pincode-lookup']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [31664] using WatchFiles
INFO:     Started server process [30484]
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

`/docs` is the easiest way to test everything manually — especially the POST endpoint,
where you can paste the JSON body straight into the form.

---

## 7. Endpoints

### `GET /`

Health/welcome check.

```powershell
curl http://127.0.0.1:8000/
```

```json
{ "message": "Pincode lookup api" }
```

---

### `GET /pincode/{code}`

Looks up one pincode. `code` must be exactly **6 digits**.

```powershell
curl http://127.0.0.1:8000/pincode/110001
```

```json
{
  "pincode": "110001",
  "city": "New Delhi",
  "state": "Delhi",
  "district": "Central Delhi"
}
```

An unknown (but well-formed) pincode returns **404**:

```powershell
curl http://127.0.0.1:8000/pincode/999999
```

```json
{
  "error": "pincode_not_found",
  "message": "No location for pincode: 999999",
  "pincode": "999999"
}
```

A badly formatted code (wrong length, or non-digits) raises `InvalidPinCodeError`:

```powershell
curl http://127.0.0.1:8000/pincode/11000
curl http://127.0.0.1:8000/pincode/abcdef
```

> **Heads up — known bug.** `main.py` registers the *same* handler for both exceptions:
>
> ```python
> app.add_exception_handler(PinCodeNotFoundError, pincode_not_found_handler)
> app.add_exception_handler(InvalidPinCodeError, pincode_not_found_handler)   # <- should be invalid_pincode_handler
> ```
>
> So a malformed pincode currently comes back as **404 `pincode_not_found`** instead of the
> intended **400 `invalid_pincode`**, and the `"Must be exactly 6 digit"` reason never reaches the
> client. `invalid_pincode_handler` in `exceptions.py` is written but never wired up.
> Fix by changing the second line to use `invalid_pincode_handler`.

---

### `POST /pincode/bulk`

Looks up many pincodes in one request. Body: `{"pincodes": ["...", "..."]}`.

Validation rules (enforced by `BulkRequest` in `models.py`, **before** the handler runs):

| Rule | Message on failure |
|---|---|
| At least 1 pincode | `At least one pincode is required` |
| At most 20 pincodes | `Maximum 20 pincodes allowed per request` |
| Every item exactly 6 digits | `Each Pincode must be exactly 6 digit` |

```powershell
curl.exe -X POST http://127.0.0.1:8000/pincode/bulk -H "Content-Type: application/json" -d "{\"pincodes\":[\"110001\",\"400001\",\"999999\"]}"
```

```json
{
  "status": "success",
  "found": 2,
  "not_found": 1,
  "results": [
    { "pincode": "110001", "city": "New Delhi", "state": "Delhi", "district": "Central Delhi" },
    { "pincode": "400001", "city": "Mumbai", "state": "Maharashtra", "district": "Mumbai City" }
  ],
  "missing": ["999999"]
}
```

Unknown pincodes here do **not** 404 — they are simply listed under `missing`,
which is what a bulk endpoint should do.

A rule violation returns **422** from Pydantic:

```json
{
  "detail": [
    {
      "type": "value_error",
      "loc": ["body", "pincodes"],
      "msg": "Value error, Each Pincode must be exactly 6 digit",
      "input": ["11000"]
    }
  ]
}
```

> **Note on route order:** `POST /pincode/bulk` and `GET /pincode/{code}` don't collide,
> because they use different HTTP methods. But `GET http://127.0.0.1:8000/pincode/bulk`
> falls into the `{code}` route and returns
> `{"error":"pincode_not_found", ..., "pincode":"bulk"}` — use POST.

> **Unused model:** `PincodeRequest` in `models.py` is defined (with its own 6-digit validator)
> but no route uses it. It's there for a single-pincode POST variant that hasn't been written yet.

---

## 8. Manual test checklist

Start the server, then run each of these in a second terminal.

```powershell
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/pincode/110001
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/pincode/201301
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/pincode/999999
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/pincode/11000
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/pincode/abcdef
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8000/pincode/bulk -H "Content-Type: application/json" -d "{\"pincodes\":[\"110001\",\"400001\"]}"
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8000/pincode/bulk -H "Content-Type: application/json" -d "{\"pincodes\":[]}"
curl.exe -s -o NUL -w "%{http_code}`n" -X POST http://127.0.0.1:8000/pincode/bulk -H "Content-Type: application/json" -d "{\"pincodes\":[\"11000\"]}"
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/docs
curl.exe -s -o NUL -w "%{http_code}`n" http://127.0.0.1:8000/openapi.json
```

| # | Request | Expected |
|---|---|---|
| 1 | `GET /` | 200 |
| 2 | `GET /pincode/110001` | 200, New Delhi |
| 3 | `GET /pincode/201301` | 200, Noida |
| 4 | `GET /pincode/999999` | 404, `pincode_not_found` |
| 5 | `GET /pincode/11000` (5 digits) | 400 `invalid_pincode` intended — **currently 404** (see bug above) |
| 6 | `GET /pincode/abcdef` | 400 intended — **currently 404** |
| 7 | `POST /pincode/bulk` with 2 valid | 200, `found: 2`, `not_found: 0` |
| 8 | `POST /pincode/bulk` with `[]` | 422, "At least one pincode is required" |
| 9 | `POST /pincode/bulk` with `["11000"]` | 422, "Each Pincode must be exactly 6 digit" |
| 10 | `GET /docs` | 200 |
| 11 | `GET /openapi.json` | 200 |

### PowerShell alternative to curl

```powershell
Invoke-RestMethod http://127.0.0.1:8000/pincode/110001 | ConvertTo-Json
Invoke-RestMethod -Method Post http://127.0.0.1:8000/pincode/bulk `
  -ContentType "application/json" `
  -Body '{"pincodes":["110001","400001","999999"]}' | ConvertTo-Json -Depth 5
```

> In PowerShell, bare `curl` is an alias for `Invoke-WebRequest`, which does not understand
> `-s -o -w`. Use `curl.exe` to force the real binary, as shown above.

---

## 9. Full pincode data reference

15 entries in `data.py`:

| Pincode | City | State | District |
|---|---|---|---|
| 110001 | New Delhi | Delhi | Central Delhi |
| 160001 | Chandigarh | Chandigarh | Chandigarh |
| 201301 | Noida | Uttar Pradesh | Gautam Buddha Nagar |
| 226001 | Lucknow | Uttar Pradesh | Lucknow |
| 302001 | Jaipur | Rajasthan | Jaipur |
| 380001 | Ahmedabad | Gujarat | Ahmedabad |
| 400001 | Mumbai | Maharashtra | Mumbai City |
| 411001 | Pune | Maharashtra | Pune |
| 440001 | Nagpur | Maharashtra | Nagpur |
| 500001 | Hyderabad | Telangana | Hyderabad |
| 560001 | Bangalore | Karnataka | Bangalore Urban |
| 600001 | Chennai | Tamil Nadu | Chennai |
| 682001 | Kochi | Kerala | Ernakulam |
| 700001 | Kolkata | West Bengal | Kolkata |
| 800001 | Patna | Bihar | Patna |

Any other 6-digit pincode is a valid *format* but simply isn't in the dict, so it 404s
(or lands in `missing` for bulk).

---

## 10. Troubleshooting

| Problem | Cause / fix |
|---|---|
| `Error loading ASGI app. Could not import module "main"` | You're in the wrong folder. `cd` into `02-pincode-lookup` first. |
| `'uvicorn' is not recognized` | The venv isn't activated. Activate it, or use `.\.venv\Scripts\python.exe -m uvicorn main:app --reload`. |
| `[Errno 10048] address already in use` | Port 8000 is taken. Use `--port 8001`, or find the process with `netstat -ano \| findstr :8000` then `taskkill /PID <pid> /F`. |
| `ModuleNotFoundError: No module named 'fastapi'` | Dependencies went into a different interpreter. Re-run `pip install -r requirements.txt` inside the venv. |
| `TypeError: unsupported operand type(s) for \|` | Python is older than 3.10. Upgrade. |
| `Activate.ps1 cannot be loaded` | Run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once. |
| Changes to `.py` files do nothing | You started without `--reload`. |
| Bad pincode returns 404 instead of 400 | The exception-handler wiring bug in `main.py` — see section 7. |
| `422` on the bulk endpoint with `{"detail": [...]}` | Body failed `BulkRequest` validation: empty list, more than 20 items, or a non-6-digit entry. |
| `500 Internal Server Error` on a lookup | An entry in `data.py` is missing a field (`pincode`/`city`/`state`/`district`), so `LocationResponse` validation failed. Read the traceback in the terminal. |

---

## 11. PyCharm run configuration

1. **Run → Edit Configurations → + → Python**
2. Set:
   - **Module name** (switch from *Script path* using the dropdown): `uvicorn`
   - **Parameters:** `main:app --reload`
   - **Working directory:** the `02-pincode-lookup` folder
   - **Python interpreter:** the `.venv` interpreter
3. Save and hit **Run**.
