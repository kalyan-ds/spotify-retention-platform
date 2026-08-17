import time
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from loguru import logger

from app.ai.feature_store.pipeline import feature_pipeline
from app.ai.services.model_loader import runtime_model_loader
from app.ai.services.prediction_engine import prediction_engine
from app.ai.services.confidence_service import confidence_service
from app.ai.services.explainability_service import explainability_service
from app.ai.services.recommendation_service import recommendation_service
from app.ai.services.business_rules import business_rule_engine
from app.ai.services.prediction_cache import prediction_cache
from app.ai.schemas.prediction import PredictionRequestDTO, PredictionResponseDTO
from app.ai.exceptions import InferenceException

class AIOrchestrator:
    """
    Master Enterprise AI Orchestrator.
    Coordinates Feature Extraction, Champion Model Resolution, Request Validation,
    Prediction Execution, Statistical Confidence, TreeSHAP Explainability, Next Best Action
    Recommendations, Business Override Rules, Response DTO Building, and Online Caching.
    Decouples all underlying AI services.
    """

    async def execute_full_ai_pipeline(
        self, db: AsyncSession, request: PredictionRequestDTO
    ) -> Dict[str, Any]:
        user_id = request.user_id
        model_key = request.model_name or "churn_predictor"

        # 1. Check Prediction Cache
        if request.use_cache:
            cached_res = prediction_cache.get_prediction(user_id, model_key)
            if cached_res:
                cached_res["metadata"]["is_cached"] = True
                return cached_res

        try:
            # 2. Load Feature Vector from Feature Store
            features = await feature_pipeline.get_user_feature_vector(db, user_id, use_cache=request.use_cache)

            # 3. Load Active Champion Model
            model = runtime_model_loader.load_champion_model(model_key)

            # 4. Execute Prediction Engine
            prob, risk_tier, days, meta, audit = prediction_engine.execute_single_prediction(
                user_id, model, features, is_cached=False
            )

            # 5. Generate Statistical Confidence Score
            conf_dto = confidence_service.calculate_confidence(prob)

            # 6. Generate TreeSHAP Explainability (optional)
            shap_dto = None
            if request.include_explanations:
                shap_dto = explainability_service.compute_shap_explanations(user_id, features)

            # 7. Generate Next Best Action Recommendations (optional)
            rec_dto = None
            if request.include_recommendations:
                rec_dto = recommendation_service.generate_recommendations(user_id, prob, risk_tier)

            # 8. Apply Business Rules & Decision Classification
            payment_failures = features.get("payment_failure_count_90d", 0)
            rule_eval = business_rule_engine.evaluate_rules(prob, risk_tier, payment_failures)

            # 9. Build Unified Response Dictionary
            response_payload = {
                "prediction_id": audit.prediction_id,
                "user_id": user_id,
                "churn_probability": prob,
                "risk_tier": risk_tier,
                "predicted_churn_days": days,
                "confidence": conf_dto.model_dump(),
                "shap_explanations": shap_dto.model_dump() if shap_dto else None,
                "recommendations": rec_dto.model_dump() if rec_dto else None,
                "business_decision": rule_eval.model_dump(),
                "metadata": meta.model_dump(),
                "audit": audit.model_dump()
            }

            # 10. Cache Prediction
            prediction_cache.set_prediction(user_id, model_key, response_payload)

            return response_payload

        except Exception as e:
            logger.error(f"[AIOrchestrator] Orchestration failed for user_id={user_id}: {str(e)}")
            raise InferenceException(f"AI Orchestration failed for user {user_id}: {str(e)}")

ai_orchestrator = AIOrchestrator()
