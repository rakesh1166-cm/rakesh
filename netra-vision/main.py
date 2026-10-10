import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv

load_dotenv()  # must run before modules that read env vars are imported

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from database import create_tables
from routes.analyse import router as analyse_router, UPLOAD_DIR
from routes.analyses import router as analyses_router
from routes.stats import router as stats_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    print("Database tables created.")
    yield
    print("Application shutdown.")


app = FastAPI(
    title="Netra Vision API",
    description="AI-powered crop disease detection. Upload plant photos, get disease diagnosis and treatment plans.",
    version="1.0.0",
    lifespan=lifespan,
)

# Allow the React dev server (Vite) to call this API from the browser.
# 5175 (kitab) and 5176 (vaken) are taken, so this one runs on 5177.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5177", "http://127.0.0.1:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyse_router)
app.include_router(analyses_router)
app.include_router(stats_router)

# Uploaded images are served so the UI can show thumbnails
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.get("/", tags=["health"])
def home():
    return {
        "app": "netra-vision",
        "version": "1.0.0",
        "endpoints": {
            "POST /analyse/": "Upload an image for disease detection",
            "POST /analyse/batch": "Upload multiple images for batch disease detection",
            "GET /analyses/": "List all analyses performed",
            "GET /analyses/{analysis_id}": "Details of a specific analysis",
            "DELETE /analyses/{analysis_id}": "Delete an analysis and its image",
            "GET /stats/summary": "Totals by severity and crop",
        },
    }


@app.get("/health", tags=["health"])
def health_check():
    return {"status": "ok"}
