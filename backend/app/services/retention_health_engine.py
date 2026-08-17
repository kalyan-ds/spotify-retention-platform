from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.retention import RetentionHealthResponse, UserPersonaResponse
from app.schemas.analytics import AnalyticsFilter

class RetentionHealthEngine:
    """
    Calculates a normalized health score per user, cohort, or segment.
    Evaluates business rules to assign users to Persona buckets.
    """

    async def get_segment_health(self, db: AsyncSession, filters: AnalyticsFilter) -> RetentionHealthResponse:
        """
        Stub calculation for overall platform health and persona distribution.
        In reality, this would aggregate `user.health_score` populated by nightly jobs.
        """

        # Hardcoded stubs for the blueprint
        score = 72.5
        category = self._get_category(score)

        personas = [
            UserPersonaResponse(persona_name="Power User", user_count=5000, percentage_of_base=5.0),
            UserPersonaResponse(persona_name="Loyal User", user_count=20000, percentage_of_base=20.0),
            UserPersonaResponse(persona_name="Active User", user_count=45000, percentage_of_base=45.0),
            UserPersonaResponse(persona_name="At Risk", user_count=10000, percentage_of_base=10.0),
            UserPersonaResponse(persona_name="Dormant", user_count=20000, percentage_of_base=20.0),
        ]

        return RetentionHealthResponse(
            overall_health_score=score,
            health_category=category,
            personas=personas
        )

    def _get_category(self, score: float) -> str:
        if score >= 81: return "Excellent"
        if score >= 61: return "Good"
        if score >= 41: return "Average"
        if score >= 21: return "Poor"
        return "Critical"

retention_health_engine = RetentionHealthEngine()
