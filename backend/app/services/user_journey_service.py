from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import UserJourneyResponse, FunnelStep
from app.schemas.analytics import AnalyticsFilter
from app.repositories.user_journey_repository import user_journey_repo

class UserJourneyService:
    """
    Business logic for user onboarding conversion and funnel drop-off analysis.
    """

    async def get_funnel_analysis(self, db: AsyncSession, filters: AnalyticsFilter) -> UserJourneyResponse:
        raw_funnel = await user_journey_repo.get_onboarding_funnel(db, filters)
        steps = [FunnelStep(**s) for s in raw_funnel["steps"]]

        return UserJourneyResponse(
            funnel_name=raw_funnel["funnel_name"],
            total_started=raw_funnel["total_started"],
            total_completed=raw_funnel["total_completed"],
            overall_conversion_rate=raw_funnel["overall_conversion_rate"],
            steps=steps
        )

user_journey_service = UserJourneyService()
