from datetime import datetime, timedelta, timezone
import hashlib
from typing import Any, Dict, Optional, Union
import jwt
from passlib.context import CryptContext
from pydantic import ValidationError
import re

from app.core.config import settings

# Argon2 Context
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def validate_password_strength(password: str) -> bool:
    """
    Validates minimum length, uppercase, lowercase, numbers, and symbols.
    Returns True if valid, False otherwise.
    """
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return False
    return True

def create_access_token(
    subject: Union[str, Any],
    role: str,
    permissions: list[str],
    token_version: int,
    session_id: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "uid": str(subject),
        "role": role,
        "permissions": permissions,
        "sid": session_id,
        "token_version": token_version,
        "token_type": "access",
        "iss": "spotify-retention-platform",
        "aud": "spotify-retention-platform",
        "iat": datetime.now(timezone.utc),
        "nbf": datetime.now(timezone.utc),
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def create_refresh_token(
    subject: Union[str, Any],
    session_id: str,
    expires_delta: Optional[timedelta] = None
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
    to_encode = {
        "exp": expire,
        "sub": str(subject),
        "sid": session_id,
        "token_type": "refresh",
        "iss": "spotify-retention-platform",
        "aud": "spotify-retention-platform",
        "iat": datetime.now(timezone.utc),
        "nbf": datetime.now(timezone.utc),
    }
    encoded_jwt = jwt.encode(
        to_encode, settings.REFRESH_SECRET_KEY, algorithm=settings.JWT_ALGORITHM
    )
    return encoded_jwt

def verify_token(token: str, is_refresh: bool = False) -> Dict[str, Any]:
    secret = settings.REFRESH_SECRET_KEY if is_refresh else settings.SECRET_KEY
    try:
        decoded_token = jwt.decode(
            token,
            secret,
            algorithms=[settings.JWT_ALGORITHM],
            audience="spotify-retention-platform",
            issuer="spotify-retention-platform"
        )
        # Validate token_type
        expected_type = "refresh" if is_refresh else "access"
        if decoded_token.get("token_type") != expected_type:
            raise jwt.InvalidTokenError(f"Invalid token type. Expected {expected_type}")
        return decoded_token
    except jwt.ExpiredSignatureError:
        raise jwt.ExpiredSignatureError("Token has expired")
    except jwt.InvalidTokenError as e:
        raise jwt.InvalidTokenError(f"Invalid token: {str(e)}")

def hash_refresh_token(token: str) -> str:
    """
    Refresh tokens must never be stored in plaintext.
    Uses SHA-256 for fast hashing of secure random tokens.
    """
    return hashlib.sha256(token.encode("utf-8")).hexdigest()
