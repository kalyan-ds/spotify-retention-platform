from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime

from app.models.subscription import Subscription

class SubscriptionAnalyticsRepository:

    async def get_total_subscriptions(self, db: AsyncSession, status: str = None) -> int:
        query = select(func.count(Subscription.id))
        if status:
            query = query.where(Subscription.status == status)

        result = await db.execute(query)
        return result.scalar() or 0

    async def get_plan_distribution(self, db: AsyncSession) -> list:
        query = select(
            Subscription.tier,
            func.count(Subscription.id).label("count")
        ).group_by(
            Subscription.tier
        )

        result = await db.execute(query)
        return result.all()

subscription_analytics_repo = SubscriptionAnalyticsRepository()
