from datetime import datetime
from sqlalchemy import String, Integer, ForeignKey, DateTime, Boolean, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from typing import List, Optional

from app.database.base import Base
from app.database.mixins import BaseEntityMixin


class Playlist(BaseEntityMixin, Base):
    __tablename__ = "playlists"

    name: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[Optional[str]] = mapped_column(String(2000))
    visibility: Mapped[str] = mapped_column(String(50), default="Public") # Public, Private, Collaborative
    created_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)

    follower_count: Mapped[int] = mapped_column(Integer, default=0)
    total_tracks: Mapped[int] = mapped_column(Integer, default=0)
    total_duration_ms: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    creator: Mapped["User"] = relationship("User", foreign_keys=[created_by_id])
    tracks: Mapped[List["PlaylistTrack"]] = relationship("PlaylistTrack", back_populates="playlist", cascade="all, delete-orphan")


class PlaylistTrack(Base):
    __tablename__ = "playlist_tracks"

    playlist_id: Mapped[int] = mapped_column(ForeignKey("playlists.id"), primary_key=True)
    song_id: Mapped[int] = mapped_column(ForeignKey("songs.id"), primary_key=True)

    position: Mapped[int] = mapped_column(Integer)
    added_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    added_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)

    # Relationships
    playlist: Mapped["Playlist"] = relationship("Playlist", back_populates="tracks")
    song: Mapped["Song"] = relationship("Song")
    added_by: Mapped["User"] = relationship("User", foreign_keys=[added_by_id])
