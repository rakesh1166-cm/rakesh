from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

from routes.orders import router as orders_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="Dabbawala Delivery API",
    description="API for managing dabbawala deliveries and tracking order statuses.",
    version="1.0.0",
    lifespan=lifespan
)

# Allow the React dev server (Vite) to call this API from the browser
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5174", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders_router)
app.include_router(stats_router)


@app.get("/", tags=["health"])
def root():
    return {"message": "Welcome to Dabbawala Delivery API"}


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
