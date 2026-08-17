import os
import joblib
from typing import Optional
from app.ai.models.base_model import BaseMLModel
from app.ai.models.churn_model import ChurnModel
from app.ai.models.engagement_model import EngagementModel
from app.ai.models.upgrade_model import UpgradeModel
from app.ai.models.persona_model import PersonaModel
from app.ai.exceptions import SerializationException

class ModelLoader:
    """
    Utility for dynamically loading serialized ML models from artifact storage.
    """

    @staticmethod
    def load_model(filepath: str) -> BaseMLModel:
        if not os.path.exists(filepath):
            raise SerializationException(f"Model artifact file does not exist at '{filepath}'")

        try:
            state = joblib.load(filepath)
            model_name = state.get("model_name", "")

            if "Churn" in model_name:
                instance = ChurnModel()
            elif "Engagement" in model_name:
                instance = EngagementModel()
            elif "Upgrade" in model_name:
                instance = UpgradeModel()
            elif "Persona" in model_name:
                instance = PersonaModel()
            else:
                instance = ChurnModel()

            instance.load(filepath)
            return instance
        except Exception as e:
            raise SerializationException(f"Failed to instantiate loaded model from '{filepath}': {str(e)}")

model_loader = ModelLoader()
