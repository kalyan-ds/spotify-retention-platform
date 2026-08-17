from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Dict, Any

from app.models.listening import ListeningSession, ListeningHistory, Device
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class SessionRepository(BaseAnalyticsRepository):
    """
    Handles session counts, average durations, and device/platform breakdowns.
    """

    async def get_session_stats(self, db: AsyncSession, filters: AnalyticsFilter) -> Dict[str, Any]:
        """Calculates total sessions and average duration."""
        query = select(
            func.count(ListeningSession.id).label("total_sessions"),
            func.coalesce(func.avg(ListeningSession.duration_ms), 0).label("avg_duration_ms"),
            func.coalesce(func.max(ListeningSession.duration_ms), 0).label("max_duration_ms")
        )
        query = self.apply_filters(query, ListeningSession, filters, date_column_name="start_time")
        result = await db.execute(query)
        row = result.one()

        avg_ms = float(row.avg_duration_ms or 0)
        max_ms = float(row.max_duration_ms or 0)

        return {
            "total_sessions": row.total_sessions or 0,
            "avg_duration_minutes": round(avg_ms / 60000.0, 2),
            "longest_session_minutes": round(max_ms / 60000.0, 2)
        }

    async def get_device_breakdown(self, db: AsyncSession, filters: AnalyticsFilter) -> Dict[str, int]:
        """Groups session count by device_type using ListeningHistory and Device join."""
        query = select(
            func.coalesce(Device.device_type, "Unknown").label("device"),
            func.count(func.distinct(ListeningSession.id)).label("total_count")
        ).join(
            ListeningHistory, ListeningHistory.session_id == ListeningSession.id
        ).join(
            Device, ListeningHistory.device_id == Device.id
        )
        query = self.apply_filters(query, ListeningSession, filters, date_column_name="start_time")
        query = query.group_by(Device.device_type)
        result = await db.execute(query)
        return {str(r.device): int(r.total_count) for r in result.all()}

session_repo = SessionRepository()
