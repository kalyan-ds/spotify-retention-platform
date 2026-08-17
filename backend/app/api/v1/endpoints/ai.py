from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.dependencies.database import get_db
from app.api.v1.dependencies.ai_auth import get_current_ai_user, AIUserPrincipal
from app.ai.schemas import PredictionRequestDTO, SHAPResponseDTO, FeatureDefinitionDTO
from app.ai.services import explainability_service
from app.ai.feature_store.registry import feature_registry
from app.ai.feature_store.cache import online_feature_cache
from app.ai.feature_store.pipeline import feature_pipeline
from app.ai.constants import FeatureGroup, FeatureDataType

from app.api.v1.endpoints.ai_predictions import router as predictions_subrouter
from app.api.v1.endpoints.ai_models import router as models_subrouter
from app.api.v1.endpoints.ai_recommendations import router as recommendations_subrouter
from app.api.v1.endpoints.ai_monitoring import router as monitoring_subrouter
from app.api.v1.endpoints.ai_health import router as health_subrouter
from app.api.v1.endpoints.ai_drift import router as drift_subrouter
from app.api.v1.endpoints.ai_metrics import router as metrics_subrouter

router = APIRouter()

# Include Sub-Routers
router.include_router(predictions_subrouter)
router.include_router(models_subrouter)
router.include_router(recommendations_subrouter)
router.include_router(monitoring_subrouter)
router.include_router(health_subrouter)
router.include_router(drift_subrouter)
router.include_router(metrics_subrouter)

# -----------------------------------------
# Explainability REST Endpoints
# -----------------------------------------

@router.post("/explanations")
async def compute_explanations(
    body: PredictionRequestDTO,
    db: AsyncSession = Depends(get_db),
    user: AIUserPrincipal = Depends(get_current_ai_user)
):
    """
    Computes TreeSHAP feature attributions, positive/negative drivers, and executive summaries.
    """
    features = await feature_pipeline.get_user_feature_vector(db, body.user_id)
    shap_res = explainability_service.compute_shap_explanations(body.user_id, features)
    return shap_res.model_dump()

# -----------------------------------------
# Feature Store REST Endpoints (Phase 7B)
# -----------------------------------------

@router.get("/features", response_model=List[FeatureDefinitionDTO])
async def search_feature_catalog(
    query: Optional[str] = Query(None, description="Search term for feature name or description"),
    group: Optional[FeatureGroup] = Query(None, description="Feature category group filter"),
    data_type: Optional[FeatureDataType] = Query(None, description="Data type filter"),
    include_deprecated: bool = Query(False, description="Include deprecated features")
):
    """
    Retrieves and searches the central Feature Store catalog.
    """
    catalog = feature_registry.search_features(
        query=query,
        group=group,
        data_type=data_type,
        include_deprecated=include_deprecated
    )
    return [FeatureDefinitionDTO(**f.model_dump()) for f in catalog]

@router.get("/features/{feature_name}", response_model=FeatureDefinitionDTO)
async def get_feature_definition(feature_name: str):
    """
    Retrieves metadata definition for a specific feature by name.
    """
    try:
        fdef = feature_registry.get_feature(feature_name)
        return FeatureDefinitionDTO(**fdef.model_dump())
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/features/cache/stats")
async def get_feature_cache_stats():
    """
    Returns online feature store cache performance statistics (hits, misses, hit rate %).
    """
    return online_feature_cache.get_cache_stats()
