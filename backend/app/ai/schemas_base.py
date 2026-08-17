from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from app.ai.constants import FeatureGroup, FeatureDataType, RefreshFrequency

# -----------------------------------------
# Prediction Request & Response DTOs
# -----------------------------------------

class PredictionRequest(BaseModel):
    user_id: int = Field(..., description="Target user ID for prediction")
    include_explanations: bool = Field(True, description="Whether to compute SHAP feature drivers")
    include_recommendations: bool = Field(True, description="Whether to include Next Best Action recommendations")

class BatchPredictionRequest(BaseModel):
    user_ids: List[int] = Field(..., description="List of user IDs for batch scoring")

class SHAPAttribution(BaseModel):
    feature_name: str = Field(..., description="Raw feature identifier")
    shap_value: float = Field(..., description="Impact direction and magnitude (+ for increased risk, - for decreased risk)")
    feature_value: Any = Field(..., description="Actual feature value")
    business_explanation: str = Field(..., description="Human-readable business impact description")

class ChurnPredictionResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    user_id: int
    churn_probability: float = Field(..., ge=0.0, le=1.0, description="Predicted cancellation probability")
    risk_tier: str = Field(..., description="Low, Medium, High, Critical")
    predicted_churn_days: int = Field(..., description="Estimated days until potential cancellation")
    shap_attributions: List[SHAPAttribution] = Field(default_factory=list)
    model_version: str = Field(..., description="Active champion model version ID")
    computed_at: datetime = Field(default_factory=datetime.utcnow)

class EngagementScoreResponse(BaseModel):
    model_config = {'protected_namespaces': ()}
    user_id: int
    engagement_score: float = Field(..., ge=0.0, le=100.0, description="Normalized 0-100 score")
    predicted_persona: str = Field(..., description="Power, Heavy, Regular, Casual, Dormant")
    activity_subscore: float
    volume_subscore: float
    feature_subscore: float
    model_version: str
    computed_at: datetime = Field(default_factory=datetime.utcnow)

class NextBestActionItem(BaseModel):
    action_code: str = Field(..., description="Unique action identifier e.g., ACT_PAYMENT_RETRY")
    action_category: str = Field(..., description="Retention, Upsell, Feature Discovery, Re-engagement")
    title: str = Field(..., description="User-facing or CSM-facing action title")
    description: str = Field(..., description="Detailed intervention strategy")
    expected_impact_percentage: float = Field(..., description="Expected churn reduction or engagement lift %")
    confidence_score: float = Field(..., ge=0.0, le=1.0)

class RecommendationResponse(BaseModel):
    user_id: int
    primary_recommendation: NextBestActionItem
    alternative_recommendations: List[NextBestActionItem] = Field(default_factory=list)
    generated_at: datetime = Field(default_factory=datetime.utcnow)

class ModelMetadata(BaseModel):
    model_config = {'protected_namespaces': ()}
    model_id: str
    model_name: str
    model_type: str = Field(..., description="Binary Classification, Regression, Ranking")
    version: str
    stage: str = Field(..., description="Production, Staging, Archived")
    auc_roc: Optional[float] = None
    rmse: Optional[float] = None
    last_trained_at: datetime

class ModelCatalogResponse(BaseModel):
    active_models: List[ModelMetadata]

# -----------------------------------------
# Feature Store DTOs (Phase 7B)
# -----------------------------------------

class FeatureValidationRuleDTO(BaseModel):
    allow_null: bool = False
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    allowed_values: Optional[List[Any]] = None
    regex_pattern: Optional[str] = None

class FeatureDefinitionDTO(BaseModel):
    name: str = Field(..., description="Unique feature identifier")
    group: FeatureGroup = Field(..., description="Behavioral, Engagement, Subscription, etc.")
    data_type: FeatureDataType = Field(..., description="Float, Int, String, Boolean, DateTime, List")
    description: str = Field(..., description="Detailed feature description")
    business_purpose: str = Field(..., description="RATIONALE for inclusion in ML pipeline")
    source_table: str = Field(..., description="Raw data source origin table")
    owner: str = Field(..., description="Responsible team/owner")
    refresh_frequency: RefreshFrequency = Field(..., description="Realtime, Hourly, Daily, Weekly")
    window_days: int = Field(30, description="Rolling historical aggregate window in days")
    default_value: Any = Field(None, description="Fallback value if data is missing")
    validation_rules: Optional[FeatureValidationRuleDTO] = None
    version: str = Field("v1.0.0", description="Semantic feature schema version")
    dependencies: List[str] = Field(default_factory=list, description="Upstream feature dependencies")
    is_deprecated: bool = Field(False, description="Deprecation marker")

class FeatureValueDTO(BaseModel):
    feature_name: str
    value: Any
    computed_at: datetime = Field(default_factory=datetime.utcnow)

class FeatureVectorDTO(BaseModel):
    user_id: int
    features: Dict[str, Any]
    feature_count: int
    computation_latency_ms: float
    is_cached: bool = False
    computed_at: datetime = Field(default_factory=datetime.utcnow)

class FeatureGroupMetadataDTO(BaseModel):
    group_name: FeatureGroup
    feature_count: int
    features: List[FeatureDefinitionDTO]

class FeatureValidationResultDTO(BaseModel):
    is_valid: bool
    total_features_validated: int
    passed_count: int
    failed_count: int
    errors: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)

class FeatureExecutionLogDTO(BaseModel):
    execution_id: str
    user_id: int
    status: str
    execution_duration_ms: float
    features_computed: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class FeatureSearchRequest(BaseModel):
    query: Optional[str] = None
    group: Optional[FeatureGroup] = None
    data_type: Optional[FeatureDataType] = None
    include_deprecated: bool = False

class FeatureBatchRequest(BaseModel):
    user_ids: List[int]
    feature_names: Optional[List[str]] = None
