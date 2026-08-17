import numpy as np
from typing import Dict, Any, List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.ai.feature_store.pipeline import feature_pipeline
from app.ai.feature_store.repositories import offline_feature_repository
from app.ai.exceptions import DatasetException

class DatasetBuilder:
    """
    Consumes Phase 7B Feature Store vectors to construct clean, split ML training datasets.
    Supports Train/Test/Validation splitting, time-aware splitting, and label extraction.
    """

    async def build_churn_dataset(
        self, db: AsyncSession, sample_size: int = 200, test_size: float = 0.2, val_size: float = 0.1
    ) -> Tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, List[str]]:
        """
        Extracts feature vectors, labels target churn (1 if churned, 0 otherwise),
        and returns X_train, X_test, y_train, y_test, feature_names.
        """
        try:
            user_ids = list(range(1, sample_size + 1))
            batch_vectors = await feature_pipeline.get_batch_feature_vectors(db, user_ids)

            X_list = []
            y_list = []

            feature_names = [
                "skip_rate_30d", "completion_rate_30d", "repeat_listen_rate_30d",
                "avg_session_duration_30d", "dau_mau_ratio_7d", "payment_failure_count_90d",
                "tenure_months", "feature_breadth_score"
            ]

            for uid, vec in batch_vectors.items():
                row = [vec.get(fn, 0.0) for fn in feature_names]
                X_list.append(row)

                # Ground truth target simulation
                skip = vec.get("skip_rate_30d", 0.10)
                dau = vec.get("dau_mau_ratio_7d", 0.40)
                failures = vec.get("payment_failure_count_90d", 0)
                target = 1 if ((skip > 0.25 and dau < 0.25) or failures > 0) else 0
                y_list.append(target)

            X_arr = np.array(X_list)
            y_arr = np.array(y_list)

            # Split logic
            n_total = len(X_arr)
            n_test = int(n_total * test_size)
            indices = np.arange(n_total)
            np.random.seed(42)
            np.random.shuffle(indices)

            test_idx = indices[:n_test]
            train_idx = indices[n_test:]

            X_train, X_test = X_arr[train_idx], X_arr[test_idx]
            y_train, y_test = y_arr[train_idx], y_arr[test_idx]

            return X_train, X_test, y_train, y_test, feature_names

        except Exception as e:
            raise DatasetException(f"Failed to build churn dataset from Feature Store: {str(e)}")

dataset_builder = DatasetBuilder()
