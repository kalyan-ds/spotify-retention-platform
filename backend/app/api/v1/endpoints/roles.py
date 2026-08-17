from typing import List
from fastapi import APIRouter, Depends, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, RequireRole, get_request_id, get_processing_time_ms
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.user import RoleResponse, PermissionResponse
from app.services.role import RoleService

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_403_FORBIDDEN: {"model": ErrorResponse, "description": "Forbidden"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}

@router.get(
    "/",
    response_model=StandardResponse[List[RoleResponse]],
    summary="List roles",
    description="Retrieve all system roles. Requires Admin role.",
    operation_id="list_roles",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def list_roles(
    request: Request,
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    roles = await RoleService.get_roles(db)
    return StandardResponse(
        success=True,
        data=roles,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.get(
    "/permissions",
    response_model=StandardResponse[List[PermissionResponse]],
    summary="List permissions",
    description="Retrieve all available system permissions. Requires Admin role.",
    operation_id="list_permissions",
    responses=common_responses,
    dependencies=[Depends(RequireRole(["admin"]))]
)
async def list_permissions(
    request: Request,
    db: AsyncSession = Depends(get_db),
    req_id: str = Depends(get_request_id)
):
    permissions = await RoleService.get_permissions(db)
    return StandardResponse(
        success=True,
        data=permissions,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
