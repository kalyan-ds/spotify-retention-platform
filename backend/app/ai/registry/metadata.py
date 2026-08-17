from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
from datetime import datetime

class ModelMetadataRecord(BaseModel):
    """
    Comprehensive Metadata Record for a registered ML Model.
    """
    model_config = {'protected_namespaces': ()}

    model_id: str = Field(..., description="Unique model artifact identifier e.g. churn_xgb_v1.4.2")
    model_name: str = Field(..., description="Business name e.g. Premium Churn Prediction")
    task_type: str = Field(..., description="binary_classification, regression, multi_class")
    algorithm: str = Field(..., description="xgboost, lightgbm, random_forest, catboost")
    version: str = Field(..., description="Semantic version string e.g. v1.4.2-prod")
    stage: str = Field("Staging", description="Production, Staging, Challenger, Archived")
    owner: str = Field("MLOps_Team", description="Responsible team or engineer")
    business_purpose: str = Field(..., description="Business objective of the model")
    feature_version: str = Field("v1.0.0", description="Feature Store schema version used")
    dataset_version: str = Field("ds_2026_q3", description="Training dataset version ID")
    hyperparameters: Dict[str, Any] = Field(default_factory=dict)
    metrics: Dict[str, float] = Field(default_factory=dict)
    artifact_path: str = Field(..., description="Disk path to serialized model file")
    is_champion: bool = Field(False, description="Whether this model version is active Champion")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    promoted_at: Optional[datetime] = None
