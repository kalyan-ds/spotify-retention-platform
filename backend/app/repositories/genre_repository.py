from typing import List, Tuple, Optional
from sqlalchemy import select, func, asc, desc
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.catalog import Genre

class GenreRepository(BaseRepository[Genre, dict, dict]):
    def __init__(self):
        super().__init__(Genre)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Genre]:
        query = select(Genre).where(Genre.name == name, Genre.is_deleted == False)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def search_and_filter(
        self,
        db: AsyncSession,
        skip: int = 0,
        limit: int = 20,
        q: Optional[str] = None,
        sort_by: str = "name",
        sort_order: str = "asc"
    ) -> Tuple[List[Genre], int]:

        base_query = select(Genre).where(Genre.is_deleted == False)

        # Filtering
        if q:
            base_query = base_query.where(Genre.name.ilike(f"%{q}%"))

        # Total count
        count_query = select(func.count()).select_from(base_query.subquery())
        total_result = await db.execute(count_query)
        total = total_result.scalar_one()

        # Sorting
        sort_column = getattr(Genre, sort_by, Genre.name)
        if sort_order.lower() == "desc":
            base_query = base_query.order_by(desc(sort_column))
        else:
            base_query = base_query.order_by(asc(sort_column))

        # Pagination
        query = base_query.offset(skip).limit(limit)

        result = await db.execute(query)
        return list(result.scalars().all()), total

genre_repo = GenreRepository()
