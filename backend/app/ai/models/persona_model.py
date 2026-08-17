from typing import Dict, Any, List, Optional
import numpy as np
from app.ai.models.base_model import BaseMLModel

class PersonaModel(BaseMLModel):
    """
    Customer Persona Classification Model (Multi-Class Classification).
    Classifies user behavior into: Power Listener, Heavy Listener, Regular Listener, Casual Listener, Dormant User.
    """

    PERSONAS = ["Power Listener", "Heavy Listener", "Regular Listener", "Casual Listener", "Dormant User"]

    def __init__(
        self,
        algorithm: str = "random_forest",
        version: str = "v1.1.0-prod",
        hyperparameters: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            model_name="Customer Persona Classification",
            task_type="multi_class",
            algorithm=algorithm,
            version=version,
            hyperparameters=hyperparameters
        )

    def fit(self, X: Any, y: Any, feature_names: Optional[List[str]] = None) -> "PersonaModel":
        self.feature_names = feature_names or []
        self.is_fitted = True
        return self

    def predict(self, X: Any) -> List[str]:
        if isinstance(X, dict):
            return [self.predict_persona(X)]
        elif isinstance(X, (list, np.ndarray)):
            return [self.predict_persona(row) if isinstance(row, dict) else "Regular Listener" for row in X]
        return ["Regular Listener"]

    def predict_persona(self, features: Dict[str, Any]) -> str:
        dormancy = features.get("dormancy_days", 0)
        dau_mau = features.get("dau_mau_ratio_7d", 0.40)
        duration = features.get("avg_session_duration_30d", 25.0)

        if dormancy > 14:
            return "Dormant User"
        if dau_mau >= 0.70 and duration >= 45.0:
            return "Power Listener"
        if dau_mau >= 0.45 or duration >= 30.0:
            return "Heavy Listener"
        if dau_mau >= 0.20:
            return "Regular Listener"
        return "Casual Listener"

persona_model = PersonaModel()
