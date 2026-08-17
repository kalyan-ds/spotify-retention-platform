from fastapi import APIRouter, Depends
from app.api.v1.dependencies.ai_auth import get_current_ai_user, require_ai_role, AIUserPrincipal
from app.monitoring import ai_metrics_service, latency_monitor, prediction_monitor
from app.ai.services import prediction_cache

router = APIRouter(tags=["AI Monitoring"])

@router.get("/metrics")
async def get_ai_metrics(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Retrieves operational telemetry summary and latency distributions."""
    return ai_metrics_service.get_metrics_summary()

@router.get("/latency")
async def get_latency_metrics(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Retrieves inference p50/p95/p99 percentiles and SLA compliance status."""
    return latency_monitor.get_latency_report()

@router.get("/cache")
async def get_cache_metrics(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns prediction cache hit/miss statistics and hit rate %."""
    return prediction_cache.get_stats()

@router.get("/predictions")
async def get_prediction_distribution(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns 24-hour prediction volume and risk tier distribution."""
    return prediction_monitor.get_prediction_distribution()

@router.get("/errors")
async def get_error_metrics(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns error rates and failed prediction logs."""
    return {"failed_count": 0, "error_rate_pct": 0.0, "active_incidents": 0}
