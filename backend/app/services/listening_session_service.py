from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.listening_session_repository import listening_session_repo
from app.schemas.activity import ListeningSessionSummaryResponse, ListeningSessionDetailResponse

class ListeningSessionService:
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
    ) -> List[ListeningSessionSummaryResponse]:

        sessions = await listening_session_repo.get_sessions(
            db,
            user_id=user_id,
            skip=skip,
            limit=limit,
            sort_by=sort_by,
            sort_desc=sort_desc,
            start_date=start_date,
            end_date=end_date
        )

        results = []
        for s in sessions:
            results.append(ListeningSessionSummaryResponse(
                id=s.id,
                start_time=s.start_time,
                end_time=s.end_time,
                duration_ms=s.duration_ms,
                is_active=s.is_active
            ))
        return results

    async def get_session_detail(
        self,
        db: AsyncSession,
        session_id: int,
        user_id: int
    ) -> ListeningSessionDetailResponse:

        s = await listening_session_repo.get_with_details(db, id=session_id, user_id=user_id)
        if not s:
            raise HTTPException(status_code=404, detail="Listening Session Not Found")

        detail = ListeningSessionDetailResponse(
            id=s.id,
            start_time=s.start_time,
            end_time=s.end_time,
            duration_ms=s.duration_ms,
            is_active=s.is_active,
            created_at=s.created_at,
            updated_at=s.updated_at
        )
        return detail

listening_session_service = ListeningSessionService()
