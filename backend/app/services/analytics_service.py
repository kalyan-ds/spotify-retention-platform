from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.analytics_repository import analytics_repo
from app.schemas.analytics import KPICollectionResponse, KPIResponse

class AnalyticsService:
    async def get_executive_kpis(self, db: AsyncSession) -> KPICollectionResponse:
        total_users = await analytics_repo.get_total_users(db)
        premium_users = await analytics_repo.get_premium_users(db)
        free_users = total_users - premium_users

        metrics = [
            KPIResponse(name="Total Users", value=total_users),
            KPIResponse(name="Premium Users", value=premium_users),
            KPIResponse(name="Free Users", value=max(0, free_users))
        ]

        return KPICollectionResponse(metrics=metrics)

    async def get_overview(self, db: AsyncSession) -> KPICollectionResponse:
        total_users = await analytics_repo.get_total_users(db)
        catalog = await analytics_repo.get_catalog_totals(db)

        metrics = [
            KPIResponse(name="Total Users", value=total_users),
            KPIResponse(name="Total Songs", value=catalog.get("total_songs", 0)),
            KPIResponse(name="Total Artists", value=catalog.get("total_artists", 0)),
            KPIResponse(name="Total Albums", value=catalog.get("total_albums", 0))
        ]

        return KPICollectionResponse(metrics=metrics)

analytics_service = AnalyticsService()
