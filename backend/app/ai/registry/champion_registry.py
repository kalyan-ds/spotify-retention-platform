from typing import Dict, Optional, List
from datetime import datetime
from app.ai.registry.metadata import ModelMetadataRecord
from app.ai.exceptions import RegistryException

class ChampionRegistry:
    """
    Manages Champion vs Challenger model governance, promotion criteria, and rollback workflows.
    """
    def __init__(self):
        # Maps model_name -> ModelMetadataRecord (active champion)
        self._champions: Dict[str, ModelMetadataRecord] = {}

    def get_champion(self, model_name: str) -> Optional[ModelMetadataRecord]:
        return self._champions.get(model_name)

    def promote_champion(
        self, candidate: ModelMetadataRecord, metric_key: str = "roc_auc"
    ) -> bool:
        """
        Promotes a candidate model version to Champion if it outperforms current Champion on target metric.
        """
        current = self.get_champion(candidate.model_name)
        if current is None:
            candidate.is_champion = True
            candidate.stage = "Production"
            candidate.promoted_at = datetime.utcnow()
            self._champions[candidate.model_name] = candidate
            return True

        current_score = current.metrics.get(metric_key, 0.0)
        candidate_score = candidate.metrics.get(metric_key, 0.0)

        # For loss/error metrics (RMSE, MAE), lower is better
        is_improved = (candidate_score < current_score) if "rmse" in metric_key or "mae" in metric_key else (candidate_score > current_score)

        if is_improved:
            current.is_champion = False
            current.stage = "Challenger"
            candidate.is_champion = True
            candidate.stage = "Production"
            candidate.promoted_at = datetime.utcnow()
            self._champions[candidate.model_name] = candidate
            return True

        return False

    def force_set_champion(self, model_record: ModelMetadataRecord):
        """Forces promotion of a model version to Champion (override)."""
        model_name = model_record.model_name
        if model_name in self._champions:
            self._champions[model_name].is_champion = False
            self._champions[model_name].stage = "Challenger"

        model_record.is_champion = True
        model_record.stage = "Production"
        model_record.promoted_at = datetime.utcnow()
        self._champions[model_name] = model_record

    def list_all_champions(self) -> List[ModelMetadataRecord]:
        return list(self._champions.values())

champion_registry = ChampionRegistry()
