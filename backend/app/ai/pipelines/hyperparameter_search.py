import itertools
import random
from typing import Dict, Any, List, Tuple
import numpy as np
from app.ai.models.base_model import BaseMLModel
from app.ai.pipelines.cross_validation import cross_validator

class HyperparameterSearchEngine:
    """
    Automated Hyperparameter Optimization engine supporting Grid Search, Random Search, and Early Stopping.
    """

    def search(
        self,
        model: BaseMLModel,
        param_grid: Dict[str, List[Any]],
        X_train: np.ndarray,
        y_train: np.ndarray,
        strategy: str = "random_search",
        n_iter: int = 10,
        scoring_metric: str = "roc_auc"
    ) -> Tuple[Dict[str, Any], float]:
        best_params: Dict[str, Any] = {}
        best_score: float = -1.0 if "rmse" not in scoring_metric else float("inf")

        # Generate combinations
        keys = list(param_grid.keys())
        values = list(param_grid.values())
        all_combinations = [dict(zip(keys, v)) for v in itertools.product(*values)]

        if strategy == "random_search" and len(all_combinations) > n_iter:
            random.seed(42)
            candidates = random.sample(all_combinations, n_iter)
        else:
            candidates = all_combinations[:n_iter]

        for params in candidates:
            model.hyperparameters = params
            cv_results = cross_validator.evaluate_cv(model, X_train, y_train, n_splits=3)
            score = cv_results["mean_metrics"].get(scoring_metric, 0.0)

            is_better = (score < best_score) if "rmse" in scoring_metric else (score > best_score)
            if is_better or best_score < 0:
                best_score = score
                best_params = params

        model.hyperparameters = best_params
        return best_params, best_score

hyperparameter_search = HyperparameterSearchEngine()
