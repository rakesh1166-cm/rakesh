from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

from routes.documents import router as documents_router
from routes.query import router as query_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="RAG API",
    description="Upload PDFs, store chunks + embeddings in Postgres, and ask questions about them.",
    version="1.0.0",
    lifespan=lifespan
)

# Allow the React dev server (Vite) to call this API from the browser.
# 5173-5175 are used by the other UIs, so this one runs on 5176.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5176", "http://127.0.0.1:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents_router)
app.include_router(query_router)
app.include_router(stats_router)


@app.get("/", tags=["health"])
def home():
    return {"message": "Welcome to the RAG API"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
