import os

from dotenv import load_dotenv
from fastapi import Header, HTTPException

load_dotenv()

# Set RAG_API_KEY in .env for anything beyond local dev
API_KEY = os.getenv("RAG_API_KEY", "my_secret_api_key")


def verify_api_key(x_api_key: str = Header(description="API key required for write / paid operations")):
    """Verify the API key from the X-API-Key request header."""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
