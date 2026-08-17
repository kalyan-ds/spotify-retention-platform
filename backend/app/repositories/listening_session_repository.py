from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc
from sqlalchemy.orm import selectinload

from app.models.listening import ListeningSession
from app.repositories.base import BaseRepository

class ListeningSessionRepository(BaseRepository[ListeningSession, dict, dict]):
    def __init__(self):
        super().__init__(ListeningSession)

    async def get_sessions(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        sort_by: str = "start_time",
        sort_desc: bool = True,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[ListeningSession]:

        query = select(self.model).where(self.model.user_id == user_id)

        if start_date:
            query = query.where(self.model.start_time >= start_date)
        if end_date:
            query = query.where(self.model.start_time <= end_date)

        sort_column = getattr(self.model, sort_by, self.model.start_time)
        if sort_desc:
            query = query.order_by(desc(sort_column))
        else:
            query = query.order_by(asc(sort_column))

        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        return result.scalars().all()

    async def get_with_details(self, db: AsyncSession, id: int, user_id: int) -> Optional[ListeningSession]:
        query = select(self.model).where(
            and_(self.model.id == id, self.model.user_id == user_id)
        ).options(
            selectinload(self.model.history).selectinload("song")
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_active_session(self, db: AsyncSession, user_id: int) -> Optional[ListeningSession]:
        query = select(self.model).where(
            and_(self.model.user_id == user_id, self.model.is_active == True)
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

listening_session_repo = ListeningSessionRepository()
