from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

from routes.users import router as users_router
from routes.books import router as books_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="Kitab Exchange API",
    description="A simple API for exchanging used books between college students.",
    version="1.0.0",
    lifespan=lifespan
)

# Allow the React dev server (Vite) to call this API from the browser.
# 5173 / 5174 are used by the rangmanch and dabbawala UIs, so this one runs on 5175.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5175", "http://127.0.0.1:5175"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users_router)
app.include_router(books_router)
app.include_router(stats_router)


@app.get("/", tags=["health"])
def home():
    return {"message": "Welcome to the Kitab Exchange API"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
