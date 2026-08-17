from typing import Optional, Dict, List, Any
from fastapi import APIRouter, Depends, Query, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_db, get_current_user, get_request_id, get_processing_time_ms
from app.models.auth import User
from app.schemas.responses import StandardResponse, ErrorResponse
from app.services.music_search_service import MusicSearchService

router = APIRouter()

common_responses = {
    status.HTTP_401_UNAUTHORIZED: {"model": ErrorResponse, "description": "Unauthorized"},
    status.HTTP_422_UNPROCESSABLE_ENTITY: {"model": ErrorResponse, "description": "Validation Error"},
    status.HTTP_500_INTERNAL_SERVER_ERROR: {"model": ErrorResponse, "description": "Internal Server Error"},
}

@router.get(
    "/",
    response_model=StandardResponse[Dict[str, List[Any]]],
    summary="Global music search",
    description="Perform a cross-entity search across artists, albums, songs, and genres.",
    operation_id="global_music_search",
    responses=common_responses
)
async def search(
    request: Request,
    q: str = Query(..., min_length=1, description="Search query string"),
    type: str = Query("all", description="Entity type to search (all, artist, album, song, genre)"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
    req_id: str = Depends(get_request_id)
):
    skip = (page - 1) * page_size

    results = await MusicSearchService.global_search(
        db, q=q, entity_type=type, skip=skip, limit=page_size
    )

    return StandardResponse(
        success=True,
        data=results,
        request_id=req_id,
        processing_time_ms=get_processing_time_ms(request)
    )
