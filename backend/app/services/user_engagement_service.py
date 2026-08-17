from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.schemas.analytics import (
    AnalyticsFilter,
    KPICollectionResponse,
    KPIResponse,
    TrendSeriesResponse,
    TrendPointResponse
)
from app.repositories.user_engagement_repository import user_engagement_repo
from app.services.kpi_engine import kpi_engine

class UserEngagementService:

    async def get_engagement_kpis(self, db: AsyncSession, filters: AnalyticsFilter) -> KPICollectionResponse:
        active_users = await user_engagement_repo.get_active_users(db, filters)
        avg_session_duration_ms = await user_engagement_repo.get_average_session_duration(db, filters)

        # Convert ms to minutes for UI
        avg_session_minutes = avg_session_duration_ms / (1000 * 60) if avg_session_duration_ms else 0.0

        metrics = [
            KPIResponse(
                name="Active Users",
                value=active_users,
                delta_percentage=0.0,
                trend_direction="flat"
            ),
            KPIResponse(
                name="Avg Session Duration (min)",
                value=round(avg_session_minutes, 2),
                delta_percentage=0.0,
                trend_direction="flat"
            )
        ]

        return KPICollectionResponse(metrics=metrics)

    async def get_user_growth_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> TrendSeriesResponse:
        records = await user_engagement_repo.get_user_growth_trend(db, filters)

        data_points = []
        for record in records:
            data_points.append(TrendPointResponse(
                date=record.day,
                value=record.active_users
            ))

        return TrendSeriesResponse(
            metric_name="User Growth Trend",
            data_points=data_points
        )

user_engagement_service = UserEngagementService()
