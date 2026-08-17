from typing import List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, desc, asc

from app.models.listening import Device
from app.repositories.base import BaseRepository

class DeviceRepository(BaseRepository[Device, dict, dict]):
    def __init__(self):
        super().__init__(Device)

    async def get_devices(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[Device]:

        query = select(self.model).where(self.model.user_id == user_id)
        query = query.order_by(desc(self.model.updated_at))
        query = query.offset(skip).limit(limit)

        result = await db.execute(query)
        return result.scalars().all()

device_repo = DeviceRepository()
