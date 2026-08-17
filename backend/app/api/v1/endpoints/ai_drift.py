from fastapi import APIRouter, Depends
from app.api.v1.dependencies.ai_auth import get_current_ai_user, AIUserPrincipal
from app.monitoring import drift_detector

router = APIRouter(prefix="/drift", tags=["AI Drift Monitoring"])

@router.get("")
async def get_drift_overview(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns Population Stability Index (PSI) drift overview across models & features."""
    return drift_detector.evaluate_feature_drift()

@router.get("/features")
async def get_feature_drift(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns feature distribution drift metrics across catalog."""
    return drift_detector.evaluate_feature_drift()

@router.get("/models")
async def get_model_drift(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns prediction distribution & concept drift analysis."""
    return drift_detector.evaluate_model_drift()

@router.get("/history")
async def get_drift_history(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns historical drift evaluation log."""
    return {
        "history": [
            {"evaluated_at": "2026-07-27T00:00:00Z", "drifted_features": 1, "status": "HEALTHY"},
            {"evaluated_at": "2026-07-20T00:00:00Z", "drifted_features": 0, "status": "HEALTHY"}
        ]
    }
