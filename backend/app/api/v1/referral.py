from fastapi import APIRouter, HTTPException, Form
from fastapi.responses import JSONResponse
from loguru import logger

from typing import Optional

from app.core.email_generator import EmailGenerator

router = APIRouter()

@router.post("/generate-referral", tags=["referral"])
async def generate_referral(
    resume_text: str = Form(...),
    job_description: str = Form(...),
    recruiter_info: Optional[str] = Form(None),
    message_type: Optional[str] = Form("linkedin message")
):
    email_gen = EmailGenerator()
    if not resume_text or not job_description:
        raise HTTPException(status_code=400, detail="Both resume_text and job_description must be provided.")
    
    try:
        result = email_gen.craft_referral(
            resume_text=resume_text,
            job_description=job_description,
            recruiter_info=recruiter_info,
            message_type=message_type
        )
        return JSONResponse(content=result, status_code=200)
    except Exception as e:
        logger.error(f"Error generating email: {e}")
        raise HTTPException(status_code=500, detail="Internal server error while generating email.")