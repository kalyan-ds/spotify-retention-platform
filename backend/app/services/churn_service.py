from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.retention import ChurnDistributionResponse
from app.schemas.analytics import AnalyticsFilter, KPICollectionResponse, KPIResponse
from app.repositories.retention_churn_repository import retention_churn_repo
from app.services.kpi_engine import kpi_engine

class ChurnService:
    """
    Calculates Churn KPIs and segments churn distributions.
    """

    async def get_churn_kpis(self, db: AsyncSession, filters: AnalyticsFilter) -> KPICollectionResponse:
        churned = await retention_churn_repo.get_churned_users_count(db, filters)
        active_at_start = await retention_churn_repo.get_active_users_start_of_period(db, filters)

        churn_rate = kpi_engine.calculate_churn_rate(churned, active_at_start)

        metrics = [
            KPIResponse(
                name="Churn Rate",
                value=round(churn_rate, 2),
                delta_percentage=0.0,
                trend_direction="flat"
            ),
            KPIResponse(
                name="Churned Users",
                value=churned,
                delta_percentage=0.0,
                trend_direction="flat"
            )
        ]

        return KPICollectionResponse(metrics=metrics)

    async def get_churn_distribution(self, db: AsyncSession, filters: AnalyticsFilter) -> ChurnDistributionResponse:
        raw_distribution = await retention_churn_repo.get_churn_distribution(db, filters)

        total_churned = sum([r.count for r in raw_distribution])
        churn_rate = 0.0 # Placeholder, requires full user base to calculate global rate

        segments = []
        for row in raw_distribution:
            segments.append({
                "segment_name": row.reason,
                "churn_count": row.count,
                "churn_rate": kpi_engine.calculate_conversion_rate(row.count, total_churned) if total_churned else 0.0
            })

        return ChurnDistributionResponse(
            total_churned=total_churned,
            overall_churn_rate=churn_rate,
            segments=segments
        )

churn_service = ChurnService()
