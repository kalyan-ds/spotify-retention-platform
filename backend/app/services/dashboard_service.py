import asyncio
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.analytics import DashboardOverviewResponse, AnalyticsFilter, KPICollectionResponse
from app.services.revenue_analytics_service import revenue_analytics_service
from app.services.user_engagement_service import user_engagement_service
from app.services.insight_service import insight_service
from app.repositories.music_analytics_repository import music_analytics_repo

class DashboardService:
    async def get_executive_dashboard(self, db: AsyncSession, filters: AnalyticsFilter) -> DashboardOverviewResponse:
        """
        Aggregates data concurrently from multiple Analytics domain services to form a
        single unified payload for the executive dashboard.
        """

        # Concurrent data fetching
        revenue_kpis_task = revenue_analytics_service.get_revenue_kpis(db, filters)
        user_kpis_task = user_engagement_service.get_engagement_kpis(db, filters)
        insights_task = insight_service.generate_executive_insights(filters)
        revenue_trend_task = revenue_analytics_service.get_revenue_trend(db, filters)
        user_trend_task = user_engagement_service.get_user_growth_trend(db, filters)

        # Await all domain tasks simultaneously
        revenue_kpis, user_kpis, insights, rev_trend, user_trend = await asyncio.gather(
            revenue_kpis_task,
            user_kpis_task,
            insights_task,
            revenue_trend_task,
            user_trend_task
        )

        # Merge KPIs
        all_kpis = revenue_kpis.metrics + user_kpis.metrics

        return DashboardOverviewResponse(
            kpis=KPICollectionResponse(metrics=all_kpis),
            insights=insights,
            revenue_trend=rev_trend,
            user_growth_trend=user_trend,
            top_artists=None # Will be hydrated dynamically if requested
        )

dashboard_service = DashboardService()
