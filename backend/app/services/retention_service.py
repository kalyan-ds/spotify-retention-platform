from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.analytics import AnalyticsFilter, TrendSeriesResponse, TrendPointResponse
from app.repositories.retention_trend_repository import retention_trend_repo

class RetentionService:
    """
    Central aggregation service for top-level retention metrics and trend lines.
    """

    async def get_retention_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> TrendSeriesResponse:
        """
        Retrieves active/retained user trend over time.
        """
        trend_data = await retention_trend_repo.get_daily_retention_trend(db, filters)

        points = []
        for row in trend_data:
            points.append(TrendPointResponse(
                date=row.day,
                value=row.retained_users
            ))

        return TrendSeriesResponse(
            metric_name="Retained Users",
            data_points=points
        )

retention_service = RetentionService()
