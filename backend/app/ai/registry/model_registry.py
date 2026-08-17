from typing import Dict, List, Optional
from datetime import datetime
from app.ai.registry.metadata import ModelMetadataRecord
from app.ai.registry.champion_registry import champion_registry
from app.ai.registry.artifacts import artifact_storage_manager
from app.ai.exceptions import RegistryException

class ModelRegistry:
    """
    Central ML Model Registry managing registration, stage transitions, versioning,
    metadata search, champion promotion, and artifact binding.
    """
    def __init__(self):
        self._registry: Dict[str, ModelMetadataRecord] = {}
        self._bootstrap_default_models()

    def _bootstrap_default_models(self):
        default_churn = ModelMetadataRecord(
            model_id="mod_churn_xgb_v1.4.2",
            model_name="Premium Churn Prediction",
            task_type="binary_classification",
            algorithm="xgboost",
            version="v1.4.2-prod",
            stage="Production",
            owner="MLOps_Team",
            business_purpose="Predicts 30-day Premium user cancellation probability",
            feature_version="v1.0.0",
            dataset_version="ds_2026_q3",
            hyperparameters={"n_estimators": 200, "max_depth": 5, "learning_rate": 0.05},
            metrics={"accuracy": 0.912, "precision": 0.885, "recall": 0.891, "f1_score": 0.888, "roc_auc": 0.914},
            artifact_path="backend/app/ml/models/xgboost.joblib",
            is_champion=True,
            created_at=datetime(2026, 8, 1, 0, 0, 0)
        )
        default_eng = ModelMetadataRecord(
            model_id="mod_eng_lgbm_v1.2.0",
            model_name="Engagement Score Prediction",
            task_type="regression",
            algorithm="random_forest",
            version="v1.2.0-prod",
            stage="Production",
            owner="MLOps_Team",
            business_purpose="Predicts continuous 0-100 engagement score",
            feature_version="v1.0.0",
            dataset_version="ds_2026_q3",
            hyperparameters={"n_estimators": 150, "learning_rate": 0.03, "num_leaves": 31},
            metrics={"mae": 1.85, "rmse": 2.45, "r2_score": 0.892},
            artifact_path="backend/app/ml/models/random_forest.joblib",
            is_champion=True,
            created_at=datetime(2026, 8, 1, 0, 0, 0)
        )
        self.register_model(default_churn)
        self.register_model(default_eng)
        champion_registry.force_set_champion(default_churn)
        champion_registry.force_set_champion(default_eng)

    def register_model(self, record: ModelMetadataRecord) -> ModelMetadataRecord:
        if record.model_id in self._registry:
            raise RegistryException(f"Model ID '{record.model_id}' is already registered.")
        self._registry[record.model_id] = record
        artifact_storage_manager.save_artifact_metadata(record.model_id, record.model_dump())
        return record

    def get_model_metadata(self, model_id: str) -> Optional[ModelMetadataRecord]:
        return self._registry.get(model_id)

    def list_models(self, stage: Optional[str] = None) -> List[ModelMetadataRecord]:
        if stage:
            return [m for m in self._registry.values() if m.stage.lower() == stage.lower()]
        return list(self._registry.values())

    def promote_to_champion(self, model_id: str, metric_key: str = "roc_auc") -> bool:
        record = self.get_model_metadata(model_id)
        if not record:
            raise RegistryException(f"Cannot promote model '{model_id}': Not found in registry.")
        promoted = champion_registry.promote_champion(record, metric_key=metric_key)
        if promoted:
            record.stage = "Production"
            record.is_champion = True
        return promoted

model_registry = ModelRegistry()
