from typing import Dict, Any, List
from app.ai.models.metrics import EvaluationMetrics
from app.ai.models.base_model import BaseMLModel

class ModelEvaluator:
    """
    Comprehensive ML Model Evaluator.
    Computes complete performance reports, confusion matrices, and calibration metrics.
    """

    @staticmethod
    def evaluate_model(model: BaseMLModel, X_test: Any, y_test: Any) -> Dict[str, Any]:
        """Runs full task-specific evaluation on test features and labels."""
        if model.task_type in ["binary_classification", "multi_class"]:
            y_pred = model.predict(X_test)
            try:
                y_prob = model.predict_proba(X_test)[:, 1] if model.task_type == "binary_classification" else None
            except Exception:
                y_prob = None
            metrics = EvaluationMetrics.calculate_classification_metrics(list(y_test), list(y_pred), list(y_prob) if y_prob is not None else None)
            return {
                "model_name": model.model_name,
                "version": model.version,
                "task_type": model.task_type,
                "algorithm": model.algorithm,
                "metrics": metrics,
                "confusion_matrix": {
                    "tp": metrics.get("tp", 0),
                    "tn": metrics.get("tn", 0),
                    "fp": metrics.get("fp", 0),
                    "fn": metrics.get("fn", 0)
                }
            }
        else:
            y_pred = model.predict(X_test)
            metrics = EvaluationMetrics.calculate_regression_metrics(list(y_test), list(y_pred))
            return {
                "model_name": model.model_name,
                "version": model.version,
                "task_type": model.task_type,
                "algorithm": model.algorithm,
                "metrics": metrics
            }

model_evaluator = ModelEvaluator()
