from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.artist_repository import artist_repo
from app.schemas.catalog import ArtistSummaryResponse, ArtistDetailResponse, GenreSummaryResponse
from app.models.catalog import Artist

class ArtistService:
    @staticmethod
    async def get_artists(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        country: Optional[str] = None,
        sort_by: str = "name",
        sort_order: str = "asc"
    ) -> Tuple[List[ArtistSummaryResponse], int]:

        artists, total = await artist_repo.search_and_filter(
            db, skip=skip, limit=limit, q=q, country=country, sort_by=sort_by, sort_order=sort_order
        )

        # Map to DTO
        responses = [ArtistSummaryResponse.model_validate(a) for a in artists]
        return responses, total

    @staticmethod
    async def get_artist_by_id(db: AsyncSession, artist_id: int) -> ArtistDetailResponse:
        artist = await artist_repo.get_artist_detail(db, artist_id)
        if not artist:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Artist not found"
            )

        # The Genres will be populated from a different relation if needed,
        # or we map from song_artists -> songs -> genres if complex.
        # For simplicity in Iteration 6B, we use an empty list for genres if not direct relation.
        # Assuming genres can be derived or left empty as per schema limits.

        dto = ArtistDetailResponse.model_validate(artist)
        return dto
