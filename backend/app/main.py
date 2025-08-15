from loguru import logger
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import all your routers
from app.api import health
from app.api.v1 import job_description, linkedin, resume, email
from app.api.v2 import email as email_v2

def create_app():
    app = FastAPI(title="Dynamic Email Generator API")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # --- Include all API routers ---
    # Health Check
    app.include_router(health.router, prefix="/api")

    # Core Email Generation
    app.include_router(email.router, prefix="/api/v1")

    # Individual Tool Endpoints (can be useful for testing)
    app.include_router(job_description.router, prefix="/api/v1")
    app.include_router(linkedin.router, prefix="/api/v1")
    app.include_router(resume.router, prefix="/api/v1")
    app.include_router(email_v2.router, prefix="/api/v2")
    
    logger.info("Application setup complete. All routers included.")
    return app

if __name__ == '__main__':
    logger.info("Starting Email Generator API")
    app = create_app()
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")