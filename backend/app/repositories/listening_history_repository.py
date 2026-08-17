from typing import List, Optional, Any
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload, joinedload

from app.models.listening import ListeningHistory
from app.repositories.base import BaseRepository

class ListeningHistoryRepository(BaseRepository[ListeningHistory, dict, dict]):
    def __init__(self):
        super().__init__(ListeningHistory)

    async def get_history(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "timestamp",
        sort_desc: bool = True,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None,
        song_id: Optional[int] = None,
        device_id: Optional[int] = None,
        min_completion: Optional[float] = None,
        skipped: Optional[bool] = None
    ) -> List[ListeningHistory]:

        query = select(self.model).where(self.model.user_id == user_id)

        # Filtering
        if start_date:
            query = query.where(self.model.timestamp >= start_date)
        if end_date:
            query = query.where(self.model.timestamp <= end_date)
        if song_id:
            query = query.where(self.model.song_id == song_id)
        if device_id:
            query = query.where(self.model.device_id == device_id)
        if min_completion is not None:
            query = query.where(self.model.completion_percentage >= min_completion)
        if skipped is not None:
            query = query.where(self.model.skipped == skipped)

        # Sorting
        sort_column = getattr(self.model, sort_by, self.model.timestamp)
        if sort_desc:
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        # Eager loading
        query = query.options(
            selectinload(self.model.song).selectinload("album"),
            selectinload(self.model.song).selectinload("song_artists"),
            selectinload(self.model.device),
            selectinload(self.model.session)
        )

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_with_details(self, db: AsyncSession, id: int, user_id: int) -> Optional[ListeningHistory]:
        query = select(self.model).where(
            and_(self.model.id == id, self.model.user_id == user_id)
        ).options(
            selectinload(self.model.song).selectinload("album"),
            selectinload(self.model.song).selectinload("song_artists"),
            selectinload(self.model.device),
            selectinload(self.model.session)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

listening_history_repo = ListeningHistoryRepository()
