from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class PredictionRequestDTO(BaseModel):
    model_config = {'protected_namespaces': ()}
    user_id: int = Field(..., description="Target user ID for AI inference")
    model_name: Optional[str] = Field("churn_predictor", description="Target model key or name")
    model_version: Optional[str] = Field(None, description="Optional explicit version string")
    include_explanations: bool = Field(True, description="Compute SHAP feature drivers")
    include_recommendations: bool = Field(True, description="Generate Next Best Action interventions")
    use_cache: bool = Field(True, description="Enable sub-10ms prediction caching")

class PredictionMetadataDTO(BaseModel):
    model_config = {'protected_namespaces': ()}
    model_id: str
    model_name: str
    model_version: str
    algorithm: str
    feature_version: str
    inference_latency_ms: float
    is_cached: bool = False
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PredictionAuditDTO(BaseModel):
    prediction_id: str
    user_id: int
    execution_environment: str = "Production"
    status: str = "SUCCESS"
    memory_usage_mb: float = 12.4
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class PredictionResponseDTO(BaseModel):
    prediction_id: str
    user_id: int
    churn_probability: float = Field(..., ge=0.0, le=1.0)
    risk_tier: str = Field(..., description="Critical, High, Medium, Low")
    predicted_churn_days: int
    engagement_score: Optional[float] = None
    predicted_persona: Optional[str] = None
    metadata: PredictionMetadataDTO
    audit: PredictionAuditDTO

class PredictionSummaryDTO(BaseModel):
    total_predictions: int
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    average_churn_probability: float
