from typing import Optional, List, Tuple
from sqlalchemy import select, or_, func, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.base import BaseRepository
from app.models.auth import User, Role, Permission, UserSession

class UserRepository(BaseRepository[User, dict, dict]):
    def __init__(self):
        super().__init__(User)

    async def get_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        query = select(User).options(
            selectinload(User.role).selectinload(Role.permissions),
            selectinload(User.preferences),
            selectinload(User.sessions)
        ).where(User.email == email, User.is_deleted == False)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_by_id(self, db: AsyncSession, user_id: int) -> Optional[User]:
        query = select(User).options(
            selectinload(User.role).selectinload(Role.permissions),
            selectinload(User.preferences),
            selectinload(User.sessions)
        ).where(User.id == user_id, User.is_deleted == False)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_paginated(
        self,
        db: AsyncSession,
        skip: int,
        limit: int,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_order: str = "asc"
    ) -> Tuple[List[User], int]:
        query = select(User).where(User.is_deleted == False)

        if search:
            query = query.where(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.first_name.ilike(f"%{search}%"),
                    User.last_name.ilike(f"%{search}%")
                )
            )

        count_query = select(func.count()).select_from(query.subquery())
        total_count = await db.scalar(count_query)

        if sort_by and hasattr(User, sort_by):
            order_col = getattr(User, sort_by)
            if sort_order.lower() == "desc":
                order_col = order_col.desc()
            query = query.order_by(order_col)
        else:
            query = query.order_by(User.id.asc())

        query = query.offset(skip).limit(limit).options(
            selectinload(User.role)
        )

        result = await db.execute(query)
        items = result.scalars().all()

        return list(items), total_count or 0

class RoleRepository(BaseRepository[Role, dict, dict]):
    def __init__(self):
        super().__init__(Role)

    async def get_by_name(self, db: AsyncSession, name: str) -> Optional[Role]:
        query = select(Role).options(selectinload(Role.permissions)).where(Role.name == name)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_all_with_permissions(self, db: AsyncSession) -> List[Role]:
        query = select(Role).options(selectinload(Role.permissions)).order_by(Role.id.asc())
        result = await db.execute(query)
        return list(result.scalars().all())

class PermissionRepository(BaseRepository[Permission, dict, dict]):
    def __init__(self):
        super().__init__(Permission)

    async def get_all_permissions(self, db: AsyncSession) -> List[Permission]:
        query = select(Permission).order_by(Permission.id.asc())
        result = await db.execute(query)
        return list(result.scalars().all())

class UserSessionRepository(BaseRepository[UserSession, dict, dict]):
    def __init__(self):
        super().__init__(UserSession)

    async def get_by_token(self, db: AsyncSession, token: str) -> Optional[UserSession]:
        query = select(UserSession).where(UserSession.token == token, UserSession.is_active == True)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    async def get_active_sessions(self, db: AsyncSession, user_id: int) -> List[UserSession]:
        query = select(UserSession).where(UserSession.user_id == user_id, UserSession.is_active == True)
        result = await db.execute(query)
        return list(result.scalars().all())

    async def revoke_all_user_sessions(self, db: AsyncSession, user_id: int) -> None:
        query = update(UserSession).where(UserSession.user_id == user_id, UserSession.is_active == True).values(is_active=False)
        await db.execute(query)
        await db.commit()

    async def revoke_session(self, db: AsyncSession, token: str) -> None:
        query = update(UserSession).where(UserSession.token == token).values(is_active=False)
        await db.execute(query)
        await db.commit()

    async def revoke_session_by_id(self, db: AsyncSession, session_id: int, user_id: int) -> None:
        query = update(UserSession).where(UserSession.id == session_id, UserSession.user_id == user_id).values(is_active=False)
        await db.execute(query)
        await db.commit()

user_repo = UserRepository()
role_repo = RoleRepository()
permission_repo = PermissionRepository()
session_repo = UserSessionRepository()
