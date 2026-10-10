from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_tables
from routes.analysis import router as analysis_router
from routes.contracts import router as contracts_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="Vakeel Contracts API",
    description="AI-powered contract analysis using Gemini, stored in PostgreSQL.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the React dev server (Vite) to call this API from the browser.
# 5173-5175 are used by the other UIs (rangmanch, dabbawala, kitab), so this one runs on 5176.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176", "http://127.0.0.1:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contracts_router)
app.include_router(analysis_router)
app.include_router(stats_router)


@app.get("/", tags=["health"])
def home():
    return {"message": "Welcome to the Vakeel Contracts API", "docs": "/docs"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
