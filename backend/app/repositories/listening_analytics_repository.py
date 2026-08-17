from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, desc
from datetime import datetime, timedelta

from app.models.listening import ListeningHistory, ListeningSession
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class ListeningAnalyticsRepository(BaseAnalyticsRepository):

    async def get_listening_hours(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        query = select(func.sum(ListeningHistory.play_duration_ms))
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        result = await db.execute(query)
        total_ms = result.scalar() or 0
        return total_ms // (1000 * 60 * 60) # Return hours

    async def get_completion_rate(self, db: AsyncSession, filters: AnalyticsFilter) -> float:
        query = select(func.avg(ListeningHistory.completion_percentage))
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        result = await db.execute(query)
        return float(result.scalar() or 0.0)

    async def get_skip_rate(self, db: AsyncSession, filters: AnalyticsFilter) -> float:
        total_query = select(func.count(ListeningHistory.id))
        skipped_query = select(func.count(ListeningHistory.id)).where(ListeningHistory.skipped == True)

        total_query = self.apply_filters(total_query, ListeningHistory, filters, date_column_name="timestamp")
        skipped_query = self.apply_filters(skipped_query, ListeningHistory, filters, date_column_name="timestamp")

        total = (await db.execute(total_query)).scalar() or 0
        if total == 0:
            return 0.0

        skipped = (await db.execute(skipped_query)).scalar() or 0
        return float((skipped / total) * 100.0)

    async def get_daily_listening_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        from sqlalchemy import cast, Date

        query = select(
            cast(ListeningHistory.timestamp, Date).label("day"),
            func.sum(ListeningHistory.play_duration_ms).label("total_ms")
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        query = query.group_by(cast(ListeningHistory.timestamp, Date)).order_by(cast(ListeningHistory.timestamp, Date))

        result = await db.execute(query)
        return result.all()

listening_analytics_repo = ListeningAnalyticsRepository()
