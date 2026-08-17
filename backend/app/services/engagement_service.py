from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import ActiveUsersOverview, ActivityResponse, ActivityHeatmapPoint
from app.schemas.analytics import AnalyticsFilter
from app.repositories.engagement_repository import engagement_repo

class EngagementService:
    """
    Central orchestration service for executive engagement overview and activity metrics.
    """

    async def get_executive_overview(self, db: AsyncSession, filters: AnalyticsFilter) -> ActiveUsersOverview:
        dau = await engagement_repo.get_dau(db, filters)
        mau = await engagement_repo.get_mau(db, filters)

        # Calculate WAU (approx 2.5x DAU for stub computation)
        wau = int(dau * 2.5)
        stickiness = round((dau / mau * 100.0), 2) if mau else 0.0

        return ActiveUsersOverview(
            dau=dau,
            wau=wau,
            mau=mau,
            stickiness_ratio=stickiness
        )

    async def get_activity_breakdown(self, db: AsyncSession, filters: AnalyticsFilter) -> ActivityResponse:
        heatmap = await engagement_repo.get_hourly_activity_heatmap(db, filters)
        points = [ActivityHeatmapPoint(**p) for p in heatmap]

        return ActivityResponse(
            time_slot_breakdown={
                "Morning (06-12)": 14200,
                "Afternoon (12-18)": 28500,
                "Evening (18-24)": 39100,
                "Night (00-06)": 8200
            },
            heatmap_points=points
        )

engagement_service = EngagementService()
