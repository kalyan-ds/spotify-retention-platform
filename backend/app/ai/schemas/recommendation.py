from pydantic import BaseModel, Field
from typing import List, Optional

class PriorityLevelDTO(BaseModel):
    level: str = Field("HIGH", description="CRITICAL, HIGH, MEDIUM, LOW")
    priority_score: float = Field(..., ge=0.0, le=100.0)

class NextBestActionDTO(BaseModel):
    action_id: str
    action_code: str
    category: str = Field(..., description="Retention, Upgrade, Engagement, Offer")
    title: str
    description: str
    expected_impact_percentage: float
    confidence_score: float = Field(..., ge=0.0, le=1.0)
    priority: PriorityLevelDTO
    business_justification: str

class RecommendationDTO(BaseModel):
    recommendation_id: str
    user_id: int
    primary_action: NextBestActionDTO
    secondary_actions: List[NextBestActionDTO] = Field(default_factory=list)

class RecommendationListDTO(BaseModel):
    user_id: int
    recommendations: List[NextBestActionDTO]
    generated_at: str
