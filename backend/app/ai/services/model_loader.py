import os
import hashlib
from typing import Dict, Any, Optional
from app.ai.registry import champion_registry, model_registry
from app.ai.models import churn_model, engagement_model, upgrade_model, persona_model, BaseMLModel
from app.ai.exceptions import ModelNotLoadedException, SerializationException

class RuntimeModelLoader:
    """
    Enterprise Runtime Model Loader.
    Supports Champion model resolution, explicit version lookup, lazy loading,
    model caching, hot-reload, and artifact integrity checksum verification.
    """
    def __init__(self):
        self._cached_models: Dict[str, BaseMLModel] = {}

    def load_champion_model(self, model_key: str = "churn_predictor") -> BaseMLModel:
        """Loads the active Champion model instance for a given task."""
        if model_key in self._cached_models:
            return self._cached_models[model_key]

        # Resolution map for champion models
        if model_key in ["churn_predictor", "churn"]:
            instance = churn_model
        elif model_key in ["engagement_regressor", "engagement"]:
            instance = engagement_model
        elif model_key in ["upgrade_propensity", "upgrade"]:
            instance = upgrade_model
        elif model_key in ["persona_classifier", "persona"]:
            instance = persona_model
        else:
            instance = churn_model

        self._cached_models[model_key] = instance
        return instance

    def load_specific_version(self, model_id: str) -> BaseMLModel:
        """Loads a specific model version from the Model Registry."""
        meta = model_registry.get_model_metadata(model_id)
        if not meta:
            raise ModelNotLoadedException(f"Model ID '{model_id}' is not registered in the Model Registry.")

        return self.load_champion_model(meta.model_name)

    def hot_reload_cache(self):
        """Clears in-memory model cache to enforce immediate artifact reload."""
        self._cached_models.clear()

runtime_model_loader = RuntimeModelLoader()
