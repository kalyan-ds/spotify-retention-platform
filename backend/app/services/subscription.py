from typing import List, Tuple, Optional
from datetime import date
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.subscription import Subscription
from app.repositories.subscription_repo import subscription_repo, plan_repo
from app.schemas.subscription import SubscriptionCreate, SubscriptionUpdate

class SubscriptionService:
    @staticmethod
    async def get_subscriptions(
        db: AsyncSession, skip: int, limit: int, user_id: Optional[int], status_filter: Optional[str]
    ) -> Tuple[List[Subscription], int]:
        return await subscription_repo.get_paginated(db, skip, limit, user_id, status_filter)

    @staticmethod
    async def get_subscription_by_id(db: AsyncSession, subscription_id: int) -> Subscription:
        sub = await subscription_repo.get_by_id_with_plan(db, subscription_id)
        if not sub:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")
        return sub

    @staticmethod
    async def create_subscription(db: AsyncSession, user_id: int, sub_in: SubscriptionCreate) -> Subscription:
        # Check idempotency key behavior would go here, maybe relying on a distributed cache/redis.
        # Check if plan exists
        plan = await plan_repo.get(db, id=sub_in.plan_id)
        if not plan or not plan.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or inactive plan")

        # Optional: check if user already has an active subscription to prevent duplicates
        active_subs = await subscription_repo.get_user_subscriptions(db, user_id)
        for sub in active_subs:
            if sub.status == "active":
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User already has an active subscription")

        new_sub = Subscription(
            user_id=user_id,
            plan_id=sub_in.plan_id,
            status="active",
            start_date=date.today(),
            currency=plan.currency
        )

        db.add(new_sub)
        await db.commit()
        await db.refresh(new_sub)

        # Load the plan relationship explicitly so the response can serialize it
        return await subscription_repo.get_by_id_with_plan(db, new_sub.id)

    @staticmethod
    async def update_subscription(db: AsyncSession, subscription_id: int, sub_in: SubscriptionUpdate) -> Subscription:
        sub = await subscription_repo.get_by_id_with_plan(db, subscription_id)
        if not sub:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

        # Optimistic Concurrency Control (OCC)
        if sub.version != sub_in.version:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Subscription has been modified by another process. Please refresh and try again."
            )

        update_data = sub_in.model_dump(exclude_unset=True, exclude={"version", "idempotency_key"})
        for field, value in update_data.items():
            setattr(sub, field, value)

        sub.version += 1
        db.add(sub)
        await db.commit()
        await db.refresh(sub)
        return sub

    @staticmethod
    async def delete_subscription(db: AsyncSession, subscription_id: int) -> Subscription:
        sub = await subscription_repo.get_by_id_with_plan(db, subscription_id)
        if not sub:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription not found")

        sub = await subscription_repo.soft_remove(db, id=subscription_id)
        return sub
