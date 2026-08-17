from datetime import datetime
from sqlalchemy import String, Integer, Float, Boolean, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class Device(BaseEntityMixin, Base):
    __tablename__ = "devices"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    device_type: Mapped[str] = mapped_column(String(100)) # Mobile, Desktop, SmartSpeaker
    operating_system: Mapped[Optional[str]] = mapped_column(String(100))
    os_version: Mapped[Optional[str]] = mapped_column(String(50))
    application_version: Mapped[Optional[str]] = mapped_column(String(50))
    platform: Mapped[Optional[str]] = mapped_column(String(100))
    manufacturer: Mapped[Optional[str]] = mapped_column(String(100))
    model: Mapped[Optional[str]] = mapped_column(String(100))

    # Relationships
    user: Mapped["User"] = relationship("User")


class ListeningSession(BaseEntityMixin, Base):
    __tablename__ = "listening_sessions"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))
    duration_ms: Mapped[Optional[int]] = mapped_column(Integer)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="listening_sessions")
    history: Mapped[List["ListeningHistory"]] = relationship("ListeningHistory", back_populates="session")


class ListeningHistory(BaseEntityMixin, Base):
    __tablename__ = "listening_history"
    __table_args__ = (
        Index("idx_user_listening_date", "user_id", "timestamp"),
    )

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"), index=True)
    session_id: Mapped[Optional[int]] = mapped_column(ForeignKey("listening_sessions.id"), index=True)
    device_id: Mapped[Optional[int]] = mapped_column(ForeignKey("devices.id"))

    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    play_duration_ms: Mapped[int] = mapped_column(Integer)
    completion_percentage: Mapped[float] = mapped_column(Float)

    # Granular Analytics
    skipped: Mapped[bool] = mapped_column(Boolean, default=False)
    skip_count: Mapped[int] = mapped_column(Integer, default=0)
    repeated: Mapped[bool] = mapped_column(Boolean, default=False)
    shuffle_enabled: Mapped[bool] = mapped_column(Boolean, default=False)
    repeat_mode: Mapped[str] = mapped_column(String(50)) # off, track, context

    # Source & Context
    playback_source: Mapped[str] = mapped_column(String(100)) # playlist, album, search, radio
    recommendation_source: Mapped[Optional[str]] = mapped_column(String(100))
    network_type: Mapped[Optional[str]] = mapped_column(String(50)) # wifi, cellular
    country: Mapped[Optional[str]] = mapped_column(String(2))
    platform: Mapped[Optional[str]] = mapped_column(String(100))
    application_version: Mapped[Optional[str]] = mapped_column(String(50))

    # Relationships
    user: Mapped["User"] = relationship("User")
    song: Mapped["Song"] = relationship("Song")
    session: Mapped[Optional["ListeningSession"]] = relationship("ListeningSession", back_populates="history")
    device: Mapped[Optional["Device"]] = relationship("Device")


class SearchHistory(BaseEntityMixin, Base):
    __tablename__ = "search_history"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    query: Mapped[str] = mapped_column(String(255))
    timestamp: Mapped[datetime] = mapped_column(DateTime(timezone=True), index=True)

    # Relationships
    user: Mapped["User"] = relationship("User")


class FavoriteSong(Base):
    __tablename__ = "favorite_songs"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class FavoriteArtist(Base):
    __tablename__ = "favorite_artists"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), primary_key=True)
    artist_id: Mapped[int] = mapped_column(ForeignKey("artists.id"), primary_key=True)
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
