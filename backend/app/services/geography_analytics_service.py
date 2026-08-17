from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import analytics_repo
from app.schemas.analytics import DistributionResponse, DistributionItemResponse

class GeographyAnalyticsService:
    async def get_geographic_distribution(self, db: AsyncSession) -> DistributionResponse:
        results = await analytics_repo.get_geographic_distribution(db)

        total = sum([count for country, count in results])
        items = []

        for country, count in results:
            percentage = round((count / total) * 100.0, 2) if total > 0 else 0.0
            items.append(DistributionItemResponse(
                category=country or "Unknown",
                count=count,
                percentage=percentage
            ))

        return DistributionResponse(metric_name="Country Distribution", distribution=items)

geography_analytics_service = GeographyAnalyticsService()
