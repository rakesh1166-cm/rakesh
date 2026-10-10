from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session

import config  # noqa: F401  (loads .env before anything reads a setting)
from database import create_tables, engine
from services.places import seed_destinations

from routes.planner import router as planner_router
from routes.stream import router as stream_router
from routes.destinations import router as destinations_router
from routes.trips import router as trips_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    with Session(engine) as session:
        seed_destinations(session)
    print("Database tables ready.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="Yatra Planner API",
    description="Aggregate travel data from multiple sources to provide single plan with SSE support",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the React dev server (Vite) to call this API from the browser.
# 5173-5177 are used by the other UIs in this series, so this one runs on 5178.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5178", "http://127.0.0.1:5178"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(planner_router)
app.include_router(stream_router)
app.include_router(destinations_router)
app.include_router(trips_router)
app.include_router(stats_router)


@app.get("/", tags=["health"])
async def root():
    return {
        "app": "Yatra Planner API",
        "version": "1.0.0",
        "endpoints": {
            "POST /plan/": "Create a travel plan (aggregated, not saved)",
            "POST /stream/plan": "Stream a travel plan (SSE)",
            "GET /plan/cache-stats": "View cache statistics",
            "DELETE /plan/cache": "Clear the cache",
            "/destinations": "Destinations and their places (Postgres)",
            "/trips": "Saved travel plans (Postgres)",
            "GET /stats/summary": "Totals",
        },
    }


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
