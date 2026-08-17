from typing import Optional, List, Tuple
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.subscription import Subscription, SubscriptionPlan, PaymentHistory

class SubscriptionRepository(BaseRepository[Subscription, dict, dict]):
    def __init__(self):
        super().__init__(Subscription)

    async def get_by_id_with_plan(self, db: AsyncSession, subscription_id: int) -> Optional[Subscription]:
        query = select(Subscription).options(
            selectinload(Subscription.plan)
        ).where(Subscription.id == subscription_id, Subscription.is_deleted == False)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_user_subscriptions(self, db: AsyncSession, user_id: int) -> List[Subscription]:
        query = select(Subscription).options(
            selectinload(Subscription.plan)
        ).where(Subscription.user_id == user_id, Subscription.is_deleted == False)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def get_paginated(
        self,
        db: AsyncSession,
        skip: int,
        limit: int,
        user_id: Optional[int] = None,
        status: Optional[str] = None
    ) -> Tuple[List[Subscription], int]:
        query = select(Subscription).where(Subscription.is_deleted == False)

        if user_id:
            query = query.where(Subscription.user_id == user_id)
        if status:
            query = query.where(Subscription.status == status)

        count_query = select(func.count()).select_from(query.subquery())
        total_count = await db.scalar(count_query)

        query = query.order_by(Subscription.id.desc()).offset(skip).limit(limit).options(
            selectinload(Subscription.plan)
        )

        result = await db.execute(query)
        return list(result.scalars().all()), total_count or 0

class SubscriptionPlanRepository(BaseRepository[SubscriptionPlan, dict, dict]):
    def __init__(self):
        super().__init__(SubscriptionPlan)

class PaymentHistoryRepository(BaseRepository[PaymentHistory, dict, dict]):
    def __init__(self):
        super().__init__(PaymentHistory)

    async def get_user_payments(
        self, db: AsyncSession, user_id: int, skip: int = 0, limit: int = 100
    ) -> Tuple[List[PaymentHistory], int]:
        # Need to join with Subscription to filter by user_id
        query = select(PaymentHistory).join(Subscription).where(
            Subscription.user_id == user_id,
            PaymentHistory.is_deleted == False
        )

        count_query = select(func.count()).select_from(query.subquery())
        total_count = await db.scalar(count_query)

        query = query.order_by(PaymentHistory.payment_date.desc()).offset(skip).limit(limit)
        result = await db.execute(query)

        return list(result.scalars().all()), total_count or 0

subscription_repo = SubscriptionRepository()
plan_repo = SubscriptionPlanRepository()
payment_repo = PaymentHistoryRepository()
