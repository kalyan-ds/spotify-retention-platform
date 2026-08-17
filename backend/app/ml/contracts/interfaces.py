from abc import ABC, abstractmethod
from typing import Any, Dict, List

class MLModelInterface(ABC):
    """
    Abstract interface that every Machine Learning model must implement.
    This guarantees that the PredictionService never couples to a specific algorithm.
    """

    @abstractmethod
    def load_model(self, path: str) -> None:
        """Load the model from artifacts."""
        pass

    @abstractmethod
    def predict(self, features: Dict[str, Any]) -> float:
        """Predict a single instance."""
        pass

    @abstractmethod
    def predict_batch(self, features_list: List[Dict[str, Any]]) -> List[float]:
        """Predict a batch of instances."""
        pass

    @abstractmethod
    def get_feature_importance(self) -> Dict[str, float]:
        """Return global feature importances for explainability."""
        pass
