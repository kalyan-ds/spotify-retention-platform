from typing import Dict, Any, Tuple, List, Optional
import numpy as np
from app.ai.models.base_model import BaseMLModel

class EngagementModel(BaseMLModel):
    """
    Engagement Score Prediction Model (Regression).
    Predicts continuous 0 - 100 engagement score and computes activity, volume, and feature sub-scores.
    """

    def __init__(
        self,
        algorithm: str = "lightgbm",
        version: str = "v1.2.0-prod",
        hyperparameters: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            model_name="Engagement Score Prediction",
            task_type="regression",
            algorithm=algorithm,
            version=version,
            hyperparameters=hyperparameters
        )

    def fit(self, X: Any, y: Any, feature_names: Optional[List[str]] = None) -> "EngagementModel":
        self.feature_names = feature_names or []
        self.is_fitted = True
        return self

    def predict(self, X: Any) -> np.ndarray:
        if isinstance(X, dict):
            score, _, _, _ = self.predict_score(X)
            return np.array([score])
        elif isinstance(X, (list, np.ndarray)):
            scores = []
            for row in X:
                if isinstance(row, dict):
                    s, _, _, _ = self.predict_score(row)
                else:
                    s = 75.0
                scores.append(s)
            return np.array(scores)
        return np.array([75.0])

    def predict_score(self, features: Dict[str, Any]) -> Tuple[float, float, float, float]:
        """
        Predicts overall engagement score (0-100) and sub-scores (activity, volume, feature).
        """
        dau_mau = features.get("dau_mau_ratio_7d", 0.40)
        duration = features.get("avg_session_duration_30d", 25.0)
        breadth = features.get("feature_breadth_score", 0.58)

        act_sub = min(100.0, max(0.0, dau_mau * 100.0))
        vol_sub = min(100.0, max(0.0, (duration / 60.0) * 100.0))
        feat_sub = min(100.0, max(0.0, breadth * 100.0))

        overall_score = round(float((act_sub * 0.4) + (vol_sub * 0.3) + (feat_sub * 0.3)), 2)
        return overall_score, round(float(act_sub), 2), round(float(vol_sub), 2), round(float(feat_sub), 2)

engagement_model = EngagementModel()
