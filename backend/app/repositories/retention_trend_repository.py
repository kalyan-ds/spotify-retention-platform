from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, text
from typing import List, Dict, Any

from app.models.auth import User
from app.models.listening import ListeningHistory
from app.models.subscription import Subscription
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class RetentionTrendRepository(BaseAnalyticsRepository):
    """
    Handles simple time-series aggregations for retention line charts.
    """

    async def get_daily_retention_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        """
        Gets the active vs churned user counts grouped by day.
        """
        from sqlalchemy import cast, Date

        # Example query fetching active listeners per day
        # (A proxy for daily retained users in this stub)
        query = select(
            cast(ListeningHistory.timestamp, Date).label("day"),
            func.count(func.distinct(ListeningHistory.user_id)).label("retained_users")
        )

        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")
        query = query.group_by(cast(ListeningHistory.timestamp, Date)).order_by(cast(ListeningHistory.timestamp, Date))

        result = await db.execute(query)
        return result.all()

retention_trend_repo = RetentionTrendRepository()
