from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.schemas.analytics import StandardAnalyticsResponse, AnalyticsFilter
from app.schemas.engagement import (
    ActiveUsersOverview,
    ActivityResponse,
    SessionMetricsResponse,
    ListeningIntelligenceResponse,
    FeatureAdoptionResponse,
    UserJourneyResponse,
    BehaviorSegmentationResponse,
    EngagementHealthResponse
)
from app.services.engagement_service import engagement_service
from app.services.session_analytics_service import session_analytics_service
from app.services.listening_intelligence_service import listening_intelligence_service
from app.services.feature_adoption_service import feature_adoption_service
from app.services.user_journey_service import user_journey_service
from app.services.behavior_segmentation_engine import behavior_segmentation_engine
from app.services.engagement_health_engine import engagement_health_engine
from app.services.insight_service import insight_service

router = APIRouter()

@router.get("/overview", response_model=StandardAnalyticsResponse[ActiveUsersOverview])
async def get_engagement_overview(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Executive summary metrics (DAU, WAU, MAU, Stickiness Ratio)."""
    data = await engagement_service.get_executive_overview(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/activity", response_model=StandardAnalyticsResponse[ActivityResponse])
async def get_activity_breakdown(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Daily and hourly activity heatmaps."""
    data = await engagement_service.get_activity_breakdown(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/sessions", response_model=StandardAnalyticsResponse[SessionMetricsResponse])
async def get_session_metrics(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Session counts, average durations, and device breakdowns."""
    data = await session_analytics_service.get_session_metrics(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/listening", response_model=StandardAnalyticsResponse[ListeningIntelligenceResponse])
async def get_listening_metrics(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Track completion rate, skip rate, replay rate, and listening hours."""
    data = await listening_intelligence_service.get_listening_metrics(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/features", response_model=StandardAnalyticsResponse[FeatureAdoptionResponse])
async def get_feature_adoption(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Feature adoption rates across Playback, Discovery, Social, and Premium."""
    data = await feature_adoption_service.get_feature_adoption(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/funnels", response_model=StandardAnalyticsResponse[UserJourneyResponse])
async def get_funnel_analysis(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """User onboarding conversion and step drop-off funnels."""
    data = await user_journey_service.get_funnel_analysis(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/segments", response_model=StandardAnalyticsResponse[BehaviorSegmentationResponse])
async def get_behavior_segments(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """User classification into behavioral personas (Power, Heavy, Casual, Explorer)."""
    data = await behavior_segmentation_engine.get_segmentation(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/health", response_model=StandardAnalyticsResponse[EngagementHealthResponse])
async def get_engagement_health(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Composite engagement health score and category."""
    data = await engagement_health_engine.calculate_health_score(db, filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))

@router.get("/insights", response_model=StandardAnalyticsResponse[list])
async def get_engagement_insights(
    filters: AnalyticsFilter = Depends(),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Automated executive insight feed for engagement trends."""
    data = await insight_service.generate_executive_insights(filters)
    return StandardAnalyticsResponse(data=data, filters_applied=filters.dict(exclude_none=True))
