"""
Main FastAPI Application Entry Point
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
import time
import logging

from .config import settings
from .database import init_db
from .middleware.audit_middleware import AuditMiddleware

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Audit Middleware
app.add_middleware(AuditMiddleware)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all requests"""
    start_time = time.time()
    
    # Log request
    logger.info(f"Request: {request.method} {request.url.path}")
    
    # Process request
    response = await call_next(request)
    
    # Log response time
    process_time = time.time() - start_time
    logger.info(f"Response: {response.status_code} - Time: {process_time:.2f}s")
    
    return response


# Health check endpoint
@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "https": settings.USE_SSL
    }


# Root endpoint
@app.get("/api/")
async def root():
    """Root API endpoint"""
    return {
        "message": "Welcome to Secure Job Search Platform API",
        "version": settings.APP_VERSION,
        "docs": "/api/docs"
    }


# Exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error",
            "message": str(exc) if settings.DEBUG else "An error occurred"
        }
    )


# Startup event
@app.on_event("startup")
async def startup_event():
    """Execute on application startup"""
    logger.info(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    
    # Initialize database
    try:
        init_db()
        logger.info("Database initialized")
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
    
    logger.info(f"HTTPS enabled: {settings.USE_SSL}")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """Execute on application shutdown"""
    logger.info("Shutting down application")


# Import and include routers
from .api import auth, users, admin, companies, jobs, applications, messages, audit, profile

app.include_router(auth.router)
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])

# March Milestone 3 routers
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(messages.router, prefix="/api/messages", tags=["Messages"])
app.include_router(audit.router, prefix="/api/audit", tags=["Audit"])
app.include_router(profile.router, prefix="/api/profile", tags=["Profile"])


if __name__ == "__main__":
    import uvicorn
    
    # Run with HTTPS if enabled
    if settings.USE_SSL:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            ssl_keyfile=settings.SSL_KEY_PATH,
            ssl_certfile=settings.SSL_CERT_PATH,
            reload=settings.DEBUG
        )
    else:
        uvicorn.run(
            "app.main:app",
            host="0.0.0.0",
            port=8000,
            reload=settings.DEBUG
        )
