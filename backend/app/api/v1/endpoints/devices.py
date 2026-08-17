from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.device_service import device_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.activity import DeviceSummaryResponse, DeviceDetailResponse

router = APIRouter()

@router.get(
    "",
    response_model=StandardResponse[List[DeviceSummaryResponse]],
    summary="Get Devices",
    description="Retrieve paginated devices for the current user.",
    operation_id="get_devices",
    responses={401: {"model": ErrorResponse}}
)
async def get_devices(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    devices = await device_service.get_devices(db, user_id=current_user.id, skip=skip, limit=limit)
    return StandardResponse.success(
        data=devices,
        message="Devices retrieved successfully"
    )

@router.get(
    "/{id}",
    response_model=StandardResponse[DeviceDetailResponse],
    summary="Get Device Detail",
    description="Retrieve details of a specific device.",
    operation_id="get_device_detail",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def get_device_detail(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detail = await device_service.get_device_detail(db, device_id=id, user_id=current_user.id)
    return StandardResponse.success(
        data=detail,
        message="Device detail retrieved successfully"
    )
