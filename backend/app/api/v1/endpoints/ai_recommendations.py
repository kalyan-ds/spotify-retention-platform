from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.dependencies.database import get_db
from app.api.v1.dependencies.ai_auth import get_current_ai_user, AIUserPrincipal
from app.ai.schemas import PredictionRequestDTO
from app.ai.services import recommendation_service, inference_service

router = APIRouter(tags=["AI Recommendations"])

@router.post("/recommendations")
async def get_recommendations(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Generates prescriptive retention and re-engagement recommendations.
    """
    churn_res = await inference_service.predict_churn(db, body.user_id)
    rec = recommendation_service.generate_recommendations(
        user_id=body.user_id,
        churn_prob=churn_res.churn_probability,
        risk_tier=churn_res.risk_tier
    )
    return rec.model_dump()

@router.post("/next-best-action")
async def get_next_best_action(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Retrieves top priority Next Best Action (NBA) intervention for target user.
    """
    churn_res = await inference_service.predict_churn(db, body.user_id)
    rec = recommendation_service.generate_recommendations(
        user_id=body.user_id,
        churn_prob=churn_res.churn_probability,
        risk_tier=churn_res.risk_tier
    )
    return rec.primary_action.model_dump()
