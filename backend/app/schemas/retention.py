from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, date

from app.schemas.analytics import StandardAnalyticsResponse, KPIResponse

# -----------------------------------------
# Retention Cohort Matrix
# -----------------------------------------

class CohortCell(BaseModel):
    period: int = Field(..., description="The period offset (e.g., Month 1, Month 2)")
    active_users: int = Field(..., description="Number of users still active in this period")
    retention_percentage: float = Field(..., description="Percentage of original cohort retained")

class CohortRow(BaseModel):
    cohort_date: str = Field(..., description="The starting date identifier for the cohort (e.g., '2026-01')")
    initial_size: int = Field(..., description="Total users in the initial cohort")
    cells: List[CohortCell] = Field(default_factory=list)

class CohortMatrixResponse(BaseModel):
    granularity: str = Field(..., description="'daily', 'weekly', 'monthly', 'quarterly'")
    rows: List[CohortRow] = Field(default_factory=list)

# -----------------------------------------
# Retention Health & Personas
# -----------------------------------------

class UserPersonaResponse(BaseModel):
    persona_name: str = Field(..., description="e.g., 'Power User', 'Dormant'")
    user_count: int
    percentage_of_base: float
    description: Optional[str] = None

class RetentionHealthResponse(BaseModel):
    overall_health_score: float = Field(..., description="0-100 normalized score")
    health_category: str = Field(..., description="Excellent, Good, Average, Poor, Critical")
    personas: List[UserPersonaResponse] = Field(default_factory=list)

# -----------------------------------------
# Churn Intelligence
# -----------------------------------------

class ChurnSegmentResponse(BaseModel):
    segment_name: str = Field(..., description="e.g., 'Voluntary Cancel', 'Payment Failed'")
    churn_count: int
    churn_rate: float

class ChurnDistributionResponse(BaseModel):
    total_churned: int
    overall_churn_rate: float
    segments: List[ChurnSegmentResponse] = Field(default_factory=list)

# -----------------------------------------
# Retention Trends
# -----------------------------------------

class RetentionTrendPoint(BaseModel):
    date: str
    retained_users: int
    churned_users: int
    retention_rate: float

class RetentionTrendResponse(BaseModel):
    metric_name: str
    granularity: str
    data_points: List[RetentionTrendPoint] = Field(default_factory=list)

# -----------------------------------------
# Customer Lifecycle
# -----------------------------------------

class LifecycleTransition(BaseModel):
    source_state: str
    target_state: str
    user_count: int

class CustomerLifecycleResponse(BaseModel):
    period_start: date
    period_end: date
    transitions: List[LifecycleTransition] = Field(default_factory=list)
