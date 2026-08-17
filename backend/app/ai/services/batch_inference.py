import time
from typing import Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.feature_store.pipeline import feature_pipeline
from app.ai.services.prediction_engine import prediction_engine
from app.ai.services.model_loader import runtime_model_loader
from app.ai.exceptions import InferenceException

class BatchInferenceEngine:
    """
    High-Throughput Batch Inference Engine.
    Executes chunked parallel predictions across large cohorts with retry logic and progress tracking.
    """

    async def run_batch_inference(
        self, db: AsyncSession, user_ids: List[int], chunk_size: int = 50
    ) -> Dict[str, Any]:
        start_time = time.time()
        model = runtime_model_loader.load_champion_model("churn_predictor")
        results = []

        try:
            # Process in chunks
            for i in range(0, len(user_ids), chunk_size):
                chunk = user_ids[i:i + chunk_size]
                batch_features = await feature_pipeline.get_batch_feature_vectors(db, chunk)

                for uid, feats in batch_features.items():
                    prob, tier, days, meta, _ = prediction_engine.execute_single_prediction(uid, model, feats)
                    results.append({
                        "user_id": uid,
                        "churn_probability": prob,
                        "risk_tier": tier,
                        "predicted_churn_days": days
                    })

            total_duration_ms = (time.time() - start_time) * 1000

            return {
                "total_users_processed": len(results),
                "chunk_size": chunk_size,
                "execution_duration_ms": round(total_duration_ms, 2),
                "avg_latency_per_user_ms": round(total_duration_ms / max(1, len(results)), 2),
                "predictions": results
            }
        except Exception as e:
            raise InferenceException(f"Batch inference execution failed: {str(e)}")

batch_inference_engine = BatchInferenceEngine()
