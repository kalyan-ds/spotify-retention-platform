from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.auth import Role, Permission
from app.repositories.user_repo import role_repo, permission_repo

class RoleService:
    @staticmethod
    async def get_roles(db: AsyncSession) -> List[Role]:
        return await role_repo.get_all_with_permissions(db)

    @staticmethod
    async def get_permissions(db: AsyncSession) -> List[Permission]:
        return await permission_repo.get_all_permissions(db)
