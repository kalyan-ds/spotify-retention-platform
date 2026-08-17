from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from datetime import datetime, timedelta

from app.models.subscription import Subscription, SubscriptionPlan, PaymentHistory
from app.repositories.base_analytics_repository import BaseAnalyticsRepository
from app.schemas.analytics import AnalyticsFilter

class RevenueAnalyticsRepository(BaseAnalyticsRepository):

    async def get_total_revenue(self, db: AsyncSession, filters: AnalyticsFilter) -> float:
        """Calculates absolute total revenue from successful payments."""
        query = select(func.sum(PaymentHistory.amount)).where(PaymentHistory.status == 'success')
        query = self.apply_filters(query, PaymentHistory, filters, date_column_name="payment_date")

        result = await db.execute(query)
        return float(result.scalar() or 0.0)

    async def get_mrr(self, db: AsyncSession, filters: AnalyticsFilter) -> float:
        """Calculates Monthly Recurring Revenue based on active subscriptions and their plans."""
        query = (
            select(func.sum(SubscriptionPlan.price))
            .select_from(Subscription)
            .join(SubscriptionPlan, Subscription.plan_id == SubscriptionPlan.id)
            .where(Subscription.status == 'active')
        )
        # Apply filters to Subscription (e.g. region if added to model, or date)
        # Note: MRR is typically a snapshot. If end_date is provided, we might want historical MRR.
        # For simplicity, we just return current MRR.
        query = self.apply_filters(query, Subscription, filters, date_column_name="start_date")

        result = await db.execute(query)
        return float(result.scalar() or 0.0)

    async def get_revenue_trend(self, db: AsyncSession, filters: AnalyticsFilter) -> list:
        """Returns time-series revenue aggregated by day."""
        from sqlalchemy import cast, Date

        query = (
            select(
                cast(PaymentHistory.payment_date, Date).label("day"),
                func.sum(PaymentHistory.amount).label("total")
            )
            .where(PaymentHistory.status == 'success')
        )

        query = self.apply_filters(query, PaymentHistory, filters, date_column_name="payment_date")

        query = query.group_by(cast(PaymentHistory.payment_date, Date)).order_by(cast(PaymentHistory.payment_date, Date))

        result = await db.execute(query)
        return result.all()

revenue_analytics_repo = RevenueAnalyticsRepository()
