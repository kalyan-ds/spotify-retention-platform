from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc

from app.models.system import ActivityLog
from app.repositories.base import BaseRepository

class PlaybackEventRepository(BaseRepository[ActivityLog, dict, dict]):
    def __init__(self):
        super().__init__(ActivityLog)

    async def get_events(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100,
        event_type: Optional[str] = None
    ) -> List[ActivityLog]:

        query = select(self.model).where(
            and_(self.model.user_id == user_id, self.model.action == "playback_event")
        )

        # We can't strictly filter JSON field in basic SQLAlchemy easily across all DB engines,
        # but normally we could use PostgreSQL jsonb operators if needed.
        # For this mock/exercise, we'll return the base query and service layer can filter or we just rely on no DB-level JSON filter if not postgres.
        # Since it's a simple query, let's just order and limit.
        query = query.order_by(desc(self.model.created_at))
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        events = list(result.scalars().all())

        if event_type:
            # Filter in Python to avoid raw json DB specific queries
            events = [e for e in events if e.details and e.details.get("event_type") == event_type]

        return events

playback_event_repo = PlaybackEventRepository()
