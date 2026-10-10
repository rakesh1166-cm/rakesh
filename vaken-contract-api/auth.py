from fastapi import Header, HTTPException

from config import API_KEY


def verify_api_key(x_api_key: str = Header(description="API key required for write operations")):
    """Verify the API key from the X-API-Key request header."""
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API Key")
    return x_api_key
