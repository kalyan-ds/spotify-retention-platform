from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.album_repository import album_repo
from app.schemas.catalog import AlbumSummaryResponse, AlbumDetailResponse
from app.models.catalog import Album

class AlbumService:
    @staticmethod
    async def get_albums(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        artist_id: Optional[int] = None,
        album_type: Optional[str] = None,
        sort_by: str = "release_date",
        sort_order: str = "desc"
    ) -> Tuple[List[AlbumSummaryResponse], int]:

        albums, total = await album_repo.search_and_filter(
            db, skip=skip, limit=limit, q=q, artist_id=artist_id, album_type=album_type,
            sort_by=sort_by, sort_order=sort_order
        )

        responses = [AlbumSummaryResponse.model_validate(a) for a in albums]
        return responses, total

    @staticmethod
    async def get_album_by_id(db: AsyncSession, album_id: int) -> AlbumDetailResponse:
        album = await album_repo.get_album_detail(db, album_id)
        if not album:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Album not found"
            )

        dto = AlbumDetailResponse.model_validate(album)
        return dto
