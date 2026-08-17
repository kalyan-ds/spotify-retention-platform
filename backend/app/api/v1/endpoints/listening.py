from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from datetime import datetime

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.listening_history_service import listening_history_service
from app.services.listening_session_service import listening_session_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.activity import (
    ListeningHistoryListResponse,
    ListeningHistoryDetailResponse,
    ListeningSessionListResponse,
    ListeningSessionDetailResponse
)

router = APIRouter()

# ---------------------------------------------------------
# Listening History
# ---------------------------------------------------------

@router.get(
    "/history",
    response_model=StandardResponse[ListeningHistoryListResponse],
    summary="Get Listening History",
    description="Retrieve paginated listening history for the current user.",
    operation_id="get_listening_history",
    responses={401: {"model": ErrorResponse}, 403: {"model": ErrorResponse}}
)
async def get_listening_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("timestamp"),
    sort_desc: bool = Query(True),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    song_id: Optional[int] = Query(None),
    device_id: Optional[int] = Query(None),
    min_completion: Optional[float] = Query(None),
    skipped: Optional[bool] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = await listening_history_service.get_listening_history(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_desc=sort_desc,
        start_date=start_date,
        end_date=end_date,
        song_id=song_id,
        device_id=device_id,
        min_completion=min_completion,
        skipped=skipped
    )
    return StandardResponse.success(
        data=ListeningHistoryListResponse(history=history),
        message="Listening history retrieved successfully"
    )

@router.get(
    "/history/{id}",
    response_model=StandardResponse[ListeningHistoryDetailResponse],
    summary="Get Listening History Detail",
    description="Retrieve details of a specific listening history record.",
    operation_id="get_listening_history_detail",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def get_listening_history_detail(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detail = await listening_history_service.get_listening_history_detail(db, history_id=id, user_id=current_user.id)
    return StandardResponse.success(
        data=detail,
        message="Listening history detail retrieved successfully"
    )

# ---------------------------------------------------------
# Listening Sessions
# ---------------------------------------------------------

@router.get(
    "/sessions",
    response_model=StandardResponse[ListeningSessionListResponse],
    summary="Get Listening Sessions",
    description="Retrieve paginated listening sessions for the current user.",
    operation_id="get_listening_sessions",
    responses={401: {"model": ErrorResponse}}
)
async def get_listening_sessions(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("start_time"),
    sort_desc: bool = Query(True),
    start_date: Optional[datetime] = Query(None),
    end_date: Optional[datetime] = Query(None),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    sessions = await listening_session_service.get_sessions(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_desc=sort_desc,
        start_date=start_date,
        end_date=end_date
    )
    return StandardResponse.success(
        data=ListeningSessionListResponse(sessions=sessions),
        message="Listening sessions retrieved successfully"
    )

@router.get(
    "/sessions/{id}",
    response_model=StandardResponse[ListeningSessionDetailResponse],
    summary="Get Listening Session Detail",
    description="Retrieve details of a specific listening session.",
    operation_id="get_listening_session_detail",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def get_listening_session_detail(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detail = await listening_session_service.get_session_detail(db, session_id=id, user_id=current_user.id)
    return StandardResponse.success(
        data=detail,
        message="Listening session detail retrieved successfully"
    )
