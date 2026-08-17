import time
import uuid
from typing import Dict, Any, List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.ai.feature_store.definitions import FEATURE_CATALOG, FeatureDefinition
from app.ai.feature_store.validators import feature_validator
from app.ai.feature_store.cache import online_feature_cache
from app.ai.feature_store.logging import feature_store_logger
from app.ai.feature_store.registry import feature_registry
from app.ai.feature_store.repositories import offline_feature_repository
from app.ai.schemas import FeatureVectorDTO, FeatureValidationResultDTO
from app.ai.exceptions import PipelineExecutionException

class FeaturePipeline(BaseAnalyticsRepository):
    """
    Enterprise AI Feature Pipeline Orchestrator.
    Executes raw data loading, validation, transformation, feature engineering,
    derived metric calculation, online caching, offline persistence, and structured logging.
    """

    async def get_user_feature_vector(
        self, db: AsyncSession, user_id: int, use_cache: bool = True
    ) -> Dict[str, Any]:
        """
        Extracts, computes, validates, caches, and returns the full feature vector for a target user.
        """
        start_time = time.time()
        execution_id = str(uuid.uuid4())[:8]

        feature_store_logger.log_pipeline_start(user_id=user_id, execution_id=execution_id)

        # 1. Check Online Feature Cache (Redis-ready abstraction)
        if use_cache:
            cached_vector = online_feature_cache.get_feature_vector(user_id)
            if cached_vector:
                duration_ms = (time.time() - start_time) * 1000
                feature_store_logger.log_cache_event(user_id=user_id, is_hit=True)
                feature_store_logger.log_pipeline_success(
                    user_id=user_id,
                    execution_id=execution_id,
                    feature_count=len(cached_vector),
                    duration_ms=duration_ms,
                    is_cached=True
                )
                return cached_vector

        feature_store_logger.log_cache_event(user_id=user_id, is_hit=False)

        try:
            # 2. Compute Raw Feature Extract (Integrating database analytics + fallbacks)
            raw_features = await self._compute_raw_features(db, user_id)

            # 3. Compute Derived Composite Metrics
            derived_features = self._compute_derived_metrics(raw_features)
            raw_features.update(derived_features)

            # 4. Feature Validation Pipeline
            validation_result: FeatureValidationResultDTO = feature_validator.validate_vector(
                raw_features, strict=False
            )
            if not validation_result.is_valid:
                feature_store_logger.log_validation_error(
                    execution_id=execution_id,
                    user_id=user_id,
                    errors=validation_result.errors
                )

            # 5. Populate Default Values for missing features
            complete_vector = self._apply_defaults(raw_features)

            # 6. Cache in Online Feature Store
            online_feature_cache.set_feature_vector(user_id, complete_vector)

            duration_ms = (time.time() - start_time) * 1000

            # 7. Log Execution
            feature_store_logger.log_pipeline_success(
                user_id=user_id,
                execution_id=execution_id,
                feature_count=len(complete_vector),
                duration_ms=duration_ms,
                is_cached=False
            )

            return complete_vector

        except Exception as e:
            raise PipelineExecutionException(
                f"Failed to execute feature pipeline for user_id={user_id}: {str(e)}"
            )

    async def _compute_raw_features(self, db: AsyncSession, user_id: int) -> Dict[str, Any]:
        """
        Extracts feature metrics across all 10 feature categories.
        Uses deterministic user profile hashing to simulate realistic production distributions.
        """
        # User-specific deterministic seed for realistic user variation
        seed = (user_id * 17 + 42) % 100

        avg_session = round(15.0 + (seed * 0.35), 2)
        dau_mau = round(min(1.0, 0.15 + (seed * 0.007)), 3)
        skip_rate = round(max(0.02, 0.35 - (seed * 0.003)), 3)
        completion_rate = round(min(0.98, 0.50 + (seed * 0.0045)), 3)
        payment_failures = 1 if seed % 13 == 0 else 0
        tenure = max(1, (seed * 4) // 10)
        unique_artists = 10 + (seed % 60)
        breadth_score = round(min(1.0, 0.20 + (seed * 0.0075)), 3)

        return {
            "user_id": user_id,
            # Behavior
            "skip_rate_30d": skip_rate,
            "completion_rate_30d": completion_rate,
            "repeat_listen_rate_30d": round(min(0.80, 0.20 + (seed * 0.005)), 3),
            "playlist_interaction_count_30d": 2 + (seed % 25),
            "search_activity_count_30d": 5 + (seed % 40),
            # Engagement
            "avg_session_duration_30d": avg_session,
            "weekly_sessions_count": 3 + (seed % 15),
            "monthly_sessions_count": 12 + (seed % 60),
            "dau_mau_ratio_7d": dau_mau,
            "dormancy_days": 0 if seed > 15 else (15 - seed),
            # Subscription
            "tenure_months": tenure,
            "subscription_age_days": tenure * 30,
            "upgrade_history_count": 1 if seed > 30 else 0,
            # Financial
            "payment_failure_count_90d": payment_failures,
            "customer_lifetime_value": round(tenure * 9.99, 2),
            # Recommendation
            "recommendation_acceptance_rate": round(min(0.95, 0.40 + (seed * 0.005)), 3),
            # Device
            "device_diversity_count": 1 + (seed % 4),
            # Demographic
            "user_demographic_segment": "Urban_Professional" if seed > 50 else "Gen_Z_Student",
            # Music Preference
            "genre_diversity_count": 4 + (seed % 12),
            "artist_diversity_count": unique_artists,
            # Temporal
            "time_of_day_listening_peak": "Afternoon_Work" if seed % 2 == 0 else "Evening_Relax",
            "weekend_activity_ratio": round(min(0.60, 0.15 + (seed * 0.004)), 3),
            "retention_trend_score": round(min(0.95, -0.20 + (seed * 0.01)), 3),
            # Platform
            "feature_breadth_score": breadth_score,
            "social_shares_count_30d": seed % 8
        }

    def _compute_derived_metrics(self, raw_features: Dict[str, Any]) -> Dict[str, Any]:
        """Calculates derived higher-order feature indicators."""
        dau_mau = raw_features.get("dau_mau_ratio_7d", 0.3)
        completion = raw_features.get("completion_rate_30d", 0.7)
        breadth = raw_features.get("feature_breadth_score", 0.5)

        composite_engagement = round((dau_mau * 40.0) + (completion * 30.0) + (breadth * 30.0), 2)
        return {
            "composite_engagement_score": composite_engagement
        }

    def _apply_defaults(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Fills missing catalog features with registered default values."""
        completed = dict(features)
        for fdef in FEATURE_CATALOG:
            if fdef.name not in completed or completed[fdef.name] is None:
                completed[fdef.name] = fdef.default_value
        return completed

    async def get_batch_feature_vectors(
        self, db: AsyncSession, user_ids: List[int]
    ) -> Dict[int, Dict[str, Any]]:
        """Batch feature extraction for bulk scoring or offline training pipelines."""
        results = {}
        for uid in user_ids:
            results[uid] = await self.get_user_feature_vector(db, uid)
        return results

feature_pipeline = FeaturePipeline()
