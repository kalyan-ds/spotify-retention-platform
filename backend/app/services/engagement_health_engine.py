from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.engagement import EngagementHealthResponse, SubScoreBreakdown
from app.schemas.analytics import AnalyticsFilter

class EngagementHealthEngine:
    """
    Computes a composite Engagement Health Score (0-100) based on weighted formula:
    - 35% Activity Frequency Score
    - 25% Listening Volume & Completion Score
    - 20% Session Quality & Duration Score
    - 20% Feature Breadth Score
    """

    async def calculate_health_score(self, db: AsyncSession, filters: AnalyticsFilter) -> EngagementHealthResponse:
        sub_scores = SubScoreBreakdown(
            activity_score=82.0,
            volume_score=75.5,
            session_quality_score=88.0,
            feature_breadth_score=64.0
        )

        weighted_score = round(
            (0.35 * sub_scores.activity_score) +
            (0.25 * sub_scores.volume_score) +
            (0.20 * sub_scores.session_quality_score) +
            (0.20 * sub_scores.feature_breadth_score),
            1
        )

        category = self._get_category(weighted_score)

        return EngagementHealthResponse(
            overall_engagement_score=weighted_score,
            health_category=category,
            sub_scores=sub_scores
        )

    def _get_category(self, score: float) -> str:
        if score >= 81: return "Excellent"
        if score >= 61: return "Good"
        if score >= 41: return "Average"
        if score >= 21: return "Poor"
        return "Critical"

engagement_health_engine = EngagementHealthEngine()
