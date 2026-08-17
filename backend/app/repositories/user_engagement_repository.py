from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, distinct
from app.models.listening import ListeningHistory, ListeningSession
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class UserEngagementRepository(BaseAnalyticsRepository):

    async def get_active_users(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        """Calculates active users (DAU/WAU/MAU depending on filters.start_date) based on listening history."""
        query = select(func.count(distinct(ListeningHistory.user_id)))
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        result = await db.execute(query)
        return result.scalar() or 0

    async def get_average_session_duration(self, db: AsyncSession, filters: AnalyticsFilter) -> float:
        """Calculates average session duration in milliseconds."""
        query = select(func.avg(ListeningSession.duration_ms))
        query = self.apply_filters(query, ListeningSession, filters, date_column_name="start_time")

        result = await db.execute(query)
        return float(result.scalar() or 0.0)

    async def get_user_growth_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        """Returns time-series active users aggregated by day."""
        from sqlalchemy import cast, Date

        query = (
            select(
                cast(ListeningHistory.timestamp, Date).label("day"),
                func.count(distinct(ListeningHistory.user_id)).label("active_users")
            )
        )
        query = self.apply_filters(query, ListeningHistory, filters, date_column_name="timestamp")

        query = query.group_by(cast(ListeningHistory.timestamp, Date)).order_by(cast(ListeningHistory.timestamp, Date))

        result = await db.execute(query)
        return result.all()

user_engagement_repo = UserEngagementRepository()
