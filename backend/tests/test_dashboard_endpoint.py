import pytest
from httpx import AsyncClient, ASGITransport
from unittest.mock import AsyncMock, MagicMock, patch
from sqlalchemy.ext.asyncio import AsyncSession

from main import app
from app.api.deps import get_db, get_current_user
from app.models.auth import User, Role
from app.schemas.dashboard import DashboardSummaryResponse
from app.schemas.analytics import KPICollectionResponse, KPIResponse, TrendSeriesResponse

@pytest.mark.asyncio
async def test_dashboard_summary_endpoint_empty_database():
    """Verify GET /api/v1/dashboard/summary returns 200 with exact $0.00 cards and None trends when database has 0 revenue."""
    mock_user = User(
        id="demo-user-id",
        email="admin@spotify-retention.demo",
        role=Role(id="role-admin", name="admin")
    )

    mock_db = MagicMock(spec=AsyncSession)
    mock_result = MagicMock()
    mock_result.scalar.return_value = 1  # 1 registered user
    mock_db.execute = AsyncMock(return_value=mock_result)

    empty_rev_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Total Revenue", value=0.0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="MRR", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    empty_user_kpis = KPICollectionResponse(metrics=[
        KPIResponse(name="Active Users", value=0, delta_percentage=0.0, trend_direction="flat"),
        KPIResponse(name="Avg Session Duration (min)", value=0.0, delta_percentage=0.0, trend_direction="flat"),
    ])
    empty_trend = TrendSeriesResponse(metric_name="Revenue Trend", data_points=[])

    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_db] = lambda: mock_db

    try:
        with patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_kpis", AsyncMock(return_value=empty_rev_kpis)), \
             patch("app.services.dashboard_service.user_engagement_service.get_engagement_kpis", AsyncMock(return_value=empty_user_kpis)), \
             patch("app.services.dashboard_service.revenue_analytics_service.get_revenue_trend", AsyncMock(return_value=empty_trend)), \
             patch("app.services.dashboard_service.user_engagement_service.get_user_growth_trend", AsyncMock(return_value=empty_trend)), \
             patch("app.services.dashboard_service.music_analytics_repo.get_genre_distribution", AsyncMock(return_value=[])):

            transport = ASGITransport(app=app)
            async with AsyncClient(transport=transport, base_url="http://test") as client:
                response = await client.get("/api/v1/dashboard/summary")
                assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

                json_data = response.json()
                assert json_data.get("success") is True
                assert "data" in json_data

                data = json_data["data"]
                validated = DashboardSummaryResponse(**data)
                assert len(validated.cards) == 4

                cards_by_id = {c.id: c for c in validated.cards}
                assert cards_by_id["total_revenue"].value == "$0.00"
                assert cards_by_id["total_revenue"].trend is None
                assert cards_by_id["total_revenue"].trend_direction is None

                assert cards_by_id["mrr"].value == "$0.00"
                assert cards_by_id["mrr"].trend is None

                assert cards_by_id["active_users"].value == "1"
                assert cards_by_id["active_users"].trend is None

                assert cards_by_id["avg_session_duration"].value == "0.0 min"
                assert cards_by_id["avg_session_duration"].trend is None
    finally:
        app.dependency_overrides.clear()

@pytest.mark.asyncio
async def test_analytics_overview_endpoint_intact():
    """Verify GET /api/v1/analytics/overview remains intact and returns 200."""
    mock_user = User(
        id="demo-user-id",
        email="admin@spotify-retention.demo",
        role=Role(id="role-admin", name="admin")
    )

    mock_db = MagicMock(spec=AsyncSession)
    mock_result = MagicMock()
    mock_result.scalar.return_value = 0
    mock_result.all.return_value = []
    mock_db.execute = AsyncMock(return_value=mock_result)

    app.dependency_overrides[get_current_user] = lambda: mock_user
    app.dependency_overrides[get_db] = lambda: mock_db

    try:
        transport = ASGITransport(app=app)
        async with AsyncClient(transport=transport, base_url="http://test") as client:
            response = await client.get("/api/v1/analytics/overview")
            assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"

            json_data = response.json()
            assert json_data.get("success") is True
            assert "data" in json_data
    finally:
        app.dependency_overrides.clear()
