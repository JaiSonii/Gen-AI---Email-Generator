from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from loguru import logger

router = APIRouter()

@router.post('/linkedin', tags=["LinkedIn"])
async def search_linkedin(recruiter_url: str):
    """
    Endpoint to search for a recruiter on LinkedIn.
    Expects a recruiter URL as input.
    Returns the recruiter's information in JSON format.
    """
    from app.tools.linkedin import LinkedIn

    if not recruiter_url:
        logger.error("Recruiter URL is required")
        raise HTTPException(status_code=400, detail="Recruiter URL is required")

    linkedin = LinkedIn()
    recruiter_info = linkedin.search(recruiter_url)

    if not recruiter_info:
        raise HTTPException(status_code=404, detail="Recruiter not found")

    return JSONResponse(content=recruiter_info, status_code=200)