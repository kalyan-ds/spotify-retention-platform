from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.api.deps import get_db, get_current_user
from app.services.auth import AuthService, AuditService
from app.schemas.auth import LoginRequest, RefreshRequest, Token, UserResponse
from app.models.auth import User

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    request: Request,
    login_data: LoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    OAuth2 compatible token login, getting an access token and a refresh token.
    """
    result = await AuthService.authenticate(db, login_data.email, login_data.password, request)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result

@router.post("/refresh", response_model=Token)
async def refresh(
    request: Request,
    refresh_data: RefreshRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Refresh tokens using a valid refresh token.
    """
    result = await AuthService.refresh_tokens(db, refresh_data.refresh_token, request)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return result

@router.post("/logout")
async def logout(
    request: Request,
    refresh_data: RefreshRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Logout and revoke the provided refresh token.
    """
    success = await AuthService.logout(db, refresh_data.refresh_token, request)
    if not success:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to logout"
        )
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get current user profile.
    """
    role = current_user.role.name if current_user.role else None
    return {
        "id": current_user.id,
        "email": current_user.email,
        "first_name": current_user.first_name,
        "last_name": current_user.last_name,
        "role": role
    }
