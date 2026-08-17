from typing import List, Optional
from datetime import datetime
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.base import BaseRepository
from app.models.listening import ListeningHistory, ListeningSession, Device

class ListeningHistoryRepository(BaseRepository[ListeningHistory, dict, dict]):
    def __init__(self):
        super().__init__(ListeningHistory)

    async def get_recent_for_user(self, db: AsyncSession, user_id: int, limit: int = 50) -> List[ListeningHistory]:
        query = (
            select(ListeningHistory)
            .where(ListeningHistory.user_id == user_id)
            .order_by(ListeningHistory.timestamp.desc())
            .limit(limit)
        )
        result = await db.execute(query)
        return result.scalars().all()

class ListeningSessionRepository(BaseRepository[ListeningSession, dict, dict]):
    def __init__(self):
        super().__init__(ListeningSession)

class DeviceRepository(BaseRepository[Device, dict, dict]):
    def __init__(self):
        super().__init__(Device)


listening_history_repo = ListeningHistoryRepository()
listening_session_repo = ListeningSessionRepository()
device_repo = DeviceRepository()
