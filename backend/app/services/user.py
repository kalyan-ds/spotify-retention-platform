from typing import List, Tuple, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status
from app.models.auth import User
from app.repositories.user_repo import user_repo
from app.schemas.user import UserUpdate

class UserService:
    @staticmethod
    async def get_users(
        db: AsyncSession, skip: int, limit: int, search: Optional[str], sort_by: Optional[str], sort_order: str
    ) -> Tuple[List[User], int]:
        return await user_repo.get_paginated(db, skip, limit, search, sort_by, sort_order)

    @staticmethod
    async def get_user_by_id(db: AsyncSession, user_id: int) -> User:
        user = await user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    async def get_user_profile(db: AsyncSession, user_id: int) -> User:
        # get_by_id already eager loads role, permissions, preferences, and sessions
        user = await user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    async def update_user(db: AsyncSession, user_id: int, user_in: UserUpdate) -> User:
        user = await user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        # Optimistic Concurrency Control (OCC)
        if user.version != user_in.version:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User has been modified by another process. Please refresh and try again."
            )

        # Update fields
        update_data = user_in.model_dump(exclude_unset=True, exclude={"version"})
        for field, value in update_data.items():
            setattr(user, field, value)

        user.version += 1
        db.add(user)
        await db.commit()
        await db.refresh(user)
        return user

    @staticmethod
    async def delete_user(db: AsyncSession, user_id: int) -> User:
        user = await user_repo.get_by_id(db, user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

        user = await user_repo.soft_remove(db, id=user_id)
        return user
