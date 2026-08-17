from typing import List, Tuple, Optional
from sqlalchemy import select, func, asc, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.catalog import Artist

class ArtistRepository(BaseRepository[Artist, dict, dict]):
    def __init__(self):
        super().__init__(Artist)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Artist]:
        query = select(Artist).where(Artist.name == name, Artist.is_deleted == False)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_artist_detail(self, db: AsyncSession, artist_id: int) -> Optional[Artist]:
        query = (
            select(Artist)
            .options(
                selectinload(Artist.albums),
                selectinload(Artist.song_artists)
            )
            .where(Artist.id == artist_id, Artist.is_deleted == False)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def search_and_filter(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        country: Optional[str] = None,
        sort_by: str = "name",
        sort_order: str = "asc"
    ) -> Tuple[List[Artist], int]:

        base_query = select(Artist).where(Artist.is_deleted == False)

        # Filtering
        if q:
            base_query = base_query.where(Artist.name.ilike(f"%{q}%"))
        if country:
            base_query = base_query.where(Artist.country == country)

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Sorting
        sort_column = getattr(Artist, sort_by, Artist.name)
        if sort_order.lower() == "desc":
            base_query = base_query.order_by(desc(sort_column))
        else:
            base_query = base_query.order_by(asc(sort_column))

        # Pagination
        query = base_query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

artist_repo = ArtistRepository()
