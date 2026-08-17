import uuid
import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from pydantic import BaseModel, Field

class ExperimentRunRecord(BaseModel):
    model_config = {'protected_namespaces': ()}
    experiment_id: str
    run_id: str
    model_name: str
    algorithm: str
    parameters: Dict[str, Any]
    metrics: Dict[str, float]
    feature_version: str
    dataset_version: str
    execution_duration_ms: float
    environment: str = "Production"
    random_seed: int = 42
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class ExperimentTracker:
    """
    MLflow-compatible Experiment Tracking System.
    Logs run parameters, metrics, feature versions, and training run artifacts.
    """
    def __init__(self):
        self._runs: Dict[str, ExperimentRunRecord] = {}

    def log_run(
        self,
        experiment_id: str,
        model_name: str,
        algorithm: str,
        parameters: Dict[str, Any],
        metrics: Dict[str, float],
        feature_version: str = "v1.0.0",
        dataset_version: str = "ds_2026_q3",
        duration_ms: float = 0.0,
        random_seed: int = 42
    ) -> ExperimentRunRecord:
        run_id = f"run_{uuid.uuid4().hex[:8]}"
        record = ExperimentRunRecord(
            experiment_id=experiment_id,
            run_id=run_id,
            model_name=model_name,
            algorithm=algorithm,
            parameters=parameters,
            metrics=metrics,
            feature_version=feature_version,
            dataset_version=dataset_version,
            execution_duration_ms=duration_ms,
            random_seed=random_seed
        )
        self._runs[run_id] = record
        return record

    def list_runs(self, experiment_id: Optional[str] = None) -> List[ExperimentRunRecord]:
        if experiment_id:
            return [r for r in self._runs.values() if r.experiment_id == experiment_id]
        return list(self._runs.values())

experiment_tracker = ExperimentTracker()
