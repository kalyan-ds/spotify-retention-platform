from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from app.schemas.analytics import (
    AnalyticsFilter,
    KPICollectionResponse,
    KPIResponse,
    TrendSeriesResponse,
    TrendPointResponse
)
from app.repositories.revenue_analytics_repository import revenue_analytics_repo
from app.services.kpi_engine import kpi_engine

class RevenueAnalyticsService:

    async def get_revenue_kpis(self, db: AsyncSession, filters: AnalyticsFilter) -> KPICollectionResponse:
        # In a real enterprise app we would calculate delta against previous period
        # For simplicity, we just fetch current values here.
        total_revenue = await revenue_analytics_repo.get_total_revenue(db, filters)
        mrr = await revenue_analytics_repo.get_mrr(db, filters)
        arr = mrr * 12

        metrics = [
            KPIResponse(
                name="Total Revenue",
                value=total_revenue,
                delta_percentage=0.0, # Placeholder for previous period logic
                trend_direction="flat"
            ),
            KPIResponse(
                name="MRR",
                value=mrr,
                delta_percentage=0.0,
                trend_direction="flat"
            ),
            KPIResponse(
                name="ARR",
                value=arr,
                delta_percentage=0.0,
                trend_direction="flat"
            )
        ]

        return KPICollectionResponse(metrics=metrics)

    async def get_revenue_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> TrendSeriesResponse:
        records = await revenue_analytics_repo.get_revenue_trend(db, filters)

        data_points = []
        for record in records:
            data_points.append(TrendPointResponse(
                date=record.day,
                value=record.total
            ))

        return TrendSeriesResponse(
            metric_name="Revenue Trend",
            data_points=data_points
        )

revenue_analytics_service = RevenueAnalyticsService()
