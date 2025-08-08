from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/health", tags=["Health Check"])
def health_check():
    """
    Health check endpoint to verify the API is running.
    Returns a simple JSON response indicating the service is up.
    """
    return JSONResponse(content={"status": "ok", "message": "API is running"}, status_code=200)