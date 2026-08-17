from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.system import UserPreference, ActivityLog

class UserPreferenceRepository(BaseRepository[UserPreference, dict, dict]):
    def __init__(self):
        super().__init__(UserPreference)

    async def get_by_user_id(self, db: AsyncSession, user_id: int) -> Optional[UserPreference]:
        query = select(UserPreference).where(UserPreference.user_id == user_id)
        result = await db.execute(query)
        return result.scalar_one_or_none()

class ActivityLogRepository(BaseRepository[ActivityLog, dict, dict]):
    def __init__(self):
        super().__init__(ActivityLog)

preference_repo = UserPreferenceRepository()
activity_repo = ActivityLogRepository()
