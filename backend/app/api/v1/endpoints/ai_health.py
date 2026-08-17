from fastapi import APIRouter
from app.monitoring import ai_health_service

router = APIRouter(tags=["AI Health"])

@router.get("/health")
async def get_ai_health():
    """Returns AI Platform operational health status (<20ms)."""
    return ai_health_service.get_health_status()

@router.get("/status")
async def get_ai_status():
    """Returns high-level status summary."""
    return ai_health_service.get_health_status()

@router.get("/heartbeat")
async def get_heartbeat():
    """Lightweight heartbeat check."""
    return ai_health_service.get_liveness()

@router.get("/readiness")
async def get_readiness():
    """Readiness probe for Kubernetes & deployment health checks."""
    return ai_health_service.get_readiness()

@router.get("/liveness")
async def get_liveness():
    """Liveness probe for process monitoring."""
    return ai_health_service.get_liveness()
