import os
import json
from typing import Dict, Any, Optional
from app.ai.exceptions import SerializationException

class ArtifactStorageManager:
    """
    Enterprise Storage Manager for ML Model Binaries, Feature Schemas, Evaluation Reports, and Metrics.
    """
    def __init__(self, base_dir: Optional[str] = None):
        if base_dir:
            self.base_dir = base_dir
        else:
            # Anchor reliably relative to backend root
            backend_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
            self.base_dir = os.path.join(backend_root, "artifacts", "ml_models")
        os.makedirs(self.base_dir, exist_ok=True)

    def get_model_artifact_path(self, model_id: str) -> str:
        model_dir = os.path.join(self.base_dir, model_id)
        os.makedirs(model_dir, exist_ok=True)
        return os.path.join(model_dir, f"{model_id}.joblib")

    def save_artifact_metadata(self, model_id: str, metadata: Dict[str, Any], overwrite: bool = False) -> str:
        model_dir = os.path.join(self.base_dir, model_id)
        os.makedirs(model_dir, exist_ok=True)
        meta_path = os.path.join(model_dir, "metadata.json")
        if os.path.exists(meta_path) and not overwrite:
            return meta_path
        try:
            with open(meta_path, "w", encoding="utf-8") as f:
                json.dump(metadata, f, indent=2, default=str)
            return meta_path
        except Exception as e:
            raise SerializationException(f"Failed to write metadata artifact to {meta_path}: {str(e)}")

    def load_artifact_metadata(self, model_id: str) -> Optional[Dict[str, Any]]:
        meta_path = os.path.join(self.base_dir, model_id, "metadata.json")
        if not os.path.exists(meta_path):
            return None
        try:
            with open(meta_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            raise SerializationException(f"Failed to read metadata artifact from {meta_path}: {str(e)}")

artifact_storage_manager = ArtifactStorageManager()
