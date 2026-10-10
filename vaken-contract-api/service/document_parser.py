import os

from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> dict:
    """Extracts text, page count and word count from a PDF file."""
    reader = PdfReader(file_path)
    text = "\n".join((page.extract_text() or "") for page in reader.pages).strip()
    return {"text": text, "page_count": len(reader.pages), "word_count": len(text.split())}


def extract_text_from_txt(file_path: str) -> dict:
    """Extracts text, page count and word count from a TXT file."""
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        text = f.read().strip()
    return {"text": text, "page_count": 1, "word_count": len(text.split())}


def extract_text(file_path: str) -> dict:
    """Extracts text from a PDF or TXT document."""
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    if ext == ".txt":
        return extract_text_from_txt(file_path)
    raise ValueError("Unsupported file type. Only PDF and TXT files are allowed.")
