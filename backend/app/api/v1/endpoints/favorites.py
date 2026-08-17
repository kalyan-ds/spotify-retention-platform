from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.services.favorite_service import favorite_service
from app.schemas.responses import StandardResponse, ErrorResponse
from app.schemas.activity import FavoriteSongResponse, FavoriteArtistResponse

router = APIRouter()

@router.get(
    "/songs",
    response_model=StandardResponse[List[FavoriteSongResponse]],
    summary="Get Favorite Songs",
    description="Retrieve paginated favorite songs for the current user.",
    operation_id="get_favorite_songs",
    responses={401: {"model": ErrorResponse}}
)
async def get_favorite_songs(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favs = await favorite_service.get_favorite_songs(db, user_id=current_user.id, skip=skip, limit=limit)
    return StandardResponse.success(
        data=favs,
        message="Favorite songs retrieved successfully"
    )

@router.post(
    "/songs/{id}",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_201_CREATED,
    summary="Add Favorite Song",
    description="Add a song to favorites.",
    operation_id="add_favorite_song",
    responses={
        401: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def add_favorite_song(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await favorite_service.add_favorite_song(db, user_id=current_user.id, song_id=id)
    return StandardResponse.success(data={}, message="Song added to favorites")

@router.delete(
    "/songs/{id}",
    response_model=StandardResponse[dict],
    summary="Remove Favorite Song",
    description="Remove a song from favorites.",
    operation_id="remove_favorite_song",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def remove_favorite_song(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await favorite_service.remove_favorite_song(db, user_id=current_user.id, song_id=id)
    return StandardResponse.success(data={}, message="Song removed from favorites")


@router.get(
    "/artists",
    response_model=StandardResponse[List[FavoriteArtistResponse]],
    summary="Get Favorite Artists",
    description="Retrieve paginated favorite artists for the current user.",
    operation_id="get_favorite_artists",
    responses={401: {"model": ErrorResponse}}
)
async def get_favorite_artists(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    favs = await favorite_service.get_favorite_artists(db, user_id=current_user.id, skip=skip, limit=limit)
    return StandardResponse.success(
        data=favs,
        message="Favorite artists retrieved successfully"
    )

@router.post(
    "/artists/{id}",
    response_model=StandardResponse[dict],
    status_code=status.HTTP_201_CREATED,
    summary="Add Favorite Artist",
    description="Add an artist to favorites.",
    operation_id="add_favorite_artist",
    responses={
        401: {"model": ErrorResponse},
        422: {"model": ErrorResponse}
    }
)
async def add_favorite_artist(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await favorite_service.add_favorite_artist(db, user_id=current_user.id, artist_id=id)
    return StandardResponse.success(data={}, message="Artist added to favorites")

@router.delete(
    "/artists/{id}",
    response_model=StandardResponse[dict],
    summary="Remove Favorite Artist",
    description="Remove an artist from favorites.",
    operation_id="remove_favorite_artist",
    responses={
        401: {"model": ErrorResponse},
        404: {"model": ErrorResponse}
    }
)
async def remove_favorite_artist(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    await favorite_service.remove_favorite_artist(db, user_id=current_user.id, artist_id=id)
    return StandardResponse.success(data={}, message="Artist removed from favorites")
