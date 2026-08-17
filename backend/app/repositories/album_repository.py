from typing import List, Tuple, Optional
from sqlalchemy import select, func, asc, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.catalog import Album

class AlbumRepository(BaseRepository[Album, dict, dict]):
    def __init__(self):
        super().__init__(Album)

    async def get_album_detail(self, db: AsyncSession, album_id: int) -> Optional[Album]:
        query = (
            select(Album)
            .options(
                selectinload(Album.artist),
                selectinload(Album.songs)
            )
            .where(Album.id == album_id, Album.is_deleted == False)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def search_and_filter(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        artist_id: Optional[int] = None,
        album_type: Optional[str] = None,
        sort_by: str = "release_date",
        sort_order: str = "desc"
    ) -> Tuple[List[Album], int]:

        base_query = select(Album).where(Album.is_deleted == False)

        # Filtering
        if q:
            base_query = base_query.where(Album.title.ilike(f"%{q}%"))
        if artist_id:
            base_query = base_query.where(Album.artist_id == artist_id)
        if album_type:
            base_query = base_query.where(Album.album_type == album_type)

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Sorting
        sort_column = getattr(Album, sort_by, Album.release_date)
        if sort_order.lower() == "desc":
            base_query = base_query.order_by(desc(sort_column))
        else:
            base_query = base_query.order_by(asc(sort_column))

        # Pagination
        query = base_query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

album_repo = AlbumRepository()
