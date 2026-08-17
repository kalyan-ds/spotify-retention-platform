from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.ml import Prediction, ModelVersion, Recommendation, FeatureSnapshot

class PredictionRepository(BaseRepository[Prediction, dict, dict]):
    def __init__(self):
        super().__init__(Prediction)

    async def get_latest_for_user(self, db: AsyncSession, user_id: int) -> Optional[Prediction]:
        query = (
            select(Prediction)
            .where(Prediction.user_id == user_id)
            .order_by(Prediction.prediction_timestamp.desc())
            .limit(1)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

class ModelVersionRepository(BaseRepository[ModelVersion, dict, dict]):
    def __init__(self):
        super().__init__(ModelVersion)

    async def get_active_model(self, db: AsyncSession, model_type: str) -> Optional[ModelVersion]:
        query = (
            select(ModelVersion)
            .where(ModelVersion.model_type == model_type, ModelVersion.is_active == True)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

class RecommendationRepository(BaseRepository[Recommendation, dict, dict]):
    def __init__(self):
        super().__init__(Recommendation)

class FeatureSnapshotRepository(BaseRepository[FeatureSnapshot, dict, dict]):
    def __init__(self):
        super().__init__(FeatureSnapshot)

prediction_repo = PredictionRepository()
model_version_repo = ModelVersionRepository()
recommendation_repo = RecommendationRepository()
feature_snapshot_repo = FeatureSnapshotRepository()
