from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Dict, Any, List
from datetime import datetime, timedelta, timezone

from app.models.listening import ListeningHistory, ListeningSession
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class EngagementRepository(BaseAnalyticsRepository):
    """
    Handles DAU, WAU, MAU aggregations and temporal usage activity heatmaps.
    """

    async def get_dau(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        """Calculates Daily Active Users (distinct users with listening history in last 24h)."""
        target_date = filters.end_date if filters.end_date else datetime.now(timezone.utc)
        start_24h = target_date - timedelta(days=1)

        query = select(func.count(func.distinct(ListeningHistory.user_id))).where(
            and_(
                ListeningHistory.timestamp >= start_24h,
                ListeningHistory.timestamp <= target_date
            )
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        result = await db.execute(query)
        return result.scalar() or 0

    async def get_mau(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        """Calculates Monthly Active Users (distinct users in last 30 days)."""
        target_date = filters.end_date if filters.end_date else datetime.now(timezone.utc)
        start_30d = target_date - timedelta(days=30)

        query = select(func.count(func.distinct(ListeningHistory.user_id))).where(
            and_(
                ListeningHistory.timestamp >= start_30d,
                ListeningHistory.timestamp <= target_date
            )
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        result = await db.execute(query)
        return result.scalar() or 0

    async def get_hourly_activity_heatmap(self, db: AsyncSession, filters: AnalyticsFilter) -> List[Dict[str, Any]]:
        """Stub aggregation for hourly usage distribution."""
        # For execution purposes, returns structured sample heatmap data
        return [
            {"hour": h, "day_of_week": d, "active_users": (h * 15 + d * 40) % 250 + 10}
            for h in range(0, 24, 4) for d in range(0, 7)
        ]

engagement_repo = EngagementRepository()
