from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.playback_event_service import playback_event_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.activity import PlaybackEventSummaryResponse

router = APIRouter()

@router.get(
    "/events",
    response_model=StandardResponse[List[PlaybackEventSummaryResponse]],
    summary="Get Playback Events",
    description="Retrieve paginated playback events for the current user.",
    operation_id="get_playback_events",
    responses={401: {"model": ErrorResponse}}
)
async def get_playback_events(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    event_type: Optional[str] = Query(None, description="PLAY, PAUSE, RESUME, SEEK, SKIP, NEXT, PREVIOUS, COMPLETE"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    events = await playback_event_service.get_events(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        event_type=event_type
    )
    return StandardResponse.success(
        data=events,
        message="Playback events retrieved successfully"
    )
