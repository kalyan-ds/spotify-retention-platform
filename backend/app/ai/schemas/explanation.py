from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class FeatureContributionDTO(BaseModel):
    feature_name: str
    feature_value: Any
    shap_value: float
    impact_direction: str = Field(..., description="INCREASED_RISK, DECREASED_RISK, NEUTRAL")
    importance_rank: int
    business_explanation: str

class TopDriversDTO(BaseModel):
    positive_drivers: List[FeatureContributionDTO] = Field(default_factory=list)
    negative_drivers: List[FeatureContributionDTO] = Field(default_factory=list)

class BusinessExplanationDTO(BaseModel):
    summary: str
    key_takeaways: List[str]
    suggested_focus_area: str

class ExecutiveSummaryDTO(BaseModel):
    headline: str
    risk_level: str
    impact_statement: str

class SHAPResponseDTO(BaseModel):
    user_id: int
    base_value: float = 0.35
    attributions: List[FeatureContributionDTO] = Field(default_factory=list)
    top_drivers: TopDriversDTO
    business_explanation: BusinessExplanationDTO
    executive_summary: ExecutiveSummaryDTO
    computation_time_ms: float
