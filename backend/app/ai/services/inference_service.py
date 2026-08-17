from typing import Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.schemas import ChurnPredictionResponse, EngagementScoreResponse, SHAPAttribution
from app.ai.schemas.prediction import PredictionRequestDTO
from app.ai.services.orchestrator import ai_orchestrator
from app.ai.feature_store.pipeline import feature_pipeline
from app.ai.models.churn_model import churn_model
from app.ai.models.engagement_model import engagement_model
from app.ai.models.persona_model import persona_model

class InferenceService:
    """
    High-level Inference Service delegating to AIOrchestrator for end-to-end predictions.
    """

    async def predict_churn(self, db: AsyncSession, user_id: int) -> ChurnPredictionResponse:
        req = PredictionRequestDTO(user_id=user_id, model_name="churn_predictor")
        result = await ai_orchestrator.execute_full_ai_pipeline(db, req)

        # Map to backward-compatible ChurnPredictionResponse DTO
        attributions = []
        if result.get("shap_explanations") and result["shap_explanations"].get("attributions"):
            for attr in result["shap_explanations"]["attributions"]:
                attributions.append(
                    SHAPAttribution(
                        feature_name=attr["feature_name"],
                        shap_value=attr["shap_value"],
                        feature_value=attr["feature_value"],
                        business_explanation=attr["business_explanation"]
                    )
                )

        return ChurnPredictionResponse(
            user_id=user_id,
            churn_probability=result["churn_probability"],
            risk_tier=result["risk_tier"],
            predicted_churn_days=result["predicted_churn_days"],
            shap_attributions=attributions,
            model_version=result["metadata"]["model_version"]
        )

    async def predict_engagement(self, db: AsyncSession, user_id: int) -> EngagementScoreResponse:
        features = await feature_pipeline.get_user_feature_vector(db, user_id)
        score, act, vol, feat = engagement_model.predict_score(features)
        persona = persona_model.predict_persona(features)

        return EngagementScoreResponse(
            user_id=user_id,
            engagement_score=score,
            predicted_persona=persona,
            activity_subscore=act,
            volume_subscore=vol,
            feature_subscore=feat,
            model_version=engagement_model.version
        )

inference_service = InferenceService()
