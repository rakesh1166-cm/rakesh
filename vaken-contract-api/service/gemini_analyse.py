import json

from google import genai
from google.genai import types

from config import GEMINI_API_KEY, GEMINI_MODEL
from models import ClauseAnalysis, RiskFlag, RiskLevel
from service.prompt import CONTRACT_ANALYSIS_PROMPT

_client = None


def get_client() -> genai.Client:
    """Create the Gemini client on first use, so the API can start without a key."""
    global _client
    if _client is None:
        _client = genai.Client(api_key=GEMINI_API_KEY)
    return _client


def _strip_fences(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("```json"):
        raw = raw[7:]
    elif raw.startswith("```"):
        raw = raw[3:]
    if raw.endswith("```"):
        raw = raw[:-3]
    return raw.strip()


async def analyze_contract(text_content: str) -> dict:
    """Send the contract to Gemini and return validated fields for an Analysis row."""
    prompt = CONTRACT_ANALYSIS_PROMPT.format(contract_text=text_content[:15000])

    response = await get_client().aio.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config=types.GenerateContentConfig(response_mime_type="application/json"),
    )

    data = json.loads(_strip_fences(response.text or ""))

    # Validate each item against our shapes, then store them as plain dicts (JSON columns)
    key_clauses = [ClauseAnalysis(**c).model_dump(mode="json") for c in data.get("key_clauses", [])]
    risk_flags = [RiskFlag(**r).model_dump(mode="json") for r in data.get("risk_flags", [])]

    return {
        "summary": data.get("summary", ""),
        "contract_type": data.get("contract_type", "Unknown"),
        "key_clauses": key_clauses,
        "risk_flags": risk_flags,
        "overall_risk_level": RiskLevel(str(data.get("overall_risk_level", "low")).lower()),
        "recommendations": [str(r) for r in data.get("recommendations", [])],
    }
