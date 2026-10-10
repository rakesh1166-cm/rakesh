import base64
import json
import os

from openai import AsyncOpenAI

# Reads OPENAI_API_KEY from the environment (.env is loaded in main.py)
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5.5")

_client: AsyncOpenAI | None = None


def get_client() -> AsyncOpenAI:
    global _client
    if _client is None:
        _client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    return _client


CROP_ANALYSIS_PROMPT = """
You are an expert agricultural scientist specializing in crop disease detection.
Analyze this image of a crop/plant and provide a detailed disease assessment.

Respond with ONLY a JSON object (no markdown) with exactly this structure:

{
"crop_detected": "Name of the crop or plant visible in the image",
"severity": "healthy" or "mild" or "moderate" or "severe" or "critical",
"diseases": [
        {
            "name": "Disease name",
            "confidence": 0.0 to 1.0,
            "description": "Brief description of the disease and visible symptoms"
        }
    ],
"treatments": [
        {
            "treatment_name": "Name of treatment",
            "treatment_type": "organic" or "chemical" or "preventive",
            "instructions": "Step by step treatment instructions",
            "urgency": "immediate" or "within_week" or "seasonal"
        }
    ],
    "overall_health": "One sentence summary of plant health",
    "additional_notes": "Any other observations or recommendations"
}
"""


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def parse_json(text: str) -> dict:
    """The model sometimes wraps JSON in ```json fences — strip them before parsing."""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1] if "\n" in text else ""
        text = text.rsplit("```", 1)[0]
    return json.loads(text)


async def analyse_image(image_path: str, content_type: str) -> dict:
    """
    Analyse the image with an OpenAI vision model for disease detection.
    """
    base64_image = encode_image(image_path)

    response = await get_client().responses.create(
        model=OPENAI_MODEL,
        input=[
            {
                "role": "user",
                "content": [
                    {"type": "input_text", "text": CROP_ANALYSIS_PROMPT},
                    {
                        "type": "input_image",
                        "image_url": f"data:{content_type};base64,{base64_image}",
                    },
                ],
            }
        ],
    )

    return parse_json(response.output_text)
