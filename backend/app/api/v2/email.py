from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from loguru import logger
from app.core.email_generator import EmailGenerator
from typing import Optional

router = APIRouter()


@router.post('/generate-email', tags=['Email Generation'])
async def generate_email(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    recruiter_info: Optional[str] = Form(None)
):
    email_gen = EmailGenerator()
    if not resume_text or not job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description must be provided.")
    
    try:
        content = email_gen.craft_email(
            resume_text=resume_text,
            job_description=job_description,
            recruiter_info=recruiter_info
        )
        return JSONResponse(content=content, status_code=200)
    except Exception as e:
        logger.error(f"Error generating email: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while generating email.")
    