from typing import List, Optional
from fastapi import APIRouter, Depends, Path, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, Pagination, ErrorResponse
from app.schemas.catalog import SongSummaryResponse, SongDetailResponse
from app.services.song_service import SongService

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_403_FORBIDDEN: {"model": ErrorResponse, "description": "Forbidden"},
    status.HTTP_404_NOT_FOUND: {"model": ErrorResponse, "description": "Not Found"},
    status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Validation Error"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}

@router.get(
    "/",
    response_model=StandardResponse[List[SongSummaryResponse]],
    summary="List songs",
    description="Retrieve a paginated list of songs.",
    operation_id="list_songs",
    responses=common_responses
)
async def list_songs(
    request: Request,
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    sort_by: str = Query("title", description="Field to sort by"),
    sort_order: str = Query("asc", description="Sort order (asc/desc)"),
    q: Optional[str] = Query(None, description="Search term for song title"),
    album_id: Optional[int] = Query(None, description="Filter by album ID"),
    is_explicit: Optional[bool] = Query(None, description="Filter by explicit content"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    skip = (page - 1) * page_size

    songs, total = await SongService.get_songs(
        db, skip=skip, limit=page_size, q=q, album_id=album_id, is_explicit=is_explicit,
        sort_by=sort_by, sort_order=sort_order
    )

    total_pages = (total + page_size - 1) // page_size

    return StandardResponse(
        success=True,
        data=songs,
        pagination=Pagination(
            page=page,
            page_size=page_size,
            total_items=total,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_previous=page > 1
        ),
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )

@router.get(
    "/{song_id}",
    response_model=StandardResponse[SongDetailResponse],
    summary="Get song details",
    description="Retrieve detailed information about a specific song.",
    operation_id="get_song_by_id",
    responses=common_responses
)
async def get_song(
    request: Request,
    song_id: int = Path(..., description="ID of the song"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    song_dto = await SongService.get_song_by_id(db, song_id)
    return StandardResponse(
        success=True,
        data=song_dto,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
