import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import AsyncSession

from app.services.dashboard_service import dashboard_service
from app.schemas.dashboard import DashboardSummaryResponse, DashboardCardResponse, ChartResponse
from app.schemas.analytics import (
    AnalyticsFilter,
    DashboardOverviewResponse,
    KPICollectionResponse,
    KPIResponse,
    TrendSeriesResponse,
    TrendPointResponse,
    InsightResponse
)

@pytest.mark.asyncio
async def test_get_dashboard_summary_empty_state():
    """Verify get_dashboard_summary returns $0.00 and None trends when database has 0 revenue/history."""
    mock_db = MagicMock(spec=AsyncSession)

    # 0 registered users in DB
    mock_result = MagicMock()
    mock_result.scalar.return_value = 0
    mock_result.all.return_value = []
    mock_db.execute = AsyncMock(return_value=mock_result)

    empty_rev_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Total Revenue", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="MRR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="ARR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    empty_user_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Active Users", value=0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="Avg Session Duration (min)", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    empty_rev_trend = TrendSeriesResponse(metric_name="Revenue Trend", data_points=[])
    empty_user_trend = TrendSeriesResponse(metric_name="User Growth Trend", data_points=[])

    with patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_kpis", AsyncMock(return_value=empty_rev_kpis)), \
         patch("app.services.dashboard_service.user_engagement_service.get_engagement_kpis", AsyncMock(return_value=empty_user_kpis)), \
         patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_trend", AsyncMock(return_value=empty_rev_trend)), \
         patch("app.services.dashboard_service.user_engagement_service.get_user_growth_trend", AsyncMock(return_value=empty_user_trend)), \
         patch("app.services.dashboard_service.music_analytics_repo.get_genre_distribution", AsyncMock(return_value=[])):

        summary = await dashboard_service.get_dashboard_summary(mock_db)

        assert isinstance(summary, DashboardSummaryResponse)
        assert len(summary.cards) == 4

        cards_by_id = {c.id: c for c in summary.cards}

        # Verify exact $0.00 value and None trends
        assert cards_by_id["total_revenue"].value == "$0.00"
        assert cards_by_id["total_revenue"].trend is None
        assert cards_by_id["total_revenue"].trend_direction is None

        assert cards_by_id["mrr"].value == "$0.00"
        assert cards_by_id["mrr"].trend is None
        assert cards_by_id["mrr"].trend_direction is None

        assert cards_by_id["active_users"].value == "0"
        assert cards_by_id["active_users"].trend is None
        assert cards_by_id["active_users"].trend_direction is None

        assert cards_by_id["avg_session_duration"].value == "0.0 min"
        assert cards_by_id["avg_session_duration"].trend is None
        assert cards_by_id["avg_session_duration"].trend_direction is None

        # Verify empty charts validate cleanly
        assert summary.primary_chart is not None
        assert summary.primary_chart.id == "revenue_trend"
        assert summary.primary_chart.labels == []
        assert summary.primary_chart.datasets[0].data == []

@pytest.mark.asyncio
async def test_get_dashboard_cards_registered_user_fallback():
    """Verify active_users falls back to total registered users count when active_users is 0."""
    mock_db = MagicMock(spec=AsyncSession)

    # 1 demo user registered in User table
    mock_result = MagicMock()
    mock_result.scalar.return_value = 1
    mock_db.execute = AsyncMock(return_value=mock_result)

    rev_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Total Revenue", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="MRR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    user_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Active Users", value=0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="Avg Session Duration (min)", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])

    with patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_kpis", AsyncMock(return_value=rev_kpis)), \
         patch("app.services.dashboard_service.user_engagement_service.get_engagement_kpis", AsyncMock(return_value=user_kpis)):

        cards = await dashboard_service.get_dashboard_cards(mock_db)
        cards_by_id = {c.id: c for c in cards}

        assert cards_by_id["active_users"].value == "1"
        assert cards_by_id["total_revenue"].value == "$0.00"
        assert cards_by_id["mrr"].value == "$0.00"

@pytest.mark.asyncio
async def test_get_executive_dashboard_contract_intact():
    """Verify get_executive_dashboard remains fully functional and returns DashboardOverviewResponse."""
    mock_db = MagicMock(spec=AsyncSession)

    rev_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Total Revenue", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="MRR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="ARR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    user_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Active Users", value=0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="Avg Session Duration (min)", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    insights = [
        InsightResponse(
            insight_type="revenue_growth",
            title="Revenue Growth on Track",
            description="MRR has maintained a steady trajectory.",
            severity="success"
        )
    ]
    rev_trend = TrendSeriesResponse(metric_name="Revenue Trend", data_points=[])
    user_trend = TrendSeriesResponse(metric_name="User Growth Trend", data_points=[])

    with patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_kpis", AsyncMock(return_value=rev_kpis)), \
         patch("app.services.dashboard_service.user_engagement_service.get_engagement_kpis", AsyncMock(return_value=user_kpis)), \
         patch("app.services.dashboard_service.insight_service.generate_executive_insights", AsyncMock(return_value=insights)), \
         patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_trend", AsyncMock(return_value=rev_trend)), \
         patch("app.services.dashboard_service.user_engagement_service.get_user_growth_trend", AsyncMock(return_value=user_trend)):

        filters = AnalyticsFilter()
        overview = await dashboard_service.get_executive_dashboard(mock_db, filters)
        assert isinstance(overview, DashboardOverviewResponse)
        assert len(overview.kpis.metrics) == 5
        assert len(overview.insights) == 1
