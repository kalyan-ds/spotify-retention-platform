from fastapi import APIRouter, Depends
from app.api.v1.dependencies.ai_auth import get_current_ai_user, AIUserPrincipal
from app.monitoring import ai_metrics_service

router = APIRouter(prefix="/metrics", tags=["AI Metrics"])

@router.get("")
async def get_metrics(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Retrieves operational telemetry summary and latency distributions."""
    return ai_metrics_service.get_metrics_summary()
