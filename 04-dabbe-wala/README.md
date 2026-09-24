# Dabbawala Delivery API

FastAPI + SQLModel + PostgreSQL backend with a React (Vite) UI for tracking tiffin orders
through `preparing → picked_up → in_transit → delivered`.

```
04-dabbe-wala/
├── main.py            # app, lifespan (creates tables), CORS, routers
├── database.py        # engine + get_session (PostgreSQL)
├── models.py          # Order, StatusLog tables + OrderCreate / OrderUpdate schemas
├── routes/
│   ├── orders.py      # CRUD + /orders/{id}/history
│   └── stats.py       # /stats/daily
└── frontend/          # React UI (Vite)
```

## Database

PostgreSQL on `localhost:5433`, database `dabbawala_db` (user `postgres` / `root`).
Override with the `DATABASE_URL` environment variable. Tables are created on startup.

```sql
CREATE DATABASE dabbawala_db;
```

## Run

Backend (port 8002 — 8000/8001 are used by the pincode and rangmanch projects):

```
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\uvicorn main:app --reload --port 8002
```

Frontend (port 5174 — 5173 is used by the rangmanch UI):

```
cd frontend
npm install
npm run dev
```

- UI: http://localhost:5174
- Swagger: http://127.0.0.1:8002/docs

## Endpoints

| Method | Path                     | Purpose                                        |
| ------ | ------------------------ | ---------------------------------------------- |
| POST   | `/orders/`               | Create an order (starts as `preparing`)        |
| GET    | `/orders/`               | List; filter `status`, `created_date`, paging  |
| GET    | `/orders/{id}`           | One order                                      |
| PATCH  | `/orders/{id}`           | Change `status` and/or `delivery_address`      |
| GET    | `/orders/{id}/history`   | Status changes recorded in `statuslog`         |
| DELETE | `/orders/{id}`           | Delete order and its history                   |
| GET    | `/stats/daily`           | Count per status for `summary_date`            |
| GET    | `/health`                | Health check                                   |
