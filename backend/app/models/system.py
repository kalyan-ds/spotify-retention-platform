from datetime import datetime
from sqlalchemy import String, Integer, Boolean, ForeignKey, DateTime, JSON, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class Notification(BaseEntityMixin, Base):
    __tablename__ = "notifications"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    type: Mapped[str] = mapped_column(String(50)) # email, in-app, sms
    title: Mapped[str] = mapped_column(String(255))
    message: Mapped[str] = mapped_column(String(2000))
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notifications")


class ActivityLog(BaseEntityMixin, Base):
    __tablename__ = "activity_logs"

    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id"), index=True)
    action: Mapped[str] = mapped_column(String(100))
    resource_type: Mapped[Optional[str]] = mapped_column(String(100))
    resource_id: Mapped[Optional[str]] = mapped_column(String(255))
    details: Mapped[Optional[dict]] = mapped_column(JSON)
    ip_address: Mapped[Optional[str]] = mapped_column(String(50))
    user_agent: Mapped[Optional[str]] = mapped_column(String(255))

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User")


class AuditLog(BaseEntityMixin, Base):
    __tablename__ = "audit_logs"

    table_name: Mapped[str] = mapped_column(String(100))
    record_id: Mapped[int] = mapped_column(Integer)
    action: Mapped[str] = mapped_column(String(50)) # INSERT, UPDATE, DELETE
    old_values: Mapped[Optional[dict]] = mapped_column(JSON)
    new_values: Mapped[Optional[dict]] = mapped_column(JSON)
    performed_by: Mapped[Optional[str]] = mapped_column(String(255))


class SystemSetting(BaseEntityMixin, Base):
    __tablename__ = "system_settings"

    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[dict] = mapped_column(JSON)
    description: Mapped[Optional[str]] = mapped_column(String(255))
    is_public: Mapped[bool] = mapped_column(Boolean, default=False)


class UserPreference(BaseEntityMixin, Base):
    __tablename__ = "user_preferences"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), unique=True, index=True)

    # Music preferences
    preferred_genres: Mapped[Optional[dict]] = mapped_column(JSON)
    preferred_artists: Mapped[Optional[dict]] = mapped_column(JSON)
    preferred_languages: Mapped[Optional[dict]] = mapped_column(JSON)
    favorite_mood: Mapped[Optional[str]] = mapped_column(String(50))
    favorite_era: Mapped[Optional[str]] = mapped_column(String(50))

    # App Settings
    preferred_audio_quality: Mapped[Optional[str]] = mapped_column(String(50))
    crossfade_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    autoplay_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    explicit_content_allowed: Mapped[bool] = mapped_column(Boolean, default=True)
    offline_downloads_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    theme_preference: Mapped[str] = mapped_column(String(20), default="system")

    # Notifications & ML
    notification_preferences: Mapped[Optional[dict]] = mapped_column(JSON)
    recommendation_preference_weight: Mapped[float] = mapped_column(Float, default=1.0)
    recommendation_diversity_preference: Mapped[float] = mapped_column(Float, default=0.5)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="preferences")
