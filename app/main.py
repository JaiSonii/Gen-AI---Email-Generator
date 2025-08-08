from loguru import logger
import uvicorn
from app.api import health

def create_app():
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    app = FastAPI(title="Email Generator API")

    app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ])
    # Include routers here
    app.include_router(health.router, prefix="/api", tags=["Health Check"])

    return app
    

if __name__ == '__main__':
    logger.info("Starting Email Generator API")
    app = create_app()
    uvicorn.run(app, host="127.0.0.1", port=5000, log_level="info")