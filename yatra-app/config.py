import os

from dotenv import load_dotenv

# Read .env once, before anything asks for a setting
load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:root@localhost:5433/yatra_db",
)
API_KEY = os.getenv("YATRA_API_KEY", "my_secret_api_key")
WEATHERAPI_API_KEY = os.getenv("WEATHERAPI_API_KEY", "")
EXCHANGERATE_API_KEY = os.getenv("EXCHANGERATE_API_KEY", "")
