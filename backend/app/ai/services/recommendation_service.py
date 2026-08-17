import uuid
from typing import Dict, Any, List
from app.ai.schemas.recommendation import (
    RecommendationDTO,
    NextBestActionDTO,
    PriorityLevelDTO
)

class RecommendationService:
    """
    Prescriptive Next Best Action (NBA) Recommendation Engine.
    Generates targeted retention interventions, upgrade offers, and engagement campaigns.
    """

    def generate_recommendations(
        self, user_id: int, churn_prob: float, risk_tier: str
    ) -> RecommendationDTO:
        rec_id = f"rec_{uuid.uuid4().hex[:8]}"

        if churn_prob >= 0.70 or risk_tier == "Critical":
            primary = NextBestActionDTO(
                action_id="act_001",
                action_code="ACT_PROMO_DISCOUNT",
                category="Retention",
                title="50% Premium Renewal Discount (3 Months)",
                description="Deliver targeted 50% discount offer for next 3 billing cycles via push notification.",
                expected_impact_percentage=38.5,
                confidence_score=0.92,
                priority=PriorityLevelDTO(level="CRITICAL", priority_score=98.0),
                business_justification="Critical churn risk probability requires immediate financial retention incentive."
            )
            secondary = [
                NextBestActionDTO(
                    action_id="act_002",
                    action_code="ACT_REC_PLAYLIST",
                    category="Engagement",
                    title="Curated Discovery Weekly Refresh Push",
                    description="Trigger instant personalized playlist refresh based on favorite genres.",
                    expected_impact_percentage=18.2,
                    confidence_score=0.85,
                    priority=PriorityLevelDTO(level="HIGH", priority_score=82.0),
                    business_justification="Secondary re-engagement action to restore weekly active sessions."
                )
            ]
        elif churn_prob >= 0.40 or risk_tier == "High":
            primary = NextBestActionDTO(
                action_id="act_003",
                action_code="ACT_REC_PLAYLIST",
                category="Engagement",
                title="Personalized Daily Mix Highlight",
                description="Promote tailored Daily Mix in main home feed hero banner.",
                expected_impact_percentage=24.0,
                confidence_score=0.88,
                priority=PriorityLevelDTO(level="HIGH", priority_score=85.0),
                business_justification="High risk user showing declining listening time benefits from fresh content recommendations."
            )
            secondary = [
                NextBestActionDTO(
                    action_id="act_004",
                    action_code="ACT_UPGRADE_DUO",
                    category="Upgrade",
                    title="Upgrade to Spotify Duo (1 Month Free)",
                    description="Offer 1 month free trial to upgrade to Premium Duo plan for family sharing.",
                    expected_impact_percentage=15.5,
                    confidence_score=0.79,
                    priority=PriorityLevelDTO(level="MEDIUM", priority_score=68.0),
                    business_justification="Multi-account Duo users have 45% higher lifetime retention."
                )
            ]
        else:
            primary = NextBestActionDTO(
                action_id="act_005",
                action_code="ACT_FEATURE_DISCOVERY",
                category="Feature Discovery",
                title="High-Fidelity Lossless Audio Feature Tour",
                description="Introduce user to Spotify Lossless audio streaming features and offline downloads.",
                expected_impact_percentage=12.0,
                confidence_score=0.90,
                priority=PriorityLevelDTO(level="LOW", priority_score=45.0),
                business_justification="Healthy user with low churn risk benefits from feature breadth adoption."
            )
            secondary = []

        return RecommendationDTO(
            recommendation_id=rec_id,
            user_id=user_id,
            primary_action=primary,
            secondary_actions=secondary
        )

recommendation_service = RecommendationService()
