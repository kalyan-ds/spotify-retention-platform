from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.search_history_service import search_history_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.activity import SearchHistorySummaryResponse

router = APIRouter()

@router.get(
    "",
    response_model=StandardResponse[List[SearchHistorySummaryResponse]],
    summary="Get Search History",
    description="Retrieve paginated search history for the current user.",
    operation_id="get_search_history",
    responses={401: {"model": ErrorResponse}}
)
async def get_search_history(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    history = await search_history_service.get_search_history(db, user_id=current_user.id, skip=skip, limit=limit)
    return StandardResponse.success(
        data=history,
        message="Search history retrieved successfully"
    )
