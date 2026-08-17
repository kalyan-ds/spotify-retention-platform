from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, date

# -----------------------------------------
# Executive Engagement Overview & Activity
# -----------------------------------------

class ActiveUsersOverview(BaseModel):
    dau: int = Field(..., description="Daily Active Users")
    wau: int = Field(..., description="Weekly Active Users")
    mau: int = Field(..., description="Monthly Active Users")
    stickiness_ratio: float = Field(..., description="DAU / MAU ratio (%)")

class ActivityHeatmapPoint(BaseModel):
    hour: int = Field(..., ge=0, le=23)
    day_of_week: int = Field(..., ge=0, le=6)
    active_users: int

class ActivityResponse(BaseModel):
    time_slot_breakdown: Dict[str, int] = Field(
        ..., description="Counts for Morning, Afternoon, Evening, Night"
    )
    heatmap_points: List[ActivityHeatmapPoint] = Field(default_factory=list)

# -----------------------------------------
# Session Intelligence
# -----------------------------------------

class SessionMetricsResponse(BaseModel):
    total_sessions: int
    avg_duration_minutes: float
    longest_session_minutes: float
    sessions_per_user: float
    device_breakdown: Dict[str, int] = Field(default_factory=dict)
    platform_breakdown: Dict[str, int] = Field(default_factory=dict)

# -----------------------------------------
# Listening Intelligence
# -----------------------------------------

class ListeningIntelligenceResponse(BaseModel):
    total_listening_hours: float
    avg_listening_hours_per_user: float
    completion_rate: float = Field(..., description="Track completion percentage")
    skip_rate: float = Field(..., description="Track skip percentage (<30s)")
    replay_rate: float = Field(..., description="Track replay percentage")
    songs_per_session: float
    albums_per_session: float
    artists_per_session: float

# -----------------------------------------
# Feature Adoption
# -----------------------------------------

class FeatureAdoptionMetric(BaseModel):
    feature_name: str
    category: str = Field(..., description="Playback, Discovery, Social, Premium")
    adoption_rate: float
    growth_rate: float
    retention_rate: float

class FeatureAdoptionResponse(BaseModel):
    features: List[FeatureAdoptionMetric] = Field(default_factory=list)

# -----------------------------------------
# User Journey & Funnels
# -----------------------------------------

class FunnelStep(BaseModel):
    step_number: int
    step_name: str
    user_count: int
    conversion_rate: float
    dropoff_rate: float

class UserJourneyResponse(BaseModel):
    funnel_name: str
    total_started: int
    total_completed: int
    overall_conversion_rate: float
    steps: List[FunnelStep] = Field(default_factory=list)

# -----------------------------------------
# Behavior Segmentation
# -----------------------------------------

class BehaviorSegmentPoint(BaseModel):
    segment_name: str = Field(..., description="e.g., Casual, Power, Explorer, Binge")
    user_count: int
    percentage: float
    description: Optional[str] = None

class BehaviorSegmentationResponse(BaseModel):
    total_users_classified: int
    segments: List[BehaviorSegmentPoint] = Field(default_factory=list)

# -----------------------------------------
# Engagement Health Engine
# -----------------------------------------

class SubScoreBreakdown(BaseModel):
    activity_score: float
    volume_score: float
    session_quality_score: float
    feature_breadth_score: float

class EngagementHealthResponse(BaseModel):
    overall_engagement_score: float = Field(..., description="0-100 normalized score")
    health_category: str = Field(..., description="Excellent, Good, Average, Poor, Critical")
    sub_scores: SubScoreBreakdown
