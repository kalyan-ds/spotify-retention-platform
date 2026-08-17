from typing import List, Tuple, Optional
from sqlalchemy import select, func, asc, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.catalog import Song

class SongRepository(BaseRepository[Song, dict, dict]):
    def __init__(self):
        super().__init__(Song)

    async def get_song_detail(self, db: AsyncSession, song_id: int) -> Optional[Song]:
        query = (
            select(Song)
            .options(
                selectinload(Song.album),
                selectinload(Song.song_artists),
                selectinload(Song.song_genres)
            )
            .where(Song.id == song_id, Song.is_deleted == False)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def search_and_filter(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        album_id: Optional[int] = None,
        is_explicit: Optional[bool] = None,
        sort_by: str = "title",
        sort_order: str = "asc"
    ) -> Tuple[List[Song], int]:

        base_query = select(Song).where(Song.is_deleted == False)

        # Filtering
        if q:
            base_query = base_query.where(Song.title.ilike(f"%{q}%"))
        if album_id:
            base_query = base_query.where(Song.album_id == album_id)
        if is_explicit is not None:
            base_query = base_query.where(Song.is_explicit == is_explicit)

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Sorting
        sort_column = getattr(Song, sort_by, Song.title)
        if sort_order.lower() == "desc":
            base_query = base_query.order_by(desc(sort_column))
        else:
            base_query = base_query.order_by(asc(sort_column))

        # Pagination
        query = base_query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

song_repo = SongRepository()
