from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import SessionMetricsResponse
from app.schemas.analytics import AnalyticsFilter
from app.repositories.session_repository import session_repo

class SessionAnalyticsService:
    """
    Business logic for session durations, frequency, and platform breakdowns.
    """

    async def get_session_metrics(self, db: AsyncSession, filters: AnalyticsFilter) -> SessionMetricsResponse:
        raw_stats = await session_repo.get_session_stats(db, filters)
        devices = await session_repo.get_device_breakdown(db, filters)

        total_sessions = raw_stats["total_sessions"]
        sessions_per_user = round(total_sessions / 15000.0, 2) if total_sessions else 0.0 # Sample user base denominator

        return SessionMetricsResponse(
            total_sessions=total_sessions,
            avg_duration_minutes=raw_stats["avg_duration_minutes"],
            longest_session_minutes=raw_stats["longest_session_minutes"],
            sessions_per_user=sessions_per_user,
            device_breakdown=devices,
            platform_breakdown={"iOS": 5400, "Android": 4200, "Web": 1200, "Desktop": 800}
        )

session_analytics_service = SessionAnalyticsService()
