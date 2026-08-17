from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import FeatureAdoptionResponse, FeatureAdoptionMetric
from app.schemas.analytics import AnalyticsFilter
from app.repositories.feature_adoption_repository import feature_adoption_repo

class FeatureAdoptionService:
    """
    Business logic for product feature adoption metrics.
    """

    async def get_feature_adoption(self, db: AsyncSession, filters: AnalyticsFilter) -> FeatureAdoptionResponse:
        raw_features = await feature_adoption_repo.get_feature_adoption_rates(db, filters)
        metrics = [FeatureAdoptionMetric(**f) for f in raw_features]
        return FeatureAdoptionResponse(features=metrics)

feature_adoption_service = FeatureAdoptionService()
