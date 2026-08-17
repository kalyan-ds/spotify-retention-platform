from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from typing import Dict, Any, Tuple

from app.models.subscription import Subscription
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class RetentionChurnRepository(BaseAnalyticsRepository):
    """
    Handles subscription cancellation joins and risk state tracking.
    """

    async def get_churned_users_count(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        """Gets count of users whose subscriptions were canceled in the period."""
        query = select(func.count(Subscription.id)).where(Subscription.status == 'canceled')
        query = self.apply_filters(query, Subscription, filters, date_column_name="end_date")

        result = await db.execute(query)
        return result.scalar() or 0

    async def get_active_users_start_of_period(self, db: AsyncSession, filters: AnalyticsFilter) -> int:
        """Gets active users at the exact start date of the filter."""
        # Active at start date means start_date <= filter.start_date AND (end_date > filter.start_date OR end_date IS NULL)
        if not filters.start_date:
            return 0

        query = select(func.count(Subscription.id)).where(
            and_(
                Subscription.start_date <= filters.start_date,
                (Subscription.end_date > filters.start_date) | (Subscription.end_date.is_(None))
            )
        )

        result = await db.execute(query)
        return result.scalar() or 0

    async def get_churn_distribution(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        """Groups churn by reason (if cancellation_reason exists on Subscription)."""
        query = select(
            func.coalesce(Subscription.cancellation_reason, 'Unknown').label('reason'),
            func.count(Subscription.id).label('count')
        ).where(Subscription.status == 'canceled')

        query = self.apply_filters(query, Subscription, filters, date_column_name="end_date")
        query = query.group_by('reason').order_by(func.count(Subscription.id).desc())

        result = await db.execute(query)
        return result.all()

retention_churn_repo = RetentionChurnRepository()
