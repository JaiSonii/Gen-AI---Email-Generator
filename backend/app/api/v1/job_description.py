from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from loguru import logger
from pydantic import BaseModel

class JDURLRequest(BaseModel):
    url : str

class JDTextRequest(BaseModel):
    jd_text: str

router = APIRouter()

@router.post('/jd-from-url', tags=['Job Description'])
def get_job_description(request: JDURLRequest):
    """
    Endpoint to scrape a job descrption from a given URL.
    Expects a job URL as input.
    """
    from app.tools.jd_scraper import Scraper
    from app.tools.jd_to_json import JD2JSON

    url = request.url.strip()
    if not url:
        logger.error("Job URL is required")
        raise HTTPException(status_code=400, detail="Job URL is required")
    scraper = Scraper()
    scrape_res = scraper.scrape(url)
    if not scrape_res:
        logger.error("Failed to scrape the job description")
        raise HTTPException(status_code=500, detail="Failed to scrape the job description")
    
    jd2json = JD2JSON()
    jd_json = jd2json.convert(scrape_res)
    if not jd_json:
        logger.error("Failed to convert job description to JSON")
        raise HTTPException(status_code=500, detail="Failed to convert job description to JSON")
    return JSONResponse(content=jd_json, status_code=200)


@router.post('/jd-from-text', tags=['Job Description'])
def get_jd_json(request: JDTextRequest):
    """
    Endpoint to convert a job description text to JSON format.
    Expects job description text as input.
    """
    from app.tools.jd_to_json import JD2JSON
    jd_text = request.jd_text.strip()
    if not jd_text:
        logger.error("Job description text is required")
        raise HTTPException(status_code=400, detail="Job description text is required")

    jd2json = JD2JSON()
    jd_json = jd2json.convert(jd_text)
    
    if not jd_json:
        logger.error("Failed to convert job description to JSON")
        raise HTTPException(status_code=500, detail="Failed to convert job description to JSON")
    
    return JSONResponse(content=jd_json, status_code=200)