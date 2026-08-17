from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, date
from app.repositories.listening_analytics_repository import listening_analytics_repo
from app.schemas.analytics import KPICollectionResponse, KPIResponse, TrendSeriesResponse, TrendPointResponse

class ListeningAnalyticsService:
    async def get_listening_metrics(self, db: AsyncSession, start_date: datetime, end_date: datetime) -> KPICollectionResponse:
        hours = await listening_analytics_repo.get_listening_hours(db, start_date, end_date)
        completion_rate = await listening_analytics_repo.get_completion_rate(db, start_date, end_date)
        skip_rate = await listening_analytics_repo.get_skip_rate(db, start_date, end_date)

        metrics = [
            KPIResponse(name="Listening Hours", value=hours),
            KPIResponse(name="Completion Rate", value=round(completion_rate, 2)),
            KPIResponse(name="Skip Rate", value=round(skip_rate, 2))
        ]

        return KPICollectionResponse(metrics=metrics)

    async def get_listening_trends(self, db: AsyncSession, start_date: datetime, end_date: datetime) -> TrendSeriesResponse:
        trends = await listening_analytics_repo.get_daily_listening_trend(db, start_date, end_date)

        points = []
        for day, total_ms in trends:
            # Assuming 'day' is a date object. If it's datetime or str, we parse/convert it.
            if isinstance(day, str):
                try:
                    day = datetime.strptime(day, "%Y-%m-%d").date()
                except ValueError:
                    day = datetime.now().date()
            elif isinstance(day, datetime):
                day = day.date()

            hours = total_ms // (1000 * 60 * 60) if total_ms else 0
            points.append(TrendPointResponse(date=day, value=hours))

        return TrendSeriesResponse(metric_name="Listening Hours Trend", data_points=points)

listening_analytics_service = ListeningAnalyticsService()
