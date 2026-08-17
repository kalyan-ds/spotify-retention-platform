from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.repositories.genre_repository import genre_repo
from app.schemas.catalog import GenreSummaryResponse, GenreDetailResponse
from app.models.catalog import Genre

class GenreService:
    @staticmethod
    async def get_genres(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        sort_by: str = "name",
        sort_order: str = "asc"
    ) -> Tuple[List[GenreSummaryResponse], int]:

        genres, total = await genre_repo.search_and_filter(
            db, skip=skip, limit=limit, q=q, sort_by=sort_by, sort_order=sort_order
        )

        responses = [GenreSummaryResponse.model_validate(g) for g in genres]
        return responses, total

    @staticmethod
    async def get_genre_by_id(db: AsyncSession, genre_id: int) -> GenreDetailResponse:
        genre = await genre_repo.get_by_id(db, genre_id)
        if not genre or genre.is_deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Genre not found"
            )

        dto = GenreDetailResponse.model_validate(genre)
        return dto
