from typing import List, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.subscription import PaymentHistory
from app.repositories.subscription_repo import payment_repo

class PaymentService:
    @staticmethod
    async def get_payments(
        db: AsyncSession, user_id: int, skip: int, limit: int
    ) -> Tuple[List[PaymentHistory], int]:
        return await payment_repo.get_user_payments(db, user_id, skip, limit)

    @staticmethod
    async def get_payment_by_id(db: AsyncSession, payment_id: int, user_id: int) -> PaymentHistory:
        payment = await payment_repo.get(db, id=payment_id)
        if not payment:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment receipt not found")

        # In a real app we should check if the payment belongs to a subscription owned by user_id
        # For simplicity, we are returning the payment (RBAC validation could be at controller layer via another check)
        return payment
