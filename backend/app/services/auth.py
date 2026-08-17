from datetime import datetime, timezone
import uuid
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import Request

from app.models.auth import User, UserSession
from app.models.system import ActivityLog
from app.repositories.user_repo import user_repo, session_repo
from app.core.security import (
    verify_password,
    get_password_hash,
    validate_password_strength,
    create_access_token,
    create_refresh_token,
    verify_token,
    hash_refresh_token
)

class PasswordService:
    @staticmethod
    def hash(password: str) -> str:
        return get_password_hash(password)

    @staticmethod
    def verify(plain: str, hashed: str) -> bool:
        return verify_password(plain, hashed)

    @staticmethod
    def validate_strength(password: str) -> bool:
        return validate_password_strength(password)

class AuditService:
    @staticmethod
    async def log_event(
        db: AsyncSession,
        action: str,
        request: Request,
        user_id: Optional[int] = None,
        session_id: Optional[str] = None,
        status: str = "success",
        reason: Optional[str] = None
    ) -> None:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent")

        # Simple extraction for demo purposes; in prod use a user-agent parser
        browser = "Unknown"
        os = "Unknown"
        device = "Unknown"
        if user_agent:
            if "Mozilla" in user_agent: browser = "Browser"
            if "Windows" in user_agent: os = "Windows"
            elif "Mac" in user_agent: os = "MacOS"
            elif "Linux" in user_agent: os = "Linux"

        details = {
            "status": status,
            "browser": browser,
            "os": os,
            "device": device,
            "platform": "web"
        }
        if reason:
            details["reason"] = reason

        log = ActivityLog(
            user_id=user_id,
            action=action,
            resource_type="Session",
            resource_id=session_id,
            details=details,
            ip_address=ip_address,
            user_agent=user_agent
        )
        db.add(log)
        await db.commit()

class SessionService:
    @staticmethod
    async def create_session(
        db: AsyncSession,
        user_id: int,
        refresh_token_hash: str,
        expires_at: datetime,
        request: Request
    ) -> UserSession:
        ip_address = request.client.host if request.client else None
        user_agent = request.headers.get("user-agent", "unknown")

        # In a real app, parse user_agent for device_id/name
        device_id = str(uuid.uuid4())

        session = UserSession(
            user_id=user_id,
            token=refresh_token_hash,
            device_id=device_id,
            ip_address=ip_address,
            expires_at=expires_at,
            is_active=True
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session

    @staticmethod
    async def revoke_session(db: AsyncSession, token_hash: str) -> None:
        await session_repo.revoke_session(db, token_hash)

    @staticmethod
    async def revoke_all_sessions(db: AsyncSession, user_id: int) -> None:
        await session_repo.revoke_all_user_sessions(db, user_id)

class TokenService:
    @staticmethod
    def generate_tokens(user: User, session_id: str):
        role_name = user.role.name if user.role else "user"
        permissions = [p.name for p in user.role.permissions] if user.role and user.role.permissions else []
        token_version = user.version

        access_token = create_access_token(
            subject=user.id,
            role=role_name,
            permissions=permissions,
            token_version=token_version,
            session_id=session_id
        )

        refresh_token = create_refresh_token(
            subject=user.id,
            session_id=session_id
        )
        return access_token, refresh_token

    @staticmethod
    def hash_token(token: str) -> str:
        return hash_refresh_token(token)

class AuthService:
    @staticmethod
    async def authenticate(db: AsyncSession, email: str, password: str, request: Request) -> Dict[str, Any]:
        user = await user_repo.get_by_email(db, email)
        if not user:
            await AuditService.log_event(db, "Login Failed", request, status="failed", reason="Unknown User")
            return None

        if user.status != "active":
            await AuditService.log_event(db, "Locked Account Attempt", request, user_id=user.id, status="failed", reason="User is not active")
            return None

        if not PasswordService.verify(password, user.password_hash):
            await AuditService.log_event(db, "Invalid Password", request, user_id=user.id, status="failed", reason="Invalid password")
            return None

        # Authentication successful
        session_id = str(uuid.uuid4())
        access_token, refresh_token = TokenService.generate_tokens(user, session_id)

        # Store securely hashed refresh token
        hashed_refresh = TokenService.hash_token(refresh_token)
        decoded = verify_token(refresh_token, is_refresh=True)
        expires_at = datetime.fromtimestamp(decoded["exp"], tz=timezone.utc)

        await SessionService.create_session(db, user.id, hashed_refresh, expires_at, request)
        await AuditService.log_event(db, "Successful Login", request, user_id=user.id, session_id=session_id)

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "user": user
        }

    @staticmethod
    async def refresh_tokens(db: AsyncSession, refresh_token: str, request: Request) -> Dict[str, Any]:
        try:
            decoded = verify_token(refresh_token, is_refresh=True)
            user_id = int(decoded["sub"])
            session_id = decoded["sid"]

            hashed_refresh = TokenService.hash_token(refresh_token)
            session = await session_repo.get_by_token(db, hashed_refresh)

            if not session or not session.is_active or session.expires_at.replace(tzinfo=timezone.utc) < datetime.now(timezone.utc):
                await AuditService.log_event(db, "Revoked Token", request, user_id=user_id, status="failed", reason="Session inactive or not found")
                return None

            user = await user_repo.get_by_id(db, user_id)
            if not user or user.status != "active":
                return None

            # Rotate Token
            await SessionService.revoke_session(db, hashed_refresh)

            new_session_id = str(uuid.uuid4())
            new_access, new_refresh = TokenService.generate_tokens(user, new_session_id)

            new_hashed_refresh = TokenService.hash_token(new_refresh)
            new_decoded = verify_token(new_refresh, is_refresh=True)
            new_expires = datetime.fromtimestamp(new_decoded["exp"], tz=timezone.utc)

            await SessionService.create_session(db, user.id, new_hashed_refresh, new_expires, request)
            await AuditService.log_event(db, "Refresh Token Rotation", request, user_id=user.id, session_id=new_session_id)

            return {
                "access_token": new_access,
                "refresh_token": new_refresh,
                "token_type": "bearer"
            }
        except Exception as e:
            await AuditService.log_event(db, "Invalid Token", request, status="failed", reason=str(e))
            return None

    @staticmethod
    async def logout(db: AsyncSession, refresh_token: str, request: Request) -> bool:
        try:
            hashed_refresh = TokenService.hash_token(refresh_token)
            session = await session_repo.get_by_token(db, hashed_refresh)
            if session:
                await SessionService.revoke_session(db, hashed_refresh)
                await AuditService.log_event(db, "Logout", request, user_id=session.user_id, session_id=str(session.id))
            return True
        except Exception:
            return False
