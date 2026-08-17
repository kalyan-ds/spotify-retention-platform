from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc

from app.models.listening import SearchHistory
from app.repositories.base import BaseRepository

class SearchHistoryRepository(BaseRepository[SearchHistory, dict, dict]):
    def __init__(self):
        super().__init__(SearchHistory)

    async def get_search_history(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[SearchHistory]:

        query = select(self.model).where(self.model.user_id == user_id)
        query = query.order_by(desc(self.model.timestamp))
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

search_history_repo = SearchHistoryRepository()
