from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.schemas.analytics import (
    StandardAnalyticsResponse,
    AnalyticsFilter,
    DashboardOverviewResponse,
    KPICollectionResponse,
    TrendSeriesResponse,
    LeaderboardResponse,
    DistributionResponse,
    CohortResponse,
    FunnelResponse
)
from app.services.dashboard_service import dashboard_service
from app.services.revenue_analytics_service import revenue_analytics_service
from app.services.user_engagement_service import user_engagement_service
# Other services not fully refactored in the blueprint yet but assuming existence for routing
from app.services.music_analytics_service import music_analytics_service
from app.services.listening_analytics_service import listening_analytics_service

router = APIRouter()

@router.get("/overview", response_model=StandardAnalyticsResponse[DashboardOverviewResponse])
async def get_overview(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Aggregated executive dashboard data."""
    data = await dashboard_service.get_executive_dashboard(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/revenue", response_model=StandardAnalyticsResponse[KPICollectionResponse])
async def get_revenue(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await revenue_analytics_service.get_revenue_kpis(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/revenue/trends", response_model=StandardAnalyticsResponse[TrendSeriesResponse])
async def get_revenue_trends(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await revenue_analytics_service.get_revenue_trend(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/engagement", response_model=StandardAnalyticsResponse[KPICollectionResponse])
async def get_engagement(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await user_engagement_service.get_engagement_kpis(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/engagement/trends", response_model=StandardAnalyticsResponse[TrendSeriesResponse])
async def get_engagement_trends(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await user_engagement_service.get_user_growth_trend(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/cohorts", response_model=StandardAnalyticsResponse[CohortResponse])
async def get_cohorts(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Stub response until cohort logic is built in analytics_repository
    data = CohortResponse(cohort_date="2026-01", initial_size=1000, retention_percentages=[100, 80, 60, 40])
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/funnels", response_model=StandardAnalyticsResponse[FunnelResponse])
async def get_funnels(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Stub response until funnel logic is integrated deeply
    data = FunnelResponse(funnel_name="Signup", steps=[])
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))
