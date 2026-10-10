import os

from dotenv import load_dotenv

# Reads .env next to this file, so GEMINI_API_KEY / DATABASE_URL can live there
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/vaken_db",
)

# Set VAKEN_API_KEY in the environment for anything beyond local dev
API_KEY = os.getenv("VAKEN_API_KEY", "my_secret_api_key")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

ALLOWED_EXTENSIONS = [".pdf", ".txt"]
MAX_FILE_SIZE_MB = 10
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
