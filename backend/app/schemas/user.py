from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    status: str = "active"
    country: Optional[str] = None
    platform: Optional[str] = None
    role_id: Optional[int] = None

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    country: Optional[str] = None
    platform: Optional[str] = None
    version: int  # For Optimistic Concurrency Control

class UserResponse(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    is_deleted: bool
    version: int

    model_config = ConfigDict(from_attributes=True)

class RoleResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class PermissionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class UserPreferenceResponse(BaseModel):
    preferred_genres: Optional[Dict[str, Any]] = None
    preferred_artists: Optional[Dict[str, Any]] = None
    preferred_languages: Optional[Dict[str, Any]] = None
    favorite_mood: Optional[str] = None
    favorite_era: Optional[str] = None
    preferred_audio_quality: Optional[str] = None
    crossfade_enabled: bool = False
    autoplay_enabled: bool = True
    explicit_content_allowed: bool = True
    offline_downloads_enabled: bool = False
    theme_preference: str = "system"

    model_config = ConfigDict(from_attributes=True)

class UserDeviceResponse(BaseModel):
    id: int
    device_id: Optional[str] = None
    ip_address: Optional[str] = None
    is_active: bool
    expires_at: datetime

    model_config = ConfigDict(from_attributes=True)

class UserProfileResponse(UserResponse):
    role: Optional[RoleResponse] = None
    preferences: Optional[UserPreferenceResponse] = None
    sessions: List[UserDeviceResponse] = []

    model_config = ConfigDict(from_attributes=True)
