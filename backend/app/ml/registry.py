from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any
from app.models.ml import ModelVersion
from datetime import datetime

async def register_model(
    db: AsyncSession,
    model_name: str,
    algorithm: str,
    dataset_version: str,
    metrics: Dict[str, Any],
    artifact_path: str
) -> ModelVersion:
    """
    Registers a new model version in the database.
    """
    # Create a unique version string
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    version = f"v1_{timestamp}"

    # In a real app we'd store hyperparameters, metrics as JSON.
    # The ModelVersion model has a description, we could put metrics there.
    description = f"Alg: {algorithm} | AUC: {metrics.get('roc_auc', 0):.4f} | DS: {dataset_version} | Path: {artifact_path}"

    mv = ModelVersion(
        name=model_name,
        version=version,
        description=description,
        is_active=True
    )

    db.add(mv)
    await db.commit()
    await db.refresh(mv)

    return mv
