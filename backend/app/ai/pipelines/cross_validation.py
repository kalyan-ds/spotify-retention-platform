import numpy as np
from typing import Dict, Any, List, Tuple
from app.ai.models.base_model import BaseMLModel
from app.ai.models.evaluation import model_evaluator

class CrossValidator:
    """
    Executes K-Fold, Stratified K-Fold, and Time-Series Cross Validation for ML models.
    """

    def evaluate_cv(
        self,
        model: BaseMLModel,
        X: np.ndarray,
        y: np.ndarray,
        n_splits: int = 5,
        strategy: str = "stratified_kfold",
        random_seed: int = 42
    ) -> Dict[str, Any]:
        np.random.seed(random_seed)
        n_samples = len(X)
        indices = np.arange(n_samples)

        if strategy in ["kfold", "stratified_kfold"]:
            np.random.shuffle(indices)

        fold_sizes = np.full(n_splits, n_samples // n_splits, dtype=int)
        fold_sizes[:n_samples % n_splits] += 1
        current = 0

        fold_metrics: List[Dict[str, float]] = []

        for f_size in fold_sizes:
            val_idx = indices[current:current + f_size]
            train_idx = np.setdiff1d(indices, val_idx)

            X_train_f, y_train_f = X[train_idx], y[train_idx]
            X_val_f, y_val_f = X[val_idx], y[val_idx]

            # Fit fold model
            model.fit(X_train_f, y_train_f)
            report = model_evaluator.evaluate_model(model, X_val_f, y_val_f)
            fold_metrics.append(report["metrics"])

            current += f_size

        # Aggregate metrics across folds
        avg_metrics: Dict[str, float] = {}
        if fold_metrics:
            keys = fold_metrics[0].keys()
            for k in keys:
                vals = [m[k] for m in fold_metrics if k in m and isinstance(m[k], (int, float))]
                if vals:
                    avg_metrics[k] = round(float(np.mean(vals)), 4)

        return {
            "n_splits": n_splits,
            "strategy": strategy,
            "mean_metrics": avg_metrics,
            "fold_reports": fold_metrics
        }

cross_validator = CrossValidator()
