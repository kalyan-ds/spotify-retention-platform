import asyncio
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.schemas.analytics import DashboardOverviewResponse, AnalyticsFilter, KPICollectionResponse
from app.schemas.dashboard import (
    DashboardCardResponse,
    ChartDatasetResponse,
    ChartSeriesResponse,
    ChartResponse,
    DashboardSummaryResponse
)
from app.services.revenue_analytics_service import revenue_analytics_service
from app.services.user_engagement_service import user_engagement_service
from app.services.insight_service import insight_service
from app.repositories.music_analytics_repository import music_analytics_repo
from app.models.auth import User

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

    async def get_dashboard_cards(self, db: AsyncSession, filters: Optional[AnalyticsFilter] = None) -> List[DashboardCardResponse]:
        """
        Generates high-level KPI cards for the main operational dashboard.
        """
        active_filters = filters or AnalyticsFilter()

        rev_kpis_task = revenue_analytics_service.get_revenue_kpis(db, active_filters)
        user_kpis_task = user_engagement_service.get_engagement_kpis(db, active_filters)
        total_users_task = db.execute(select(func.count(User.id)))

        rev_kpis, user_kpis, total_users_res = await asyncio.gather(
            rev_kpis_task,
            user_kpis_task,
            total_users_task
        )

        total_users = total_users_res.scalar() or 0

        # Extract metrics safely with fallbacks
        kpi_map = {m.name: m.value for m in (rev_kpis.metrics + user_kpis.metrics)}

        total_rev = float(kpi_map.get("Total Revenue", 0.0))
        mrr = float(kpi_map.get("MRR", 0.0))
        active_users = int(kpi_map.get("Active Users", 0))
        avg_session = float(kpi_map.get("Avg Session Duration (min)", 0.0))

        # If active_users is 0 from listening history, fall back to registered users count
        display_users = active_users if active_users > 0 else total_users

        cards = [
            DashboardCardResponse(
                id="total_revenue",
                title="Total Revenue",
                value=f"${total_rev:,.2f}" if total_rev > 0 else "$0.00",
                trend=None,
                trend_direction=None
            ),
            DashboardCardResponse(
                id="mrr",
                title="Monthly Recurring Revenue",
                value=f"${mrr:,.2f}" if mrr > 0 else "$0.00",
                trend=None,
                trend_direction=None
            ),
            DashboardCardResponse(
                id="active_users",
                title="Active Users",
                value=f"{display_users:,}",
                trend=None,
                trend_direction=None
            ),
            DashboardCardResponse(
                id="avg_session_duration",
                title="Avg Session Duration",
                value=f"{avg_session:.1f} min" if avg_session > 0 else "0.0 min",
                trend=None,
                trend_direction=None
            )
        ]
        return cards

    async def get_dashboard_charts(self, db: AsyncSession, filters: Optional[AnalyticsFilter] = None) -> ChartResponse:
        """
        Generates time-series and categorical chart series for the dashboard.
        """
        active_filters = filters or AnalyticsFilter()

        rev_trend_task = revenue_analytics_service.get_revenue_trend(db, active_filters)
        user_trend_task = user_engagement_service.get_user_growth_trend(db, active_filters)
        genre_dist_task = music_analytics_repo.get_genre_distribution(db, active_filters)

        rev_trend, user_trend, genre_dist = await asyncio.gather(
            rev_trend_task,
            user_trend_task,
            genre_dist_task
        )

        charts: List[ChartSeriesResponse] = []

        # 1. Revenue Trend Chart
        rev_labels = [str(dp.date) for dp in rev_trend.data_points]
        rev_data = [float(dp.value) for dp in rev_trend.data_points]
        charts.append(
            ChartSeriesResponse(
                id="revenue_trend",
                title="Revenue Over Time",
                chart_type="line",
                labels=rev_labels,
                datasets=[
                    ChartDatasetResponse(label="Revenue ($)", data=rev_data)
                ]
            )
        )

        # 2. User Growth Chart
        user_labels = [str(dp.date) for dp in user_trend.data_points]
        user_data = [float(dp.value) for dp in user_trend.data_points]
        charts.append(
            ChartSeriesResponse(
                id="user_growth_trend",
                title="Active User Growth",
                chart_type="line",
                labels=user_labels,
                datasets=[
                    ChartDatasetResponse(label="Active Users", data=user_data)
                ]
            )
        )

        # 3. Genre Distribution Chart
        genre_labels = [str(row[0]) for row in genre_dist] if genre_dist else []
        genre_data = [float(row[1]) for row in genre_dist] if genre_dist else []
        if genre_labels:
            charts.append(
                ChartSeriesResponse(
                    id="genre_distribution",
                    title="Plays by Genre",
                    chart_type="doughnut",
                    labels=genre_labels,
                    datasets=[
                        ChartDatasetResponse(label="Plays", data=genre_data)
                    ]
                )
            )

        return ChartResponse(charts=charts)

    async def get_dashboard_summary(self, db: AsyncSession, filters: Optional[AnalyticsFilter] = None) -> DashboardSummaryResponse:
        """
        Aggregates summary cards and primary/secondary charts for GET /api/v1/dashboard/summary.
        """
        cards_task = self.get_dashboard_cards(db, filters)
        charts_task = self.get_dashboard_charts(db, filters)

        cards, chart_resp = await asyncio.gather(cards_task, charts_task)

        primary_chart = chart_resp.charts[0] if chart_resp.charts else None
        secondary_charts = chart_resp.charts[1:] if len(chart_resp.charts) > 1 else []

        return DashboardSummaryResponse(
            cards=cards,
            primary_chart=primary_chart,
            secondary_charts=secondary_charts
        )

dashboard_service = DashboardService()
