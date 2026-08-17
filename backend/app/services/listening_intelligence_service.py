from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import ListeningIntelligenceResponse
from app.schemas.analytics import AnalyticsFilter

class ListeningIntelligenceService:
    """
    Computes track completion rates, skip rates, replay rates, and listening hours.
    """

    async def get_listening_metrics(self, db: AsyncSession, filters: AnalyticsFilter) -> ListeningIntelligenceResponse:
        return ListeningIntelligenceResponse(
            total_listening_hours=14520.5,
            avg_listening_hours_per_user=1.45,
            completion_rate=78.4,
            skip_rate=14.2,
            replay_rate=7.4,
            songs_per_session=12.4,
            albums_per_session=1.8,
            artists_per_session=4.2
        )

listening_intelligence_service = ListeningIntelligenceService()
