from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.playlist_service import playlist_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.playlist import (
    PlaylistListResponse,
    PlaylistDetailResponse,
    PlaylistSummaryResponse,
    PlaylistCreateRequest,
    PlaylistUpdateRequest,
    PlaylistAddSongRequest
)

router = APIRouter()

@router.get(
    "",
    response_model=StandardResponse[PlaylistListResponse],
    summary="Get Playlists",
    description="Retrieve paginated playlists for the current user.",
    operation_id="get_playlists",
    responses={401: {"model": ErrorResponse}}
)
async def get_playlists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    sort_by: str = Query("created_at"),
    sort_desc: bool = Query(True),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlists = await playlist_service.get_playlists(
        db,
        user_id=current_user.id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        sort_desc=sort_desc
    )
    return StandardResponse.success(
        data=PlaylistListResponse(playlists=playlists),
        message="Playlists retrieved successfully"
    )

@router.get(
    "/{id}",
    response_model=StandardResponse[PlaylistDetailResponse],
    summary="Get Playlist Detail",
    description="Retrieve details of a specific playlist.",
    operation_id="get_playlist_detail",
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def get_playlist_detail(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    detail = await playlist_service.get_playlist_detail(db, playlist_id=id, user_id=current_user.id)
    return StandardResponse.success(
        data=detail,
        message="Playlist detail retrieved successfully"
    )

@router.post(
    "",
    response_model=StandardResponse[PlaylistSummaryResponse],
    status_code=status.HTTP_201_CREATED,
    summary="Create Playlist",
    description="Create a new playlist for the current user.",
    operation_id="create_playlist",
    responses={
        401: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def create_playlist(
    req: PlaylistCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = await playlist_service.create_playlist(db, user_id=current_user.id, req=req)
    return StandardResponse.success(
        data=playlist,
        message="Playlist created successfully"
    )

@router.patch(
    "/{id}",
    response_model=StandardResponse[PlaylistSummaryResponse],
    summary="Update Playlist",
    description="Update a specific playlist.",
    operation_id="update_playlist",
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def update_playlist(
    id: int,
    req: PlaylistUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    playlist = await playlist_service.update_playlist(db, playlist_id=id, user_id=current_user.id, req=req)
    return StandardResponse.success(
        data=playlist,
        message="Playlist updated successfully"
    )

@router.delete(
    "/{id}",
    response_model=StandardResponse[dict],
    summary="Delete Playlist",
    description="Soft delete a specific playlist.",
    operation_id="delete_playlist",
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def delete_playlist(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await playlist_service.delete_playlist(db, playlist_id=id, user_id=current_user.id)
    return StandardResponse.success(
        data={},
        message="Playlist deleted successfully"
    )

@router.post(
    "/{id}/songs",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_201_CREATED,
    summary="Add Song to Playlist",
    description="Add a track to a playlist.",
    operation_id="add_song_to_playlist",
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def add_song_to_playlist(
    id: int,
    req: PlaylistAddSongRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    pos = req.position if req.position is not None else 0
    await playlist_service.add_song(db, playlist_id=id, song_id=req.song_id, user_id=current_user.id, position=pos)
    return StandardResponse.success(
        data={},
        message="Song added to playlist successfully"
    )

@router.delete(
    "/{id}/songs/{song_id}",
    response_model=StandardResponse[dict],
    summary="Remove Song from Playlist",
    description="Remove a track from a playlist.",
    operation_id="remove_song_from_playlist",
    responses={
        401: {"model": ErrorResponse},
        403: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def remove_song_from_playlist(
    id: int,
    song_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await playlist_service.remove_song(db, playlist_id=id, song_id=song_id, user_id=current_user.id)
    return StandardResponse.success(
        data={},
        message="Song removed from playlist successfully"
    )
