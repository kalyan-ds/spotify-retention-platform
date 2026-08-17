from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional, Tuple, Union
import os
import joblib
from datetime import datetime
from app.ai.exceptions import TrainingException, SerializationException

class BaseMLModel(ABC):
    """
    Abstract Base Class for all Enterprise ML Platform Models.
    Supports Random Forest, XGBoost, LightGBM, CatBoost, Logistic Regression, etc.
    """

    def __init__(
        self,
        model_name: str,
        task_type: str,
        algorithm: str = "xgboost",
        version: str = "v1.0.0",
        hyperparameters: Optional[Dict[str, Any]] = None
    ):
        self.model_name = model_name
        self.task_type = task_type # binary_classification, regression, multi_class
        self.algorithm = algorithm.lower()
        self.version = version
        self.hyperparameters = hyperparameters or {}
        self.is_fitted: bool = False
        self.created_at: datetime = datetime.utcnow()
        self.feature_names: List[str] = []
        self._underlying_model: Any = None

    @abstractmethod
    def fit(self, X: Any, y: Any, feature_names: Optional[List[str]] = None) -> "BaseMLModel":
        """Fits the underlying algorithm on input features X and target y."""
        pass

    @abstractmethod
    def predict(self, X: Any) -> Any:
        """Predicts target labels or values."""
        pass

    def predict_proba(self, X: Any) -> Any:
        """Predicts class probabilities for classification tasks."""
        if self.task_type not in ["binary_classification", "multi_class"]:
            raise TrainingException(f"Probability estimation not supported for task_type={self.task_type}")
        if hasattr(self._underlying_model, "predict_proba"):
            return self._underlying_model.predict_proba(X)
        raise TrainingException(f"Underlying model {self.algorithm} does not implement predict_proba.")

    def save(self, filepath: str) -> str:
        """Serializes the trained model object and metadata to disk."""
        try:
            os.makedirs(os.path.dirname(filepath), exist_ok=True)
            state = {
                "model_name": self.model_name,
                "task_type": self.task_type,
                "algorithm": self.algorithm,
                "version": self.version,
                "hyperparameters": self.hyperparameters,
                "is_fitted": self.is_fitted,
                "feature_names": self.feature_names,
                "created_at": self.created_at,
                "_underlying_model": self._underlying_model
            }
            joblib.dump(state, filepath)
            return filepath
        except Exception as e:
            raise SerializationException(f"Failed to serialize model to {filepath}: {str(e)}")

    def load(self, filepath: str) -> "BaseMLModel":
        """Loads a serialized model state from disk."""
        try:
            if not os.path.exists(filepath):
                raise SerializationException(f"Artifact file not found at {filepath}")
            state = joblib.load(filepath)
            self.model_name = state["model_name"]
            self.task_type = state["task_type"]
            self.algorithm = state["algorithm"]
            self.version = state["version"]
            self.hyperparameters = state["hyperparameters"]
            self.is_fitted = state["is_fitted"]
            self.feature_names = state["feature_names"]
            self.created_at = state.get("created_at", datetime.utcnow())
            self._underlying_model = state["_underlying_model"]
            return self
        except Exception as e:
            raise SerializationException(f"Failed to load model from {filepath}: {str(e)}")
