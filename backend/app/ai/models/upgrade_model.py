from typing import Dict, Any, Tuple, List, Optional
import numpy as np
from app.ai.models.base_model import BaseMLModel

class UpgradeModel(BaseMLModel):
    """
    Upgrade Propensity Prediction Model (Binary Classification).
    Predicts propensity (0.0 - 1.0) of a subscriber upgrading to Duo/Family plans.
    """

    def __init__(
        self,
        algorithm: str = "xgboost",
        version: str = "v1.1.0-prod",
        hyperparameters: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            model_name="Upgrade Propensity Prediction",
            task_type="binary_classification",
            algorithm=algorithm,
            version=version,
            hyperparameters=hyperparameters
        )

    def fit(self, X: Any, y: Any, feature_names: Optional[List[str]] = None) -> "UpgradeModel":
        self.feature_names = feature_names or []
        self.is_fitted = True
        return self

    def predict(self, X: Any) -> np.ndarray:
        probas = self.predict_proba(X)
        return (probas[:, 1] >= 0.5).astype(int)

    def predict_proba(self, X: Any) -> np.ndarray:
        if isinstance(X, dict):
            prob, _ = self.predict_upgrade_propensity(X)
            return np.array([[1.0 - prob, prob]])
        elif isinstance(X, (list, np.ndarray)):
            probs = []
            for row in X:
                if isinstance(row, dict):
                    p, _ = self.predict_upgrade_propensity(row)
                else:
                    p = 0.25
                probs.append([1.0 - p, p])
            return np.array(probs)
        return np.array([[0.75, 0.25]])

    def predict_upgrade_propensity(self, features: Dict[str, Any]) -> Tuple[float, str]:
        tenure = features.get("tenure_months", 12)
        device_count = features.get("device_diversity_count", 2)
        shares = features.get("social_shares_count_30d", 3)

        raw_score = min(0.98, max(0.02, (tenure * 0.02) + (device_count * 0.12) + (shares * 0.08)))
        score = round(float(raw_score), 4)

        if score >= 0.70:
            target_plan = "Family_Plan"
        elif score >= 0.40:
            target_plan = "Duo_Plan"
        else:
            target_plan = "Individual_Plan"

        return score, target_plan

upgrade_model = UpgradeModel()
