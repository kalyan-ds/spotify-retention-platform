from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.api.deps import get_db, get_current_user
from app.models.auth import User
from app.schemas.responses import StandardResponse
from app.schemas.dashboard import DashboardCardResponse, ChartResponse, DashboardSummaryResponse
from app.services.dashboard_service import dashboard_service

router = APIRouter()

@router.get("/cards", response_model=StandardResponse[List[DashboardCardResponse]])
async def get_dashboard_cards(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await dashboard_service.get_dashboard_cards(db)
    return StandardResponse(data=data)

@router.get("/charts", response_model=StandardResponse[ChartResponse])
async def get_dashboard_charts(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await dashboard_service.get_dashboard_charts(db)
    return StandardResponse(data=data)

@router.get("/summary", response_model=StandardResponse[DashboardSummaryResponse])
async def get_dashboard_summary(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = await dashboard_service.get_dashboard_summary(db)
    return StandardResponse(data=data)
