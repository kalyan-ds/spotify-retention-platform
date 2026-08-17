from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.schemas.analytics import StandardAnalyticsResponse, AnalyticsFilter, KPICollectionResponse, TrendSeriesResponse, InsightResponse
from app.schemas.retention import (
    RetentionHealthResponse,
    CohortMatrixResponse,
    ChurnDistributionResponse,
    RetentionTrendResponse
)
from app.services.retention_health_engine import retention_health_engine
from app.services.churn_service import churn_service
from app.services.cohort_service import cohort_service
from app.services.retention_service import retention_service
from app.services.insight_service import insight_service

router = APIRouter()

@router.get("/health", response_model=StandardAnalyticsResponse[RetentionHealthResponse])
async def get_retention_health(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Overall retention health score and persona distribution."""
    data = await retention_health_engine.get_segment_health(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/cohorts", response_model=StandardAnalyticsResponse[CohortMatrixResponse])
async def get_cohort_matrix(
    filters: AnalyticsFilter = Depends(),
    granularity: str = Query("monthly", description="daily, weekly, monthly"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Cohort retention heatmaps."""
    data = await cohort_service.get_retention_matrix(db, filters, granularity)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/churn", response_model=StandardAnalyticsResponse[ChurnDistributionResponse])
async def get_churn_distribution(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Segmented churn distribution analysis."""
    data = await churn_service.get_churn_distribution(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/churn/kpis", response_model=StandardAnalyticsResponse[KPICollectionResponse])
async def get_churn_kpis(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """High-level churn KPIs like Churn Rate and total churned users."""
    data = await churn_service.get_churn_kpis(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/trends", response_model=StandardAnalyticsResponse[TrendSeriesResponse])
async def get_retention_trends(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Daily/Weekly active user retention decay trends."""
    data = await retention_service.get_retention_trend(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/insights", response_model=StandardAnalyticsResponse[list])
async def get_retention_insights(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Automated text-based insights based on retention anomalies."""
    # Reuses Insight Service from Phase 6 Analytics blueprint
    data = await insight_service.generate_executive_insights(filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))
