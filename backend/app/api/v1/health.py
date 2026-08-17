from fastapi import APIRouter
from app.schemas.responses import StandardResponse
from app.core.config import settings

router = APIRouter()

@router.get("/health", response_model=StandardResponse[dict])
async def health_check():
    """Basic health check endpoint"""
    return StandardResponse(data={"status": "healthy"})

@router.get("/ready", response_model=StandardResponse[dict])
async def readiness_check():
    """Readiness probe endpoint"""
    return StandardResponse(data={"ready": True})

@router.get("/live", response_model=StandardResponse[dict])
async def liveness_check():
    """Liveness probe endpoint"""
    return StandardResponse(data={"alive": True})

@router.get("/version", response_model=StandardResponse[dict])
async def version_check():
    """Version info endpoint"""
    return StandardResponse(data={"version": settings.VERSION})
