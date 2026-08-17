from typing import List
from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.device_repository import device_repo
from app.schemas.activity import DeviceSummaryResponse, DeviceDetailResponse

class DeviceService:
    async def get_devices(
        self,
        db: AsyncSession,
        *,
        user_id: int,
        skip: int = 0,
        limit: int = 100
    ) -> List[DeviceSummaryResponse]:

        devices = await device_repo.get_devices(db, user_id=user_id, skip=skip, limit=limit)
        results = []
        for d in devices:
            results.append(DeviceSummaryResponse(
                id=d.id,
                device_type=d.device_type,
                platform=d.platform,
                last_active=d.updated_at
            ))
        return results

    async def get_device_detail(
        self,
        db: AsyncSession,
        device_id: int,
        user_id: int
    ) -> DeviceDetailResponse:

        d = await device_repo.get(db, id=device_id)
        if not d or getattr(d, "is_deleted", False) or d.user_id != user_id:
            raise HTTPException(status_code=404, detail="Device Not Found")

        return DeviceDetailResponse(
            id=d.id,
            device_type=d.device_type,
            platform=d.platform,
            last_active=d.updated_at,
            operating_system=d.operating_system,
            os_version=d.os_version,
            application_version=d.application_version,
            manufacturer=d.manufacturer,
            model=d.model,
            created_at=d.created_at,
            updated_at=d.updated_at
        )

device_service = DeviceService()
