from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import analytics_repo
from app.schemas.analytics import DistributionResponse, DistributionItemResponse

class DeviceAnalyticsService:
    async def get_device_distribution(self, db: AsyncSession) -> DistributionResponse:
        results = await analytics_repo.get_device_distribution(db)

        total = sum([count for platform, count in results])
        items = []

        for platform, count in results:
            percentage = round((count / total) * 100.0, 2) if total > 0 else 0.0
            items.append(DistributionItemResponse(
                category=platform or "Unknown",
                count=count,
                percentage=percentage
            ))

        return DistributionResponse(metric_name="Platform Distribution", distribution=items)

device_analytics_service = DeviceAnalyticsService()
