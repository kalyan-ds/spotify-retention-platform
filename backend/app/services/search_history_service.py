from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.search_history_repository import search_history_repo
from app.schemas.activity import SearchHistorySummaryResponse

class SearchHistoryService:
    async def get_search_history(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[SearchHistorySummaryResponse]:

        history = await search_history_repo.get_search_history(db, user_id=user_id, skip=skip, limit=limit)
        results = []
        for h in history:
            results.append(SearchHistorySummaryResponse(
                id=h.id,
                query=h.query,
                timestamp=h.timestamp
            ))
        return results

search_history_service = SearchHistoryService()
