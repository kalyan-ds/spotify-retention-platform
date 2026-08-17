from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.api.v1.dependencies.ai_auth import get_current_ai_user, AIUserPrincipal
from app.ai.registry import model_registry, champion_registry

router = APIRouter(prefix="/models", tags=["AI Models"])

@router.get("")
async def list_models(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Lists all registered models in the Model Registry."""
    return [m.model_dump() for m in model_registry.list_models()]

@router.get("/champion")
async def get_champion_models(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Lists active Champion model metadata records."""
    return [m.model_dump() for m in champion_registry.list_all_champions()]

@router.get("/versions")
async def get_model_versions(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns available semantic versions across all registered models."""
    return [{"model_id": m.model_id, "version": m.version, "stage": m.stage} for m in model_registry.list_models()]

@router.get("/metadata")
async def get_all_models_metadata(user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Returns full metadata catalog for operational governance."""
    return [m.model_dump() for m in model_registry.list_models()]

@router.get("/{model_id}")
async def get_model_by_id(model_id: str, user: AIUserPrincipal = Depends(get_current_ai_user)):
    """Retrieves specific model metadata record by model_id."""
    meta = model_registry.get_model_metadata(model_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Model ID '{model_id}' not found in registry.")
    return meta.model_dump()
