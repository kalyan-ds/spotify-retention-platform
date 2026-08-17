from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.api.v1.dependencies.ai_auth import get_current_ai_user, require_ai_role, AIUserPrincipal
from app.ai.schemas import PredictionRequestDTO, PredictionResponseDTO, BatchPredictionRequest
from app.ai.services import ai_orchestrator, batch_inference_engine
from app.monitoring import ai_health_service

router = APIRouter(prefix="/predict", tags=["AI Predictions"])

@router.post("/churn")
async def predict_churn(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Executes real-time 30-day Premium Churn Prediction via AIOrchestrator.
    Computes churn probability, risk tier, statistical confidence, TreeSHAP attributions,
    Next Best Action recommendations, and business override rules.
    """
    body.model_name = "churn_predictor"
    res = await ai_orchestrator.execute_full_ai_pipeline(db, body)
    ai_health_service.record_prediction(success=True)
    return res

@router.post("/engagement")
async def predict_engagement(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Predicts continuous 0-100 engagement score and activity/volume/feature sub-scores.
    """
    body.model_name = "engagement_regressor"
    res = await ai_orchestrator.execute_full_ai_pipeline(db, body)
    ai_health_service.record_prediction(success=True)
    return res

@router.post("/upgrade")
async def predict_upgrade(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Predicts plan upgrade propensity (Individual -> Duo / Family).
    """
    body.model_name = "upgrade_propensity"
    res = await ai_orchestrator.execute_full_ai_pipeline(db, body)
    ai_health_service.record_prediction(success=True)
    return res

@router.post("/persona")
async def predict_persona(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Classifies user behavior into behavioral personas (Power, Heavy, Regular, Casual, Dormant).
    """
    body.model_name = "persona_classifier"
    res = await ai_orchestrator.execute_full_ai_pipeline(db, body)
    ai_health_service.record_prediction(success=True)
    return res

@router.post("/batch")
async def predict_batch(
    body: BatchPredictionRequest,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(require_ai_role(["Admin", "Analyst"]))
):
    """
    Executes high-throughput batch scoring across a cohort of user IDs.
    """
    return await batch_inference_engine.run_batch_inference(db, body.user_ids)
