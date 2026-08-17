import numpy as np
from typing import Dict, Any, List
from app.ai.exceptions import DatasetException

class ValidationPipeline:
    """
    Data and Dataset Pre-training Validation Pipeline.
    """

    def validate_dataset(self, X: np.ndarray, y: np.ndarray) -> Dict[str, Any]:
        if X is None or len(X) == 0:
            raise DatasetException("Input feature matrix X is empty or None.")
        if y is None or len(y) == 0:
            raise DatasetException("Target vector y is empty or None.")
        if len(X) != len(y):
            raise DatasetException(f"Length mismatch: X length ({len(X)}) != y length ({len(y)})")

        has_nan = np.isnan(X).any()
        has_inf = np.isinf(X).any()

        return {
            "num_samples": len(X),
            "num_features": X.shape[1] if X.ndim > 1 else 1,
            "has_nan": bool(has_nan),
            "has_inf": bool(has_inf),
            "is_valid": not (has_nan or has_inf)
        }

validation_pipeline = ValidationPipeline()
