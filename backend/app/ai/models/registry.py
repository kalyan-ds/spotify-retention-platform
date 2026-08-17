from typing import Dict, List, Optional
from app.ai.models.base_model import BaseMLModel
from app.ai.models.churn_model import churn_model
from app.ai.models.engagement_model import engagement_model
from app.ai.models.upgrade_model import upgrade_model
from app.ai.models.persona_model import persona_model

class ModelsCatalogRegistry:
    """
    Catalog registry bridge for active instantiated ML models.
    """
    def __init__(self):
        self._models: Dict[str, BaseMLModel] = {
            "churn_predictor": churn_model,
            "engagement_regressor": engagement_model,
            "upgrade_propensity": upgrade_model,
            "persona_classifier": persona_model
        }

    def get_model(self, model_key: str) -> Optional[BaseMLModel]:
        return self._models.get(model_key)

    def list_models(self) -> List[BaseMLModel]:
        return list(self._models.values())

models_catalog_registry = ModelsCatalogRegistry()
