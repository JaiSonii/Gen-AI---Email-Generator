from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from loguru import logger
from app.core.email_generator import EmailGenerator
from typing import Optional
import os

router = APIRouter()

@router.post('/generate-email', tags=['Email Generation'], deprecated=True)
async def generate_email_endpoint(
    file: UploadFile = File(...),
    jd_url: Optional[str] = Form(None),
    jd_text: Optional[str] = Form(None),
    recruiter_url: Optional[str] = Form(None)
):
    """
    Generates a professional email based on a resume, job description, and optional recruiter profile.

    - **file**: The user's resume in PDF format.
    - **jd_url**: The URL of the job description (optional).
    - **jd_text**: The raw text of the job description (optional).
    - **recruiter_url**: The LinkedIn URL of the recruiter (optional).

    *Provide either jd_url or jd_text.*
    """
    if not jd_url and not jd_text:
        raise HTTPException(status_code=400, detail="Either jd_url or jd_text must be provided.")

    if not file.content_type or not file.content_type.startswith('application/pdf'):
        logger.error("Invalid file type. Only PDF files are allowed.")
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    try:
        # Save the uploaded resume temporarily
        contents = await file.read()
        temp_dir = "/tmp"
        os.makedirs(temp_dir, exist_ok=True)
        temp_path = os.path.join(temp_dir, file.filename)
        with open(temp_path, "wb") as f:
            f.write(contents)

        # Initialize and run the email generator
        email_generator = EmailGenerator()
        generated_email = email_generator.generate(
            resume_path=temp_path,
            jd_url=jd_url,
            jd_text=jd_text,
            recruiter_url=recruiter_url
        )

        # Clean up the temporary file
        os.remove(temp_path)

        return JSONResponse(content={"email": generated_email}, status_code=200)

    except ValueError as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating email: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate email.")