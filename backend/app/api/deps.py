from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.engine import AsyncSessionLocal
from app.repositories.user_repo import user_repo, role_repo, session_repo
from app.repositories.subscription_repo import subscription_repo, plan_repo, payment_repo
from app.repositories.catalog_repo import artist_repo, album_repo, song_repo, genre_repo
from app.repositories.listening_repo import listening_history_repo, listening_session_repo, device_repo
from app.repositories.ml_repo import prediction_repo, model_version_repo, recommendation_repo, feature_snapshot_repo

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session

# Dependency injection helpers for Repositories (if needed by FastAPI routes)
def get_user_repo(): return user_repo
def get_subscription_repo(): return subscription_repo
def get_catalog_song_repo(): return song_repo
def get_listening_history_repo(): return listening_history_repo
def get_prediction_repo(): return prediction_repo

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError

from app.core.security import verify_token
from app.models.auth import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"/api/v1/auth/login")

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = verify_token(token, is_refresh=False)
        user_id: str = payload.get("sub")
        token_version: int = payload.get("token_version")
        if user_id is None or token_version is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception

    user = await user_repo.get_by_id(db, int(user_id))
    if user is None:
        raise credentials_exception

    if user.version != token_version:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked due to user changes")

    if user.status != "active":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Inactive user")

    return user

class RequireRole:
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(get_current_user)) -> User:
        if not user.role or user.role.name not in self.allowed_roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")
        return user

class RequirePermission:
    def __init__(self, required_permission: str):
        self.required_permission = required_permission

    def __call__(self, user: User = Depends(get_current_user)) -> User:
        if not user.role:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough privileges")

        permissions = [p.name for p in user.role.permissions]
        if self.required_permission not in permissions:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Missing required permission")
        return user

from fastapi import Request
import time

def get_request_id(request: Request) -> str:
    return getattr(request.state, "request_id", "unknown")

def get_processing_time_ms(request: Request) -> float:
    start_time = getattr(request.state, "start_time", None)
    if start_time:
        return round((time.time() - start_time) * 1000, 2)
    return 0.0
