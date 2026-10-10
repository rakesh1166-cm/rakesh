import os
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlmodel import Session

from auth import verify_api_key
from database import get_session
from models.analysis import Analysis, AnalysisRead
from services.image import validate_image, resize_image_if_needed, save_image
from services.vision import analyse_image as vision_analyse_image

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")

router = APIRouter(prefix="/analyse", tags=["analyse"])


async def process_single_image(file: UploadFile, session: Session) -> Analysis:
    """
    Validate, store, analyse and persist a single image.
    """
    content_type = file.content_type or ""
    if not content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail=f"Invalid file type for {file.filename}. Please upload an image.")

    content = await file.read()

    validation = validate_image(content, content_type)
    if not validation["is_valid"]:
        raise HTTPException(status_code=400, detail=f"{file.filename}: {validation['message']}")

    processed = resize_image_if_needed(content)

    filename = file.filename or "upload"
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    unique_name = f"{uuid.uuid4().hex}.{ext}"

    path = save_image(processed, UPLOAD_DIR, unique_name)

    try:
        result = await vision_analyse_image(path, content_type)
    except ValueError as e:  # includes json.JSONDecodeError
        raise HTTPException(status_code=502, detail=f"Vision model returned invalid JSON: {e}")
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Vision model call failed: {e}")

    analysis = Analysis(
        filename=filename,
        stored_name=unique_name,
        content_type=content_type,
        crop_detected=result.get("crop_detected"),
        severity=result.get("severity"),
        overall_health=result.get("overall_health"),
        additional_notes=result.get("additional_notes"),
        diseases=result.get("diseases") or [],
        treatments=result.get("treatments") or [],
    )
    session.add(analysis)
    session.commit()
    session.refresh(analysis)
    return analysis


@router.post("/", response_model=AnalysisRead, status_code=201)
async def analyse_image(
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    """Upload one plant photo; returns the saved diagnosis."""
    return await process_single_image(file, session)


@router.post("/batch", response_model=list[AnalysisRead], status_code=201)
async def analyse_images(
    files: list[UploadFile] = File(...),
    session: Session = Depends(get_session),
    api_key: str = Depends(verify_api_key),
):
    """Upload several plant photos; each one is analysed and saved."""
    return [await process_single_image(file, session) for file in files]
