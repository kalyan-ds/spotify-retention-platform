from typing import List, Optional, Union, Any, Dict
from pydantic import BaseModel, Field

# -----------------------------------------
# Dashboard Cards (High Level Metrics)
# -----------------------------------------

class DashboardCardResponse(BaseModel):
    id: str = Field(..., description="Unique identifier for the card component")
    title: str = Field(..., description="Display title for the card")
    value: str = Field(..., description="Formatted string value (e.g., '1.5M', '$40,000')")
    trend: Optional[str] = Field(None, description="Formatted trend (e.g., '+5%', '-2%')")
    trend_direction: Optional[str] = Field(None, description="'up', 'down', or 'neutral'")

# -----------------------------------------
# Dashboard Charts
# -----------------------------------------

class ChartDatasetResponse(BaseModel):
    label: str
    data: List[Union[int, float]]

class ChartSeriesResponse(BaseModel):
    id: str = Field(..., description="Unique identifier for the chart component")
    title: str
    chart_type: str = Field(..., description="'line', 'bar', 'pie', 'doughnut'")
    labels: List[str] = Field(..., description="X-axis labels or categorical labels")
    datasets: List[ChartDatasetResponse]

class ChartResponse(BaseModel):
    charts: List[ChartSeriesResponse]

# -----------------------------------------
# Dashboard Summary
# -----------------------------------------

class DashboardSummaryResponse(BaseModel):
    cards: List[DashboardCardResponse]
    primary_chart: Optional[ChartSeriesResponse] = None
    secondary_charts: List[ChartSeriesResponse] = []
