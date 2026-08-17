from typing import List, Optional, Union, Dict, Any, Generic, TypeVar
from datetime import date, datetime
from pydantic import BaseModel, Field
from pydantic.generics import GenericModel

T = TypeVar('T')

# -----------------------------------------
# Filters
# -----------------------------------------

class AnalyticsFilter(BaseModel):
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    country: Optional[str] = None
    device: Optional[str] = None
    subscription_plan: Optional[str] = None
    artist_id: Optional[int] = None
    album_id: Optional[int] = None
    playlist_id: Optional[int] = None
    song_id: Optional[int] = None
    user_segment: Optional[str] = None
    premium_status: Optional[bool] = None
    age_group: Optional[str] = None
    gender: Optional[str] = None
    timezone: Optional[str] = None
    granularity: str = Field("daily", description="hourly, daily, weekly, monthly")

# -----------------------------------------
# Standard Metadata & Pagination
# -----------------------------------------

class PaginationResponse(BaseModel):
    page: int
    size: int
    total_pages: int
    total_items: int

class MetadataResponse(BaseModel):
    cache_hit: bool = False
    data_freshness: Optional[str] = None

class StandardAnalyticsResponse(GenericModel, Generic[T]):
    success: bool = True
    message: str = "Data retrieved successfully"
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    request_id: Optional[str] = None
    execution_time_ms: Optional[int] = None
    filters_applied: Optional[Dict[str, Any]] = None
    pagination: Optional[PaginationResponse] = None
    metadata: Optional[MetadataResponse] = None
    data: Optional[T] = None

# -----------------------------------------
# Executive KPIs
# -----------------------------------------

class KPIResponse(BaseModel):
    name: str = Field(..., description="The name of the metric (e.g., 'Total Users')")
    value: Union[int, float] = Field(..., description="The computed value")
    delta_percentage: Optional[float] = Field(None, description="Percentage change from previous period, if applicable")
    trend_direction: Optional[str] = Field(None, description="up, down, or flat")

class KPICollectionResponse(BaseModel):
    metrics: List[KPIResponse]

# -----------------------------------------
# Trends (Time Series)
# -----------------------------------------

class TrendPointResponse(BaseModel):
    date: date
    value: Union[int, float]

class TrendSeriesResponse(BaseModel):
    metric_name: str
    data_points: List[TrendPointResponse]

# -----------------------------------------
# Distributions (Categorical Breakdown)
# -----------------------------------------

class DistributionItemResponse(BaseModel):
    category: str
    count: int
    percentage: float

class DistributionResponse(BaseModel):
    metric_name: str
    distribution: List[DistributionItemResponse]

# -----------------------------------------
# Leaderboards
# -----------------------------------------

class LeaderboardItemResponse(BaseModel):
    rank: int
    entity_id: int
    entity_name: str
    metadata: Optional[str] = Field(None, description="Additional context like Artist Name or Album Title")
    metric_value: Union[int, float]

class LeaderboardResponse(BaseModel):
    metric_name: str
    items: List[LeaderboardItemResponse]

# -----------------------------------------
# Comparisons
# -----------------------------------------

class ComparisonResponse(BaseModel):
    metric_name: str
    current_period_value: Union[int, float]
    previous_period_value: Union[int, float]
    delta_percentage: float
    trend_direction: str

# -----------------------------------------
# Cohorts & Funnels
# -----------------------------------------

class CohortResponse(BaseModel):
    cohort_date: str
    initial_size: int
    retention_percentages: List[float]

class FunnelStepResponse(BaseModel):
    step_name: str
    user_count: int
    dropoff_percentage: float
    conversion_percentage: float

class FunnelResponse(BaseModel):
    funnel_name: str
    steps: List[FunnelStepResponse]

# -----------------------------------------
# Insights
# -----------------------------------------

class InsightResponse(BaseModel):
    insight_type: str = Field(..., description="e.g., revenue_winner, highest_churn")
    title: str
    description: str
    severity: str = Field("info", description="info, warning, critical, success")

# -----------------------------------------
# Dashboard Hierarchy
# -----------------------------------------

class DashboardOverviewResponse(BaseModel):
    kpis: KPICollectionResponse
    insights: List[InsightResponse]
    revenue_trend: Optional[TrendSeriesResponse] = None
    user_growth_trend: Optional[TrendSeriesResponse] = None
    top_artists: Optional[LeaderboardResponse] = None
