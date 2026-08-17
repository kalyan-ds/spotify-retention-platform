from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.subscription_analytics_repository import subscription_analytics_repo
from app.schemas.analytics import KPICollectionResponse, KPIResponse

class SubscriptionAnalyticsService:
    async def get_subscription_metrics(self, db: AsyncSession) -> KPICollectionResponse:
        total = await subscription_analytics_repo.get_total_subscriptions(db)
        active = await subscription_analytics_repo.get_total_subscriptions(db, status="ACTIVE")
        canceled = await subscription_analytics_repo.get_total_subscriptions(db, status="CANCELED")

        conversion_rate = round((active / total * 100), 2) if total > 0 else 0.0
        cancellation_rate = round((canceled / total * 100), 2) if total > 0 else 0.0

        metrics = [
            KPIResponse(name="Total Subscriptions", value=total),
            KPIResponse(name="Active Premium", value=active),
            KPIResponse(name="Conversion Rate", value=conversion_rate),
            KPIResponse(name="Cancellation Rate", value=cancellation_rate)
        ]

        return KPICollectionResponse(metrics=metrics)

subscription_analytics_service = SubscriptionAnalyticsService()
