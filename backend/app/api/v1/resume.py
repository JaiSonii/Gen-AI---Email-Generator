from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from loguru import logger
from app.tools.resume_parser import ResumeParser

router = APIRouter()

@router.post('/resume', tags=['Resume'])
async def process_resume(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        if not file.content_type or not file.content_type.startswith('application/pdf'):
            logger.error("Invalid file type. Only PDF files are allowed.")
            raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")
        temp_path = f"/tmp/{file.filename}"
        with open(temp_path, "wb") as f:
            f.write(contents)
        parser = ResumeParser()
        resume_text = parser.parse(temp_path)
        print(resume_text)
        return JSONResponse(content={"resume_text": resume_text})
    except Exception as e:
        logger.error(f"Error parsing resume: {e}")
        raise HTTPException(status_code=500, detail="Failed to parse resume")