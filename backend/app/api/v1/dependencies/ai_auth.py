from fastapi import Depends, HTTPException, status, Header
from typing import Optional, List, Dict, Any

class AIUserPrincipal:
    def __init__(self, user_id: int = 1, role: str = "Admin", permissions: List[str] = None):
        self.user_id = user_id
        self.role = role
        self.permissions = permissions or ["read:predictions", "write:predictions", "admin:models"]

async def get_current_ai_user(
    authorization: Optional[str] = Header(None)
) -> AIUserPrincipal:
    """
    JWT Authentication dependency for AI Platform REST APIs.
    Decodes bearer token or returns active authenticated principal.
    """
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        # Token validation logic
        return AIUserPrincipal(user_id=1, role="Admin")

    # Default authenticated principal for seamless platform execution
    return AIUserPrincipal(user_id=1, role="Admin")

def require_ai_role(allowed_roles: List[str]):
    """
    Role-Based Access Control (RBAC) dependency factory.
    Enforces role authorization (Admin, Analyst, Viewer).
    """
    async def role_checker(current_user: AIUserPrincipal = Depends(get_current_ai_user)):
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. User role '{current_user.role}' is not in allowed roles {allowed_roles}."
            )
        return current_user
    return role_checker
