from typing import List
from fastapi import APIRouter, Depends, Path, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.user import UserDeviceResponse
from app.repositories.user_repo import session_repo

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}

@router.get(
    "/",
    response_model=StandardResponse[List[UserDeviceResponse]],
    summary="List active sessions",
    description="Retrieve a list of active sessions (devices) for the authenticated user.",
    operation_id="list_sessions",
    responses=common_responses
)
async def list_sessions(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    sessions = await session_repo.get_active_sessions(db, current_user.id)
    return StandardResponse(
        success=True,
        data=sessions,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.delete(
    "/all",
    response_model=StandardResponse[None],
    summary="Revoke all sessions",
    description="Logout from all devices by revoking all active sessions for the user.",
    operation_id="revoke_all_sessions",
    responses=common_responses
)
async def revoke_all_sessions(
    request: Request,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    await session_repo.revoke_all_user_sessions(db, current_user.id)
    return StandardResponse(
        success=True,
        data=None,
        message="All sessions revoked successfully",
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.delete(
    "/{session_id}",
    response_model=StandardResponse[None],
    summary="Revoke specific session",
    description="Logout from a specific device by revoking its session. Must belong to the authenticated user.",
    operation_id="revoke_session",
    responses=common_responses
)
async def revoke_session(
    request: Request,
    session_id: int = Path(..., description="ID of the session to revoke"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    await session_repo.revoke_session_by_id(db, session_id, current_user.id)
    return StandardResponse(
        success=True,
        data=None,
        message="Session revoked successfully",
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
