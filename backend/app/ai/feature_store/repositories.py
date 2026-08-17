from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from app.models.ml import FeatureSnapshot, Prediction
from app.repositories.base import BaseRepository
from app.ai.exceptions import PipelineExecutionException

class OfflineFeatureRepository:
    """
    Offline Feature Store repository providing persistence, historical snapshot retrieval,
    time travel support, and training dataset extraction.
    """

    async def save_snapshot(
        self, db: AsyncSession, prediction_id: int, features: Dict[str, Any]
    ) -> FeatureSnapshot:
        try:
            snapshot = FeatureSnapshot(
                prediction_id=prediction_id,
                features=features
            )
            db.add(snapshot)
            await db.commit()
            await db.refresh(snapshot)
            return snapshot
        except Exception as e:
            await db.rollback()
            raise PipelineExecutionException(f"Failed to persist offline feature snapshot: {str(e)}")

    async def get_snapshot(
        self, db: AsyncSession, prediction_id: int
    ) -> Optional[Dict[str, Any]]:
        query = select(FeatureSnapshot).where(FeatureSnapshot.prediction_id == prediction_id)
        result = await db.execute(query)
        snapshot = result.scalar_one_or_none()
        return snapshot.features if snapshot else None

    async def get_user_feature_history(
        self, db: AsyncSession, user_id: int, limit: int = 10
    ) -> List[Dict[str, Any]]:
        query = (
            select(FeatureSnapshot)
            .join(Prediction, FeatureSnapshot.prediction_id == Prediction.id)
            .where(Prediction.user_id == user_id)
            .order_by(desc(Prediction.prediction_timestamp))
            .limit(limit)
        )
        result = await db.execute(query)
        snapshots = result.scalars().all()
        return [s.features for s in snapshots]

    async def generate_training_dataset(
        self, db: AsyncSession, limit: int = 1000
    ) -> List[Dict[str, Any]]:
        """
        Extracts historical feature vectors and ground-truth target labels for ML model training.
        """
        query = (
            select(Prediction, FeatureSnapshot)
            .join(FeatureSnapshot, Prediction.id == FeatureSnapshot.prediction_id)
            .order_by(desc(Prediction.prediction_timestamp))
            .limit(limit)
        )
        result = await db.execute(query)
        records = result.all()

        dataset = []
        for pred, snap in records:
            row = dict(snap.features)
            row["target_churn"] = 1 if pred.churn_probability >= 0.5 else 0
            row["prediction_id"] = pred.id
            row["user_id"] = pred.user_id
            dataset.append(row)

        return dataset

offline_feature_repository = OfflineFeatureRepository()
